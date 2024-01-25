<template>
    <div class="left__side">
        <div class="head">
            <div class="app__title">
                <h2>Weather</h2>
            </div>
            <el-dropdown split-button type="primary">
                {{ calculType }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="calculType = 'Fahrenheit °F'">Fahrenheit °F</el-dropdown-item>
                        <el-dropdown-item @click="calculType = 'Celcius °C'">Celcius °C</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <WeatherChartComponent />
        <div class="head">
            <div class="app__title">
                <h2>Weather's global impact</h2>
            </div>
        </div>
        <div class="review__content">
            <div v-if="load == true" :style="{
                'width': '100%',
                'height': `350px`,
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
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5" v-else>
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            v-for="conditionData in formattedWeatherRating" :key="conditionData.condition">
                            <td class="px-6 py-4" :style="{
                                'fontWeight': 'bold',
                            }">
                                {{ conditionData.condition }}
                            </td>
                            <td class="px-6 py-4" :style="{
                                'color': conditionData.color,
                                'fontWeight': 'bold',
                            }">
                                {{ conditionData.note != 0 ? conditionData.note : '' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="tablet_mobile__filter">
        <div class="date__picker">
            <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
        </div>
        <div class="date__picker">
            <el-date-picker v-model="dateEnd" placeholder="End date" :size="'large'" />
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
        <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" />
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
    Tooltip,
    Legend
} from 'chart.js';
import { PolarArea, Pie } from 'vue-chartjs';
import { useResizeObserver, useWindowSize } from '@vueuse/core';
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/dropdown-item/style/css'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip)

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();

const data_test = {
    labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
    ],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(179,181,198,0.2)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
}

appStore.setCurrentPage({
    title1: "",
    title2: "Weather",
    icon: "uil-cloud-sun",
})

appStore.setIsExist(true);

const WeatherChartComponent = defineAsyncComponent(() =>
    import('@Components/utils/WeatherChartComponent.vue')
)

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
);

const route = useRoute();
const companyId = route.params.id;
const router = useRouter();

appStore.setBreadcrumbs([
    {
        title: "Back",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Weather",
        path: `${route.path}`,
        isCurrent: true
    }
])

let data = ref([]);
let weatherIcons = ref([]);

provide('data', data);
provide('icons', weatherIcons);
let calculType = ref('Celcius °C');

const dataLoading = ref(true);
const chartLoading = ref(false);
provide('chartLoading', chartLoading);
const { width, height } = useWindowSize();
let load = ref(true);

let establishment = ref({});
let weather = ref([]);
let reviews = ref([]);
const legendData = ref([]);
const legendGlobalData = ref([]);
provide('legendData', legendData);
let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dateEnd = ref(new Date());
const dateto = moment(dateEnd.value).format('YYYY-MM-DD');
const datefrom = moment().subtract(30, 'days').format('YYYY-MM-DD')
const dateStart = ref(new Date(datefrom));
const enableDateEnd = ref(false);
const colors = ref(['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']);
const chartWidth = ref(0);
provide('chartWidth', chartWidth);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth - 50) : chartWidth.value;
})

