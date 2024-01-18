<template>
    <div class="main__container" v-if="exist">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="app__container">
            <div class="left__side">
                <div class="head">
                    <div class="app__title">
                        <h2>Reviews</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <div class="reviews__pagination">
                        <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                            loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars)
                        }" @prev="(option) => {
    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars)
}" />
                    </div>
                    <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                        @reloadData="(review) => reloadData(review)" />
                    <div v-else role="status"
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
                    <div v-if="visibleData.length == 0">
                        No Reviews
                    </div>
                    <div class="reviews__pagination">
                        <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                            loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars)
                        }" @prev="(option) => {
    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars)
}" />
                    </div>
                </div>
            </div>
            <div class="tablet_mobile__filter tablet">
                <!--  <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" :class="['flex items-center mt-1', 'include']"
                        @click="starFilter(star.intVal)">
                        <a href="#" class="text-xs font-medium hover:underline">{{ star.label }}</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{ 'width': `${star.percentage}%` }">
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div> -->
                <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                            {{ star.label }}
                        </a>
                        <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                            <div class="star__bar-fill h-3 bg-yellow-300 rounded"
                                :style="{ 'width': `${star.percentage}%` }">
                            </div>
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div>
                <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
            </div>
            <div class="tablet_mobile__filter" v-if="currentFilter == 'filter'">
                <DropdownComponent :showTitle="false" class="dropdown" title="Filter by plateform"
                    placeholder="Select a website" :data="websites" @submit="(website) => {
                        selectedWebsites = website
                    }" :default="websites[0]" />
                <div class="date__picker">
                    <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                </div>
                <div class="date__picker">
                    <el-date-picker v-model="dateEnd" placeholder="End date" :size="'large'" />
                </div>
            </div>
            <div class="tablet_mobile__filter" v-if="currentFilter == 'feedback'">
                <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
            </div>
            <div class="tablet_mobile__filter" v-if="currentFilter == 'star'">
                <!-- <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" :class="['flex items-center mt-1', 'include']"
                        @click="starFilter(star.intVal)">
                        <a href="#" class="text-xs font-medium hover:underline">{{ star.label }}</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{ 'width': `${star.percentage}%` }">
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div> -->
                <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                            {{ star.label }}
                        </a>
                        <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                            <div class="star__bar-fill h-3 bg-yellow-300 rounded"
                                :style="{ 'width': `${star.percentage}%` }">
                            </div>
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div>
            </div>
            <div class="tablet_mobile__head">
                <div class="establishment__info_tablet">
                    <label v-if="!dataLoading">{{ establishment.name }}</label>
                    <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                    <div>
                        <i
                            :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
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
                        <span v-if="!dataLoading">{{ establishment.city }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-favorite"></i>
                        <span v-if="!dataLoading" class="society__location">{{ all_items[0].value }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-comment-alt"></i>
                        <span v-if="!dataLoading">{{ all_items[1].value }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-building"></i>
                        <span v-if="!dataLoading">{{ all_items[2].value }} competitors</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="mobile__filter__btn">
                        <button :class="['btn', (currentFilter == 'feedback') ? 'isactive' : '']"
                            @click="currentFilter = 'feedback'">
                            <i class="uil uil-arrow-growth"></i>
                            <!--  <i class="uil uil-chart-down"></i> -->
                            Stat
                        </button>
                        <button :class="['btn', (currentFilter == 'star') ? 'isactive' : '']"
                            @click="currentFilter = 'star'">
                            <i class="uis uil-star"></i> Stars
                        </button>
                        <button :class="['btn', (currentFilter == 'filter') ? 'isactive' : '']"
                            @click="currentFilter = 'filter'">
                            <i class="uil uil-filter"></i>Filters
                        </button>
                    </div>
                </div>
                <div class="photo" v-if="!dataLoading">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="photo" v-else>
                    <div role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="right__side">
                <div
                    class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#" v-if="!dataLoading">
                        <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                        <div v-else role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <a href="#" v-else>
                        <div role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                        <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                        <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                        <div class="society__location">
                            <i
                                :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                            <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                        <div class="society__location">
                            <i class="uil uil-location-point"></i>
                            <span v-if="!dataLoading" class="society__location">{{
                                establishment.city }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                    </div>
                    <DropdownComponent class="dropdown" title="Filter by plateform" placeholder="Select a website"
                        :data="websites" @submit="(website) => {
                            selectedWebsites = website
                        }" :default="websites[0]" />
                    <div class="date__filter">
                        <div class="text-sm title">Select a date range</div>
                        <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                        <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" />
                    </div>
                </div>
                <!--  <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" :class="['flex items-center mt-1', 'include']"
                        @click="starFilter(star.intVal)">
                        <a href="#" class="text-xs font-medium hover:underline">{{ star.label }}</a>
                        <div class="star__barre h-3 rounded mx-2" :style="{ 'width': `${star.percentage}%` }">
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div> -->
                <div class="reviews__star">
                    <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                        <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                            {{ star.label }}
                        </a>
                        <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                            <div class="star__bar-fill h-3 bg-yellow-300 rounded"
                                :style="{ 'width': `${star.percentage}%` }">
                            </div>
                        </div>
                        <span class="text-xs font-medium">{{ star.value }}</span>
                    </div>
                </div>
                <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
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
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import { ref, reactive, watch, onBeforeMount, computed, provide, defineAsyncComponent } from 'vue';
import { ElDatePicker } from 'element-plus';


const page = ref({
    title1: "",
    title2: "",
    icon: "uil-estate",
});

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Back",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Reviews",
        path: `${route.path}`,
        isCurrent: true
    }
]
const companyId = route.params.id;
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();

let establishment = ref({});
let reviews = ref([]);
let _reviews = ref([]);
let dataReviews = ref([]);
let reviews_loader = ref(true);
let visibleData = ref([])
let paginationConfig = ref({
    current: 0,
    size: 5,
    data: [],
    _data: []
});
let dataLoading = ref(true);
let currentFilter = ref('filter');

let checkedFeeling = ref(['positive', 'neutre', 'negative']);
const showModal = ref(false);
let selectedWebsites = ref('Global');
let websites = ref(['Global']);
let media = [];
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

const dateStart = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
const dateEnd = ref(moment().format('YYYY-M-DD'));
const enableDateEnd = ref(false);
const downloaded = ref(false);
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

const options = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
})

