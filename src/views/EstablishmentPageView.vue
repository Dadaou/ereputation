<template>
    <div class="main__container" v-if="exist">
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
                    <DashboardComponent :is-loading="dataLoading" class="counter" v-for="item in all_items" :item="item"/>
                </div>
                <div class="head">
                    <div class="app__title">
                      <h2>Comparison</h2>
                    </div>
                  </div>
                  <div
                    v-if="reviews_loader == true"
                    :style="{
                      'width': `100%`,
                      'height': `200px`,
                      'display': 'flex',
                      'alignItems': 'center',
                      'background': 'rgba(0, 0, 0, 0.1)',
                      'opacity': 0.9,
                      'justifyContent': 'center',
                      'alignItems': 'center',
                      'zIndex': 1,
                      'marginTop': '10px',
                      'marginBottom': '10px'
                    }"
                  >
                    <SpinnerComponent/>
                  </div>
                  <ComparisonChartComponent
                      v-else
                      :data="plotdata"
                      :width="chart__width"
                      :chartheight="chart__height"
                      :establishment="establishment"
                      :companies="comparisonData"
                      :competitors="computedCompetitors"
                      :timePeriod="selectedTimePeriod"
                    />
                  <BaseLegend v-if="reviews_loader == false" class="legend" :LegendData="legendData" :alignment="'vertical'">
                  </BaseLegend>
                <div class="head">
                    <div class="app__title">
                       <h2>Last reviews</h2>
                    </div>
                </div>
                <div class="reviews__content" v-if="!dataLoading">
                    <p>Discover the latest feedback about your establishment. Click <a @click="gotoReviewPage(establishment.competitor_tag, $route.params.tag)">here</a> to access all reviews.</p>
                    <div class="reviews__pagination">
                        <CommentPagination  v-if="lastReviews.length > 0" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="lastReviews.length" :data="visibleData"></CommentPagination>
                    </div>
                    <CommentComponent  
                    v-if="reviews_loader == false"  
                    :reviews="visibleData" 
                    :allReviews="establishment.reviews"  
                    :showEmoji="false"/>
                    <div 
                    v-else 
                    role="status" 
                    class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" 
                    v-for="index in 5">
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
                            <a @click="gotoReviewPage(establishment.competitor_tag, $route.params.tag)" class="see__more text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">See more</a>
                        </div>
                    </aside> 
                </div> 
                <div v-else>Loading</div>
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
                    <DropdownComponent :showTitle="false" class="dropdown" title="Filter by plateform" placeholder="Select a website" :data="websites" @submit="(website)=>{
                        selectedWebsites = website
                        if(website == websites[0]){
                            globalComparison();
                        }else{
                            reloadComparisonByWebsite(website);
                        }
                    }" :default="websites[0]"/>
                    <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                                selectedTimePeriod = timePeriod
                        }" :default="timePeriods[0]"/>
                    <!-- <el-date-picker
                        v-model="date2"
                        type="daterange"
                        range-separator="To"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :size="'large'"
                        class="custom-date-picker"
                      /> -->
                    <div  class="date__picker">
                        <el-date-picker
                            v-model="start_date"
                            type="date"
                            placeholder="Select the start date"
                            :size="'large'"
                        />
                    </div>
                    <div class="date__picker">
                        <el-date-picker
                            v-model="end_date"
                            type="date"
                            placeholder="Select the end date"
                            :size="'large'"
                        />
                    </div>
            </div>
            <div class="tablet_mobile__head">
                <div class="establishment__info_tablet">
                        <label v-if="!dataLoading">{{ establishment.name }}</label>
                        <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                        <div>
                            <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span v-if="!dataLoading">{{ establishment.category }}</span>
                                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-48 mb-4"></span>
                        </div>
                        <div class="society__location" v-if="establishment.country != null">
                                <i class="uil uil-map"></i>
                                <span v-if="!dataLoading">{{ establishment.country }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div> 
                        <div class="society__location">
                                <i class="uil uil-location-point"></i>
                                <span v-if="!dataLoading">{{ establishment.address1 }}, {{ establishment.city }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                         <div class="society__location">
                                <i class="uil uil-favorite"></i>
                                <span v-if="!dataLoading" class="society__location">{{ all_items[0].value  }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                         <div class="society__location">
                            <i class="uil uil-comment-alt"></i>
                                <span v-if="!dataLoading">{{ all_items[1].value  }}</span>
                                 <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                         <div class="society__location">
                            <i class="uil uil-building"></i>
                            <span v-if="!dataLoading">{{ all_items[2].value  }} competitors</span>
                             <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                         </div>
                    </div>
                <div class="photo" v-if="!dataLoading">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
                <div class="photo" v-else>
                    <div role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
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
                    <a href="#" v-if="!dataLoading">
                        <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                        <div v-else role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <a href="#" v-else>
                        <div role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                            <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                            <div class="society__location">
                                <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                            </div>
                            <div class="society__location">
                                    <i class="uil uil-location-point"></i>
                                    <span v-if="!dataLoading" class="society__location">{{ establishment.address1 }}, {{ establishment.city }}</span>
                                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
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
                    <DropdownComponent class="dropdown" title="Filter by plateform" placeholder="Select a website" :data="websites" @submit="(website)=>{
                        selectedWebsites = website
                        if(website == websites[0]){
                            globalComparison();
                        }else{
                            reloadComparisonByWebsite(website);
                        }
                    }" :default="websites[0]"/>
                    <div class="date__filter">
                        <div class="text-sm title">Select a range of date</div>
                       <!--  <el-date-picker
                            v-model="date2"
                            type="daterange"
                            range-separator="To"
                            start-placeholder="Start date"
                            end-placeholder="End date"
                            :size="'large'"
                        /> -->
                        <el-date-picker
                            v-model="start_date"
                            type="date"
                            placeholder="Select the start date"
                            :size="'large'"
                        />
                        <el-date-picker
                            class="mt-2"
                            v-model="end_date"
                            type="date"
                            placeholder="Select the end date"
                            :size="'large'"
                        />
                        <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod)=>{
                                selectedTimePeriod = timePeriod
                        }" :default="timePeriods[0]"/>
                    </div>
                </div>
              <div class="rating__customers">
                <div class="title">Rating by Customers</div>
                <div class="chart__rating">
                    <Line :data="chartData" :options="chartConfig.options" />
                </div>
              </div>
              <div class="reviews__star">
                    <div :class="['flex items-center mt-1', 'include']" @click="starFilter(5)">
                        <a href="#" class="text-xs font-medium hover:underline">5 star</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate5*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium">{{ companiesStore.getNumberOfRating(reviews).rate5 }}</span>
                    </div>
                    <div :class="['flex items-center mt-1','include']" @click="starFilter(4)">
                        <a href="#" class="text-xs font-medium dark:text-blue-500 hover:underline">4 star</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate4*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium">{{ companiesStore.getNumberOfRating(reviews).rate4 }}</span>
                    </div>
                    <div :class="['flex items-center mt-1','include']" @click="starFilter(3)">
                        <a href="#" class="text-xs font-medium hover:underline">3 star</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate3*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium">{{ companiesStore.getNumberOfRating(reviews).rate3 }}</span>
                    </div>
                    <div :class="['flex items-center mt-1', 'include']" @click="starFilter(2)">
                        <a href="#" class="text-xs font-medium hover:underline">2 star</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate2*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium">{{ companiesStore.getNumberOfRating(reviews).rate2 }}</span>
                    </div>
                    <div :class="['flex items-center mt-1','include']" @click="starFilter(1)">
                        <a href="#" class="text-xs font-medium hover:underline">1 star</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{'width':`${companiesStore.getNumberOfRating(reviews).rate1*100/reviews.length}%`}"></div>
                        <span class="text-xs font-medium">{{ companiesStore.getNumberOfRating(reviews).rate1 }}</span>
                    </div>
              </div>
              <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData"/>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else/>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import DashboardComponent from '@Components/utils/DashboardComponent.vue';
import CommentPagination from '@Components/utils/CommentPagination.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import ComparisonChartComponent from '@Components/utils/ComparisonChartComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import {ref, reactive, watch, onBeforeMount, computed, provide, defineAsyncComponent} from 'vue';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css'

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

const page=ref({
    title1: "",
    title2: "",
    icon: "uil-estate",
});

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const SpinnerComponent = defineAsyncComponent(()=>
  import('@Components/utils/SpinnerComponent.vue')
)

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
const date = ref(moment(new Date(),'YYYY-MM-DD'));

let selected_date = reactive(moment());

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
let showWebsites = ref(false);
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

let establishment =ref({reviews:[]});
let reviews = ref([]);
let _reviews = computed(()=>{
    return reviews.value;
})
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
const dataLoading = ref(true)
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');
const date2 = ref([startDate, endDate]);

let start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
let end_date = ref(moment().format('YYYY-M-DD'));

let selectedTimePeriod = ref('');
let timePeriods = ref(['Days', 'Weeks','Months', 'Quarters', 'Semesters']);

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
        maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        }
    },
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
            data: companiesStore.getRatingLastMonthsV2(establishment.reviews, 6, date, true)
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
   
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    let endDate = new Date();
    
    if (date2.value.length > 0) {
        startDate = new Date(date2.value[0]);
        endDate = new Date(date2.value[1]);
    }

    all_items.value[2].value = competitors.value.length;
    all_items.value[1].value = establishment.value.totalReviews;
    all_items.value[0].value = establishment.value.rating;

    legendData.value = await companiesStore.generateLegend(comparisonData.value, colors);
    _legendData = legendData;
    
    lastReviews.value = companiesStore.getLastReviews(establishment.value.reviews, 100);
    await updateVisibleData(lastReviews.value);
    
    reviewFeedbackData.value = companiesStore.getfeedbackData(establishment.value.reviews);

    loadDatasets(_comparisonData, colors, selected_date);
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);

    appStore.isLoading = false;
};

