<template>
    <div class="left__side">
        <div class="reviews__content">
            <div class="reviews__pagination">
                <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" @prev="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" />
            </div>
            <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                @reloadData="(review) => reloadData(review)" :categories="categories" />
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
            <div class="no-comment" v-if="visibleData.length == 0">
                No reviews meet to the current filters
            </div>
            <div class="reviews__pagination">
                <PaginationComponent :options="options" v-if="visibleData.length > 0" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" @prev="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                }" />
            </div>
        </div>
    </div>
    <div class="tablet_mobile__filter tablet">
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" :style="{'width':'8%'}" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }} <i class="fa fa-star " aria-hidden="true"></i>
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

          <!--     <DropdownComponent :showTitle="false" class="dropdown w-full" title="Filter by plateform"
            placeholder="Select a website" :data="formattedWebsites" @submit="(website) => {
                selectedWebsites = website
            }" :default="formattedWebsites[0]" /> -->

        <div class="date__picker px-2">
            <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
        </div>
        <div class="date__picker px-2">

            <el-date-picker v-model="end_date" placeholder="End date" :size="'large'" />
        </div>
        <div class="px-2 w-full my-2">
            <el-select v-model="categoryFilters" multiple collapse-tags collapse-tags-tooltip filterable
                :max-collapse-tags="3" placeholder="select categories" size="large">
                <el-option :label="'All'" :value="'all'" @click="handleCategoryDropdown('all')"
                    :disabled="categoryFilters.length > 1 && !categoryFilters.includes('all')" />
                <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                    :value="item.category" @click="handleCategoryDropdown('other')" />
            </el-select>
        </div>
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'feedback'">
        <CommunityFeedbackComponent :reviewFeedbackData="reviewFeedbackData" />
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'star'">
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" :style="{'width':'8%'}" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }} <i class="fa fa-star " aria-hidden="true"></i>
                </a>
                <div class="star__bar h-3 bg-gray-200 rounded mx-2 flex-grow">
                    <div class="star__bar-fill h-3 bg-yellow-300 rounded" :style="{ 'width': `${star.percentage}%` }">
                    </div>
                </div>
                <span class="text-xs font-medium">{{ star.value }}</span>
            </div>
        </div>
    </div>
    <EstablishmentInfoMobile :establishment="establishment" :isLoading="dataLoading">
        <template #btn>
            <div class="mobile__filter__btn">
                <button :class="['btn', (currentFilter == 'feedback') ? 'isactive' : '']"
                    @click="currentFilter = 'feedback'">
                    <i class="uil uil-arrow-growth"></i>
                    Stat
                </button>
                <button :class="['btn', (currentFilter == 'star') ? 'isactive' : '']" @click="currentFilter = 'star'">
                    <i class="uis uil-star"></i> Stars
                </button>
                <button :class="['btn', (currentFilter == 'filter') ? 'isactive' : '']"
                    @click="currentFilter = 'filter'">
                    <i class="uil uil-filter"></i>Filters
                </button>
            </div>
        </template>
    </EstablishmentInfoMobile>
    <div class="right__side">
        <div
            class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#" v-if="!dataLoading">
                <div v-if="establishment.url_source !== null" class="establishment__img">
                    <img :src="establishment.url_source" id="logoimage" :class="widthimage(establishment.url_source)" alt="" />
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
                <div class="society__location" v-if="establishment.country != null">
                    <i class="uil uil-map"></i>
                    <span v-if="!dataLoading" class="society__location">
                        {{ establishment.country }}</span>
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
                 <div class="text-sm title">Filter by plateform</div>
               <DropdownComponent :showTitle="false" class="dropdown w-full" title="Filter by plateform"
            placeholder="Select a website" :data="websites" @submit="(website) => {
                selectedWebsites = website
            }" :default="websites[0]" />
              </div>

            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" placeholder="End date" :size="'large'" />
            </div>
        </div>
        <div class="reviews__star">
            <div v-for="star in starsData" :key="star.label" class="flex items-center mt-1">
                <a href="#" :style="{'width':'8%'}" :class="{ 'text-blue-500': selectedStars === star.intVal }" class="text-xs font-medium hover:underline" @click.prevent="starFilter(star.intVal)">
                    {{ star.label }} <i class="fa fa-star " aria-hidden="true"></i>
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
import { ref, watch, onBeforeMount, inject,provide, defineAsyncComponent, onMounted,computed } from 'vue';
import { ElDatePicker, ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'


const EstablishmentInfoMobile = defineAsyncComponent(
    () => import("@Components/utils/EstablishmentInfoMobile.vue")
)

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setCurrentPage({
    title1: "",
    title2: "Reviews",
    icon: "uil-estate",
});

appStore.setIsExist(true)
const customerTag = inject('tag')





const route = useRoute();
const starParams = route.query.star;
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

const platform = computed(() => route.query.platform);

let establishment = ref({});
let _reviews = ref([]);
let dataReviews = ref([]);
let reviews_loader = ref(true);
let visibleData = ref([])
let paginationConfig = ref({
    current: 0,
    size: 20,
    data: [],
    _data: []
});
let dataLoading = ref(true);
let currentFilter = ref('filter');
const language = inject('language')
let feelings = ref(['All', 'Positive', 'Neutral', 'Negative']);
let selectedFeeling = ref(null);
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

const formattedWebsites = computed(() => {
    return websites.value.map(website => formatString(website));
});
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

// const dateStart = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
// const dateEnd = ref(moment().format('YYYY-M-DD'));
// let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
// let endDate = moment().format('YYYY-M-DD');
const start_date = inject('start_date');
const end_date = inject('end_date');
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0,
    score:0
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

watch([start_date, end_date, selectedWebsites, selectedFeeling, categoryFilters], () => {
    categoryFilters.value = categoryFilters.value.length > 0 ? categoryFilters.value : ['all']
    loadReviews(companyId, 1, options.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value);
})

let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = star;
};

