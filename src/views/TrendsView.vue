<template>
    <div class="left__side">
        <div class="head">
            <div class="app__title">
                <h2>Trends</h2>
            </div>
        </div>
        <div style="margin-top: 15px;">
            <Line :data="data" :options="options" />
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
            <!-- <div class="society__location">
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
            </div> -->
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
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute } from "vue-router";
import { ref, watch, onBeforeMount, provide, onUpdated, inject } from 'vue';
import { ElDatePicker } from 'element-plus';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useResizeObserver } from '@vueuse/core';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const appStore = useAppStore();
const route = useRoute();
const companiesStore = useCompanyStore();

appStore.setIsExist(true);

appStore.setCurrentPage({
    title1: "",
    title2: "Trends",
    icon: "uil-trophy",
})

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Trends",
        path: `${route.path}`,
        isCurrent: true,
    },
]);

const dataLoading = ref(true)
let establishment = ref({});
provide('establishment', establishment)
const companyId = route.params.id;
const customerTag = inject('tag')

let timePeriods = ref(['Daily', 'Monthly', 'Yearly']);
let selectedTimePeriod = ref(timePeriods.value[0]);
const date = ref([]);
// let start_date = ref(moment().subtract(10, 'days').format('YYYY-M-DD'));
// let end_date = ref(moment().format('YYYY-M-DD'));
// const start_date = ref(appStore.start_date);
// const end_date = ref(appStore.end_date);
const start_date = inject('start_date');
const end_date = inject('end_date');
let data = ref({
    labels: [],
    datasets: []
})

const options = ref({
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        }
    },
    scales: {
        y: {
            min: 0,
            max: 6,
            ticks: {
                stepSize: 1,
                precision: 0,
                beginAtZero: true
            }
        }
    }
});

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

const loadFromServer = async (type, company, datefrom, dateto) => {

    const response = await new Promise((resolve) => {
        services.get_Record(`establishment/trends?tag=${company}&dateFrom=${datefrom}&dateTo=${dateto}`, (response) => {
            resolve(response)
        });

    });

    if (response.status == 200) {
        data.value = transformData({ ...response.data })
        console.log('data value', data.value)
        console.log('response data', response.data)
    }
}

watch([date, selectedTimePeriod], () => {
    console.log(date.value)
    if (date.value.length == 0) {

        date.value = [moment().subtract(10, 'days').format('YYYY-M-DD'), moment().format('YYYY-M-DD')];
    }
    // appStore.setDatesValue(start_date.value, end_date.value);
    let datefrom = moment(date.value[0]).format('YYYY-MM-DD');
    let dateto = moment(date.value[1]).format('YYYY-MM-DD');
    loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, datefrom, dateto);
})

onBeforeMount(async () => {
    appStore.isLoading = true;
    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            
            appStore.setCurrentPage({
                title1: "",
                title2: "Trends",
                icon: "uil-trophy",
            })

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Trends",
                    path: `${route.path}`,
                    isCurrent: true,
                },
            ]);
            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;
        }
    });

    await loadFromServer('daily', companyId, start_date.value, end_date.value)

    // const response = await new Promise((resolve) => {
    //     services.get_Record(`establishment/${companyId}/rating`, (response) => {
    //         resolve(response)
    //         if (response.status == 404) {
    //             appStore.setIsExist(false);
    //             appStore.isLoading = false;
    //         }
    //     });
    // });

    // if (response.status == 200) {
    //     establishment.value = response.data;
    //    appStore.setCurrentPage({
    //         title1: "",
    //         title2: "Trends",
    //         icon: "uil-trophy",
    //     })

    //     appStore.setBreadcrumbs([
    //         {
    //             title: establishment.value.name,
    //             path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
    //             isCurrent: false,
    //         },
    //         {
    //             title: "Trends",
    //             path: `${route.path}`,
    //             isCurrent: true,
    //         },
    //     ]);
    //     all_items.value[0].value = establishment.value.rating;
    //     all_items.value[1].value = establishment.value.totalReviews;
    //     appStore.isLoading = false;
    //     dataLoading.value = false;
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

const generateColor = (text, index) => {
    const colors = ['#f75842', '#337ecc', '#1E90FF', '#87CEFA', '#B0C4DE', '#4169E1', '#231db8'];

    return colors[index];
}

function transformData(inputData) {
    const labels = Object.keys(inputData.data);
    let datasets = {};
    let index = 3;

    labels.forEach(date => {
        Object.keys(inputData.data[date]).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).forEach(key => {
            if (!datasets[key]) {
                
                if (key == 'global') {
                    datasets[key] = {
                        label: key,
                        borderColor: '#FF0000',
                        borderWidth: 3,
                        backgroundColor: '#FF0000',
                        data: Array(labels.length).fill(0),
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1
                    };
                }else if(key == 'reviews'){
                    datasets[key] = {
                        label: key,
                        borderColor: '#337ecc',
                        borderWidth: 3,
                        backgroundColor: '#337ecc',
                        data: Array(labels.length).fill(0),
                    };
                } else {
                    datasets[key] = {
                        label: key,
                        borderColor: generateColor(key, index),
                        borderWidth: 3,
                        backgroundColor: generateColor(key, index),
                        data: Array(labels.length).fill(0)
                    };
                    index++;
                }
            }
            datasets[key].data[labels.indexOf(date)] = inputData.data[date][key];
        });
    });

    let global = Object.values(datasets).find(x => x.label == 'global');

    datasets = Object.values(datasets).filter(x => x.label != 'global' && x.label != 'events');
    datasets.unshift(global)

    const result = {
        labels: labels,
        datasets: datasets
    };

    return result;
}
</script>