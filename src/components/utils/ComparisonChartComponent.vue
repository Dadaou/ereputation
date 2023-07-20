<template>
<div class="establishments__comparison">
    <ul class="filter__menu">
      <li @click="viewFullscreen()"> <i class="uil uil-expand-arrows-alt"></i> View fullscreen</li>
    </ul>
    <GroupedBarChart :plot-data="props.data" x-key="name"
    :width="width" :height="height" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="props.labels.x" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
    </GroupedBarChart>
    <ModalComponent :showModal="showModal" @close="showModal=false">
        <template #content>
            <div class="modal__header">
                 <h4>Comparison</h4>
                 <i class="uil uil-times-circle"  @click="showModal = false"></i>
            </div>
            <div class="modal__filter">
                <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                        selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]"/>
                <div class="date__filter">
                 <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2"/>
                </div>
            </div>
            <div class="modal__container">
                <GroupedBarChart :plot-data="plotData" x-key="name"
                        :width="width + 600" :height="height + 100" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="props.labels.x" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
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
import {ref, watch, onBeforeMount} from 'vue';
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
    companies: Array
});

const showModal = ref(false);
const companiesStore = useCompanyStore();
let selectedTimePeriod = ref('');
let timePeriods = ref(['Months', 'Quarters', 'Semesters']);

const viewFullscreen = () => {
    showModal.value = !showModal.value;
}
const date2 = ref({
  day: new Date().getDay(),  
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

const format2 = (date) => {
  const startDate = new Date(date[0]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = new Date(date[1]).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startDate} - ${endDate}`;
}

const plotData = ref(props.data);

watch(date2, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
        viewData(selectedTimePeriod.value, startDate, endDate);
    }else{
        viewData(selectedTimePeriod.value, startDate, endDate);
    }  
});

watch(selectedTimePeriod, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate);
});

const viewData = (timePeriod, startDate, endDate) => {
    plotData.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, props.companies);
}
</script>

<style scoped>
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

.modal__header i{
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition)
}

.modal__header i:hover{
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