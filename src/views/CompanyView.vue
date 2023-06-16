<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
            <div class="left__side">
                <div class="head">
                    <div class="app__title">
                     <h1>Dashboard</h1>
                    </div>
                    <div class="competitors">
                        <div class="select__title w-full">Compare to</div>
                        <div @click="showCompetitors = !showCompetitors">
                            <div id="competitors__dropdown" data-dropdown-toggle="dropdownDivider" class="font-medium rounded-xl text-sm px-3 py-2 border border-1 w-60" type="button">
                            <span>{{ selectedCompetitors }}</span>
                            <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                            <!-- Dropdown menu -->
                            <div id="dropdownDivider" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-60" v-show="showCompetitors">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li v-for="company, index in competitorStore.establishments" @click="selectedCompetitors= company.name">
                                       {{ company.name }}
                                    </li>
                                    <!-- <li @click="selectedCompetitors='Company 1'">
                                        Company 1
                                    </li>
                                    <li @click="selectedCompetitors='Company 2'">
                                        Company 2
                                    </li>
                                    <li @click="selectedCompetitors='Company 3'">
                                        Company 3
                                    </li>
                                    <li @click="selectedCompetitors='Company 4'">
                                        Company 4
                                    </li> -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dashboard__content">
                    <CounterComponent class="counter" v-for="item in all_items" :item="item"/>
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Comparison</h2>
                    </div>
                </div>
                <div class="chart__content">
                    <GroupedBarChart :plot-data="plotdata" x-key="date"
                                    :width="700" :height="300" :margin="margin" :colors="colors"
                                    x-axis-label="Trimester" y-axis-label="Reviews"
                                    :y-tick-format="d => `$${d}`">
                    </GroupedBarChart>
                </div>
                <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
                </BaseLegend>
                <div class="head">
                    <div class="app__title">
                       <h2>Top Three reviews</h2>
                    </div>
                </div>
                <div class="reviews__content">  
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Comment
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Rating
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" v-for="i in 3">
                                    <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img class="w-10 h-10 rounded-full" src="/src/assets/images/Portrait_Placeholder.png" alt="Jese image">
                                        <div class="pl-3">
                                            <div class="text-base font-semibold">Neil Sims</div>
                                            <div class="font-normal text-gray-500">neil.sims@flowbite.com</div>
                                        </div>  
                                    </th>
                                    <td class="px-6 py-4 comments">
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam dignissimos rerum, molestias sapiente aspernatur.
                                    </td>
                                    <td class="px-6 py-4 rating">
                                       4.8
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="right__side">
              <div class="filter__content">
                <div class="title">
                    Filter by website
                </div>
                <div @click="showWebsites = !showWebsites">
                            <div id="website__dropdown" data-dropdown-toggle="dropdownDivider" class="font-medium rounded-xl text-sm px-3 py-2 border border-1 w-60" type="button">
                            <span>Global</span>
                            <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                            <!-- Dropdown menu -->
                            <div id="dropdownDivider" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-60" v-show="showWebsites">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        Google
                                    </li>
                                    <li>
                                        Trivago
                                    </li>
                                    <li>
                                        Booking
                                    </li>
                                </ul>
                            </div>
                        </div>
              </div>
              <div class="rating__customers">
                <div class="title">Rating by Customers</div>
                <div class="chart__rating">
                    <LineChart :plot-data="plotdata1" x-key="year"
                                :width="300" :height="200" :margin="margin"
                                :y-min="1" :x-ticks="3" :x-min="2021" :x-max="2023"
                                :colors="colors"
                                :y-tick-format="d => `${d}`">
                    </LineChart>
                </div>
              </div>
              <div class="community__feedback">
                    <div class="title">Community Feedback</div>
                    <h2>Mostly Positive</h2>
                    <div class="reviews__content1">
                        <div class="review h-2 bg-gray-200 rounded dark:bg-gray-700">
                            <div class="h-2 bg-red-300 rounded" style="width: 100%"></div>
                            <span>Negative</span>
                        </div>
                        <div class="review h-2 bg-gray-200 rounded dark:bg-gray-700">
                            <div class="h-2 bg-grey-300 rounded" style="width: 100%"></div>
                            <span>Neutral</span>
                        </div>
                        <div class="review h-2 bg-gray-200 rounded dark:bg-gray-700">
                            <div class="h-2 bg-green-300 rounded" style="width: 100%"></div>
                            <span>Positive</span>
                        </div>
                    </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import CounterComponent from '@Components/utils/CounterComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import {ref, watch} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useRoute } from "vue-router";

