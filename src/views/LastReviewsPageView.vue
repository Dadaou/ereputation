<template>
    <div>
        <div class="title" style="width: 100%;">
            Last reviews
        </div>
        <div class="reviews__content">
            <!--<div class="reviews__pagination">
                <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" @prev="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" />
            </div>-->
            <LastReviewContent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                @reloadData="(review) => reloadData(review)" />
            <div v-else role="status"
                class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                v-for="index in 5" :key="index">
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
            <div class="reviews__pagination">
                <!--<PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" @prev="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" />-->
            </div>

        </div>
    </div>
</template>

<script setup>

import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import LastReviewContent from '@Components/utils/LastReviewContentComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';
import { ref, watch, onBeforeMount, inject, provide } from 'vue';


const companiesStore = useCompanyStore();
const appStore = useAppStore();
const customerTag = inject('tag')
const route = useRoute()
const router = useRouter()

let establishment = ref({})
let _reviews = ref([])
let dataReviews = ref([])
let reviews_loader = ref(true)
let visibleData = ref([])
let paginationConfig = ref({
    current: 0,
    size: 20,
    data: [],
    _data: []
});
let dataLoading = ref(true);

const start_date = inject('start_date')
const end_date = inject('end_date')

let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0,
    score:0
});

provide('reviewFeedbackData',reviewFeedbackData);

const language = inject('language')
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

appStore.setCurrentPage({
    title1: "",
    title2: "Reviews",
    icon: "uil-estate",
})

appStore.setIsExist(true)

const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

let updatePage = function (pageNumber) {
    paginationConfig.value.current = pageNumber;
    updateVisibleData(_reviews.value);
}

let updateVisibleData = function (_data, isStarFilter = false) {
    let data = paginationConfig.value;
    _reviews.value = _data
    if (isStarFilter == false) dataReviews.value = _reviews.value;

    paginationConfig.value.data = _data.slice(data.current * data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage(paginationConfig.value.current - 1);
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = false;
}

const options = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
})

const categories = ref([])
const categoryFilters = ref(['all'])

const loadReviews = async (page, limit, current) => {

    options.value.current = current;
    options.value.page = page;
    reviews_loader.value = true;
    feedbackLoading.value = true;

    let apiBase = '/customer/reviews/last';
    let apiParams = `page=${page}&limit=${limit}`;

   
    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });


    if (response.status == 200) {

        reviews_loader.value = false
        visibleData.value = response.data
        
    }
}

const feedbackLoading = ref(false)

const loadCategories = async (establishmentCompetitorTag) => {
    
        const api = `customer/establishment/categorizations?tag=${establishmentCompetitorTag}`
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response)
            });
        });

        if (response.status == 200) {
             if (response.data) {
                let cats=[];
                response.data.forEach((_cat,_index)=>{
                    cats.push({id:_index,category:_cat});
                });

                categories.value = cats;

                console.clear()
                console.log("Categories loaded: ", categories.value)

            }
        }

}

onBeforeMount(async () => {
    appStore.isLoading = false;
    await loadReviews(1, 1, 1)
})

</script>

<style scoped>
.fa-star{
    color:var(--color-warning);
}
.text-blue-500 {
  color: #4299e1;
}
@media screen and (max-width:1024px) {
    .tablet>div {
        height: 200px;
        margin: 0 !important;
        flex-basis: 30%
    }
}

.category-selector {
    width: 300px;
}

@media screen and (max-width: 425px) {
    .category-selector {
        width: 100%;
        margin-top: 8px;
    }
}
.reviews__content {
    margin: 0
}
@media screen and (min-width: 540px) and (max-width: 975px) {

    .establishment__info_tablet{
        margin-top:50px! important;
    }
    .smallClass{
        margin-top:10px! important;
        margin-bottom:10px;
    }
    .largeClass{
        margin-top:10px! important;
        margin-bottom:10px;
    }
}

@media screen  and (max-width: 520px) {

    .establishment__info_tablet{
        margin-top:50px! important;
    }
    .smallClass{
        margin-top:60px! important;
        margin-bottom:10px;
    }
    .largeClass{
        margin-top:60px! important;
        margin-bottom:10px;
    }
}



.smallClass{
    width: auto! important;
    height: 100%! important;
    border-radius: 10px;
}
.mediumClass {
    width: 90%; /* Occupe toute la largeur du conteneur */
    height: auto; /* Garde le ratio de l'image */
    border-radius: 10px;
}
.establishment__img{
    display:flex;
    justify-content:center;
    height: 160px;
    align-items:center;
}
.largeClass{
    width: 100%! important;
    height: auto! important;
    border-radius: 10px;
}
.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}
.fade-in.show {
    opacity: 1;
}

.society__location {
    font-size: 13px;
    font-weight: 500;
}

.title {
    font-size: 18px;
    color: var(--color-bg2);
    transform: var(--transition);
}
</style>