const reloadComparison = async (competitor) => {
    selectedCompetitors.value = competitor.name;
    plotdata.value = [];
    comparisonData.value = [establishment.value, competitor];
    _comparisonData  = [establishment.value, competitor];
    
    let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
    let endDate = moment().format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
    legendData.value =  companiesStore.generateLegend(_comparisonData, colors);
}

const reloadComparisonByWebsite = async (website) => {
    selectedWebsites.value = website;
    showWebsites.value = !showWebsites.value;
    comparisonData.value = _comparisonData;

    const data = await new Promise((resolve) => {
        companiesStore.getReviewsByWebsite(comparisonData.value, selectedWebsites.value, (fetchedData) => {
            resolve(fetchedData);
        });
    });

    // Find the company matching the establishment ID
    const establishmentData = data.find(company => company.id === establishment.value.id);

    if (establishmentData) {
        all_items.value[1].value = establishmentData.reviews.length;
        all_items.value[0].value = companiesStore.calculateRatingV2(establishmentData.reviews);
        lastReviews.value = companiesStore.getLastReviews(establishmentData.reviews, 100);
        reviews.value = establishmentData.reviews;
        updateVisibleData(lastReviews.value);
        reviewFeedbackData.value = companiesStore.getfeedbackData(establishmentData.reviews);
    }

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    let endDate = new Date();
    if (date2.value.length > 0) {
        startDate = new Date(date2.value[0]);
        endDate = new Date(date2.value[1]);
    }

    // Perform async tasks concurrently
    await Promise.all([
        viewData(selectedTimePeriod.value, startDate, endDate, data),
        loadDatasets(data, colors, selected_date)
    ]);
};


