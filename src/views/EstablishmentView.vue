<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
            
            <div class="left__side">
                <div class="head dashboard">
                    <div class="app__title">
                     <h1>Dashboard</h1>
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
                <ComparisonChartComponent  v-if="reviews_loader == false" :data="plotdata" :width="chart__width" :height="chart__height" :establishment="establishment" :companies="comparisonData" :competitors="computedCompetitors" :timePeriod="selectedTimePeriod"/>
                <div v-else role="status" class="rounded shadow animate-pulse md:p-6 mt-5 mb-5">
                    <div class="flex items-baseline mt-2 space-x-3">
                        <div class="w-full h-40 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full h-64 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-40 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full h-64 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-40 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full h-40 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full h-64 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-40 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-40 dark:bg-gray-700"></div>
                        <div class="w-full bg-gray-200 rounded-t-lg h-60 dark:bg-gray-700"></div>
                    </div>
                    <span class="sr-only">Loading...</span>
                </div>
                <BaseLegend v-if="reviews_loader == false" class="legend" :LegendData="legendData" :alignment="'vertical'">
                </BaseLegend>
                <div class="head">
                    <div class="app__title">
                       <h2>Staff Excellence Awards</h2>
                    </div>
                </div>
                 <p class="temp__p">To see the staffs list, please click <a @click="goto('Staff')">here</a></p>
                <div class="reviews__content">
                    <!-- <p>To see the staffs list, please click <a @click="goto('Staff')">here</a></p> -->
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Last Events</h2>
                    </div>
                </div>
                <p class="temp__p">Explore the latest events, please click <a @click="goto('Event')">here</a> to access all </p>
                <div class="reviews__content">
                    <!-- <p>Explore the latest events, please click <a @click="goto('Event')">here</a> to access all </p> -->
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Socials</h2>
                    </div>
                </div>
                 <p class="temp__p">Explore your social account statistic, please click <a @click="goto('Social')">here</a></p>
                <div class="reviews__content">
                    <!-- <p>Explore your social account statistic, please click <a @click="goto('Social')">here</a></p> -->
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Last reviews</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <p>Discover the latest feedback about your establishment. Click <a @click="gotoReviewPage(establishment.id)">here</a> to access all reviews.</p>
                    <div class="reviews__pagination">
                        <CommentPagination  v-if="lastReviews.length > 0" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="lastReviews.length" :data="visibleData"></CommentPagination>
                    </div>
                    <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :allReviews="establishment.reviews"  :showEmoji="false"/>
                    <div v-else role="status" class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" v-for="index in 3">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                    <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                </div>
                                <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                            </div>
                            <div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <span class="sr-only">Loading...</span>
                    </div>
                    <aside v-if="lastReviews.length > 0">
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{  all_items[1].value - 3 }} reviews remains</p>
                        <div class="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
                            <a @click="gotoReviewPage(establishment.id)" class="see__more text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">See more</a>
                        </div>
                    </aside> 
                </div> 
            </div>
            <div class="tablet_mobile__filter">
                <DropdownComponent class="dropdown" :showTitle="false" title="Compare to" placeholder="Select a competitor" :data="computedCompetitors" @submit="(competitor)=>{
                        selectedCompetitors = competitor.name
                        if(competitor.name == computedCompetitors[0].name){
                            globalComparison();
                        }else{
                            reloadComparison(competitor);
                        }
                    }" :defaultObj="computedCompetitors[0]" :isDataObject="true"/>
                    <DropdownComponent :showTitle="false" class="dropdown" title="Filter by website" placeholder="Select a website" :data="websites" @submit="(website)=>{
                        selectedWebsites = website
                        if(website == websites[0]){
                            globalComparison();
                        }else{
                            reloadComparisonByWebsite(website);
                        }
                    }" :default="websites[0]"/>
                    <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2"/>
                    <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                                selectedTimePeriod = timePeriod
                        }" :default="timePeriods[0]"/>
            </div>
            <div class="tablet_mobile__head">
                <div class="establishment__info">
                        <label class="society__name">{{ establishment.name }}</label>
                        <div class="society__category">
                            <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span>{{ establishment.category }}</span>
                        </div>
                        <div class="society__country" v-if="establishment.country != null">
                                <i class="uil uil-map"></i>
                                <span>{{ establishment.country }}</span>
                        </div> 
                        <div class="society__location">
                                <i class="uil uil-location-point"></i>
                                <span>{{ establishment.address1 }}, {{ establishment.city }}</span>
                         </div>
                         <div class="society__rating">
                                <i class="uil uil-favorite"></i>
                                <span>{{ all_items[0].value  }}</span>
                         </div>
                         <div class="society__reviews">
                            <i class="uil uil-comment-alt"></i>
                                <span>{{ all_items[1].value  }}</span>
                         </div>
                         <div class="society__reviews">
                            <i class="uil uil-building"></i>
                            <span>{{ all_items[2].value  }} competitors</span>
                         </div>
                    </div>
                <div class="photo">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
            </div>
            <div class="right__side">
                <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                        <div v-else role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                            <label class="society__name">{{ establishment.name }}</label>
                            <div class="society__category">
                                <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span>{{ establishment.category }}</span>
                            </div>
                            <div class="society__location">
                                    <i class="uil uil-location-point"></i>
                                    <span>{{ establishment.address1 }}, {{ establishment.city }}</span>
                            </div> 
                    </div>
                    <DropdownComponent class="dropdown" title="Compare to" placeholder="Select a competitor" :data="computedCompetitors" @submit="(competitor)=>{
                        selectedCompetitors = competitor.name
                        if(competitor.name == computedCompetitors[0].name){
                            globalComparison();
                        }else{
                            reloadComparison(competitor);
                        }
                    }" :defaultObj="computedCompetitors[0]" :isDataObject="true"/>
                    <DropdownComponent class="dropdown" title="Filter by website" placeholder="Select a website" :data="websites" @submit="(website)=>{
                        selectedWebsites = website
                        if(website == websites[0]){
                            globalComparison();
                        }else{
                            reloadComparisonByWebsite(website);
                        }
                    }" :default="websites[0]"/>
                    <div class="date__filter">
                        <div class="text-sm title">Select a range of date</div>
                        <VueDatePicker v-model="date2" range :month-change-on-scroll="false" :format="format2"/>
                        <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                                selectedTimePeriod = timePeriod
                        }" :default="timePeriods[0]"/>
                    </div>
                    <div class="btn__light_secondary mb-1" @click="goto('Weather')">
                        <i class="uil uil-cloud-sun"></i> weather
                    </div>
                </div>
              <div class="rating__customers">
                <div class="title">Rating by Customers</div>
                <div class="chart__rating">
                    <Line :data="chartData" :options="chartConfig.options" />
                </div>
              </div>
              <div class="reviews__star">
                    <div class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium text-yellow-600 dark:text-blue-500 hover:underline">5 star</a>
                        <div class="h-3 bg-yellow-300 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate5*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate5 }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium text-yellow-600 dark:text-blue-500 hover:underline">4 star</a>
                        <div class="h-3 bg-yellow-300 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate4*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate4 }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium text-yellow-600 dark:text-blue-500 hover:underline">3 star</a>
                        <div class="h-3 bg-yellow-300 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate3*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate3 }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium text-yellow-600 dark:text-blue-500 hover:underline">2 star</a>
                        <div class="h-3 bg-yellow-300 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate2*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate2 }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium text-yellow-600 dark:text-blue-500 hover:underline">1 star</a>
                        <div class="h-3 bg-yellow-300 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate1*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate1 }}</span>
                    </div>
              </div>
              <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import CounterComponent from '@Components/utils/CounterComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import ComparisonChartComponent from '@Components/utils/ComparisonChartComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import CommentPagination from '@Components/utils/CommentPagination.vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import {ref, reactive, watch, onBeforeMount, computed, provide} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import { useAppStore } from "@Stores/index.js";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from '@vueuse/core';
