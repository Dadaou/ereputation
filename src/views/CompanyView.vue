<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
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
                            <div id="competitors__dropdown" data-dropdown-toggle="dropdownDivider" :class="['font-medium rounded-xl text-sm px-3 py-2 border border-1', width < 1100?'w-40':'w-60']" type="button">
                            <span>{{ selectedCompetitors }}</span>
                            <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                            <!-- Dropdown menu -->
                            <div id="dropdownDivider" class="" :class="['z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600', width < 1100?'w-40':'w-60']" v-show="showCompetitors">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" ref="target__competitors">
                                    <li @click="globalComparison(), showCompetitors = !showCompetitors">
                                                Global
                                    </li>
                                    <li v-for="competitor in competitors" @click="reloadComparison(competitor)">
                                       {{ competitor.name }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="filter__container">
                    <div class="filter__content">
                        <div class="title">
                            Compare to
                        </div>
                        <div @click="showCompetitors = !showCompetitors">
                                    <div id="website__dropdown" data-dropdown-toggle="dropdownDivider"
                                    :class="['font-medium rounded-xl text-sm px-3 py-2 border border-1', width < 600?'w-40':'w-60', width < 550?'w-60':'', width < 450?'w-30':'']"
                                    type="button">
                                    <span>{{ selectedCompetitors }}</span>
                                    <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                                    <!-- Dropdown menu -->
                                    <div id="dropdownDivider" :class="['z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600', width < 600?'w-40':'w-60', width < 550?'w-60':'', width < 450?'w-30':'']" v-show="showCompetitors">
                                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" ref="target__competitors_2">
                                            <li @click="globalComparison(), showCompetitors = !showCompetitors">
                                                Global
                                            </li>
                                            <li v-for="competitor in competitors" @click="reloadComparison(competitor)">
                                            {{ competitor.name }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                    </div>
                    <div class="filter__content">
                        <div class="title">
                            Filter by website
                        </div>
                        <div @click="showWebsites = !showWebsites">
                                    <div id="website__dropdown" data-dropdown-toggle="dropdownDivider" :class="['font-medium rounded-xl text-sm px-3 py-2 border border-1', width < 600?'w-40':'w-60', width < 550?'w-60':'', width < 450?'w-30':'']" type="button">
                                    <span>{{ selectedWebsites }}</span>
                                    <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                                    <!-- Dropdown menu -->
                                    <div id="dropdownDivider" :class="['z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600', width < 600?'w-40':'w-60', width < 550?'w-60':'', width < 450?'w-30':'']" v-show="showWebsites">
                                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" ref="target__websites_2">
                                            <li @click="globalComparison(), showWebsites = !showWebsites">
                                                Global
                                            </li>
                                            <li v-for="website in websites" @click="reloadComparisonByWebsite(website.name)">
                                                {{ website.name }}
                                            </li>
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
                    <GroupedBarChart :plot-data="plotdata" x-key="name"
                                    :width="chart__width" :height="chart__height" :margin="margin" :colors="colors"
                                    x-axis-label="" y-axis-label="Reviews"
                                    :y-tick-format="d => `${d}`">
                    </GroupedBarChart>
                </div>
                <BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
                </BaseLegend>
                <div class="rating__statistics">
                    <div class="rating__customers">
                        <div class="title">Rating by Customers</div>
                        <div class="chart__rating">
                            <LineChart :plot-data="plotdata1" x-key="year"
                                        :width="chart__width2" :height="chart__height2" :margin="margin"
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
                <div class="head">
                    <div class="app__title">
                       <h2>Top Three reviews</h2>
                    </div>
                </div>
                <div class="reviews__content">
                        <article v-for="review in bestReviews">
                            <div class="flex items-center review__item">
                                <div class="flex items-center mb-6 space-x-4">
                                    <div class="space-y-1 font-medium dark:text-white">
                                        <p>{{ review.author }}</p>
                                        <ul class="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                                            <li class="flex items-center"><svg aria-hidden="true" class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path></svg>{{ review.source }}</li>
                                        </ul>
                                    </div>
                                </div>
                                <p class="bg-yellow-400 text-white text-sm font-semibold inline-flex items-center p-1.5 rounded">{{ review.rating }}</p>
                            </div>
                            <div class="col-span-2 mt-6 md:mt-0">
                                <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
                            </div>
                        </article>
                </div>
            </div>
            <div class="right__side">
              <div class="filter__content">
                <div class="title">
                    Filter by website
                </div>
                <div @click="showWebsites = !showWebsites">
                            <div id="website__dropdown" data-dropdown-toggle="dropdownDivider" class="font-medium rounded-xl text-sm px-3 py-2 border border-1 w-60" type="button">
                            <span>{{ selectedWebsites }}</span>
                            <svg class="w-10 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>

                            <!-- Dropdown menu -->
                            <div id="dropdownDivider" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-60" v-show="showWebsites">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" ref="target__websites">
                                    <li @click="globalComparison(), showWebsites = !showWebsites">
                                        Global
                                    </li>
                                    <li v-for="website in websites" @click="reloadComparisonByWebsite(website.name)">
                                        {{ website.name }}
                                    </li>
                                </ul>
                            </div>
                        </div>
              </div>
              <div class="rating__customers">
                <div class="title">Rating by Customers</div>
                <div class="chart__rating">
                    <LineChart :plot-data="plotdata1" x-key="year"
                                :width="chart__width2" :height="chart__height2" :margin="margin"
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
                            <div class="h-2 bg-grey-300 rounded" style="width: 50%"></div>
                            <span>Neutral</span>
                        </div>
                        <div class="review h-2 bg-gray-200 rounded dark:bg-gray-700">
                            <div class="h-2 bg-green-300 rounded" style="width: 50%"></div>
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
import {ref, watch, onBeforeMount, onMounted} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute } from "vue-router";
import { useWindowSize } from '@vueuse/core';
import { onClickOutside } from '@vueuse/core';

const page=ref({
    title1: "Your",
    title2: "establishment",
    icon: "uil-estate",
});

// Competitors list 1
const target__competitors = ref(null);
const target__competitors_2 = ref(null);
onClickOutside(target__competitors, (event) => showCompetitors.value = false);
onClickOutside(target__competitors_2, (event) => showCompetitors.value = false);

// Website list 1
const target__websites = ref(null);
const target__websites_2 = ref(null);
onClickOutside(target__websites, (event) => showWebsites.value = false);
onClickOutside(target__websites_2, (event) => showWebsites.value = false);

const route = useRoute();

const breadcrumbData = [
    {
        title: "Establishment",
        path: `${route.path}`,
        isCurrent: true,
    },
]

const competitorStore = useCompetitorStore();
const companiesStore = useCompanyStore();
let showCompetitors = ref(false);
let showWebsites = ref(false);
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref([
    { name : 'Booking'},
    { name : 'Campings'},
    { name : 'Expedia'},
    { name : 'Tripadvisor'},
    { name : 'Trustpilot'},
    { name : 'Google'},
    { name : 'OpenTable'},
])

const establishment = ref(null);
const competitors = ref([]); 
let comparisonData = ref([establishment.value, ...competitors.value]);
let _comparisonData = [establishment.value, ...competitors.value];
const all_items = ref([
    {title: "Rating", value: 0, icon: "uil-star"},
    {title: "Reviews", value: 0, icon: "uil-comment"},
    {title: "Competitors", value: 0, icon: "uil-building"},
]);

let plotdata = ref([])

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

let legendData = ref([]);
let _legendData = [];

let bestReviews = ref([]);

let margin = { top: 20, bottom: 35, left: 55, right: 20 };

let colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890'];

watch(showCompetitors, ()=>{
 console.log(showCompetitors.value);   
});

const globalComparison = async () => {
    selectedCompetitors.value = 'Global';
    selectedWebsites.value = 'Global';
    // showWebsites.value = !showWebsites.value;
    // showCompetitors.value = !showCompetitors.value;
    plotdata.value = [];
    
    comparisonData.value = [establishment.value, ...competitors.value];
    _comparisonData = [establishment.value, ...competitors.value];
    
    await companiesStore.calculateReviews(comparisonData.value, (reviews) => {
        plotdata.value.push(reviews);
    })
    await companiesStore.generateLegend(comparisonData.value, (data) => {
        legendData.value = data;
        _legendData  = data;
    })
}

onBeforeMount(async () => {
const companyId = route.params.id;
await companiesStore.fetchOne(companyId, async (company) => {
    establishment.value = company;
    console.log(establishment.value.reviews)
    companiesStore.calculateRating(establishment.value.reviews, (rating) =>{
        all_items.value[0].value = rating;
    });

    const competitorTag = `competitor_tag=${company.competitor_tag}`;
    await competitorStore.getAllCompetitors(competitorTag, (data) => {  
      data.forEach(element => {
        competitors.value.push(element);
      });
      all_items.value[2].value = competitors.value.length;
      all_items.value[1].value = establishment.value.reviews.length;
      globalComparison();
      bestReviews.value = companiesStore.getTopThreeReviews(establishment.value.reviews, 5, []);
    })
 });
})

const reloadComparison = async (competitor) => {
    console.log(competitor)
    selectedCompetitors.value = competitor.name;
    showCompetitors.value = !showCompetitors.value;

    plotdata.value = [];
    
    comparisonData.value = [establishment.value, competitor];
    _comparisonData  = [establishment.value, competitor];
    
    await companiesStore.calculateReviews(comparisonData.value, async (reviews) => {
        console.log(reviews)
        plotdata.value.push(reviews);
        legendData.value = _legendData.filter(e => e.name == establishment.value.name || e.name == competitor.name)
    })
}

const reloadComparisonByWebsite = async (website) => {
    selectedWebsites.value = website;
    showWebsites.value = !showWebsites.value;

    comparisonData.value = _comparisonData
    console.log(_comparisonData)
    await companiesStore.getReviewsByWebsite(comparisonData.value, selectedWebsites.value, async (data) =>{
        plotdata.value = [];
        await companiesStore.calculateReviews(data, async (reviews) => {
            plotdata.value.push(reviews);

        })
    });
}

/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const{ width, height} = useWindowSize();
//For Group bar chart
const chart__width = ref(700);
const chart__height = ref(300);

//For Line chart
const chart__width2 = ref(300);
const chart__height2 = ref(200);

onBeforeMount(() => {
    if(width.value <= 600){
        chart__width.value = 300;
        chart__height.value = 200;

        chart__width2.value = 300;
        chart__height2.value = 150;
    }

    if(width.value <  1287){
        chart__width.value = 600;
        chart__width2.value = 250;
        chart__height2.value = 150;
    }

   if(width.value <  1075){
    chart__width.value = 550;
   }

   if(width.value <  1025){
    chart__width.value = 500;
   }

   if(width.value <  450){
    chart__width.value = 350;
    chart__height.value = 200;
    chart__width2.value = 200;
   }

   if(width.value <  400){
    chart__width.value = 300;
    chart__height.value = 200;
   }
});

watch([width], () => {
   if(width.value <  1287){
    chart__width.value = 600;
    chart__width2.value = 250;
    chart__height2.value = 150;
   }

   if(width.value <  1075){
    chart__width.value = 550;
   }

   if(width.value <  1025){
    chart__width.value = 500;
   }

   if(width.value <  550){
    chart__width.value = 400;
    chart__height.value = 200;
   }

   if(width.value <  450){
    chart__width.value = 350;
    chart__height.value = 200;
    chart__width2.value = 200;
   }

   if(width.value <  400){
    chart__width.value = 300;
    chart__height.value = 200;
   }

   if(width.value <  350){
    chart__width.value = 250;
    chart__height.value = 180;
   }
});

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.review__item{
    justify-content: space-between !important;
}

.reviews__content article{
   border: 1px solid var(--light-color-bg2);
   margin: 10px auto;
   border-radius: 10px;
   padding: 10px;
}
.app__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    gap:1rem;
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
    border: 1px solid var(--light-color-bg2);
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
    border: 1px solid var(--light-color-bg2);
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
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: 125px;
    padding: 15px;
}

