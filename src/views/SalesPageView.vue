<template>
    <div class="main__container" v-if="exist">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="app__container">
            <div class="left__side">
                <div class="head">
                    <div class="app__title">
                        <h1>Sales</h1>
                    </div>
                </div>

                <div style="margin-top: 25px; height: 400px; width: 100%;">
                    <div class="app__title" style="margin-bottom: 25px;">
                        <h2>TTV</h2>
                    </div>
                    <Bar :data="data" :options="options" />
                </div>

                <div style="margin-top: 25px;">
                    <div class="app__title" style="margin-bottom: 25px;">
                        <h2>Booking's number</h2>
                    </div>
                    <Bar :data="dataBooking" :options="options" />
                </div>


            </div>

            <div class="tablet_mobile__filter">
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
                        <span v-if="!dataLoading">{{ establishment.address1 }}, {{ establishment.city }}</span>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
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
import { useResizeObserver } from '@vueuse/core';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, PointElement,
    LineElement)

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

const page = ref({
    title1: "",
    title2: "",
    icon: "uil-users-alt",
});

const route = useRoute();
const breadcrumbData = [
    {
        title: "Back",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Sales",
        path: `${route.path}`,
        isCurrent: true,
    },
]

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();

const dataLoading = ref(true)
let establishment = ref({});
provide('establishment', establishment)
let visibleData = ref([]);
let paginationConfig = ref({
    current: 0,
    size: 5,
    data: [],
    _data: []
});
const companyId = route.params.id;

const showModal = ref(false);
let timePeriods = ref(['Daily', 'Monthly', 'Yearly']);
let selectedTimePeriod = ref(timePeriods.value[0]);
const date = ref([]);
const currentDate = new Date();
let start_date = ref(moment().subtract(10, 'days').format('YYYY-M-DD'));
let end_date = ref(moment().format('YYYY-M-DD'));
let data = ref({
    labels: [],
    datasets: []
})

let dataBooking = ref({
    labels: [],
    datasets: []
})


provide('date', date);
provide('type', selectedTimePeriod);
let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
const { width, height } = useWindowSize();

const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
watch([start_date, end_date], () => {
    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        date.value = [start_date.value, end_date.value]
    } else {
        date.value = [];
    }
})

const loadFromServer = async (company, datefrom, dateto, type) => {

    let api = `establishment/booking/${type}?tag=${company}&dateFrom=${datefrom}&dateTo=${dateto}`
    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });

    });

    if (response.status == 200) {
        if (type == 'sales') data.value = transformSalesData(response.data.data);
        else dataBooking.value = transformBookingData(response.data.data)
    }
}

watch(date, () => {
    if (date.value.length == 0) {

        date.value = [moment().subtract(10, 'days').format('YYYY-M-DD'), moment().format('YYYY-M-DD')];
    }
    let datefrom = moment(date.value[0]).format('YYYY-MM-DD');
    let dateto = moment(date.value[1]).format('YYYY-MM-DD');
    loadFromServer(companyId, datefrom, dateto, 'sales');
    loadFromServer(companyId, datefrom, dateto, 'number');
})

const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'x',
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'x',
            }
        }
    },
    scales: {
        'y-axis-1': {
            type: 'linear',
            display: true,
            position: 'left',
        },
        'y-axis-2': {
            type: 'linear',
            display: true,
            position: 'right', // Setting the second y-axis to the right
            grid: {
                drawOnChartArea: false, // This will prevent the right y-axis from displaying its grid lines
            },
        }
    }
}

onBeforeMount(async () => {
    let company = null;
    appStore.isLoading = true;
    console.log(companyId)
    await loadFromServer(companyId, start_date.value, end_date.value, 'sales')
    await loadFromServer(companyId, start_date.value, end_date.value, 'number')

    const response = await new Promise((resolve, reject) => {
        services.get_Record(`establishment/${companyId}/rating`, (response) => {
            resolve(response)
            if (response.status == 404) {
                exist.value = false;
                appStore.isLoading = false;
            }
        });
    });

    if (response.status == 200) {
        establishment.value = response.data;
        page.value.title2 = establishment.value.name;
        all_items.value[0].value = establishment.value.rating;
        all_items.value[1].value = establishment.value.totalReviews;
        appStore.isLoading = false;
        dataLoading.value = false;
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

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});

const hashString = (inputString) => {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = (hash << 5) - hash + inputString.charCodeAt(i);
    }
    return hash;
}

