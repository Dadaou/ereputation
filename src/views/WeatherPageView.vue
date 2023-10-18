<template>
    <div class="main__container" v-if="exist">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
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
                <div class="reviews__content" ref="el">
                    <GroupedBarChart :plot-data="data" x-key="date" :width="chartWidth" :height="300"
                        :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
                        :x-tick-format="d => `${d}`" />
                    <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
                    </BaseLegend>
                </div>

                <div class="head">
                    <div class="app__title">
                        <h2>Weather's global impact</h2>
                    </div>
                </div>
                <BaseLegend class="legend" :LegendData="legendGlobalData" :alignment="'horizontal'">
                </BaseLegend>
                <div class="review__content">
                    <PolarArea :data="globalData" :options="options" />
                </div>
            </div>
            <div class="tablet_mobile__filter">
                  <el-date-picker
                        v-model="dateStart"
                        placeholder="Start date"
                        :size="'large'"
                      />
                      <el-date-picker
                        class="mt-2"
                        v-model="dateEnd"
                        placeholder="End date"
                        :size="'large'"
                      />
            </div>
            <div class="tablet_mobile__head">
                <div class="establishment__info_tablet">
                        <label v-if="!dataLoading">{{ establishment.name }}</label>
                        <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                        <div>
                            <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
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
                                <span v-if="!dataLoading" class="society__location">{{ all_items[0].value  }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                         <div class="society__location">
                            <i class="uil uil-comment-alt"></i>
                                <span v-if="!dataLoading">{{ all_items[1].value  }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                         <div class="society__location">
                            <i class="uil uil-building"></i>
                            <span v-if="!dataLoading">{{ all_items[2].value  }} competitors</span>
                             <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                    </div>
                <div class="photo" v-if="!dataLoading">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
                <div class="photo" v-else>
                    <div role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
            </div>
            <div class="right__side">
                <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#" v-if="!dataLoading">
                        <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                        <div v-else role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <a href="#" v-else>
                        <div role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                            <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                            <div class="society__location">
                                <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                            </div>
                            <div class="society__location">
                                    <i class="uil uil-location-point"></i>
                                    <span v-if="!dataLoading" class="society__location">{{ establishment.address1 }}, {{ establishment.city }}</span>
                                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                            </div> 
                    </div>
                    <div class="date__filter">
                        <div class="text-sm title">Select a range of date</div>
                       <el-date-picker
                        v-model="dateStart"
                        placeholder="Start date"
                        :size="'large'"
                      />
                      <el-date-picker
                        class="mt-2"
                        v-model="dateEnd"
                        placeholder="End date"
                        :size="'large'"
                      />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else/>
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
import { ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem  } from 'element-plus';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { PolarArea } from 'vue-chartjs';
import { useResizeObserver, useWindowSize } from '@vueuse/core';
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/dropdown-item/style/css'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip)


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
const page = ref({
    title1: "",
    title2: "Weather",
    icon: "uil-cloud-sun",
});

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Back",
        path: `/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Weather",
        path: `${route.path}`,
        isCurrent: true
    }
]

let data = ref([]);
let calculType = ref('Celcius °C');
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const dataLoading = ref(true);
const { width, height } = useWindowSize(); 

let establishment = ref({});
let weather = ref([]);
let reviews = ref([]);
const legendData = ref([])
const legendGlobalData = ref([]);

let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dateEnd = ref(new Date());
const dateto = moment(dateEnd.value).format('YYYY-MM-DD');
const datefrom = moment().subtract(7, 'days').format('YYYY-MM-DD')
const dateStart = ref(new Date(datefrom));
const enableDateEnd = ref(false);
const colors = ref(['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']);
const chartWidth = ref(0);

onUpdated(()=>{
    chartWidth.value = (el.value != null && el.value != undefined)?Math.abs(el.value.offsetWidth-50):chartWidth.value;
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

watch([dateStart, dateEnd], () => {
    console.log(dateStart.value, dateEnd.value)
    if (dateEnd.value !== null && dateStart.value !== null) {
        data.value = weaherImpact(moment(dateStart.value).format('YYYY-MM-DD'), moment(dateEnd.value).format('YYYY-MM-DD'));
    }
})

function comparerDates(a, b) {
    // Extrait les parties de date (jour, mois, année) des chaînes
    var dateA = a.date.split(' ')[1];
    var dateB = b.date.split(' ')[1];

    // Convertit les dates en objets Date pour la comparaison
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
             console.log(date.format('YYYY-MM-DD'))
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
        console.log(key)
        let icon = generateWeatherIcon(key)
        let item = {
            "date": `${icon} ${moment(key).format('DD-MM-YYYY')}`,
            "rating": impactByDay[key]['note'],
            "temperature": impactByDay[key]['temp'],
        }

        data.push(item);
    }

    let dataType = ['rating', 'temperature']
    legendData.value = generatedLegend(colors.value, dataType);
    data.sort(comparerDates);
    return data;
}

const generateWeatherIcon = (day) => {
    const weatherClassification = {
        'Rain, Overcast': "🌧",
        'Rain, Partially cloudy': "🌧",
        'Partially cloudy': "⛅",
        'Clear': "🌞",
        'Rain': "☔"
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
        // conditions.forEach(condition => {
        //     if (!labels.includes(condition.trim())) labels.push(condition.trim());
        // })
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

watch(calculType, () => {
    data.value = weaherImpact(datefrom, dateto);
})

const el = ref(null);
useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});

onBeforeMount(async () => {
    const companyId = route.params.id;
    let company = null;
    appStore.isLoading = true;

    const response2 = await new Promise((resolve, reject) => {
        services.get_Record(`establishment/${companyId}/rating`, (response) => {
                resolve(response)
                 if(response.status == 404) {
                    exist.value = false;
                    appStore.isLoading = false;
                }
        });
    });

    if(response2.status == 200){
        establishment.value = response2.data;
        page.value.title2 = establishment.value.name;
        all_items.value[0].value = establishment.value.rating;
        all_items.value[1].value = establishment.value.totalReviews;
        appStore.isLoading = false;
        dataLoading.value = false;
    }
     const response = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/${companyId}/detail`, (response) => {
                resolve(response)
                 if(response.status == 404) {
                    exist.value = false;
                    appStore.isLoading = false;
                }
        });
    });

      if(response.status == 200){
            establishment.value['reviews'] = response.data['reviews'];
            establishment.value['weather'] = response.data['weather'];
            weather.value = establishment.value.weather;
            reviews.value = establishment.value.reviews;
            data.value = weaherImpact(datefrom, dateto);
            globalData.value = groupReviewByCondition();
     }
});
</script>

