<template>
    <div class="left__side">
        <div class="head w-full">
            <div class="app__title">
                <h2>Reviews</h2>
            </div>
            <!-- <div class="category-selector">
                <el-select v-model="categoryFilters" multiple collapse-tags collapse-tags-tooltip filterable
                    :max-collapse-tags="3" placeholder="select categories" size="">
                    <el-option :label="'All'" :value="'all'" @click="handleCategoryDropdown('all')"
                        :disabled="categoryFilters.length > 1 && !categoryFilters.includes('all')" />
                    <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                        :value="item.category" @click="handleCategoryDropdown('other')" />
                </el-select>
            </div> -->
        </div>
        <div class="reviews__content">
            <div class="reviews__pagination">
                <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, categoryFilters)
                }" @prev="(option) => {
    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, categoryFilters)
}" />
            </div>
            <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
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
            <div v-if="visibleData.length == 0">
                No Reviews
            </div>
            <div class="reviews__pagination">
                <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, categoryFilters)
                }" @prev="(option) => {
    loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, categoryFilters)
}" />
            </div>
        </div>
    </div>
    <div class="tablet_mobile__filter tablet">
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }}
                </a>
                <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                    <div class="star__bar-fill h-3 bg-yellow-300 rounded" :style="{ 'width': `${star.percentage}%` }">
                    </div>
                </div>
                <span class="text-xs font-medium">{{ star.value }}</span>
            </div>
        </div>
        <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'filter'">
        <DropdownComponent :showTitle="false" class="dropdown w-full" title="Filter by plateform"
            placeholder="Select a website" :data="websites" @submit="(website) => {
                selectedWebsites = website
            }" :default="websites[0]" />
        <div class="date__picker px-2">
            <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
        </div>
        <div class="date__picker px-2">

            <el-date-picker v-model="dateEnd" placeholder="End date" :size="'large'" />
        </div>
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'feedback'">
        <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'star'">
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }}
                </a>
                <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                    <div class="star__bar-fill h-3 bg-yellow-300 rounded" :style="{ 'width': `${star.percentage}%` }">
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
                    :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
                <button :class="['btn', (currentFilter == 'star') ? 'isactive' : '']" @click="currentFilter = 'star'">
                    <i class="uis uil-star"></i> Stars
                </button>
                <button :class="['btn', (currentFilter == 'filter') ? 'isactive' : '']" @click="currentFilter = 'filter'">
                    <i class="uil uil-filter"></i>Filters
                </button>
            </div>
        </div>
        <div class="photo" v-if="!dataLoading">
            <div v-if="establishment.url_source !== null" class="establishment__img">
                <img :src="establishment.url_source" alt="" />
            </div>
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
        <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#" v-if="!dataLoading">
                <div v-if="establishment.url_source !== null" class="establishment__img">
                    <img :src="establishment.url_source" alt="" />
                </div>
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
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
            <DropdownComponent class="dropdown" title="Filter by sentiment analysis" placeholder="Select a sentiment"
                :data="feelings" @submit="(feeling) => {
                    selectedFeeling = feeling
                }" :default="feelings[0]" />

            <div class="date__filter">
                <div class="text-sm title">Filter by category</div>
                <el-select v-model="categoryFilters" multiple collapse-tags collapse-tags-tooltip filterable
                    :max-collapse-tags="3" placeholder="select categories" size="large">
                    <el-option :label="'All'" :value="'all'" @click="handleCategoryDropdown('all')"
                        :disabled="categoryFilters.length > 1 && !categoryFilters.includes('all')" />
                    <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                        :value="item.category" @click="handleCategoryDropdown('other')" />
                </el-select>
            </div>

            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" />
            </div>
        </div>
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }}
                </a>
                <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                    <div class="star__bar-fill h-3 bg-yellow-300 rounded" :style="{ 'width': `${star.percentage}%` }">
                    </div>
                </div>
                <span class="text-xs font-medium">{{ star.value }}</span>
            </div>
        </div>
        <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import CommentComponent from '@Components/utils/CommentComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import { ref, watch, onBeforeMount } from 'vue';