const gotoReviewPage = (id, tag)=>{
    appStore.isLoading = true;
    setTimeout(()=>{
        router.push({
            name: 'Review',
            params:{
                id: id,
                tag: tag
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
    // let startDate = moment().subtract(180, 'days').format('YYYY-M-DD');
    // let endDate = moment().format('YYYY-M-DD');
    console.log(startDate, endDate)
    comparisonData.value = _comparisonData;
    if(date2.value){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
        const reviews = companiesStore.calculateReviewsV4(selectedTimePeriod.value, startDate, endDate, comparisonData.value).reviews;
        all_items.value[1].value = reviews.length;
        all_items.value[0].value = companiesStore.calculateRatingV2(reviews);
    }else{
         all_items.value[1].value = establishment.value.totalReviews;
         all_items.value[0].value = establishment.value.rating;  
         startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
         endDate = moment().format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

watch([start_date, end_date], ()=>{
 if(start_date.value !== '' && end_date.value !== ''){
        startDate = moment(start_date.value).format('YYYY-M-DD');
        endDate = moment(end_date.value).format('YYYY-M-DD');
        const reviews = companiesStore.calculateReviewsV4(selectedTimePeriod.value, startDate, endDate, comparisonData.value).reviews;
        all_items.value[1].value = reviews.length;
        all_items.value[0].value = companiesStore.calculateRatingV2(reviews);
 }else{
         all_items.value[1].value = establishment.value.totalReviews;
         all_items.value[0].value = establishment.value.rating; 
 }
 viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

// watch(selectedTimePeriod, ()=>{
//     let startDate = moment().subtract(180, 'days').format('YYYY-M-DD');
//     let endDate = moment().format('YYYY-M-DD');
//     comparisonData.value = _comparisonData;
//     if(date2.value){
//         startDate = moment(date2.value[0]).format('YYYY-M-DD');
//         endDate = moment(date2.value[1]).format('YYYY-M-DD');
//         plotdata.value = companiesStore.calculateReviewsV3(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
//     }else{
//         plotdata.value = companiesStore.calculateReviewsV3(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
//     }
   
// })

watch(selectedTimePeriod, ()=>{
    let startDate = moment().subtract(180, 'days').format('YYYY-M-DD');
    let endDate = moment().format('YYYY-M-DD');
    comparisonData.value = _comparisonData;
     if(start_date.value !== '' && end_date.value !== ''){
        startDate = moment(start_date.value).format('YYYY-M-DD');
        endDate = moment(end_date.value).format('YYYY-M-DD');
        plotdata.value = companiesStore.calculateReviewsV3(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
     }else{
        plotdata.value = companiesStore.calculateReviewsV3(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
     }
   
})

const goto = (value) =>{
    router.push({name: value});
};

let selectedStars = ref('0');
const starFilter = (star)=>{
    selectedStars.value = star;
};

const filterReviewsByStar = (star, data)=>{
    let result = [];
    data.forEach(review =>{
        let rating = companiesStore.formatRating(review.rating);
        rating = rating>5?rating/2:rating;
        if(Math.abs(rating) == star) result.push(review);
    })
    return result;
}
const reloadStarData = ()=>{
    let scores = [1,2,3,4,5];
    let filteredReviews = _reviews.value;
    let rating = scores.filter((element) => !selectedStars.value.includes(element));
    if (selectedStars.value.length > 0) {
        let result = filterReviewsByStar(rating, filteredReviews);
        filteredReviews = result;
    }
    updateVisibleData(filteredReviews);
}

watch(selectedStars, ()=>{
    let filteredReviews = _reviews.value;
    let result = filterReviewsByStar(selectedStars.value, filteredReviews);
    updateVisibleData(result);
});

onBeforeMount(async () => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
    )
    const companyId = route.params.id;
    let company = null;
    appStore.isLoading = true;
    reviews_loader.value = true;

    const response2 = await new Promise((resolve, reject) => {
        services.get_Record(`establishment/${companyId}/rating`, (response) => {
                resolve(response)
                 if(response.status == 404) {
                    exist.value = false;
                    appStore.isLoading = false;
                }
        });
    });

    if(response2.status == 200){
        establishment.value = response2.data;
        page.value.title2 = establishment.value.name;
        all_items.value[0].value = establishment.value.rating;
        all_items.value[1].value = establishment.value.totalReviews;
        appStore.isLoading = false;
        dataLoading.value = false;
    }

    const response = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/${companyId}/detail`, (response) => {
                resolve(response)
                console.log(response)
                 if(response.status == 404){
                    exist.value = false
                 }
        });
    });

    if(response.status == 200){
            establishment.value['reviews'] = response.data['reviews'];
            establishment.value['websites'] = response.data['websites'];
            establishment.value['competitors'] = response.data['competitors'];
            reviews.value = establishment.value.reviews;
            console.log(establishment.value.websites);

            if(establishment.value.websites != []){
                websites.value = ['Global',...companiesStore.getWebsites(establishment.value.websites)];
            }
            reloadStarData();
            let data = [];
            let promises = [];

            establishment.value.competitors.forEach(company=>{
               let promise = services.get_Record(`/establishment/${company.establishment_competitor_tag}/detail`, (response) => {
                        data.push(response.data);
                });
                promises.push(promise);  
            })

            Promise.all(promises).then(() => {
                    competitors.value = data;
                    reviews_loader.value = false;
                    globalComparison();
            });
     }
});
</script>

<style scoped>
*{
    transition: var(--transition);
}

img{
    height: 200px !important;
}

.include{
      cursor: pointer;
}

.include a{
    color: var(--color-primary);
}

.not__include a{
    color: var(--light-color-bg2);
}

.include .star__barre{
    background: var(--color-warning);
}

.not__include .star__barre{
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span{
    color: rgb(165, 165, 165);
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

.establishment__info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}
.establishment__info_tablet{
    margin-top: 30px;
}
.establishment__info i, .establishment__info_tablet i{
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label, .establishment__info_tablet label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div{
    font-size: 13px;
    font-weight: 500;
}

.establishment__info_tablet div{
    display: flex;
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
    display: flex;
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

.date__picker{
    width: 100% !important;
    margin: 0px 2px !important;
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
    height: 150px;
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

    .date__picker{
        margin: 5px 0 10px !important;
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

@media screen and (max-width:475px) {
   .app__container{
    overflow-x: hidden;
   }
}
.establishment__info_tablet{
    margin-top: 50px;
}
</style>