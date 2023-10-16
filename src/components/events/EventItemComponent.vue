<template>
    <div class="staff__list">
        <div class="staff__card" v-if="events.length>0" v-for="event in events">
            <ul class="mb-5">
                <li><h5>{{ event.name }}</h5></li>
                <li class="event_category"><span class="label">Category: </span> <span>{{ event.category }}</span></li>
                <li class="period"><i class="uil uil-calender"></i> <span>{{ moment(event.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="event.dateto != null">{{ `to ${moment(event.dateto).format('DD MMMM YYYY')}` }}</span></li>
            </ul>
            <div class="pie__chart">
                <div>
                    <h3 class="mb-2">Before the event (<span class="rating">{{calculateAverageRating(eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['before']))}}</span>)</h3>
                    <Pie 
                        :data="eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['before'])" 
                        :options="options" 
                    />
                </div>
                <div>
                    <h3 class="mb-2">During the event (<span class="rating">{{calculateAverageRating(eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['between']))}}</span>)</h3>
                    <Pie 
                        :data="eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['between'])" 
                        :options="options" 
                    />
                </div>
                <div>
                    <h3 class="mb-2">After the event  (<span class="rating">{{calculateAverageRating(eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['after']))}}</span>)</h3>
                    <Pie 
                        :data="eventRatingDataset(companiesStore.calculateEventRatingV2(establishment, event)['after'])" 
                        :options="options" 
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-if="events.length==0">No Event</div>
</template>
<script setup>
import {ref, inject, onBeforeMount, computed} from 'vue';
import moment from 'moment';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs';
import { useCompanyStore } from "@Stores/company.js";

ChartJS.register(ArcElement, Tooltip)

const companiesStore = useCompanyStore();
const events = inject('events');
const establishment = inject('establishment');

const options = {
  responsive: true,
  maintainAspectRatio: false,
   plugins: {
        legend: {
            display: false,
        }
  },
};

const eventRatingDataset = (eventRating)=> {
      return {
        labels: [
          "0 star",
          "1 star",
          "2 stars",
          "3 stars",
          "4 stars",
          "5 stars",
        ],
        datasets: [
          {
            backgroundColor: [
            '#6c63ff',
            '#00bf8e',
            '#fd1f1f',
            '#2e3267',
            '#424890',
            '#aca8fd',
            ],
            data: [
              eventRating["0"],
              eventRating["1"],
              eventRating["2"],
              eventRating["3"],
              eventRating["4"],
              eventRating["5"],
            ],
          },
        ],
      };
};

const calculateAverageRating = (data) =>  {
  const starRatings = [0, 1, 2, 3, 4, 5];
  const ratingsData = data.datasets[0].data;

  // Calcul de la somme pondérée des évaluations
  let weightedSum = 0;
  for (let i = 0; i < starRatings.length; i++) {
    weightedSum += starRatings[i] * ratingsData[i];
  }

  // Calcul de la moyenne
  const totalRatings = ratingsData.reduce((total, count) => total + count, 0);
  const averageRating = weightedSum / totalRatings;
  if(isNaN(averageRating.toFixed(1))) return 0;
  return averageRating.toFixed(1);
};
</script>
<style scoped>
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
    height: 250px;
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
</style>