import moment from 'moment';
import services from '@Services/index.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
)

const page=ref({
    title1: "",
    title2: "",
    icon: "uil-estate",
});

const weatherModal = ref(false);
provide('showModal', weatherModal);
const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Establishment",
        path: `${route.path}`,
        isCurrent: true,
    },
]
const date = ref(new Date());
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

let selected_date = reactive(moment());

const competitorStore = useCompetitorStore();
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
let showWebsites = ref(false);
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

let establishment =ref({reviews:[]});
let reviews = ref([]);
let reviews_loader = ref(true);
let competitors = ref([]); 
let computedCompetitors = computed(()=>{
    let data = [{name:'Global'}];
    competitors.value.forEach(competitor => {
        data.push(competitor);
    });
    return data;
});

let visibleData = ref([])
let paginationConfig = ref({
    current:0,
    size: 20,
    data: [],
    _data: []
})

let comparisonData = ref([establishment.value, ...competitors.value]);
let _comparisonData = [establishment.value, ...competitors.value];
const all_items = ref([
    {title: "Rating", value: 0, icon: "uil-star"},
    {title: "Reviews", value: 0, icon: "uil-comment"},
    {title: "Competitors", value: 0, icon: "uil-building"},
]);

let plotdata = ref([]);
let legendData = ref([]);
let _legendData = [];

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

let selectedTimePeriod = ref('');
let timePeriods = ref(['Months', 'Quarters', 'Semesters']);

let lastReviews = ref([]);
let media = [];

let reviewsConfidence = ref(0);
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