onMounted(()=>{
    const {stars} = route.query
    if(stars) starFilter(route.query.stars)
})

const reloadData = (reviewUpdated) => {
    visibleData.value.forEach((review, index) => {
        if (review.id == reviewUpdated.id) {
            visibleData.value[index].feeling = reviewUpdated.feeling;
        }
    })
}

const calculSentimentAnalysis = (_score) =>{

        
        let rawWidth = _score * 100 / 2
        let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
        let feeling = rawWidth > 0 ? 1 : -1
        let red = 255
        let green = 255
        if (feeling == -1) {
            red = 255
            green = 255 - ((_score * 100 * 255) / 100)
        } else {
            green = 255
            red = 255 - ((_score * 100 * 255) / 100)
        }

       let _reviewFeedbackData = {
            width: width,
            red: red,
            green: green,
            feeling: feeling,
            score: _score
        }

        return _reviewFeedbackData;
        
}

const updateFeeling = (newFeedbackData) =>{
   
    reviewFeedbackData.value = newFeedbackData;
}

provide('reviewFeedbackData',reviewFeedbackData);
provide('calculSentimentAnalysis',calculSentimentAnalysis);

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars, category, language) => {
    options.value.current = current;
    options.value.page = page;
    reviews_loader.value = true;
     feedbackLoading.value = true;

    let apiBase = '/review/by_establishment';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    if (route.params.type === 'intern') {
        source = 'App (Private)';
        selectedWebsites.value='App (Private)';
    } else {


         if (IsValueOkay(source)) {
            source = (source == 'App (Private)') ? 'App (Private)' : source.toLowerCase();
            // apiParams += `&platform=${source}`
        }else{
            source = IsValueOkay(platform.value) ? platform.value : 'all';
        }

        
    }

    if (source !== 'App (Private)') {
        source = source.toLowerCase();
    }

    apiParams += `&platform=${source}`;

    
    const isValueOkay = (value) => (value !== '' && value !== null && value !== undefined && value !== 'Global' && value !== 0);

   
    let starQueryPart = '';

    if (isValueOkay(starParams)) {
        starQueryPart = `&star=${starParams} stars`;
        
    } else if (isValueOkay(stars) || route.query.star_filter) {
       
        if (route.query.star_filter) {
            
            starQueryPart = `&star=${route.query.star_filter}`;

             console.log("star filter",route.query.star_filter)
        } else {
            starQueryPart = `&star=${stars}`;
             console.log("stars filter",stars)
        }
       
    }

    if(route.query.stars){
        apiParams += `&via=myqrcode`;
    }

    if (starQueryPart) {
        apiParams += starQueryPart;
    }

    // if (IsValueOkay(stars)) {
    //     apiParams += `&star=${stars}`
    // }

    // console.log(starParams)
    // if (starParams) {
    //     apiParams += `&star=${starParams} star`
    // }

    if (category != 'all') {
        apiParams += `&category=${category.join(',')}`
    }

    if (selectedFeeling.value && selectedFeeling.value != 'All') {
        selectedFeeling.value = selectedFeeling.value == 'neutral' ? 'neutre' : selectedFeeling.value
        apiParams += `&feeling=${selectedFeeling.value.toLowerCase()}`
    }

    if (route.params.type == 'intern') {
        apiParams += `&via=myqrcode`;
    }

    if (route.params.type == 'alert') {
        apiParams += `&via=myqrcode`;
    }
    // if(IsValueOkay(language)){
    //         apiParams += `&language=${language}`
    // }

    const api = apiBase + '?' + apiParams;
    console.log(api)

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
        let feeling_score = calculSentimentAnalysis(response.data['feeling_score']);
       reviewFeedbackData.value = feeling_score;
        feedbackLoading.value = false
    }
}