const format2 = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}/${month}/${day}`;
}

const handleDate = (modelData) => {
    enableDateEnd.value = (modelData != null) ? true : false;
    dateEnd.value = null;
}

watch([dateStart, dateEnd], async () => {
    console.log(dateStart.value, dateEnd.value)
    load.value = true
    await loadWeatherFromServer(companyId, dateStart.value, dateEnd.value, calculType.value);
    await loadConditionFromServer(companyId, dateStart.value, dateEnd.value);
})

function comparerDates(a, b) {
    var dateA = a.date.split(' ')[1];
    var dateB = b.date.split(' ')[1];

    var dateObjA = new Date(dateA.split('-').reverse().join('-'));
    var dateObjB = new Date(dateB.split('-').reverse().join('-'));

    // Compare les dates
    return dateObjA - dateObjB;
}

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

const weaherImpact = (startDate, endDate) => {
    let reviewData = reviews.value;
    let weatherData = weather.value;

    const impactByDay = {};

    weatherData.forEach((weather) => {
        const date = moment(weather.date_weather);

        if (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate) || date.isSame(endDate)) {
            if (!impactByDay[date.format('YYYY-MM-DD')]) {
                impactByDay[date.format('YYYY-MM-DD')] = {};
                impactByDay[date.format('YYYY-MM-DD')]['reviews'] = []
                impactByDay[date.format('YYYY-MM-DD')]['note'] = 0;
            }
            if (calculType.value == 'Celcius °C') {
                impactByDay[date.format('YYYY-MM-DD')]['temp'] = ((weather.tempmax + weather.tempmin - 64) / 3.6).toFixed(1);
            } else {
                impactByDay[date.format('YYYY-MM-DD')]['temp'] = ((weather.tempmax + weather.tempmin) / 2).toFixed(1);
            }
            impactByDay[date.format('YYYY-MM-DD')]['max'] = ((weather.tempmax - 32) / 1.8).toFixed(1);
            impactByDay[date.format('YYYY-MM-DD')]['min'] = ((weather.tempmin - 32) / 1.8).toFixed(1);
            impactByDay[date.format('YYYY-MM-DD')]['condition'] = weather.conditions;
        }
    });

    reviewData.forEach((review) => {
        const date = moment(review.date_review);

        if (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {
            let rating = parseInt(review.rating, 10);

            if (rating > 5) {
                rating /= 2;
            }
            if (!impactByDay[date.format('YYYY-MM-DD')]) {
                impactByDay[date.format('YYYY-MM-DD')] = {};
                impactByDay[date.format('YYYY-MM-DD')]['reviews'] = [];
                impactByDay[date.format('YYYY-MM-DD')]['temp'] = 25;
                impactByDay[date.format('YYYY-MM-DD')]['max'] = 30;
                impactByDay[date.format('YYYY-MM-DD')]['min'] = 20;
                impactByDay[date.format('YYYY-MM-DD')]['note'] = 0;
            }
            impactByDay[date.format('YYYY-MM-DD')]['reviews'].push(review);
            let nb = impactByDay[date.format('YYYY-MM-DD')]['reviews'].length;
            let sum = (impactByDay[date.format('YYYY-MM-DD')]['note'] + Number(rating))
            impactByDay[date.format('YYYY-MM-DD')]['note'] = nb >= 2 ? sum / 2 : sum;
        }
    });

    let data = [];
    for (const key in impactByDay) {
        let icon = generateWeatherIcon(key)
        let item = {
            "date": `${icon}\n ${moment(key).format('DD-MM-YYYY')}`,
            "rating": impactByDay[key]['note'],
            "temperature": impactByDay[key]['temp'],
        }

        data.push(item);
    }

    let dataType = ['rating']
    legendData.value = generatedLegend(colors.value, dataType);
    data.sort(comparerDates);
    return data;
}

const generateWeatherIcon = (day) => {
    const weatherClassification = {
        'Rain, Overcast': "🌧",
        'Rain, Partially cloudy': "🌦",
        'Partially cloudy': "⛅",
        'Clear': "🌞",
        'Rain': "☔",
        'Rain Overcast': "🌧",
        'Overcast': "☁",
        'Rain Partially cloudy': "🌦"
    }

    const weatherData = weather.value;
    const dayWeather = weatherData.find(weather => {
        return moment(weather.date_weather).isSame(day, 'day')
    })

    if (dayWeather && weatherClassification[dayWeather.conditions]) {
        return weatherClassification[dayWeather.conditions]
    }

    return "🌞"

}

const generatedLegend = (colors, dataType) => {
    let legends = [];

    dataType.forEach((type, index) => {
        let legend = {};
        legend['name'] = type;
        legend['color'] = colors[index];
        legends.push(legend);
    })
    return legends;
}

const globalData = ref({
    labels: [],
    datasets: []
})

const options = {
    responsive: true,
    maintainAspectRatio: false
}
const generatedLabel = (weatherData) => {
    let labels = [];
    let data = {};
    weatherData.forEach(weather => {
        let conditions = weather.conditions.split(',');
        if (!labels.includes(conditions[0].trim())) labels.push(conditions[0].trim());
    })

    labels.forEach(label => {
        data[label] = {};
        data[label]['notes'] = [];
    })
    return [labels, data];
}

const groupedReview = (weatherData, reviews) => {
    let data = generatedLabel(weatherData)[1];
    let labels = generatedLabel(weatherData)[0];

    reviews.forEach(review => {
        const date_review = moment(review.date_review).format('YYYY-MM-DD');
        let exist = false;
        let rating = parseInt(review.rating, 10);

        if (rating > 5) {
            rating /= 2;
        }

        weatherData.forEach(weather => {
            const date_weather = moment(weather.date_weather).format('YYYY-MM-DD');
            if (date_review === date_weather) {
                exist = true;
                let conditions = weather.conditions.split(',');
                if (!data[conditions[0].trim()]['notes'].includes(rating)) data[conditions[0].trim()]['notes'].push(rating)
            }
        })
    })

    return data;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},0.2)`;
}

