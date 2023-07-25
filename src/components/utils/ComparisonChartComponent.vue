<template>
<div class="establishments__comparison">
    <ul class="filter__menu">
      <li @click="viewFullscreen()" > <i class="uil uil-expand-arrows-alt"></i></li>
    </ul>
    <GroupedBarChart :plot-data="props.data" x-key="name"
    :width="width" :height="height" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="selectedTimePeriod" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
    </GroupedBarChart>
    <ModalComponent :showModal="showModal" @close="showModal=false">
        <template #content>
            <div class="modal__close">
                 <i class="uil uil-times-circle mb-8"  @click="showModal = false"></i>
            </div>
            <div class="modal__header">
                 <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Comparison</h3>
            </div>
            <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full">
                    <div class="flex items-center pl-3">
                        <input type="radio" :value="false" v-model="comparisonByEstablishments" name="list-radio" class="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300">
                        <label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sources</label>
                    </div>
                </li>
                <li class="w-full">
                    <div class="flex items-center pl-3">
                        <input type="radio" name="list-radio" :value="true" v-model="comparisonByEstablishments" class="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300">
                        <label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Establishments</label>
                    </div>
                </li>
                <li class="w-full mr-3">
                    <DropdownComponent :showTitle="false" placeholder="Select an establishments" :data="data2" @submit="(company)=>{
                        selectedCompany = company
                    }" :defaultObj="data2[0]" :isDataObject="true"/>
                </li>
                <li class="w-full mr-3">
                    <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                            selectedTimePeriod = timePeriod
                    }" :default="timePeriods[0]"/>
                </li>
                <li class="w-full mr-3">
                    <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2"/>
                </li>
                <!-- <li class="w-full mr-3">
                    <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2"/>
                </li> -->
            </ul>
            <!-- <div class="modal__filter">
                
            </div> -->
            <div class="modal__container">
                <GroupedBarChart :plot-data="plotData" x-key="name"
                        :width="width + 400" :height="height + 100" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="props.labels.x" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
                </GroupedBarChart>
            </div>
        </template>
    </ModalComponent>
</div>
</template>
<script setup>
import ModalComponent from '@Components/utils/ModalComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import moment from 'moment';
import {ref, watch, onUpdated, computed} from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useCompanyStore } from "@Stores/company.js";

const props = defineProps({
    data:{
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
        default: ['#6c63ff', '#f75842', '#aca8fd', '#424890'] 
    },
    labels: {
        type: Object,
        default: {x: "Months", y: "Reviews"}
    },
    establishment: Object,
    companies: Array,
    competitors: Array
});

const showModal = ref(false);
const comparisonByEstablishments = ref(false);
const companiesStore = useCompanyStore();
let selectedTimePeriod = ref('');
let timePeriods = ref(['Months', 'Quarters', 'Semesters']);
let data2 = computed(() => comparisonByEstablishments.value?props.competitors:props.companies);
let selectedCompany = ref(data2[0]);
let startDate = moment().startOf('year').format('YYYY-M-DD');
let endDate = moment().endOf('year').format('YYYY-M-DD');

const viewFullscreen = () => {
    showModal.value = !showModal.value;
}
const date2 = ref({
  day: new Date().getDay(),  
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

const format2 = (date) => {
  const startDate2 = new Date(date[0]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate2 = new Date(date[1]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startDate2} - ${endDate2}`;
}

const plotData = ref([]);

watch(date2, ()=>{
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
        viewData(selectedTimePeriod.value, startDate, endDate);
    }else{
        viewData(selectedTimePeriod.value, startDate, endDate);
    }  
});

watch(selectedTimePeriod, () => {
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate);
});

watch(comparisonByEstablishments, () => {
    console.log(selectedCompany.value);
   if(comparisonByEstablishments.value == true){
    viewData(selectedTimePeriod.value, startDate, endDate);
   }else{
        if(data2.value.length > 0){
                if(Object.keys(data2.value[0]).length > 1){
                    plotData.value = companiesStore.calculateReviewsBySources(data2.value[0], selectedTimePeriod.value, startDate, endDate);
                    selectedCompany.value = data2.value[0];
                }
        }
   }
});

watch(selectedCompany, () => {
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    if(comparisonByEstablishments.value == true){
        viewData(selectedTimePeriod.value, startDate, endDate);
    }else{
        plotData.value = companiesStore.calculateReviewsBySources(selectedCompany.value, selectedTimePeriod.value, startDate, endDate);
    }
})

const viewData = (timePeriod, startDate, endDate) => {
    plotData.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, props.companies);
}

onUpdated(() => {
    if(comparisonByEstablishments.value == true){
        plotData.value = props.data;
    }
    else{
        if(data2.value.length > 0){
            if(Object.keys(data2.value[0]).length > 1){
                console.log(companiesStore.calculateReviewsBySources(data2.value[0], selectedTimePeriod.value, startDate, endDate))
                plotData.value = companiesStore.calculateReviewsBySources(data2.value[0], selectedTimePeriod.value, startDate, endDate);
                selectedCompany.value = data2.value[0];
            }
        }
    } 
})

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.filter__menu{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: small;
    margin: auto;
}

.filter__menu li{
    padding: 4px 8px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--light-color-bg2);
    border-radius: 5px;
    color: white;
    font-size: 13px;
}

.filter__menu li:hover{
    background-color: var(--color-primary);
}
.modal__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal__close i{
   position: relative;
   top: -20px; 
   right: -5px;
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.modal__close i:hover{
    transform: rotate(360deg);
}

.modal__filter{
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
}

.date__filter{
    width: 21%;
}

.modal__container{
    margin: 30px auto;
}
</style>