<template>
    <div class="head">
        <div class="app__title">
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
                            <span> {{ conditionData.note }}</span>
                            <span
                                class="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400">
                                <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                                </svg>
                                {{ conditionData.days }} {{ conditionData.days > 1 ? 'days' : 'day' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
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

appStore.setIsExist(true);

const WeatherChartComponent = defineAsyncComponent(() =>
    import('@Components/utils/WeatherChartComponent.vue')
)

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
);

const route = useRoute();
const companyId = route.params.id;

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

const start_date = inject('start_date');
const end_date = inject('end_date');
const colors = ref(['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']);
const chartWidth = ref(0);
provide('chartWidth', chartWidth);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth - 50) : chartWidth.value;
})

watch([start_date, end_date], async () => {
    load.value = true
    await loadWeatherFromServer(companyId, start_date.value, end_date.value, calculType.value);
    await loadConditionFromServer(companyId, start_date.value, end_date.value);
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
    await loadWeatherFromServer(companyId, start_date.value, end_date.value, calculType.value);
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

const getIcon = (weatherConditions) => {
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
            return '&#x2601;';
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
    const order = ['Clear', 'Partially cloudy', 'Overcast', 'Rain, Partially cloudy', 'Rain Partially cloudy', 'Rain, Overcast', 'Rain Overcast', 'Rain', 'Snow Rain Overcast']
    let conditions = []
    if (!weatherRating.value) return [];
    else {
        let data = []
        if (weatherRating.value.conditions) {
            data = weatherRating.value.conditions.map(condition => ({
                condition,
                icon: getIcon(condition),
                note: weatherRating.value[condition].note,
                color: weatherRating.value[condition].color,
                days: weatherRating.value[condition].days
            }));
        }

        order.forEach(condition => {
            for (var i = 0; i < data.length; i++) {
                if (condition == data[i].condition) conditions.push(data[i])
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
        load.value = false;
    }
}

onBeforeMount(async () => {
    chartLoading.value = true;

    await loadWeatherFromServer(companyId, start_date.value, end_date.value, 'C');
    await loadConditionFromServer(companyId, start_date.value, end_date.value);
});
</script>

<style scoped>
.condition {
    display: flex;
    justify-content: space-between;
}
</style>