const getGlobalData = (data, colors) => {
    let globalData = [];
    let index = 0;
    let allColors = [];

    for (const key in data) {
        let value = {
            label: `${key} global rating`,
            backgroundColor: hexToRgb(colors[index]),
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: data[key]['notes']
        }
        globalData.push(value)
        allColors.push(hexToRgb(colors[index]));
        index++;
    }
    return [globalData, allColors];
}

const groupReviewByCondition = () => {
    let reviewData = reviews.value;
    let weatherData = weather.value;
    let _colors = colors.value;
    let labels = generatedLabel(weatherData)[0];
    let data = groupedReview(weatherData, reviewData);
    let datasets = getGlobalData(data, _colors)[0];
    legendGlobalData.value = generatedLegend(getGlobalData(data, _colors)[1], labels);
    let global_data = {
        labels: [],
        datasets: []
    }

    global_data['labels'] = labels;
    global_data['datasets'] = datasets;
    return global_data;
}

watch(calculType, async () => {
    await loadWeatherFromServer(companyId, dateStart.value, dateEnd.value, calculType.value);
})

const el = ref(null);
useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadWeatherFromServer = async (tag, dateStart, dateEnd, unit) => {
    chartLoading.value = true;
    let apiBase = '/charts/weather';

    if (unit == 'Fahrenheit °F') unit = "F"
    else unit = "C"
    let apiParams = `tag=${tag}&unit=${unit}`;
    let dataType = ['rating']
    legendData.value = generatedLegend(colors.value, dataType);

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        let results = response.data['data'].reverse()
        data.value = results.map(r =>
        ({
            name: r['name'],
            rating: r['rating'],
            // temperature: r['temperature']
        }));
        weatherIcons.value = results.map(r =>
        ({
            code: r['code'],
            title: r['condition'],
            temperature: r['temperature'],
            unit: (calculType.value == 'Celcius °C') ? '°C' : '°F',
            color: r['color']
        }));
        chartLoading.value = false;
    }
}
const weatherRating = ref(null);
const formattedWeatherRating = computed(() => {
    console.log(weatherRating.value)
    if (weatherRating.value == null) return [];
    else {

        let data = weatherRating.value.conditions.map(condition => ({
            condition,
            note: weatherRating.value[condition].note,
            color: weatherRating.value[condition].color
        }));
        data.unshift({ condition: 'Global rating', note: weatherRating.value['rating'], color: 'green' })

        return data;
    }
})

const loadConditionFromServer = async (tag, dateStart, dateEnd) => {
    let apiBase = '/etablissement/conditions';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        console.log(response.data['data']);
        weatherRating.value = response.data['data']
        load.value = false;
    }
}

onBeforeMount(async () => {
    let company = null;
    appStore.isLoading = true;
    chartLoading.value = true;
    await loadWeatherFromServer(companyId, dateStart.value, dateEnd.value, 'C');
    await loadConditionFromServer(companyId, '', '');

    companiesStore.getEstablishment(companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value.name,
                icon: "uil-cloud-sun",
            })
            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;
            chartLoading.value = false;

        }
    })

    // const response = await new Promise((resolve, reject) => {
    //     services.get_Record(`/establishment/${companyId}/detail`, (response) => {
    //         resolve(response)
    //         if (response.status == 404) {
    //             exist.value = false;
    //             appStore.isLoading = false;
    //         }
    //     });
    // });

    // if (response.status == 200) {
    //     establishment.value['reviews'] = response.data['reviews'];
    //     establishment.value['weather'] = response.data['weather'];
    //     weather.value = establishment.value.weather;
    //     reviews.value = establishment.value.reviews;
    //     chartLoading.value = false;
    // }
});
</script>

<style scoped>
* {
    transition: var(--transition);
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


.legend {
    margin: 15px auto;
}

.comment {
    overflow: hidden;
    text-align: justify;
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

@media screen and (max-width: 975px) {

    .dashboard__content,
    .dashboard {
        display: none !important;
    }
}
</style>