const page=ref({
    title1: "Your",
    title2: "establishment",
    icon: "uil-estate",
});

const route = useRoute();

const breadcrumbData = [
    {
        title: "Establishment",
        path: `${route.path}`,
        isCurrent: true,
    },
]

const competitorStore = useCompetitorStore();
let showCompetitors = ref(false);
let showWebsites = ref(false);
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');

const all_items = ref([
    {title: "Rating", value: "4.5", icon: "uil-star"},
    {title: "Reviews", value: "1,200", icon: "uil-comment"},
    {title: "Competitors", value: "4", icon: "uil-building"},
]);

let plotdata = [
    {
        "date": "1st Trimester",
        "Company 1": 5921,
        "Company 2": 1026,
        "Company 3": 2324,
        "Company 4": 2324
    },
    {
        "date": "2nd Trimester",
        "Company 1": 2365,
        "Company 2": 5000,
        "Company 3": 2000,
        "Company 4": 3900
    },
    {
        "date": "3rd Trimester",
        "Company 1": 5600,
        "Company 2": 4026,
        "Company 3": 3324,
        "Company 4": 2324
    },
]

let plotdata1 = [
    {
        "year": "2021",
        "Company 1": 4.9,
        "Company 2": 4.2,
        "Company 3": 4.3,
        "Company 4": 3.5
    },
    {
        "year": "2022",
        "Company 1": 3.2,
        "Company 2": 4.6,
        "Company 3": 3.5,
        "Company 4": 2.8
    },
    {
        "year": "2023",
        "Company 1": 4.3,
        "Company 2": 4.8,
        "Company 3": 4.6,
        "Company 4": 4.5
    },
]

let legendData = [
  {
    "name": "Company 1",
    "color": "#6c63ff"
  },
  {
    "name": "Company 2",
    "color": "#f75842"
  },
  {
    "name": "Company 3",
    "color": "#aca8fd"
  },
  {
    "name": "Company 4",
    "color": "#424890"
  },
];

let margin = { top: 20, bottom: 35, left: 55, right: 20 };

let colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890'];

watch(showCompetitors, ()=>{
 console.log(showCompetitors.value);   
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.app__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    gap:1rem;
    /* flex-wrap: wrap; */
}

.reviews__content1{
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    margin-top: 15px;
}

.reviews__content1 .review{
    flex-grow: 1;
}

.rating__customers{
    /* box-shadow: 0 1rem 2rem rgba(0,0,0,0.09); */
    border:1px solid var(--color-primary);
    border-radius: 10px;
    margin: 15px auto;
    /* padding: 15px; */
}

.filter__content .title{
    font-size: 15px;
    font-weight:600;
    /* margin-left: 15px; */
    /* margin-top:15px; */
}

.filter__content{
    border:1px solid var(--color-primary);
    border-radius: 10px;
    /* margin: 15px auto; */
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

.community__feedback{
    /* box-shadow: 0 1rem 2rem rgba(0,0,0,0.1); */
    border:1px solid var(--color-primary);
    border-radius: 10px;
    height: 125px;
    padding: 15px;
}

.chart__rating{
    display: flex;
    justify-content: center;
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
   display: flex;
   justify-content: center;
   margin-bottom: 30px;
}

.app__title{
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1{
    font-size: 20px;
}

.app__title h2{
    font-size: 18px;
}

.left__side{
    flex-basis: 1300px;
    padding: 50px 5px;
}

.left__side .head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

#competitors__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

#website__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
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

.dashboard__content, .chart__content, .reviews__content{
    margin-top: 50px;
}

.chart__content{
    display: flex;
    justify-content: center;
}

.head .competitors{
    display: flex;
    align-items: center;
    gap: 1rem;
}

.competitors .select__title{
    font-weight: 500;
}

.comments{
    text-align: justify;
}

.rating{
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
}

.right__side{
    flex-basis: 500px;
    /* box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
    border-radius: 20px; */
    padding: 50px 0px;
}
</style>