.chart__rating{
    display: flex;
    /* justify-content: center; */
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
 margin: 15px auto;
}

.comment{
    /* width: 50rem !important; */
    overflow: hidden;
    text-align: justify;
}

.app__title{
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1{
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2{
    font-size: 18px;
    transition: var(--transition);
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
    transition: var(--transition);
}

#website__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
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
    margin-top: 20px;
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

.rating__statistics{
    display:none;
    margin-bottom:15px;
    transition: var(--transition);
}

.filter__container{
    display: none;
    transition: var(--transition);
}

/* For tablets */
@media screen and (max-width:1287px) {
  .counter{
    gap: 2rem !important;
  }
  .left__side{
    flex-basis: 1000px !important;
  }
  
  .right__side{
    flex-basis: 400px !important;
  }
}

@media screen and (max-width:1225px) {
  .counter{
    gap: 1rem !important;
  }

  .right__side{
    flex-basis: 300px !important;
  } 
}

@media screen and (max-width:1075px) {
  .counter{
    gap: 0.5rem !important;
  }
  
  .right__side{
    flex-basis: 250px !important;
  } 
}

@media screen and (max-width:1024px) {
    .app__container{
        position: relative;
        top: 7.5rem !important;
    }

    .right__side{
     flex-basis: 250px !important;
    } 
}

@media screen and (max-width: 975px) {
    .right__side{
        display: none;
    }

    .filter__content{
        border: none;
    }

    .filter__container{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100% !important;
    }

    .rating__statistics{
       display: block;
    }

    .competitors{
        display: none !important;
    }
}

@media screen and (max-width: 675px) {
   .left__side{
    flex-basis: 600px !important;
   }

   .app__container{
    width: var(--container-width-md) !important;
   }
}

@media screen and (max-width: 550px) {
   .left__side{
    flex-basis: 500px !important;
   }
    .dashboard__content{
        gap: 0.5rem !important;
        width: 100%!important;
    }

   .counter{
    /* flex-grow: 0 !important; */
    margin-top: 15px;
   }

   .app__container{
    width: var(--container-width-sm) !important;
   }

   .filter__container{
       flex-direction: column;
    }

    .rating__statistics{
        width: var(--container-width-sm) !important;
        margin: auto !important;
    }

    .reviews__content{
        width: var(--container-width-sm) !important;
        margin: auto !important;
    }

    .rating__statistics{
        margin-bottom: 20px !important;
    }
}

@media screen and (max-width:500px) {
    .left__side{
        flex-basis: 400px !important;
    }

    .rating__statistics{
        width: 100% !important;
    }
}

</style>