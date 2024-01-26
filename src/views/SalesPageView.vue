<template>
    <div class="left__side">
        <div class="head">
            <div class="app__title">
                <h1>Sales</h1>
            </div>
        </div>

        <div id="ttv__container" style="margin-top: 25px;">
            <div class="app__title" style="margin-bottom: 25px;">
                <h2>TTV</h2>
            </div>
            <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody">
                        <Bar :data="data" :options="options" />
                    </div>
                </div>
                <div class="legend-container">
                    <span v-for="(legendValue, index) in legendValues" :key="`legend-badge-${index}`">
                        <span :style="{ 'background-color': legendValue.color }" class="badge"></span>
                        <span class="title">{{ legendValue.label }}</span>
                    </span>
                </div>
            </div>
        </div>

        <div style="margin-top: 25px;">
            <div class="app__title" style="margin-bottom: 25px;">
                <h2>Number of booking</h2>
            </div>
            <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody2">
                        <Bar :data="dataBooking" :options="options" />
                    </div>
                </div>
                <div class="legend-container">
                    <span v-for="(legendValue, index) in legendValuesBooking" :key="`legend-badge-${index}`">
                        <span :style="{ 'background-color': legendValue.color }" class="badge"></span>
                        <span class="title">{{ legendValue.label }}</span>
                    </span>
                </div>
            </div>

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
            </div>
        </div>
    </div>
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip, PointElement, PointElement,
    LineElement)

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const route = useRoute();

appStore.setIsExist(true);

appStore.setCurrentPage({
    title1: "",
    title2: "",
    icon: "uil-users-alt",
});

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Sales",
        path: `${route.path}`,
        isCurrent: true,
    },
]);



const colors = ref(['#f75842', '#337ecc', '#4682B4', '#6495ED', '#1E90FF', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']);

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
        const containerBody = document.querySelector('.containerBody');
        const _containerBody = document.querySelector('.containerBody2');
        // const right__side = document.querySelector('.right__side');
        let totalLabels = 0
        if (type == 'sales') {
            data.value = transformSalesData(response.data.data)
            totalLabels = data.value['labels'].length
        }
        else {
            dataBooking.value = transformBookingData(response.data.data)
            totalLabels = dataBooking.value['labels'].length
        }

        if (totalLabels > 11) {
            let new_width = totalLabels * 150
            containerBody.style.width = `${new_width}px`
            _containerBody.style.width = `${new_width}px`
            // right__side.style.width = `${500}px`
        } else {
            containerBody.style.width = '';
            _containerBody.style.width = '';
            // right__side.style.width = `${350}px`
        }
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
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    plugins: {
        legend: {
            display: false,
            // position: 'bottom'
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
                appStore.setExist(false);
                appStore.isLoading = false;
            }
        });
    });

    if (response.status == 200) {
        establishment.value = response.data;
        appStore.setCurrentPage({
            title1: "",
            title2: establishment.value.name,
            icon: "uil-users-alt",
        })
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

const legendValues = ref([
    {
        label: "TTV",
        color: "#FFC04C",
    },
    {
        label: "Global",
        color: "#f75842",
    },
    {
        label: "Reviews",
        color: "#337ecc",
    },
])

const legendValuesBooking = ref([
    {
        label: "Bookings",
        color: "#FFC04C",
    },
    {
        label: "Global",
        color: "#f75842",
    },
    {
        label: "Reviews",
        color: "#337ecc",
    },
])

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
                backgroundColor: '#FFC04C',
                borderColor: '#FFC04C',
                fill: true,
                stack: 'combined',
            },
            {
                label: 'Global',
                yAxisID: 'y-axis-1',
                data: totalData,
                backgroundColor: '#f75842',
                // borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Reviews',
                yAxisID: 'y-axis-1',
                data: reviewsData,
                backgroundColor: '#337ecc',
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
                backgroundColor: '#FFC04C',
                borderColor: '#FFC04C',
                fill: true,
                stack: 'combined',
            },
            {
                label: 'Global',
                yAxisID: 'y-axis-1',
                data: totalData,
                backgroundColor: '#f75842',
                // borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Reviews',
                yAxisID: 'y-axis-1',
                data: reviewsData,
                backgroundColor: '#337ecc',
                // borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,

            }
        ]
    };
    return chartData;
};
</script>