watch(selectedStars, () => {
    loadReviews(companyId, 1, options.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value);
});

const starsData = ref([]);
const feedbackLoading = ref(false)

const formatStarsData = (data) => {
    let tmp = []
    const total = Object.keys(data).reduce(function (previous, key) {
        return previous + data[key];
    }, 0);
    Object.keys(data).forEach(k => {
        tmp.push({
            label: k[0],
            value: data[k],
            percentage: (data[k] == 0) ? 0 : (data[k] * 100 / total),
            intVal: k.split()[0]
        })
    })
    return tmp;

}

const loadFeelingData = async (tag, dateStart, dateEnd, source) => {
    let apiBase = 'charts/feeling';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
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

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        // const score = response.data[tag]
        // let rawWidth = score * 100 / 2
        // let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
        // let feeling = rawWidth > 0 ? 1 : -1
        // let red = 255
        // let green = 255
        // if (feeling == -1) {
        //     red = 255
        //     green = 255 - ((score * 100 * 255) / 100)
        // } else {
        //     green = 255
        //     red = 255 - ((score * 100 * 255) / 100)
        // }



        // reviewFeedbackData.value = {
        //     width: width,
        //     red: red,
        //     green: green,
        //     feeling: feeling,
        //     score: score
        // }

        // feedbackLoading.value = false
    }
}