const generateColor = (text) => {
    const inputString = text;
    const hash = hashString(inputString);

    const red = (hash & 0xFF0000) >> 16;
    const green = (hash & 0x00FF00) >> 8;
    const blue = hash & 0x0000FF;

    return `rgb(${red}, ${green}, ${blue})`;
}

const transformSalesData = (salesData) => {
    const labels = Object.keys(salesData);

    const ttvData = labels.map(date => salesData[date].TTV);
    const reviewsData = labels.map(date => salesData[date].reviews);
    const totalData = labels.map(date => salesData[date].global);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'TTV',
                type: 'line',
                yAxisID: 'y-axis-2',
                data: ttvData,
                backgroundColor: 'grey',
                borderColor: 'grey',
                fill: true,
                stack: 'combined',
            },
            {
                label: 'Global',
                yAxisID: 'y-axis-1',
                data: totalData,
                backgroundColor: '#9c9aff',
                // borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Reviews',
                yAxisID: 'y-axis-1',
                data: reviewsData,
                backgroundColor: '#ff977a',
                // borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,

            }
        ]
    };
    return chartData;
};

const transformBookingData = (salesData) => {
    const labels = Object.keys(salesData);

    const bookingData = labels.map(date => salesData[date].Bookings);
    const reviewsData = labels.map(date => salesData[date].reviews);
    const totalData = labels.map(date => salesData[date].global);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Bookings',
                type: 'line',
                yAxisID: 'y-axis-2',
                data: bookingData,
                backgroundColor: 'grey',
                borderColor: 'grey',
                fill: true,
                stack: 'combined',
            },
            {
                label: 'Global',
                yAxisID: 'y-axis-1',
                data: totalData,
                backgroundColor: '#9c9aff',
                // borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Reviews',
                yAxisID: 'y-axis-1',
                data: reviewsData,
                backgroundColor: '#ff977a',
                // borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,

            }
        ]
    };
    return chartData;
};
</script>

<style scoped>
.no__staff {
    display: flex !important;
    align-items: center !important;
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

.reviews__content p {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-bg1);
}

.reviews__content a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}

.reviews__content a:hover {
    background-color: var(--color-danger);
    color: white;
}

.reviews__pagination {
    display: flex;
    justify-content: flex-end;
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

.app__title {
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1 {
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2 {
    font-size: 18px;
    transition: var(--transition);
}

.left__side {
    width: 100%;
    padding: 50px 5px;
}

.left__side .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
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

.dashboard__content {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 50px auto;
}

.counter {
    flex-grow: 1;
}

.reviews__content {
    margin-top: 20px;
}

.rating {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
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

.see__more {
    cursor: pointer;
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

.ptable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.ptable th {
    background-color: #678bb1;
    color: white;
}

.ptable th,
.ptable td {
    border: 1px solid #ddd;
    padding: 8px;
}

.ptable tr:nth-child(even) {
    background-color: #f2f2f2;
}

.ptable tr:hover {
    background-color: #ddd;
}

.ptable td:nth-child(3) {
    font-weight: bold;
}

.ptable td:nth-child(5) {
    color: #df6145;
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

    .dashboard__content,
    .dashboard,
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

    .photo {
        flex-basis: 225px !important;
    }

    .ptable th,
    .ptable td {
        padding: 4px;
    }

    .ptable th {
        font-size: 12px;
    }

    .ptable td {
        font-size: 14px;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
    }

    .tablet {
        display: none !important;
    }

    .mobile__filter__btn {
        display: flex !important;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 10px;
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

    .ptable th {
        font-size: 10px;
    }

    .ptable td {
        font-size: 12px;
    }
}

.establishment__info_tablet {
    margin-top: 50px;
}
</style>