let colors = ['#6c63ff','#f75842','#aca8fd','#424890','#ff42e5','#58f742','#8eaca8','#fda458','#90fdac','#444278','#f7a142','#de90fd','#42d3ff','#e558f7','#a8ac42','#90fdd4','#784444','#58f7bf','#fdaa58','#90fdff'];

let chartConfig = reactive({
    data: {
        labels: [],
        datasets: [
            {
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 20, 12, 39, 10, 40,]
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

let chartData = ref({
        labels: [],
        datasets: []
})

const loadDatasets = (establishments, colors, date) => {
    let data = [];
    var index = 0;
    let chartdata = {
        labels: companiesStore.getLastMonths(6, date, true),
        datasets: []
    }
    chartConfig.data.datasets = [];
    establishments.forEach(establishment => {
        let dataset = {
            label: establishment.name,
            backgroundColor: colors[index],
            data: companiesStore.getRatingLastMonths(establishment.reviews, 6, date, true)
        };
        if(index >= establishments.length) index = 0;
        index ++;
        data.push(dataset);
        chartdata.datasets.push(dataset);
    });
    chartConfig.data.datasets = data;
    chartData.value = chartdata;
    return data;
}

watch(date, ()=>{
 if(date.value== null){
    plotdata.value = companiesStore.calculateReviewsV2(comparisonData.value, 6, selected_date, true);   
    loadDatasets(_comparisonData, colors, selected_date);
 }else{
    plotdata.value = companiesStore.calculateReviewsV2(comparisonData.value, 6, moment(date.value, 'DD/MM/YYYY'), true);   
    loadDatasets(_comparisonData, colors, moment(date.value, 'DD/MM/YYYY'));
 }
});

const viewData = (timePeriod, startDate, endDate, data) => {
    plotdata.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, data);
}

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(lastReviews.value);
}

let updateVisibleData = function(_data){
    let data = paginationConfig.value;

    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size);
                
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage(paginationConfig.value.current -1);
    }
    visibleData.value = paginationConfig.value.data;
}

const globalComparison = async () => {
    selectedCompetitors.value = 'Global';
    selectedWebsites.value = 'Global';
    
    plotdata.value = [];

    comparisonData.value = [establishment.value, ...competitors.value];
    _comparisonData = [establishment.value, ...competitors.value];
    reviews.value = establishment.value.reviews;
   
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }

    all_items.value[2].value = competitors.value.length;
    all_items.value[1].value = establishment.value.reviews.length;
    all_items.value[0].value = companiesStore.calculateRatingV2(establishment.value.reviews);

    legendData.value =  companiesStore.generateLegend(comparisonData.value, colors);
    _legendData =  companiesStore.generateLegend(_comparisonData, colors);

    
    lastReviews.value = companiesStore.getLastReviews(establishment.value.reviews, 100);
    updateVisibleData(lastReviews.value);
    reviewFeedbackData.value = companiesStore.getfeedbackData(establishment.value.reviews);
    
    setTimeout(() => {
        loadDatasets(_comparisonData, colors, selected_date);
        viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
    }, 100);
   
    
    reviews_loader.value = false
    appStore.isLoading = false;
}

globalComparison();

onBeforeMount(async () => {
const companyId = route.params.id;
    companiesStore.establishments.forEach(_establishment=>{
        if(_establishment.id==companyId){
            establishment.value = _establishment;
            reviews.value = establishment.value.reviews;
            page.value.title2 = establishment.value.name;
            let data = [];
            let promises = [];
            establishment.value.competitors.forEach(competitor=>{
               let promise = services.get_Record(`/establishment/${competitor.id}/detail`, (response) => {
                        data.push(response.data);
                });
                promises.push(promise);  
             })

            Promise.all(promises).then(() => {
                     competitors.value = data;
                     console.log(data)
            });
        }
    })

    if(userStore.user.customer !==null){
        userStore.user.customer.establishments.forEach(async (company, index) => {
            if(company.id == companyId){
                userStore.user.customer.establishments[index].media.forEach(item => {
                    media.push(item.url_source);
                });
            }
        });
    }

    companiesStore.calculateRating(establishment.value.reviews, (rating) =>{
        all_items.value[0].value = rating;
    });
    websites.value = ['Global',...companiesStore.getWebsites(establishment.value.websites)];
})

const reloadComparison = async (competitor) => {
    selectedCompetitors.value = competitor.name;
    plotdata.value = [];
    comparisonData.value = [establishment.value, competitor];
    _comparisonData  = [establishment.value, competitor];
    
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
    // legendData.value = _legendData.filter(e => e.name == establishment.value.name || e.name == competitor.name)
    legendData.value =  companiesStore.generateLegend(_comparisonData, colors);
}

