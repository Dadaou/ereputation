<template>
    <div class="staff__list">
        <div class="staff__card" v-if="events.length>0" v-for="event in events">
            <ul class="mb-5">
                <li><h5 :style="{
                    color: `${generateColor(event.name)}`,
                    fontWeight: 600,
                }">{{ event.name }}</h5></li>
                <li class="event_category" v-if="event.category"><span class="label">Category: </span> <span>{{ event.category }}</span></li>
                <li class="event_category" v-if="event.segment"><span class="label">Segment: </span> <span>{{ event.segment }}</span></li>
                <li class="period"><i class="uil uil-calender"></i> <span>{{ moment(event.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="event.dateto != null">{{ `to ${moment(event.dateto).format('DD MMMM YYYY')}` }}</span></li>
            </ul>
             <div class="pie__chart">
                            <div>
                                <h3 class="mb-2">-90 days to event (<span class="rating">{{eventNote(event.data,'beforeRating')}}</span>)</h3>
                                <Pie 
                                    :data="eventRatingDataset(event.data, 'beforeData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">During event (<span class="rating">{{eventNote(event.data,'duringRating')}}</span>)</h3>
                                <Pie 
                                    :data="eventRatingDataset(event.data, 'duringData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">Event +90 days  (<span class="rating">{{eventNote(event.data,'afterRating')}}</span>)</h3>
                                <Pie 
                                    :data="eventRatingDataset(event.data, 'afterData')" 
                                    :options="options" 
                                />
                            </div>
                        </div>
            <!-- <div class="list__actions">
                    <button 
                        class="btn chart" 
                        @click="showEventChart(event)">
                        <i class="uil uil-chart-pie-alt"></i> View Chart
                    </button>
            </div> -->
        </div>
    </div>
    <div v-if="events.length==0">No Event</div>
</template>
<script setup>
import {ref, inject, onBeforeMount, computed, defineAsyncComponent} from 'vue';
import moment from 'moment';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs';
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import services from '@Services/services.js';

ChartJS.register(ArcElement, Tooltip)

const companiesStore = useCompanyStore();
const props = defineProps(['events'])
const route = useRoute();
// const events = inject('events');

const establishment = inject('establishment');
const showModal = ref(false);
const showChart = ref(false);
const selectedEvent = ref({})
const eventComparison = ref({});
const legendData = ref([
    {name: '1 star', color: '#FF0000'},
    {name: '2 stars', color: '#FFA500'},
    {name: '3 stars', color: '#FFFF00'},
    {name: '4 stars', color: '#00FF00'},
    {name: '5 stars', color: '#008000'},
])

const options = {
  responsive: true,
  maintainAspectRatio: false,
   plugins: {
        legend: {
            display: false,
        }
  },
};

const ModalComponent = defineAsyncComponent(()=>
    import('@Components/utils/ModalComponent.vue')
)

const eventRatingDataset = (periods, type)=> {
      return {
        labels: periods.labels,
        datasets: [
          {
            backgroundColor: [
            '#FF0000',
            '#FFA500',
            '#FFFF00',
            '#00FF00',
            '#008000',
            ],
            data: periods[`${type}`], //beforeData, duringData, afterData
          },
        ],
      };
};

const eventNote = (periods, type)=> {
      return periods[type]
};

const hashString = (inputString) => {
      let hash = 0;
      for (let i = 0; i < inputString.length; i++) {
        hash = (hash << 5) - hash + inputString.charCodeAt(i);
      }
      return hash;
}

const generateColor = (text) =>{
      const inputString = text;
      const hash = hashString(inputString);

      const red = (hash & 0xFF0000) >> 16;
      const green = (hash & 0x00FF00) >> 8;
      const blue = hash & 0x0000FF;

      return `rgb(${red}, ${green}, ${blue})`;
};

const showEventChart = (event)=>{
    selectedEvent.value = event;
    showChart.value = true;
    loadDataFromServer(event.id, route.params.tag)
};

</script>
<style scoped>
.staff__list{
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.modal__header{
    display: flex;
    justify-content: space-between;
}

.modal__header div{
    align-self: center;
}

.modal__close i{
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.modal__close i:hover{
    transform: rotate(360deg);
}

/*.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 400px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    height: 250px;
}*/

.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 15px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap:1rem;
    flex-direction: column;
    margin-bottom: 10px;
}

.staff__card h5{
    color: var(--color-primary);
    font-weight: 500;
    font-size: 16px;
}

.uil-mars{
    color: blue;
}

.uil-venus{
    color: pink;
}

span.rating{
    color: var(--color-danger);
    font-weight: 600;
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
    display: flex;
    gap: 1rem;
    justify-content: center;
    height: 150px;
}

.pie__chart div{
    width: 30% !important;
    height: 100px !important;
}

.pie__chart h3{
    text-align: center;
    font-weight: 500;
    color: var(--color-bg1);
    font-size: 14px;
}

.period span{
    font-weight: 500;
}

.period i{
   color: var(--color-danger)
}

.event_category{
     font-weight: 500;
}

.list__actions{
    display: flex;
    justify-content: flex-end;
}

.list__actions button{
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
}

.list__actions button.chart{
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.list__actions button.chart:hover{
    color: white;
    background-color: var(--color-primary);
}

.list__actions button:hover{
    transform: scale(0.95);
}

</style>