import { ElDatePicker, ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setCurrentPage({
    title1: "",
    title2: "Reviews",
    icon: "uil-estate",
});

appStore.setIsExist(true)

const route = useRoute();
appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Reviews",
        path: `${route.path}`,
        isCurrent: true
    }
])

const companyId = route.params.id;


let establishment = ref({});
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

let feelings = ref(['All', 'Positive', 'Neutre', 'Negative']);
let selectedFeeling = ref(null);
let selectedWebsites = ref('Global');
let websites = ref(['Global']);
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
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');
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

const categories = ref([])
const categoryFilters = ref(['all'])

const handleCategoryDropdown = (type) => {
    const filters = type == 'other' ? categoryFilters.value.filter(category => category != 'all') : ['all']
    categoryFilters.value = categoryFilters.value.length > 0 ? filters : ['all']
}

watch([dateStart, dateEnd, selectedWebsites, selectedFeeling, categoryFilters], () => {
    categoryFilters.value = categoryFilters.value.length > 0 ? categoryFilters.value : ['all']
    loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value, categoryFilters.value);

})

let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = star;
};

const reloadData = (reviewUpdated) => {
    visibleData.value.forEach((review, index) => {
        if (review.id == reviewUpdated.id) {
            visibleData.value[index].feeling = reviewUpdated.feeling;
        }
    })
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars, category) => {
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

    if (category != 'all') {
        apiParams += `&category=${category.join(',')}`
    }

    if (selectedFeeling.value && selectedFeeling.value != 'All') {
        apiParams += `&feeling=${selectedFeeling.value.toLowerCase()}`
    }

    const api = apiBase + '?' + apiParams;

    await loadFeelingData(tag, dateStart, dateEnd, source);
    await loadStarData(tag, dateStart, dateEnd, source);
    const response = await new Promise((resolve) => {
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
    loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value, categoryFilters.value);
});

const starsData = ref([]);
const feedbackLoading = ref(false)

const formatStarsData = (data) => {
    let tmp = []
    console.log(data)
    const total = Object.keys(data).reduce(function (previous, key) {
        return previous + data[key];
    }, 0);
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
        dateStart = moment().subtract(30, 'days').format('YYYY-M-DD');
        dateEnd = moment().format('YYYY-M-DD');
    }
    apiParams += `&fromDate=${dateStart}&toDate=${dateEnd}`;

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? source : source.toLowerCase();
        apiParams += `&platform=${source}`
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve) => {
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
            green = 255 - ((score * 100 * 255) / 100)
        } else {
            green = 255
            red = 255 - ((score * 100 * 255) / 100)
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
        dateStart = moment().subtract(30, 'days').format('YYYY-M-DD');
        dateEnd = moment().format('YYYY-M-DD');
    }
    apiParams += `&fromDate=${dateStart}&toDate=${dateEnd}`;

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? source : source.toLowerCase();
        apiParams += `&platform=${source}`
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve) => {
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

const loadCategories = async (tag) => {
    const api = `establishment/${tag}/categories`
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        if (response.data && response.data.data) {
            categories.value = response.data.data
        }
    }
}

onBeforeMount(async () => {
    appStore.isLoading = true;

    companiesStore.getEstablishment(companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            // page.value.title2 = establishment.value.name;
            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value.name,
                icon: "uil-estate",
            });

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Reviews",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
            dataLoading.value = false;
            websites.value = ['Global', 'App (Private)', ...establishment.value['websites']];

        }
    })

    await loadReviews(companyId, 1, options.value['rowLimit'], 1, dateStart.value, dateEnd.value, selectedWebsites.value, selectedStars.value, categoryFilters.value)
    await loadCategories(companyId)
});
</script>

<style scoped>
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
</style>