const loadStarData = async (tag, dateStart, dateEnd, source) => {
    let apiBase = 'charts/stars';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
    } else {
        dateStart = moment().subtract(30, 'days').format('YYYY-M-DD');
        dateEnd = moment().format('YYYY-M-DD');
    }
    apiParams += `&fromDate=${dateStart}&toDate=${dateEnd}`;

    if (IsValueOkay(source)) {
        source = (source == 'App (Private)') ? source : source.toLowerCase();
        apiParams += `&platform=${source}`
    }



    if (IsValueOkay(starParams)) {
        apiParams += `&star=${starParams} stars`;
        
    } else if (IsValueOkay(selectedStars.value) || route.query.star_filter) {
       
        if (route.query.star_filter) {
            
            apiParams += `&star=${route.query.star_filter}`;

        } else {
            apiParams += `&star=${selectedStars.value}`;
        }
       
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    
    if (response.status == 200) {
        if (response.data && response.data.data) {
            starsData.value = formatStarsData(response.data.data);
            if (selectedStars.value === '0') {
                return starsData.value;
            } else {
                const filtre = starsData.value.filter(star => {
                     return parseInt(star.label) === parseInt(selectedStars.value);
                });
                starsData.value = filtre;
                console.log()
                return starsData.value = filtre;
            }
        }
    }
}
// onBeforeMount(async (tag, dateStart, dateEnd, source) => {
//   await loadStarData("66a246fe4c106", dateStart, dateEnd, source);
// });
const loadCategories = async (tag) => {
      const api = `customer/establishment/categorizations?tag=${tag}`
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
            }
            // if (response.data && response.data.data) {
            //     categories.value = response.data.data
            // }
        }
    // const api = `establishment/${tag}/categories`
    // const response = await new Promise((resolve) => {
    //     services.get_Record(api, (response) => {
    //         resolve(response)
    //     });
    // });

    // if (response.status == 200) {
    //     if (response.data && response.data.data) {
    //         categories.value = response.data.data
    //     }
    // }
}

onBeforeMount(async () => {
    appStore.isLoading = true;

    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            // page.value.title2 = establishment.value.name;
            appStore.setCurrentPage({
                title1: "",
                title2: "Reviews",
                icon: "uil-comment-alt-dots",
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
    
    // const reviewsType = IsValueOkay(route.params.type) && route.params.type == 'intern'
    // ?'App (Private)'
    // :'all'
    
    await loadReviews(companyId, 1, options.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value)
    await loadCategories(companyId)
});

/**
 * obtenir width image from url
 */
 const getMeta = (url, cb) => {
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = (err) => cb(err);
  img.src = url;
};

/** Fonction widthimage pour savoir le width 
 * @param event 
*/
const  widthimage = (event) => {
    // Loadging establishment__img
    
    var imgmobile = document.getElementById("logoimagemobile");
    if(imgmobile !== null){
        imgmobile.classList.add("fade-in");
    }
    document.getElementsByClassName("establishment__img").innerText = "Loading image...";
    return getMeta(event,(err, img) =>{
        //if(img!=null){
            const heightresize = 160; //hauteur div pour l'image
            var aspectRatio = img.naturalWidth / img.naturalHeight;
            var newWidth = 0;
            if(aspectRatio == 1){
                // ici carre
                newWidth =heightresize;
            }else{
                newWidth =heightresize * aspectRatio;
            }   
            // let classy =   (newWidth>240)? "largeClass" : "smallClass";
            let classy;
            if (newWidth > 300) {
                classy = "largeClass"; // largeClass pour les images plus larges
            } else if (newWidth >= 220 && newWidth <= 300) {
                classy = "mediumClass"; // Nouvelle classe pour les images entre 240 et 300 pixels
            } else {
                classy = "smallClass"; // smallClass pour les images plus petites
            }
            // pour le desktop
            var elem = document.getElementById("logoimage");
            elem.classList.add("fade-in");
            setTimeout(() => {
                elem.classList.add('show');
                elem.style.display="block";
                }, 10);
            elem.classList.add(classy);
            elem.src = event;
            //new Promise(resolve=>{elem.onload = resolve})
        
            //pour le mobile
            var elemmob = document.getElementById("logoimagemobile");
            if(elemmob !== null){
                elemmob.classList.add(classy);
                
                elemmob.src=event;
                // Ajouter la classe 'show' pour déclencher l'animation de fondu en entrée
                setTimeout(() => {
                    
                    elemmob.classList.add('show');
                    elemmob.style.display = "block";
                }, 10);
            }
            
            return "OK";
        //}
        
    });
   
}
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
</style>
