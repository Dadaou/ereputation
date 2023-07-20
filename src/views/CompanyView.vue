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
                    <ComparisonChartComponent :data="plotdata" :width="chart__width" :height="chart__height" :establishment="establishment" :companies="comparisonData"/>
                </div>
                <BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
                </BaseLegend>
                <div class="rating__statistics">
                    <div class="rating__customers">
                        <div class="title">Rating by Customers</div>
                        <div class="chart__rating">
                            <Line :data="chartData" :options="chartConfig.options" />
                        </div>
                    </div>
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Last reviews</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <div class="reviews__pagination">
                        <CommentPagination  v-if="lastReviews.length > 0" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="lastReviews.length" :data="visibleData"></CommentPagination>
                    </div>
                    <CommentComponent :reviews="visibleData" :showEmoji="false"/>
                    <aside v-if="lastReviews.length > 0">
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{  all_items[1].value - 3 }} reviews remains</p>
                        <div class="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
                            <a @click="seeMoreReviews()" class="see__more text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">See more</a>
                        </div>
                    </aside>
                </div> 
            </div>
            <div class="right__side">
                <div class="establishment max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <img v-if="media.length > 0" class="rounded-t-lg" :src="media[0]" alt="" />
                        <img v-else :src="'https://images.pexels.com/photos/7070/space-desk-workspace-coworking.jpg'" alt="">
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
                    <DropdownComponent title="Compare to" placeholder="Select a competitor" :data="computedCompetitors" @submit="(competitor)=>{
                        selectedCompetitors = competitor.name
                        if(competitor.name == computedCompetitors[0].name){
                            globalComparison();
                        }else{
                            reloadComparison(competitor);
                        }
                    }" :defaultObj="computedCompetitors[0]" :isDataObject="true"/>
                    <DropdownComponent title="Filter by website" placeholder="Select a website" :data="websites" @submit="(website)=>{
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
                    <div class="type__filter">
                        
                    </div>
                </div>
              <div class="rating__customers">
                <div class="title">Rating by Customers</div>
                <div class="chart__rating">
                    <Line :data="chartData" :options="chartConfig.options" />
                </div>
              </div>
              <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData"/>
              <div class="community__feedback">
                <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">5</a>
                        <div class="h-2 bg-green-300 rounded mx-4" style="width: 45%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(establishment.reviews).rate5 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">4</a>
                        <div class="h-2 bg-blue-300 rounded mx-4" style="width: 17%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(establishment.reviews).rate4 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">3</a>
                        <div class="h-2 bg-yellow-300 rounded mx-4" style="width: 8%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(establishment.reviews).rate3 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-pink-300 rounded mx-4" style="width: 4%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(establishment.reviews).rate2 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-red-300 rounded mx-4" style="width: 1%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(establishment.reviews).rate1 }}</span>
                    </div>
              </div>
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
import {ref, reactive, watch, onBeforeMount, computed} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute, useRouter } from "vue-router";
import { useWindowSize } from '@vueuse/core';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
const companiesStore = useCompanyStore();
let showCompetitors = ref(false);
let showWebsites = ref(false);
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

let establishment =ref({reviews:[]});
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
    size: 3,
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
let name = ""

let reviewsConfidence = ref(0);
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

let colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890'];


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
    loadDatasets(_comparisonData, ['#6c63ff', '#f75842', '#aca8fd', '#424890'], selected_date);
 }else{
    plotdata.value = companiesStore.calculateReviewsV2(comparisonData.value, 6, moment(date.value, 'DD/MM/YYYY'), true);   
    loadDatasets(_comparisonData, ['#6c63ff', '#f75842', '#aca8fd', '#424890'], moment(date.value, 'DD/MM/YYYY'));
 }
});

