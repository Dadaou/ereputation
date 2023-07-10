<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
           <div class="head">
                <div class="title">Reviews</div>
                <div class="date__range">
                    <VueDatePicker v-model="date" :format="format" range month-picker />
                </div>
           </div>
           <div class="reviews__statistics">
                <div class="reviews__statistics_item">
                    <h1>Total Reviews</h1>
                    <div class="statistic">
                        <div class="statistics__content flex items-center space-x-2">
                            <span class="value">10.0K</span>
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
                                <span class="value">4.0</span>  
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
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">70%</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">4</a>
                        <div class="h-2 bg-blue-300 rounded mx-4" style="width: 17%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">17%</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">3</a>
                        <div class="h-2 bg-yellow-300 rounded mx-4" style="width: 8%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">8%</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-pink-300 rounded mx-4" style="width: 4%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">4%</span>
                    </div>
                    <div class="flex items-center">
                        <a href="#" class="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline">2</a>
                        <div class="h-2 bg-red-300 rounded mx-4" style="width: 1%"></div>
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">1%</span>
                    </div>
                </div> 
           </div>
           <div class="all__reviews">
            <article v-for="review in reviews" v-if="reviews.length > 0">
                            <div class="flex items-center review__item">
                                <div class="flex items-center mb-6 space-x-4">
                                    <div class="space-y-1 font-medium dark:text-white">
                                        <p>{{ review.author }}</p>

                                        <ul class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <li class="flex items-center"><svg class="w-2.5 h-2.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                            </svg>{{ moment(review.created_at).format('D MMMM YYYY')}}</li>
                                            <li class="flex items-center"><svg aria-hidden="true" class="w-3 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path></svg>{{ review.source }}</li>
                                        </ul>
                                    </div>
                                </div>
                                <p class="bg-yellow-100 text-yellow-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-yellow-200 dark:text-yellow-800">{{ formatRating(review.rating) }}</p>
                            </div>
                            <div class="col-span-2 mt-6 md:mt-0">
                                <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
                            </div>
                        </article>
                        <article v-else>No reviews ...</article>
           </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponent.vue';
import {ref, onBeforeMount, onMounted} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useCompanyStore } from "@Stores/company.js";
import { useMediaStore } from "@Stores/media.js";
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';


const page=ref({
    title1: "",
    title2: "Reviews",
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

</style>