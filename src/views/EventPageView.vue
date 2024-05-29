<template>
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
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="Private Events" name="events">
            <div class="reviews__content">
                <EventItemComponent v-if="eventLoading == false" :events="events" />
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
                <EventItemComponent v-if="eventLoading == false" :events="publics" />
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
const activeName = ref('events'); 

const companyId = route.params.id;
let establishment = ref({});
provide('establishment', establishment)
let events = ref([]);
provide('events', events);
let publics = ref([]);

const start_date = inject('start_date');
const end_date = inject('end_date');
const date = ref([start_date.value, end_date.value])
provide('date', date);

const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');

watch([start_date, end_date], async () => {
    date.value = [start_date.value, end_date.value]

    if (activeName.value == 'events') {
        await loadEvents(companyId, start_date.value, end_date.value)
    } else {
        await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    }
})

watch(activeName, async () => {
    if (activeName.value == 'events') {
        await loadEvents(companyId, start_date.value, end_date.value)
    } else {
        await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    }
})


const IsValueOkay = (value) => (value == '' || value == null || value == undefined || value == []) ? false : true;
const loadEvents = async (tag, dateStart, dateEnd, locality) => {
    eventLoading.value = true;
    let apiBase = `/establishment/${tag}/event`;
    let apiParams = '';

    if (IsValueOkay(dateStart)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD')
        apiParams += `fromDate=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD')
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
        if (IsValueOkay(locality)) {
            publics.value = response.data
        } else events.value = response.data;
        eventLoading.value = false;
    }
}

onBeforeMount(async () => {
    chartLoading.value = true;
    if (activeName.value == 'events') {
        await loadEvents(companyId, start_date.value, end_date.value)
    } else {
        await loadEvents(companyId, start_date.value, end_date.value, establishment.value.locality_id)
    }
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