const format2 = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const handleDate = (modelData) => {
    enableDateEnd.value = (modelData != null) ? true : false;
    dateEnd.value = null;
}

watch([dateStart, dateEnd, selectedWebsites, checkedFeeling], () => {
    loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value);
})

let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = star;
};

const filterReviewsByStar = (star, data) => {
    let result = [];
    data.forEach(review => {
        let rating = companiesStore.formatRating(review.rating);
        rating = rating > 5 ? rating / 2 : rating;
        if (Math.abs(rating) == star) result.push(review);
    })
    return result;
}

const reloadStarData = () => {
    let scores = [1, 2, 3, 4, 5];
    let filteredReviews = _reviews.value;
    let rating = scores.filter((element) => !selectedStars.value.includes(element));
    if (selectedStars.value.length > 0) {
        let result = filterReviewsByStar(rating, filteredReviews);
        filteredReviews = result;
    }
}

const reloadData = (reviewUpdated) => {
    visibleData.value.forEach((review, index) => {
        if (review.id == reviewUpdated.id) {
            visibleData.value[index].feeling = reviewUpdated.feeling;
        }
    })
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars) => {
    options.value.current = current;
    options.value.page = page;
    reviews_loader.value = true;

    let apiBase = '/review/by_establishment';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? 'App (Private)' : source.toLowerCase();
        apiParams += `&platform=${source}`
    }

    if (IsValueOkay(stars)) {
        apiParams += `&star=${stars}`
    }

    const api = apiBase + '?' + apiParams;

    await loadFeelingData(tag, dateStart, dateEnd, source);
    await loadStarData(tag, dateStart, dateEnd, source);
    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        reviews_loader.value = false;
        options.value.max = response.data['count'];
        visibleData.value = response.data['data'];
    }
}

watch(selectedStars, () => {
    loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value);
});

const starsData = ref([]);
const starsLoading = ref(false);
const feedbackLoading = ref(false)

