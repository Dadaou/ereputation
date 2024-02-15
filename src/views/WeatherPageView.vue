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
                              <span v-html="conditionData.icon"></span> {{ conditionData.condition }} 
                              
                            </td>
                            <td class="px-6 py-4 condition" :style="{
                                'color': conditionData.color,
                                'fontWeight': 'bold',
                            }">
                                <span> {{ conditionData.note}}</span>
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400">
                                <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                                </svg>
                                {{conditionData.days}} {{conditionData.days>1?'days':'day'}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="tablet_mobile__filter">
        <div class="date__picker px-2">
            <span class="block">Start date {{startDate}}</span>
            <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
        </div>
        <div class="date__picker px-2">
            <span class="block">End date {{endDate}}</span>
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
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import {
    ref,
    watch,
    onBeforeMount,
    computed,
    provide,
    onUpdated,
    defineAsyncComponent,
    inject
} from 'vue';
import { ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useResizeObserver } from '@vueuse/core';
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/dropdown-item/style/css'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const companiesStore = useCompanyStore();
const appStore = useAppStore();
const customerTag = inject('tag')

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

appStore.setBreadcrumbs([
    {
        title: "Establishment",
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
let load = ref(true);

let establishment = ref({});
const legendData = ref([]);
provide('legendData', legendData);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dateEnd = ref(new Date());
const datefrom = moment().subtract(30, 'days').format('YYYY-MM-DD')
const dateStart = ref(new Date(datefrom));
const colors = ref(['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']);
const chartWidth = ref(0);
provide('chartWidth', chartWidth);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth - 50) : chartWidth.value;
})
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');

const viewData = async () => {
   
   startDate = moment(start_date.value).format('YYYY-MM-DD');
   endDate = moment(end_date.value).format('YYYY-MM-DD');
  
}

watch([dateStart, dateEnd], async () => {
    load.value = true
    await loadWeatherFromServer(companyId, dateStart.value, dateEnd.value, calculType.value);
    await loadConditionFromServer(companyId, dateStart.value, dateEnd.value);
    viewData()
})

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
    let dataType = ['reviews']
    legendData.value = generatedLegend(colors.value, dataType);

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        let results = response.data['data'].reverse()
        data.value = results.map(r =>
        ({
            name: r['name'],
            reviews: r['rating'],
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
const nbDays = computed(()=>{
    console.log(getNbDays(dateEnd.value, dateStart.value))
    return getNbDays(dateEnd.value, dateStart.value)
})
const getIcon = (weatherConditions)=>{
    switch (weatherConditions) {
            case 'Rain, Overcast':
                return '&#x1F327;';
                break;
            case 'Rain, Partially cloudy':
                return '&#x1F326;';
                break;
            case 'Partially cloudy':
                return '&#x1F325;';
                break;
            case 'Clear':
                return '&#x263C;';
                break;
            case 'Rain':
                return '&#x2602;';
                break;
            case 'Rain Overcast':
                return '&#x1F327;';
                break;
            case 'Overcast':
                return'&#x2601;';
                break;
            case 'Rain Partially cloudy':
                return '&#x1F326;';
                break;
            case 'Snow Rain Overcast':
                return '&#x1F327;';
                break;
            default:
                return '&#x1F324;';
                break;
    }
}

const formattedWeatherRating = computed(() => {
    const unit = nbDays.value>1?'days':'day'
    const order = ['Clear', 'Partially cloudy', 'Overcast', 'Rain, Partially cloudy', 'Rain Partially cloudy', 'Rain, Overcast', 'Rain Overcast', 'Rain', 'Snow Rain Overcast']
    let conditions = []
    if (weatherRating.value) return [];
    else {
        let data = []
        if(weatherRating.value.conditions){
            console.log(weatherRating.value)
            data = weatherRating.value.conditions.map(condition => ({
                condition,
                icon: getIcon(condition),
                note: weatherRating.value[condition].note,
                color: weatherRating.value[condition].color,
                days: weatherRating.value[condition].days
            }));
        }

        order.forEach(condition =>{
            for (var i = 0; i < data.length; i++) {
                if(condition == data[i].condition) conditions.push(data[i])
            }
        })

        conditions.unshift({ 
            condition: 'Average rating', 
            note: weatherRating.value['rating'], 
            color: 'green',
            days: weatherRating.value['global_days']
        })

        return conditions;
    }
})

const getNbDays = (date1, date2)=>{
    date1 = new Date(date1);
    date2 = new Date(date2);
    const differenceInTime = date1.getTime() - date2.getTime();

    return Math.round(differenceInTime / (1000 * 3600 * 24));
}

const loadConditionFromServer = async (tag, dateStart, dateEnd) => {
    let apiBase = '/etablissement/conditions';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        weatherRating.value = response.data['data']
        console.log(weatherRating.value)
        load.value = false;
    }
}

onBeforeMount(async () => {
    appStore.isLoading = true;
    chartLoading.value = true;
    await loadWeatherFromServer(companyId, dateStart.value, dateEnd.value, 'C');
    await loadConditionFromServer(companyId, dateStart.value, dateEnd.value);

    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

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

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Weather",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;
            chartLoading.value = false;

        }
    })
});
</script>

<style scoped>
.condition{
    display: flex;
    justify-content: space-between;
}
</style>