const globalComparison = async () => {
    selectedCompetitors.value = 'Global';
    selectedWebsites.value = 'Global';
    
    plotdata.value = [];

    comparisonData.value = [establishment.value, ...competitors.value];
    _comparisonData = [establishment.value, ...competitors.value];
    console.log(comparisonData.value)
   
    // plotdata.value = companiesStore.calculateReviewsV2(comparisonData.value, 6, selected_date, true);
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);

    await companiesStore.generateLegend(comparisonData.value, (data) => {
        legendData.value = data;
        _legendData  = data;
    });
    all_items.value[2].value = competitors.value.length;
    all_items.value[1].value = establishment.value.reviews.length;
    all_items.value[0].value = companiesStore.calculateRatingV2(establishment.value.reviews);
    lastReviews.value = companiesStore.getLastReviews(establishment.value.reviews, 10);
    updateVisibleData(lastReviews.value);
    reviewFeedbackData.value = companiesStore.getfeedbackData(establishment.value.reviews);
    loadDatasets(_comparisonData, ['#6c63ff', '#f75842', '#aca8fd', '#424890'], selected_date);
}

onBeforeMount(async () => {
const companyId = route.params.id;
await companiesStore.fetchOne(companyId, async (company) => {
    establishment.value = company;
    page.value.title2 = company.name;
    establishment.value.media.forEach(item => {
        media.push(item.url_source);
    });
    companiesStore.calculateRating(establishment.value.reviews, (rating) =>{
        all_items.value[0].value = rating;
    });
    const competitorTag = `competitor_tag=${company.competitor_tag}`;
    await competitorStore.getAllCompetitors(competitorTag, (data) => {  
      data.forEach(element => {
        competitors.value.push(element);
      });
      globalComparison();
    });
    websites.value = ['Global',...companiesStore.getWebsites(establishment.value.websites)]
 });
})

const reloadComparison = async (competitor) => {
    selectedCompetitors.value = competitor.name;

    plotdata.value = [];
    
    comparisonData.value = [establishment.value, competitor];
    _comparisonData  = [establishment.value, competitor];
    
    // plotdata.value = companiesStore.calculateReviewsV2(comparisonData.value, 6, selected_date, true);
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value.length > 0){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
    legendData.value = _legendData.filter(e => e.name == establishment.value.name || e.name == competitor.name)
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
        // plotdata.value = companiesStore.calculateReviewsV2(data, 6, selected_date, true);
        loadDatasets(data, ['#6c63ff', '#f75842', '#aca8fd', '#424890'], selected_date);
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

const seeMoreReviews = ()=>{
    router.push(`/companies/${route.params.id}/reviews`)
}

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(lastReviews.value);
}


let updateVisibleData = function(_data){
    let data = paginationConfig.value;

    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size)
                

    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }

    visibleData.value = paginationConfig.value.data
}


watch(date2, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    console.log(startDate, endDate)
    comparisonData.value = _comparisonData;
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

watch(selectedTimePeriod, ()=>{
    let startDate = moment().startOf('year').format('YYYY-M-DD');
    let endDate = moment().endOf('year').format('YYYY-M-DD');
    if(date2.value){
        startDate = moment(date2.value[0]).format('YYYY-M-DD');
        endDate = moment(date2.value[1]).format('YYYY-M-DD');
    }
    comparisonData.value = _comparisonData;
    viewData(selectedTimePeriod.value, startDate, endDate, comparisonData.value);
});

const viewData = (timePeriod, startDate, endDate, data) => {
    plotdata.value = companiesStore.calculateReviewsV3(timePeriod, startDate, endDate, data);
}

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

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}

.rating__customers{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
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

/* .community__feedback{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: 125px;
    padding: 15px;
    margin: 15px auto;
}

.review-feedback__labels{
    flex-direction: row;
    display: flex;
    justify-content: space-between;
}

.review-feedback__labels span{
    margin: 0 !important;
} */

/* .review-feedback__negative{
    transform: rotate(180deg);
    transform-origin: center left;
    position: absolute;
    left: 50%;
}

.review-feedback__positive{
    position: absolute;
    left: 50%; 
} */

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

.see__more{
    cursor: pointer;
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
.dp__theme_light {
    --dp-primary-color: var(--color-danger) !important;
    --dp-primary-text-color: #f8f5f5 !important;
 }
</style>