<template>
    <div class="main__container" v-if="exist">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="app__container">
            <div class="left__side">
                <RouterView />
            </div>
            <div class="tablet_mobile__filter">
                <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />
                <div class="date__picker">
                    <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                </div>
                <div class="date__picker">
                    <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
                </div>
            </div>

            <div class="tablet_mobile__head">
                <div class="establishment__info_tablet">
                    <label v-if="!dataLoading">{{ establishment.name }}</label>
                    <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                    <div>
                        <i
                            :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                        <span v-if="!dataLoading">{{ establishment.category }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-48 mb-4"></span>
                    </div>
                    <div class="society__location" v-if="establishment.country != null">
                        <i class="uil uil-map"></i>
                        <span v-if="!dataLoading">{{ establishment.country }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-location-point"></i>
                        <span v-if="!dataLoading">{{ establishment.city }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-favorite"></i>
                        <span v-if="!dataLoading" class="society__location">{{ all_items[0].value }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-comment-alt"></i>
                        <span v-if="!dataLoading">{{ all_items[1].value }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-building"></i>
                        <span v-if="!dataLoading">{{ all_items[2].value }} competitors</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <RouterLink
                        :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/staffsranking`">
                        <button class="btn">
                            <i class="uil uil-trophy" :style="{ 'color': 'white' }"></i>
                            <span class="ml-2" :style="{ 'color': 'white' }">Staff Ranking</span>
                        </button>
                    </RouterLink>
                </div>
                <div class="photo" v-if="!dataLoading">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="photo" v-else>
                    <div role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="right__side">
                <div
                    class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#" v-if="!dataLoading">
                        <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                        <div v-else role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <a href="#" v-else>
                        <div role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                        <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                        <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                        <div class="society__location">
                            <i
                                :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                            <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                        <div class="society__location">
                            <i class="uil uil-location-point"></i>
                            <span v-if="!dataLoading" class="society__location">{{
                                establishment.city }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                    </div>
                    <div class="date__filter">
                        <div class="text-sm title">Select a date range</div>
                        <el-date-picker v-model="start_date" type="date" placeholder="Select the start date"
                            :size="'large'" />
                        <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                            :size="'large'" />
                        <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                            selectedTimePeriod = timePeriod
                        }" :default="timePeriods[0]" />
                    </div>
                    <RouterLink
                        :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/staffsranking`">
                        <button class="btn">
                            <i class="uil uil-trophy"></i>
                            <span class="ml-2">Staff Ranking</span>
                        </button>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>

<script setup>
import moment from 'moment';
import { RouterView } from 'vue-router';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import { useWindowSize } from '@vueuse/core';
import {
    ref,
    reactive,
    watch,
    onBeforeMount,
    computed,
    provide,
    onUpdated,
    defineAsyncComponent
} from 'vue';
import { ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip
} from 'chart.js';
import { PolarArea } from 'vue-chartjs';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip);
import { useResizeObserver } from '@vueuse/core';

let exist = ref(true);

const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

const route = useRoute();
const breadcrumbData = ref([
    {
        title: "Back",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Staffs",
        path: `${route.path}`,
        isCurrent: true
    }
])
const route_name = computed(() => {
    console.log(breadcrumbData.value);
    return route.name;
})

const page = ref({
    title1: "",
    title2: "Staffs",
    icon: "uil-users-alt",
});

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const selectedStaff = ref(null);
provide('selectedStaff', selectedStaff);

const dataLoading = ref(true);
const chartLoading = ref(false);
provide('dataLoading', dataLoading);
provide('chartLoading', chartLoading);
const staffLoading = ref(false);
provide('staffLoading', staffLoading);
let establishment = ref({});
provide('establishment', establishment)
let staffs = ref([]);
let reviews = ref([]);
provide('staffs', staffs);
let dataReviews = ref([]);
let selectedStars = ref([1, 2, 3, 4, 5]);
let visibleData = ref([]);
let paginationConfig = ref({
    current: 0,
    size: 5,
    data: [],
    _data: []
});

const showModal = ref(false);
const timePeriods = ref(['Daily', 'Weekly', 'Monthly', 'Yearly']);
const selectedTimePeriod = ref(timePeriods.value[0]);
const startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
const endDate = moment().format('YYYY-M-DD');
let start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
let end_date = ref(moment().format('YYYY-M-DD'));
const date = ref([startDate, endDate]);
provide('date', date);
provide('type', selectedTimePeriod);
let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
const { width, height } = useWindowSize();


watch([start_date, end_date], () => {
    if (start_date.value !== '' && end_date.value !== '') {
        date.value = [start_date.value, end_date.value]
    } else {
        date.value = [startDate, endDate];
    }
})

watch(route_name, () => {
    if (route_name.value == 'StaffReview') {
        breadcrumbData.value[1].isCurrent = false;
        breadcrumbData.value[1].path = `/customer/${route.params.tag}/establishment/${route.params.id}/staffs`;
        breadcrumbData.value.push({
            title: "reviews",
            path: `${route.path}`,
            isCurrent: true,
        })
    }

    if (route_name.value == 'StaffComparison') {
        breadcrumbData.value = [
            {
                title: "Back",
                path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                isCurrent: false,
            },
            {
                title: "Staffs",
                path: `${route.path}`,
                isCurrent: true
            }
        ]
    }
})
onBeforeMount(async () => {
    const companyId = route.params.id;
    let company = null;
    appStore.isLoading = true;
    chartLoading.value = true;
    staffLoading.value = true;

    if (route_name.value == 'StaffReview') {
        breadcrumbData.value[1].isCurrent = false;
        breadcrumbData.value[1].path = `/customer/${route.params.tag}/establishment/${route.params.id}/staffs`;
        breadcrumbData.value.push({
            title: "reviews",
            path: `${route.path}`,
            isCurrent: true,
        })
    }

    if (route_name.value == 'StaffComparison') {
        breadcrumbData.value = [
            {
                title: "Back",
                path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                isCurrent: false,
            },
            {
                title: "Staffs",
                path: `${route.path}`,
                isCurrent: true
            }
        ]
    }

    companiesStore.getEstablishment(companyId).then((data) => {

        if (data == false) {
            exist.value = false;
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            page.value.title2 = establishment.value.name;
            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;

        }
    })

    const response = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/${companyId}/detail`, (response) => {
            resolve(response)
            if (response.status == 404) {
                exist.value = false;
                appStore.isLoading = false;
            }
        });
    });

    if (response.status == 200) {
        establishment.value['reviews'] = response.data['reviews'];
        establishment.value['staffs'] = response.data['staffs'];
        reviews.value = establishment.value.reviews;
        staffs.value = establishment.value.staffs;
        chartLoading.value = false;
        staffLoading.value = false;
    }
})

const el = ref(null);
const chartWidth = ref(0);
const barWidth = computed(() => {
    let result = 0;
    if (width.value >= 800) result = Math.abs(Number(chartWidth.value - 100));
    else result = 800;
    return result;
})
provide('barWidth', barWidth);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});
</script>

<style scoped>
.btn {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border-radius: 5px;
    padding: 5px;
}

* {
    transition: var(--transition);
}

img {
    height: 200px !important;
}

.include {
    cursor: pointer;
}

.include a {
    color: var(--color-primary);
}

.not__include a {
    color: var(--light-color-bg2);
}

.include .star__barre {
    background: var(--color-warning);
}

.not__include .star__barre {
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span {
    color: rgb(165, 165, 165);
}

.temp__p {
    font-size: 14px;
    color: var(--color-bg1);
    font-weight: 500;
}

.temp__p a:hover {
    background-color: var(--color-danger);
    color: white;
}

.temp__p a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
}

.app__container {
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
}

.rating__customers {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
}

.establishment {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}

.establishment__info i,
.establishment__info_tablet i {
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label,
.establishment__info_tablet label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div {
    font-size: 13px;
    font-weight: 500;
}

.establishment__info_tablet div {
    display: flex;
}

.date__filter .title {
    font-weight: 600;
}

.filter__content .title {
    font-weight: 500;
}

.filter__content {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.rating__customers .title {
    font-size: 15px;
    font-weight: 600;
    margin-left: 15px;
    margin-top: 15px;
}

.reviews__content1 .review span {
    font-size: 12px;
    margin: auto;
}

.community__feedback .title {
    font-size: 15px;
    font-weight: 600;
}

.community__feedback h2 {
    font-size: 14px;
    font-weight: 500;
}

.legend {
    margin: 15px auto;
}

.comment {
    overflow: hidden;
    text-align: justify;
}

.left__side {
    width: 100%;
    padding: 50px 5px;
}

#website__dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#dropdownDivider {
    position: absolute;
}

#dropdownDivider li {
    cursor: pointer;
    padding: 5px 10px;
    margin: auto;
    transform: var(--transition);
}

#dropdownDivider li:hover {
    background-color: var(--color-danger);
    color: var(--color-white);
}

.right__side {
    width: 500px;
    padding: 50px 0px;
}

.rating__statistics {
    display: none;
    margin-bottom: 15px;
    transition: var(--transition);
}

.filter__container {
    display: none;
    transition: var(--transition);
}

.society__name {
    margin: 5px 0;
    display: flex;
}

.tablet_mobile__head,
.tablet_mobile__filter {
    display: none;
}

.society__location {
    display: flex;
}

.society__location span {
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

.date__picker {
    width: 100% !important;
    margin: 0px 2px !important;
}

@media screen and (max-width:1400px) {
    .app__container {
        width: var(--container-width-md);
    }

    .breadcrumb__container {
        width: var(--container-width-md);
    }
}

@media screen and (max-width:1287px) {
    .counter {
        gap: 2rem !important;
    }

    .right__side {
        width: 300px !important;
    }
}


@media screen and (max-width:1024px) {

    .right__side {
        width: 250px !important;
    }
}

@media screen and (max-width: 975px) {
    .app__container {
        flex-direction: column-reverse;
        width: 95% !important;
        justify-content: center;
        align-items: center;
    }

    .left__side {
        width: inherit !important;
    }

    .photo {
        flex-basis: 250px;
    }

    .photo div {
        height: 100%;
    }

    .photo img {
        height: 150px;
        width: 100%;
    }

    .right__side {
        display: none !important;
    }

    .tablet_mobile__head {
        display: flex;
        justify-content: space-between;
        margin: auto;
        margin-top: 50px;
        width: inherit;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: 1px solid var(--light-color-bg2);
        border-radius: 5px;
        padding: 15px;
        font-size: 14px;
    }

    .tablet_mobile__head label {
        font-size: 17px !important;
    }

    .tablet_mobile__head span {
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter {
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter * {
        flex-basis: 200px;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head {
        font-size: 13px !important;
    }

    .tablet_mobile__head label {
        font-size: 15px !important;
    }

    .tablet_mobile__filter {
        gap: 0.25rem;
    }
}

@media screen and (max-width:800px) {
    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
    }

    .photo {
        flex-basis: 210px !important;
    }

    .tablet_mobile__head label {
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter {
        flex-direction: column;
        padding: 5px 0px !important;
    }

    .tablet_mobile__filter * {
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }

    .date__picker {
        margin: 5px 0 10px !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head {
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo {
        flex-basis: 150px !important;
        height: 100px !important;
    }
}

.establishment__info_tablet {
    margin-top: 50px;
}
</style>