const formatStarsData = (data) => {
    let tmp = []
    console.log(data)
    const total = Object.keys(data).reduce(function (previous, key) {
        return previous + data[key];
    }, 0);
    console.log(total)
    Object.keys(data).forEach(k => {
        tmp.push({
            label: k,
            value: data[k],
            percentage: data[k] * 100 / total,
            intVal: k.split()[0]
        })
    })
    return tmp;

}

const loadFeelingData = async (tag, dateStart, dateEnd, source) => {
    let apiBase = 'charts/feeling';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
    } else {
        startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
        endDate = moment().format('YYYY-M-DD');
    }
    apiParams += `&fromDate=${dateStart}&toDate=${dateEnd}`;

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? source : source.toLowerCase();
        apiParams += `&platform=${source}`
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        const score = response.data[tag]
        let rawWidth = score * 100 / 2
        let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
        let feeling = rawWidth > 0 ? 1 : -1
        let red = 255
        let green = 255
        if (feeling == -1) {
            red = 255
            green = 0
        } else {
            green = 255
            red = 0
        }

        reviewFeedbackData.value = {
            width: width,
            red: red,
            green: green,
            feeling: feeling,
            score: score
        }

        feedbackLoading.value = false
    }
}


const loadStarData = async (tag, dateStart, dateEnd, source) => {
    let apiBase = 'charts/stars';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
    } else {
        startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
        endDate = moment().format('YYYY-M-DD');
    }
    apiParams += `&fromDate=${dateStart}&toDate=${dateEnd}`;

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? source : source.toLowerCase();
        apiParams += `&platform=${source}`
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        if (response.data && response.data.data) {
            starsData.value = formatStarsData(response.data.data)
        }
    }
}

onBeforeMount(async () => {
    let company = null;
    appStore.isLoading = true;

    companiesStore.getEstablishment(companyId).then((data) => {

        if (data == false) {
            exist.value = false;
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            page.value.title2 = establishment.value.name;
            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;
            websites.value = ['Global', 'App (Private)', ...establishment.value['websites']];

        }
    })

    await loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value);

    // const response3 = await new Promise((resolve, reject) => {
    //     services.get_Record(`charts/stars?tag=${companyId}`, (response) => {
    //         resolve(response)
    //     });
    // });

    // if (response3.status == 200) {
    //     if (response3.data && response3.data.data) {
    //         starsData.value = formatStarsData(response3.data.data)
    //         starsLoading.value = false
    //     }
    // }

    // const response4 = await new Promise((resolve, reject) => {
    //     services.get_Record(`charts/feeling?tag=${companyId}`, (response) => {
    //         resolve(response)
    //     });
    // });

    // if (response4.status == 200) {
    //     const score = response4.data[companyId]
    //     let rawWidth = score * 100 / 2
    //     let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
    //     let feeling = rawWidth > 0 ? 1 : -1
    //     let red = 255
    //     let green = 255
    //     if (feeling == -1) {
    //         red = 255
    //         green = 0
    //     } else {
    //         green = 255
    //         red = 0
    //     }

    //     reviewFeedbackData.value = {
    //         width: width,
    //         red: red,
    //         green: green,
    //         feeling: feeling,
    //         score: score
    //     }

    //     feedbackLoading.value = false

    // }
});
</script>

<style scoped>
* {
    transition: var(--transition);
}

img{
    height: 200px !important;
}

.tablet,
.mobile__filter__btn {
    display: none !important;
}

.mobile__filter__btn button {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    flex-basis: 100%;
}

.isactive,
.mobile__filter__btn button:hover {
    background-color: var(--color-primary);
    color: white !important;
}

.isactive i,
.mobile__filter__btn button:hover i {
    color: white !important;
}

.include {
    cursor: pointer;
}

.include a {
    color: var(--color-primary);
}

.not__include a {
    color: var(--light-color-bg2);
}

.include .star__barre {
    background: var(--color-warning);
}

.not__include .star__barre {
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span {
    color: rgb(165, 165, 165);
}

.temp__p {
    font-size: 14px;
    color: var(--color-bg1);
    font-weight: 500;
}

.temp__p a:hover {
    background-color: var(--color-danger);
    color: white;
}

.temp__p a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
}

.app__container {
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
}

.reviews__content p {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-bg1);
}

.reviews__content a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}

.reviews__content a:hover {
    background-color: var(--color-danger);
    color: white;
}

.reviews__pagination {
    display: flex;
    justify-content: flex-end;
}

