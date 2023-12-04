<template>
    <ul class="filter__menu">
        <li @click="viewFullscreen()"> <i class="uil uil-expand-arrows-alt"></i> Expand</li>
    </ul>
    <div class="establishments__comparison" ref="el" :style="{
        'width': `${getWidth()}`,
        'overflowX': 'auto'
    }">
        <GroupedBarChart class="chart" :plot-data="props.data" x-key="name" :width="custom_width"
            :height="chartheight - 100" :margin="margin"
            :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
            :x-axis-label="_timePeriod" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
        </GroupedBarChart>
    </div>
    <ModalComponent :showModal="showModal" @close="showModal = false">
        <template #content>
            <div class="modal__close">
                <i class="uil uil-times-circle mb-8" @click="showModal = false"></i>
            </div>
            <div class="modal__header">
                <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Comparison</h3>
            </div>
            <ul
                class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full">
                    <div class="flex items-center pl-3">
                        <input type="radio" :value="false" v-model="comparisonByEstablishments" name="list-radio"
                            class="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300">
                        <label for="horizontal-list-radio-id"
                            class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sources</label>
                    </div>
                </li>
                <li class="w-full">
                    <div class="flex items-center pl-3">
                        <input type="radio" name="list-radio" :value="true" v-model="comparisonByEstablishments"
                            class="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300">
                        <label for="horizontal-list-radio-license"
                            class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Establishments</label>
                    </div>
                </li>
                <li class="w-full mr-3">
                    <DropdownComponent :showTitle="false" placeholder="Select an establishments"
                        :data="establishmentDropdown" @submit="(company) => {
                            selectedCompany = company
                        }" :defaultObj="establishmentDropdown[0]" :isDataObject="true" />
                </li>
                <li class="w-full mr-3">
                    <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                        selectedTimePeriod = timePeriod
                    }" :default="timePeriods[2]" />
                </li>
            </ul>
            <div class="range__date">
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
            </div>
            <div class="modal__container" ref="el2" :style="{
                'width': `${get_Width()}`,
                'overflowX': 'auto'
            }">
                <GroupedBarChart class="chart" :plot-data="plotData" x-key="name" :width="custom_width2"
                    :height="chart_Height" :margin="margin"
                    :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
                    :x-axis-label="selectedTimePeriod" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
                </GroupedBarChart>
            </div>
            <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
            </BaseLegend>
        </template>
    </ModalComponent>
</template>
<script setup>
import ModalComponent from '@Components/utils/ModalComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import moment from 'moment';
import { ref, watch, computed, onUpdated } from 'vue';
import { useCompanyStore } from "@Stores/company.js";
import { useResizeObserver } from '@vueuse/core';
import { useWindowSize } from '@vueuse/core';
import { ElDatePicker } from 'element-plus';
import { useChartsStore } from "@Stores/charts.js"

const props = defineProps({
    data: {
        type: Array,
        default: [],
        required: true
    },
    width: {
        type: Number,
        default: 300
    },
    chartheight: {
        type: Number,
        default: 300
    },
    margin: {
        type: Object,
        default: { top: 20, bottom: 35, left: 55, right: 20 }
    },
    colors: {
        type: Array,
        default: ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']
    },
    labels: {
        type: Object,
        default: { x: "Months", y: "Rating" }
    },
    establishment: Object,
    companies: Array, // (customer's establishment + its competitors)
    competitors: Array,
    timePeriod: String
});

const showModal = ref(false);
const comparisonByEstablishments = ref(true);
const companiesStore = useCompanyStore();
const chartsStore = useChartsStore();
let selectedTimePeriod = ref('');
let timePeriods = ref(['Days', 'Weeks', 'Months', 'Quarters', 'Semesters']);
let establishmentDropdown = computed(() => comparisonByEstablishments.value ? props.competitors : props.establishment.websites.map(w => ({ name: w })));
let selectedCompany = ref(establishmentDropdown.value[0]);

// console.log(establishmentDropdown.value);

let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');
let start_date = ref();
let end_date = ref();
let legendData = ref([]);
let _timePeriod = computed(() => props.timePeriod);
const chart2Loading = ref(false)
const { width, height } = useWindowSize();
const custom_width = computed(() => {
    let nb = props.data.length;
    let width = 1000;
    if (nb > 9) {
        width = (width * nb) / 9;
    }

    return width;
})

let colors2 = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff'];

