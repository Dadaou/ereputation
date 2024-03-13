<template>
    <div class="left__side">
        <div class="head">
            <div class="app__title">
                <h2>Event Histogram</h2>
            </div>
        </div>
        <div class="reviews__content" ref="el">
            <div v-if="chartLoading == true" :style="{
                'width': `100%`,
                'height': `200px`,
                'display': 'flex',
                'alignItems': 'center',
                'background': 'rgba(0, 0, 0, 0.1)',
                'opacity': 0.9,
                'justifyContent': 'center',
                'alignItems': 'center',
                'zIndex': 1,
                'marginTop': '10px',
                'marginBottom': '10px'
            }">
                <SpinnerComponent />
            </div>
            <EventChartComponent v-else :establishment="establishment" :width="chartWidth" />
        </div>
        <div class="head mb-4">
            <div class="app__title" style="margin-top: 50px;">
                <h2>Events List</h2>
            </div>
        </div>
         <el-tabs
            v-model="activeName"
            type="card"
            class="demo-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane label="Events" name="events">
                <div class="reviews__content">
                    <EventItemComponent v-if="eventLoading == false" :events="events"/>
                    <div v-else role="status"
                        class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                        v-for="index in 2" :key="index">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                </div>
                                <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                            </div>
                            <div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Public Events" name="public_events">
                <div class="reviews__content">
                     <EventItemComponent v-if="eventLoading == false" :events="publics"/> 
                    <div v-else role="status"
                        class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                        v-for="index in 2" :key="index">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                </div>
                                <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                            </div>
                            <div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </el-tab-pane>
          </el-tabs>
    </div>
    <div class="tablet_mobile__filter">
        <div class="date__picker px-2">
            
            <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
        </div>

        <div class="date__picker px-2">
            
            <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
        </div>
        <DropdownComponent :showTitle="false" class="dorpdown w-full"  placeholder="" :data="timePeriods" @submit="(timePeriod) => {
            selectedTimePeriod = timePeriod
        }" :default="timePeriods[0]" />

    </div>
    <div class="tablet_mobile__head">
        <div class="establishment__info_tablet">
            <label v-if="!dataLoading">{{ establishment.name }}</label>
            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
            <div>
                <i
                    :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '',establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '',establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                    :size="'large'" />
                <DropdownComponent :showTitle="false"   placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import EventItemComponent from '@Components/events/EventItemComponent.vue';
import { ref, watch, onBeforeMount, onUpdated, provide, defineAsyncComponent, inject } from 'vue';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css'
import { useResizeObserver } from '@vueuse/core';
import { ElTabs, ElTabPane } from 'element-plus';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

const EventChartComponent = defineAsyncComponent(() =>
    import('@Components/utils/EventChartComponent.vue')
)

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true);
appStore.setCurrentPage({
    title1: "",
    title2: "Events",
    icon: "uil-calender",
})

const route = useRoute();

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Events",
        path: `${route.path}`,
        isCurrent: true
    }
])

const dataLoading = ref(true);
const chartLoading = ref(false);
provide('chartLoading', chartLoading);
const eventLoading = ref(false);
const customerTag = inject('tag');
const activeName = ref('events'); // ou public event

const companyId = route.params.id;
let establishment = ref({});
provide('establishment', establishment)
let events = ref([]);
provide('events', events);
let publics = ref([]);
const timePeriods = ref(['Daily', 'Weekly', 'Monthly', 'Yearly']);
const selectedTimePeriod = ref(timePeriods.value[1]);
// let start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
// let end_date = ref(moment().format('YYYY-M-DD'));
// const date = ref([moment().subtract(30, 'days').format('YYYY-M-DD'), moment().format('YYYY-M-DD')]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const date = ref([start_date.value, end_date.value])
provide('date', date);
provide('type', selectedTimePeriod);

const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');

watch([start_date, end_date], async () => {
    // if (start_date.value !== '' && end_date.value !== '') {
    //     date.value = [start_date.value, end_date.value]
    // } else {
    //     date.value = [moment().subtract(30, 'days').format('YYYY-M-DD'), moment().format('YYYY-M-DD')];
    // }
    date.value = [start_date.value, end_date.value]

    if(activeName.value == 'events'){
        await loadEvents(companyId, start_date.value, end_date.value)
    }else{
        await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    }
})

watch(activeName, async()=>{
    if(activeName.value == 'events'){
        await loadEvents(companyId, start_date.value, end_date.value)
    }else{
        await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    }
})

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined || value == [])?false:true;
const loadEvents = async (tag, dateStart, dateEnd, locality)=>{
    eventLoading.value = true;
    let apiBase = `/establishment/${tag}/event`;
    let apiParams = '';

    if (IsValueOkay(dateStart)) {
      dateStart = moment(dateStart).format('YYYY-MM-DD')
      apiParams += `fromDate=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
      dateEnd = moment(dateEnd).format('YYYY-MM-DD')
      apiParams += `&toDate=${dateEnd}`;
    }

    if (IsValueOkay(locality)) {
      apiParams += `&locality=${locality}`;
    }

    const api = `${apiBase}?${apiParams}`;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
            if (response.status == 404) {
                appStore.setIsExist(false)
                appStore.isLoading = false;
            }
        });
    });

    if (response.status == 200) {
        if(IsValueOkay(locality)){
            publics.value = response.data
        }else events.value = response.data;
        eventLoading.value = false;
    }
}

const handleClick = ()=>{


}

onBeforeMount(async () => {
    appStore.isLoading = true;
    chartLoading.value = true;

    companiesStore.getEstablishment(customerTag.value, companyId).then(async(data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            console.log(establishment.value)

            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value.name,
                icon: "uil-calender",
            })

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Events",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;

        }
    })
    // if(activeName.value == 'events'){
    //     await loadEvents(companyId, start_date.value, end_date.value)
    // }else{
    //     await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    // }
    chartLoading.value = false
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