<style scoped>
*{
    transition: var(--transition);
}

img{
    height: 200px !important;
}

.include{
      cursor: pointer;
}

.include a{
    color: var(--color-primary);
}

.not__include a{
    color: var(--light-color-bg2);
}

.include .star__barre{
    background: var(--color-warning);
}

.not__include .star__barre{
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span{
    color: rgb(165, 165, 165);
}

.temp__p{
    font-size: 14px;
    color: var(--color-bg1);
    font-weight: 500;
}

.temp__p a:hover{
    background-color: var(--color-danger);
    color: white;
}

.temp__p a{
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
}

.app__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap:1rem;
}

.reviews__content p{
   font-size: 14px;
   font-weight: 500;
   color: var(--color-bg1);
}

.reviews__content a{
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}
.reviews__content a:hover{
   background-color: var(--color-danger);
   color: white;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}

.rating__customers{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
}

.establishment{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}

.establishment__info i, .establishment__info_tablet i{
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label, .establishment__info_tablet label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div{
    font-size: 13px;
    font-weight: 500;
}

.establishment__info_tablet div{
    display: flex;
}

.date__filter .title{
    font-weight:600;
}

.filter__content .title{
    font-weight: 500;
}

.filter__content{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.rating__customers .title{
   font-size: 15px;
   font-weight:600;
   margin-left: 15px;
   margin-top:15px;
}

.reviews__content1 .review span{
   font-size: 12px;
   margin: auto;
}

.community__feedback .title{
    font-size: 15px;
    font-weight: 600;
}

.community__feedback h2{
    font-size: 14px;
    font-weight: 500;
}

.legend{
 margin: 15px auto;
}

.comment{
    overflow: hidden;
    text-align: justify;
}

.app__title{
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1{
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2{
    font-size: 18px;
    transition: var(--transition);
}

.left__side{
    width: 1100px;
    padding: 50px 5px;
}

.left__side .head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

#website__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#dropdownDivider{
    position: absolute;
}

#dropdownDivider li{
    cursor: pointer;
    padding: 5px 10px;
    margin: auto;
    transform: var(--transition);
}

#dropdownDivider li:hover{
   background-color: var(--color-danger);
   color: var(--color-white);
}

.dashboard__content{
    display: flex;
    flex-wrap: wrap;
    gap:1rem;
    margin: 50px auto;
}

.counter{
    flex-grow: 1;
}

.reviews__content{
    margin-top: 20px;
}

.rating{
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
}

.right__side{
    width: 500px;
    padding: 50px 0px;
}

.rating__statistics{
    display:none;
    margin-bottom:15px;
    transition: var(--transition);
}

.filter__container{
    display: none;
    transition: var(--transition);
}

.see__more{
    cursor: pointer;
}

.society__name{
    margin: 5px 0;
    display: flex;
}

.tablet_mobile__head, .tablet_mobile__filter{
    display: none;
}

.society__location{
    display: flex;
}
.society__location span{
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

@media screen and (max-width:1400px) {
  .app__container{
    width: var(--container-width-md);
  }

  .breadcrumb__container{
        width: var(--container-width-md);
    }
}

@media screen and (max-width:1287px) {
  .counter{
    gap: 2rem !important;
  }
  .left__side{
    width: 1000px !important;
  }
  
  .right__side{
    width: 300px !important;
  }
}


@media screen and (max-width:1024px) {
   
    .right__side{
     width: 250px !important;
    } 
}

@media screen and (max-width: 975px) {
   .app__container{
    flex-direction: column-reverse;
    width: 95% !important;
    justify-content: center;
    align-items: center;
   }
   .left__side{
    width: inherit !important;
   }

   .photo{
    flex-basis: 250px;
   }

   .photo div{
    height: 100%;
   }

   .photo img{
    height: 150px;
    width: 100%;
   }
   .dashboard__content, .dashboard, .right__side{
    display: none !important;
   }

   .tablet_mobile__head{
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

    .tablet_mobile__head label{
        font-size: 17px !important;
    }

    .tablet_mobile__head span{
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter{
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter *{
        flex-basis: 200px;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head{
        font-size: 13px !important;
    }

    .tablet_mobile__head label{
        font-size: 15px !important;
    }

    .tablet_mobile__filter{
       gap: 0.25rem;
    }
}

@media screen and (max-width:800px) {
    .photo{
       flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head{
        font-size: 12px !important;
        padding: 10px;
    }

    .photo{
       flex-basis: 210px !important;
    }

    .tablet_mobile__head label{
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter{
       flex-direction: column;
       padding: 5px 0px !important;
    }

    .tablet_mobile__filter *{
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head{
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo{
       flex-basis: 150px !important;
       height: 100px !important;
    }
}
</style>