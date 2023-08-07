<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
           <div class="head">
                <div class="title">Reviews</div>
                <!-- <div class="date__range">
                    <VueDatePicker v-model="date" :format="format" range month-picker />
                </div> -->
           </div>
           <div class="reviews__statistics">
                <div class="reviews__statistics_item">
                    <h1>Total Reviews</h1>
                    <div class="statistic">
                        <div class="statistics__content flex items-center space-x-2">
                            <span class="value">{{ parseFloat(reviews.length) }}</span>
                            <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                21%
                                <i class="uil uil-arrow-growth"></i>
                                <i v-show="false" class="uil uil-chart-down"></i>
                                <i v-show="false" class="uil uil-chart-down"></i>
                            </span>
                        </div>
                        <span class="description text-sm">Growth in reviews in this year</span>
                    </div>
                </div>
                <div class="reviews__statistics_item reviews__rating">
                    <h1>Average Rating</h1>
                    <div class="statistic">
                        <div class="statistics__content">   
                            <div class="flex items-center space-x-2">
                                <span class="value">{{ companiesStore.calculateRatingV2(reviews) }}</span>  
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                            </div>
                        </div>
                        <span class="description text-sm">Average rating on this year</span>
                    </div>
                </div>
                <div class="reviews__statistics_item reviews__stars">
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">5</a>
                        <div class="h-2 bg-green-300 rounded mx-4" style="width: 45%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate5 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">4</a>
                        <div class="h-2 bg-blue-300 rounded mx-4" style="width: 17%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate4 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">3</a>
                        <div class="h-2 bg-yellow-300 rounded mx-4" style="width: 8%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate3 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-pink-300 rounded mx-4" style="width: 4%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate2 }}</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-red-300 rounded mx-4" style="width: 1%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ companiesStore.getNumberOfRating(reviews).rate1 }}</span>
                    </div>
                </div> 
           </div>
           <div class="reviews__pagination">
            <CommentPagination  v-if="reviews.length > 0" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="reviews.length" :data="visibleData"></CommentPagination>
           </div>
           <div class="all__reviews">
            <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"/>
            <div v-else role="status" class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" v-for="index in 5">
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
           </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import CommentPagination from '@Components/utils/CommentPagination.vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import {ref, onBeforeMount, onMounted} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useCompanyStore } from "@Stores/company.js";
import { useMediaStore } from "@Stores/media.js";
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';


const page=ref({
    title1: "",
    title2: "",
    icon: "uil-estate",
});

const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Back",
        path: `/companies/${route.params.companyId}`,
        isCurrent: false,
    },
    {
        title: "Reviews",
        path: `${route.path}`,
        isCurrent: true
    }
]

const competitorStore = useCompetitorStore();
const companiesStore = useCompanyStore();
const mediaStore = useMediaStore();

const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

let establishment = ref({});
let reviews = ref([]);
let reviews_loader = ref(true);
let visibleData = ref([])
let paginationConfig = ref({
    current:0,
    size: 5,
    data: [],
    _data: []
})

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(reviews.value);
}


let updateVisibleData = function(_data){
    let data = paginationConfig.value;
    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = visibleData.value.length>0?false:true;
}


const format = (date) => {
  const startDate = new Date(date[0]).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  const endDate = new Date(date[1]).toLocaleString('en-US', { month: 'short', year: 'numeric' });
 

  return `${startDate} - ${endDate}`;
}

const formatRating = (rating) => {
    rating = parseFloat(rating);
    if(rating > 5){
        rating = rating / 2;
    }
    return rating.toFixed(1);
}

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
})

onBeforeMount(async()=>{
    const companyId = route.params.companyId;
    await companiesStore.fetchOne(companyId, async (company) => {
        establishment.value = company;
        reviews.value = company.reviews;
        page.value.title2 = company.name;
        updateVisibleData(reviews.value);
    });
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.app__container{
    margin-top: 3rem !important;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
}

.app__container .head{
    padding: 20px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.head .title{
    font-size: 22px;
    font-weight: 800;
    color: var(--color-danger);
    transition: var(--transition);
}

.reviews__statistics{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px !important;  
}

.reviews__statistics_item{
   flex-basis: 300px;
}

.statistics__content span.value{
   font-size: 20px;
   font-weight: bold;
}

.reviews__statistics_item h1{
    font-weight: 600;
    margin: 10px 0;
}

.reviews__statistics_item .description{
    font-weight: 600;
    margin: 10px 0;
    color: rgb(130, 138, 156);
}

.reviews__stars{
    align-self: flex-end;
}

.reviews__rating{
    align-self: center;
}

.all__reviews article{
   border: 1px solid var(--light-color-bg2);
   margin: 15px;
   border-radius: 10px;
   padding: 10px;
}

.review__item{
    justify-content: space-between !important;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}
</style>