const viewData = async () => {
    // date2, comparisonByEstablishments, selectedCompany, selectedTimePeriod

    let sDate = moment().subtract(6, 'months').format('YYYY-M-DD');
    let eDate = moment().format('YYYY-M-DD');

    // if (start_date.value)
    //     sDate = moment(start_date.value).format('YYYY-M-DD');
    // if (end_date.value) eDate = moment(end_date.value).format('YYYY-M-DD');

    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        sDate = moment(start_date.value).format('YYYY-M-DD');
        eDate = moment(end_date.value).format('YYYY-M-DD');
    }
    chart2Loading.value = true

    if (comparisonByEstablishments.value) {
        if (selectedCompany.value.name != 'Global') {
            const tags = [props.establishment.tag, selectedCompany.value.tag]
            plotData.value = await chartsStore.loadData(tags, selectedTimePeriod.value, sDate, eDate, 'global')
            legendData.value = companiesStore.generateLegend(plotData.value, colors2);
        } else {
            const tags = [props.establishment.tag, ...props.establishment.competitors.map(c => c.tag)]
            plotData.value = await chartsStore.loadData(tags, selectedTimePeriod.value, sDate, eDate, 'global')
            legendData.value = companiesStore.generateLegend(plotData.value, colors2);
        }
    } else {
        const tags = [props.establishment.tag, ...props.establishment.competitors.map(c => c.tag)]
        plotData.value = await chartsStore.loadData(tags, selectedTimePeriod.value, sDate, eDate, selectedCompany.value.name)
        legendData.value = companiesStore.generateLegend(plotData.value, colors2);
    }


    chart2Loading.value = false;
}

const custom_width2 = computed(() => {

    let nb = plotData.value.length;
    let width = 1500;
    if (nb > 9) {
        width = (width * nb) / 9;
    }

    return width;
})

const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 35;
});

const chart_Height = computed(() => {
    if (width.value <= 900) {
        return 200;
    }
    else return props.chartheight;
})

const viewFullscreen = () => {
    showModal.value = !showModal.value;
}
const date2 = ref(null);

const format2 = (date) => {
    const startDate2 = new Date(date[0]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const endDate2 = new Date(date[1]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startDate2} - ${endDate2}`;
}

const plotData = ref([]);

const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
watch([start_date, end_date], () => {
    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        date2.value = [start_date.value, end_date.value]
    } else {
        date2.value = [];
    }
})

const viewDataByEstablishment = (establishments, timePeriod, startDate, endDate, colors) => {
    plotData.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, establishments);
    legendData.value = companiesStore.generateLegend(establishments, colors);
}

const viewDataBySource = (websites, establishment, timePeriod, startDate, endDate, colors) => {
    websites = companiesStore.getWebsites(websites);
    plotData.value = companiesStore.calculateReviewsBySources(establishment, websites, timePeriod, startDate, endDate);
    legendData.value = companiesStore.generateLegendV2(websites, colors);
}

watch([start_date, end_date, comparisonByEstablishments, selectedCompany, selectedTimePeriod], () => {
    // startDate = moment().startOf('year').format('YYYY-M-DD');
    // endDate = moment().endOf('year').format('YYYY-M-DD');
    console.log(selectedCompany.value)
    viewData();
})

const el = ref(null);
const el2 = ref(null);
const chartWidth = ref(0);
const chartModalWidth = ref(0);
const barWidth = computed(() => {
    let result = 0;
    if (width.value >= 800) result = Math.abs(Number(chartWidth.value - 50));
    else result = 800;
    return result;
})

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
    chartModalWidth.value = (el2.value != null && el2.value != undefined) ? Math.abs(el2.value.offsetWidth) : chartModalWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
})

useResizeObserver(el2, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartModalWidth.value = Math.abs(width);
});

const getWidth = () => {
    const defaultWidth = 900;
    if (width.value >= 1500) {
        return `${defaultWidth}px`;
    }
    const percentage = 0.8;

    return `${Math.min(width.value * percentage, 850)}px`;
};

const get_Width = () => {
    // const defaultWidth = 1400;
    // if (width.value >= 1500) {
    //     return `${defaultWidth}px`;
    // }
    // const percentage = 1;

    // return `${Math.min(width.value * percentage, 850)}px`;
    return '100%'
};


</script>

<style scoped>
.range__date {
    width: 100%;
    display: flex;
    gap: 0.5rem;
    margin: 5px 0;
}

.filter__menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: small;
    margin: auto;
}

.filter__menu li {
    padding: 4px 8px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--light-color-bg2);
    border-radius: 5px;
    color: white;
    font-size: 13px;
}

.filter__menu li:hover {
    background-color: var(--color-primary);
}

.modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal__close i {
    position: relative;
    top: -20px;
    right: -5px;
    float: right;
    font-size: 25px;
    color: red;
    cursor: pointer;
    transition: var(--transition);
}

.modal__close i:hover {
    transform: rotate(360deg);
}

.modal__filter {
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
}

.date__filter {
    width: 21%;
}

.establishments__comparison::-webkit-scrollbar {
    width: 6px;
    height: 4px !important;
    background-color: #F5F5F5;
}

@media screen and (max-width:900px) {
    .range__date {
        flex-direction: column;
    }
}
</style>