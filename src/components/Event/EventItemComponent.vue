<template>
    <div class="staff__list">
        <div class="staff__card" v-if="events.length>0" v-for="event in events">
            <ul>
                <li><h5>{{ event.name }}</h5></li>
                <li><span class="label">Category: </span> <span>{{ event.category }}</span></li>
                <li class="period"><span class="label">Period: </span> <span>{{ moment(event.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="event.dateto != null">{{ `to ${moment(event.dateto).format('DD MMMM YYYY')}` }}</span></li>
            </ul>
            <div class="pie__chart">
                <Pie :data="data" :options="options" />
            </div>
        </div>
    </div>
    <div v-if="events.length==0">No Event</div>
</template>
<script setup>
import {ref, inject, onBeforeMount, computed} from 'vue';
import moment from 'moment';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs';
import { useCompanyStore } from "@Stores/company.js";

ChartJS.register(ArcElement, Tooltip)

// const data = {
//   labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
//   datasets: [
//     {
//       backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
//       data: [40, 20, 80, 10]
//     }
//   ]
// }
const companiesStore = useCompanyStore();
const events = inject('events');
const establishment = inject('establishment');
const data = companiesStore.eventRatingDataset(establishment.value, events.value);
console.log(data)
const options = {
  responsive: true,
  maintainAspectRatio: false
}

 
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.staff__list{
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 400px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.staff__card h5{
    color: var(--color-primary);
}

.uil-mars{
    color: blue;
}

.uil-venus{
    color: pink;
}

span{
    font-size: 14px;
    color: var(--color-bg2);
}
span.label{
    color: var(--color-bg1);
    font-size: 14px;
}

.pie__chart{
    width: 100px !important;
    height: 100px;
}


</style>