.rating__customers {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
}

.establishment {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}

.establishment__info i,
.establishment__info_tablet i {
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label,
.establishment__info_tablet label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div {
    font-size: 13px;
    font-weight: 500;
}

.establishment__info_tablet div {
    display: flex;
}

.date__filter .title {
    font-weight: 600;
}

.filter__content .title {
    font-weight: 500;
}

.filter__content {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.rating__customers .title {
    font-size: 15px;
    font-weight: 600;
    margin-left: 15px;
    margin-top: 15px;
}

.reviews__content1 .review span {
    font-size: 12px;
    margin: auto;
}

.community__feedback .title {
    font-size: 15px;
    font-weight: 600;
}

.community__feedback h2 {
    font-size: 14px;
    font-weight: 500;
}

.legend {
    margin: 15px auto;
}

.comment {
    overflow: hidden;
    text-align: justify;
}

.app__title {
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1 {
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2 {
    font-size: 18px;
    transition: var(--transition);
}

.left__side {
    width: 100%;
    padding: 50px 5px;
}

.left__side .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

#website__dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#dropdownDivider {
    position: absolute;
}

#dropdownDivider li {
    cursor: pointer;
    padding: 5px 10px;
    margin: auto;
    transform: var(--transition);
}

#dropdownDivider li:hover {
    background-color: var(--color-danger);
    color: var(--color-white);
}

.dashboard__content {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 50px auto;
}

.counter {
    flex-grow: 1;
}

.reviews__content {
    margin-top: 20px;
}

.rating {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
}

.right__side {
    width: 500px;
    padding: 50px 0px;
}

.rating__statistics {
    display: none;
    margin-bottom: 15px;
    transition: var(--transition);
}

.filter__container {
    display: none;
    transition: var(--transition);
}

.see__more {
    cursor: pointer;
}

.society__name {
    margin: 5px 0;
    display: flex;
}

.tablet_mobile__head,
.tablet_mobile__filter {
    display: none;
}

.society__location {
    display: flex;
}

.society__location span {
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

.date__picker {
    width: 100% !important;
    margin: 0px 2px !important;
}

@media screen and (max-width:1400px) {
    .app__container {
        width: var(--container-width-md);
    }

    .breadcrumb__container {
        width: var(--container-width-md);
    }
}

@media screen and (max-width:1287px) {
    .counter {
        gap: 2rem !important;
    }

    .right__side {
        width: 300px !important;
    }
}


@media screen and (max-width:1024px) {

    .right__side {
        width: 250px !important;
    }

    .tablet {
        display: flex !important;
        align-items: center;
        vertical-align: center;
        flex-wrap: wrap !important;
        flex-direction: horizontal;
        gap: 3px !important;
    }

    .tablet>div {
        height: 200px;
        margin: 0 !important;
        flex-basis: 30%
    }
}

@media screen and (max-width: 975px) {
    .app__container {
        flex-direction: column-reverse;
        width: 95% !important;
        justify-content: center;
        align-items: center;
    }

    .left__side {
        width: inherit !important;
    }

    .photo {
        flex-basis: 250px;
    }

    .photo div {
        height: 100%;
    }

    .photo img {
        height: 150px;
        width: 100%;
    }

    .dashboard__content,
    .dashboard,
    .right__side {
        display: none !important;
    }

    .tablet_mobile__head {
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

    .tablet_mobile__head label {
        font-size: 17px !important;
    }

    .tablet_mobile__head span {
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter {
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter * {
        flex-basis: 200px;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head {
        font-size: 13px !important;
    }

    .tablet_mobile__head label {
        font-size: 15px !important;
    }

    .tablet_mobile__filter {
        gap: 0.25rem;
    }

    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
    }

    .tablet {
        display: none !important;
    }

    .mobile__filter__btn {
        display: flex !important;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 10px;
    }

    .photo {
        flex-basis: 210px !important;
    }

    .tablet_mobile__head label {
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter {
        flex-direction: column;
        padding: 5px 0px !important;
    }

    .tablet_mobile__filter * {
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }

    .date__picker {
        margin: 5px 0 10px !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head {
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo {
        flex-basis: 150px !important;
        height: 100px !important;
    }
}

.establishment__info_tablet {
    margin-top: 10px;
}</style>
