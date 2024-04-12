<template>
    <!-- <div class="left__side"> -->
        <!-- <div class="head">
            <div class="app__title">
                <h2>Staffs Ranking</h2>
            </div>
        </div> -->

        <!-- Table of ranking -->
        <div class="relative overflow-x-auto" style="margin-top: 15px;">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Staff Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Number of Evaluations
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Average grades
                        </th>
                        <th scope="col" class="px-6 py-3">
                            last 5 grades
                        </th>
                    </tr>
                </thead>
                <tbody v-if="staffs.length > 0">
                    <tr v-for="staff in staffs" :key="staff.id"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ staff.name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ staff.nb_eval }}
                        </td>
                        <td class="px-6 py-4">
                            {{ staff.note_moyenne }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div v-for="(note, index) in staff.last_notes" :key="index"
                                    class="rounded-full w-6 h-6 mx-1" :class="{
                                        'bg-red-600': Math.round(note.rating) == 0,
                                        'bg-red-500': Math.round(note.rating) == 1,
                                        'bg-orange-400': Math.round(note.rating) == 2,
                                        'bg-yellow-200': Math.round(note.rating) == 3,
                                        'bg-green-400': Math.round(note.rating) == 4,
                                        'bg-green-600': Math.round(note.rating) == 5
                                    }">
                                    <span class="text-white flex items-center justify-center h-full">
                                        {{ Math.round(note.rating) }}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="no__staff">
                        <td colspan="4">
                            <div style="text-align: center;">
                                <span>no staff</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    <!-- </div> -->

    <!-- <div class="tablet_mobile__filter">
        <div class="date__picker">
            <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
        </div>

        <div class="date__picker">
            <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
        </div>
        <DropdownComponent :showTitle="false" class="dropdown w-full" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
            selectedTimePeriod = timePeriod
        }" :default="timePeriods[0]" />
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
        </div>
        <div class="photo" v-if="!dataLoading">
            <div v-if="establishment.url_source !== null" class="establishment__img">
                <img :src="establishment.url_source" alt="" />
            </div>
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
        <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#" v-if="!dataLoading">
                <div v-if="establishment.url_source !== null" class="establishment__img">
                    <img :src="establishment.url_source" alt="" />
                </div>
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
                    <span v-if="!dataLoading" class="society__location">{{ establishment.address1 }}, {{
                        establishment.city }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>

            </div>

            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                    :size="'large'" />
                <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[1]" />
            </div>
        </div>
    </div> -->
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import {
    ref,
    watch,
    onBeforeMount,
    provide,
    inject,
    onUpdated,
} from 'vue';
import { ElDatePicker } from 'element-plus';

import { useResizeObserver } from '@vueuse/core';

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true);

const route = useRoute();

// appStore.setBreadcrumbs([
//     {
//         title: "Establishment",
//         path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
//         isCurrent: false,
//     },
//     {
//         title: "Staffs",
//         path: `/customer/${route.params.tag}/establishment/${route.params.id}/staffs`,
//         isCurrent: false,
//     },
//     {
//         title: "Staffs Ranking",
//         path: `${route.path}`,
//         isCurrent: true
//     }
// ]);

const dataLoading = ref(true)
let establishment = ref({});
provide('establishment', establishment)
let staffs = ref([]);
provide('staffs', staffs);
const companyId = route.params.id;
let timePeriods = ref(['Daily', 'Monthly', 'Yearly']);
let selectedTimePeriod = ref(timePeriods.value[0]);
const date = ref([]);
const currentDate = new Date();
const start_date = inject('start_date');
const end_date = inject('end_date');

provide('date', date);
provide('type', selectedTimePeriod);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
watch([start_date, end_date], () => {
    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        date.value = [start_date.value, end_date.value]
    } else {
        date.value = [];
    }

})

const customerTag = inject('tag')

const loadFromServer = async (type, company, datefrom, dateto) => {
    switch (type) {
        case 'yearly':
            datefrom = moment(datefrom).format('YYYY');
            dateto = moment(dateto).format('YYYY');
            break;
        case 'monthly':
            datefrom = moment(datefrom).format('YYYY-MM');
            dateto = moment(dateto).format('YYYY-MM');
            break;
        default:
            datefrom = moment(datefrom).format('YYYY-MM-DD');
            dateto = moment(dateto).format('YYYY-MM-DD');
            break;
    }

    const response = await new Promise((resolve) => {
        services.get_Record(`establishment/${company}/${type}/${datefrom}/${dateto}/staffs/notes`, (response) => {
            resolve(response)
        });

    });

    if (response.status == 200) {
        staffs.value = response.data;
    }
}

watch([start_date, end_date, selectedTimePeriod], () => {
    loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, start_date.value, end_date.value);
})

onBeforeMount(async () => {
    // appStore.isLoading = true;

    // companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

    //     if (data == false) {
    //         appStore.setIsExist(false);
    //         appStore.isLoading = false;
    //     }
    //     else {
    //         establishment.value = data;
    //         appStore.setCurrentPage({
    //             title1: "",
    //             title2: "Staff ranking",
    //             icon: "uil-trophy",
    //         })

    //         appStore.setBreadcrumbs([
    //             {
    //                 title: establishment.value.name,
    //                 path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
    //                 isCurrent: false,
    //             },
    //             {
    //                 title: "Staffs",
    //                 path: `/customer/${route.params.tag}/establishment/${route.params.id}/staffs`,
    //                 isCurrent: false,
    //             },
    //             {
    //                 title: "Staffs Ranking",
    //                 path: `${route.path}`,
    //                 isCurrent: true
    //             }
    //         ]);

    //         all_items.value[0].value = establishment.value.rating;
    //         all_items.value[1].value = establishment.value.totalReviews;
    //         appStore.isLoading = false;
    //         dataLoading.value = false;

    //     }
    // })
    await loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, start_date.value, end_date.value);
    // const response = await new Promise((resolve) => {
    //     firstDateOfPreviousYear = moment(firstDateOfPreviousYear).format('YYYY-MM-DD');
    //     lastDateOfCurrentYear = moment(lastDateOfCurrentYear).format('YYYY-MM-DD');
    //     services.get_Record(`establishment/${companyId}/${selectedTimePeriod.value.toLowerCase()}/${firstDateOfPreviousYear}/${lastDateOfCurrentYear}/staffs/notes`, (response) => {
    //         resolve(response)
    //         if (response.status == 404) {
    //             appStore.setIsExist(false);
    //             appStore.isLoading = false;
    //         }
    //     });

    // });

    // if (response.status == 200) {
    //     staffs.value = response.data;
    //     console.log(staffs.value)

    // }

})


const el = ref(null);
const chartWidth = ref(0);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});
</script>