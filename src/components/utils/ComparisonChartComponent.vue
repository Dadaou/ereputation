<template>
    <div class="establishments__comparison" ref="el">
        <ul class="filter__menu">
            <li @click="viewFullscreen()"> <i class="uil uil-expand-arrows-alt"></i> Expand</li>
        </ul>
        <div class="chart__container" :width="chartWidth - 25">
            <GroupedBarChart class="chart" :plot-data="props.data" x-key="name" width="800" :height="height - 100"
                :margin="margin"
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
                    <li class="w-full mr-3">
                        <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2" />
                    </li>
                </ul>
                <div class="modal__container" ref="el2">
                    <div class="chart__container" :width="chartModalWidth">
                        <GroupedBarChart :plot-data="plotData" x-key="name" width="1200" :height="height" :margin="margin"
                            :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
                            :x-axis-label="selectedTimePeriod" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
                        </GroupedBarChart>
                    </div>
                    <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
                    </BaseLegend>
                </div>
            </template>
        </ModalComponent>
    </div>
</template>
<script setup>
import ModalComponent from '@Components/utils/ModalComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import moment from 'moment';
import { ref, watch, computed, onUpdated } from 'vue';
import { useCompanyStore } from "@Stores/company.js";
import { useResizeObserver } from '@vueuse/core';

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
    height: {
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
let selectedTimePeriod = ref('');
let timePeriods = ref(['Weeks', 'Months', 'Quarters', 'Semesters']);
let establishmentDropdown = computed(() => comparisonByEstablishments.value ? props.competitors : props.companies);
let selectedCompany = ref(establishmentDropdown.value[0]);
let startDate = moment().startOf('year').format('YYYY-M-DD');
let endDate = moment().endOf('year').format('YYYY-M-DD');
let legendData = ref([]);
let _timePeriod = computed(() => props.timePeriod)

console.log(props.data)

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

const viewDataByEstablishment = (establishments, timePeriod, startDate, endDate, colors) => {
    plotData.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, establishments);
    legendData.value = companiesStore.generateLegend(establishments, colors);
}

const viewDataBySource = (websites, establishment, timePeriod, startDate, endDate, colors) => {
    websites = companiesStore.getWebsites(websites);
    plotData.value = companiesStore.calculateReviewsBySources(establishment, websites, timePeriod, startDate, endDate);
    legendData.value = companiesStore.generateLegendV2(websites, colors);
}

watch([date2, comparisonByEstablishments, selectedCompany, selectedTimePeriod], () => {
    startDate = moment().startOf('year').format('YYYY-M-DD');
    endDate = moment().endOf('year').format('YYYY-M-DD');

    if (date2.value !== null) {
        if (date2.value.length > 0) {
            startDate = moment(date2.value[0]).format('YYYY-M-DD');
            endDate = moment(date2.value[1]).format('YYYY-M-DD');
        }
    }

    if (comparisonByEstablishments.value == true) {
        let data = props.companies;
        if (selectedCompany.value.name !== 'Global') {
            data = data.filter(item => item.id == selectedCompany.value.id || item.id == props.establishment.id);
            console.log(data)
        }

        setTimeout(() => {
            viewDataByEstablishment(data, selectedTimePeriod.value, startDate, endDate, props.colors);
        }, 100);
    } else {
        let websites = establishmentDropdown.value[0].websites; // get all websites of the current establishment
        setTimeout(() => {
            viewDataBySource(websites, selectedCompany.value, selectedTimePeriod.value, startDate, endDate, props.colors);
        }, 100);
    }
})

const el = ref(null);
const el2 = ref(null);
const chartWidth = ref(0);
const chartModalWidth = ref(0);

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
})

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

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

.modal__container {
    margin: 30px auto;
}

.chart__container {
    padding-inline: 16px;
    overflow: auto;
}
</style>