const reloadComparisonByWebsite = async (website) => {
    selectedWebsites.value = website;
    showWebsites.value = !showWebsites.value;
    comparisonData.value = _comparisonData;
    await companiesStore.getReviewsByWebsite(comparisonData.value, selectedWebsites.value, async (data) =>{
        plotdata.value = [];
        data.forEach(company => {
            if(company.id == establishment.value.id){
                console.log(company)
                all_items.value[1].value = company.reviews.length;
                all_items.value[0].value = companiesStore.calculateRatingV2(company.reviews);
                lastReviews.value = companiesStore.getLastReviews(company.reviews, 10);
                reviews.value = company.reviews;
                updateVisibleData(lastReviews.value);
                reviewFeedbackData.value = companiesStore.getfeedbackData(company.reviews);
            }
        });
        let startDate = moment().startOf('year').format('YYYY-M-DD');
        let endDate = moment().endOf('year').format('YYYY-M-DD');
        if(date2.value.length > 0){
            startDate = moment(date2.value[0]).format('YYYY-M-DD');
            endDate = moment(date2.value[1]).format('YYYY-M-DD');
        }
        viewData(selectedTimePeriod.value, startDate, endDate, data);
        loadDatasets(data, colors, selected_date);
    });
}

const gotoReviewPage = (id)=>{
    appStore.isLoading = true;
    setTimeout(()=>{
        router.push({
            name: 'reviews',
            params:{
                id: id,
            }
        })
    }, 100);
}

/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const{ width, height} = useWindowSize();
//For Group bar chart
const chart__width = ref(800);
const chart__height = ref(300);

//For Line chart
const chart__width2 = ref(300);
const chart__height2 = ref(200);


watch(date2, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    comparisonData.value = _comparisonData;
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

watch(selectedTimePeriod, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    comparisonData.value = _comparisonData;
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

const goto = (value) =>{
    router.push({name: value});
};

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

*{
    transition: var(--transition);
}

.temp__p{
    font-size: 14px;
    color: var(--color-bg1);
    font-weight: 500;
}

.temp__p a:hover{
    background-color: var(--color-danger);
    color: white;
}

.temp__p a{
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
}

.app__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap:1rem;
}

.reviews__content p{
   font-size: 14px;
   font-weight: 500;
   color: var(--color-bg1);
}

.reviews__content a{
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}
.reviews__content a:hover{
   background-color: var(--color-danger);
   color: white;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}

.rating__customers{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
}

.establishment{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info i{
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div{
    font-size: 13px;
    font-weight: 500;
}

.date__filter .title{
    font-weight:600;
}

.filter__content .title{
    font-weight: 500;
}

.filter__content{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
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

.chart__rating{
    display: flex;
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
    width: 1300px;
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
    width: 500px;
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

.see__more{
    cursor: pointer;
}

.society__name{
    margin: 5px 0;
}

.tablet_mobile__head, .tablet_mobile__filter{
    display: none;
}

.society__location{
    display: flex;
}
.society__location span{
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

@media screen and (max-width:1400px) {
  .app__container{
    width: var(--container-width-md);
  }

  .breadcrumb__container{
        width: var(--container-width-md);
    }
}

@media screen and (max-width:1287px) {
  .counter{
    gap: 2rem !important;
  }
  .left__side{
    width: 1000px !important;
  }
  
  .right__side{
    width: 300px !important;
  }
}


@media screen and (max-width:1024px) {
   
    .right__side{
     width: 250px !important;
    } 
}

@media screen and (max-width: 975px) {
   .app__container{
    flex-direction: column-reverse;
    width: 95% !important;
    justify-content: center;
    align-items: center;
   }
   .left__side{
    width: inherit !important;
   }

   .photo{
    flex-basis: 250px;
   }

   .photo div{
    height: 100%;
   }

   .photo img{
    height: 100%;
    width: 100%;
   }
   .dashboard__content, .dashboard, .right__side{
    display: none !important;
   }

   .tablet_mobile__head{
        display: flex;
        justify-content: space-between;
        margin: auto;
        margin-top: 50px;
        width: inherit;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: 1px solid var(--light-color-bg2);
        border-radius: 5px;
        padding: 15px;
        font-size: 14px;
    }

    .tablet_mobile__head label{
        font-size: 17px !important;
    }

    .tablet_mobile__head span{
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter{
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter *{
        flex-basis: 200px;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head{
        font-size: 13px !important;
    }

    .tablet_mobile__head label{
        font-size: 15px !important;
    }

    .tablet_mobile__filter{
       gap: 0.25rem;
    }
}

@media screen and (max-width:800px) {
    .photo{
       flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head{
        font-size: 12px !important;
        padding: 10px;
    }

    .photo{
       flex-basis: 210px !important;
    }

    .tablet_mobile__head label{
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter{
       flex-direction: column;
       padding: 5px 0px !important;
    }

    .tablet_mobile__filter *{
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head{
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo{
       flex-basis: 150px !important;
       height: 100px !important;
    }
}
</style>