<template>
    <div class="left__side">
        <!-- <div class="head dashboard">
            <div class="app__title">
                <h1>Dashboard</h1>
            </div>
        </div> -->
        <div class="dashboard__content">
            <DashboardComponent :is-loading="establishmentLoading" class="counter" v-for="item in all_items"
                :item="item" :key="item" />
        </div>
        <!-- <div class="head">
            <div class="app__title">
                <h2>Comparison</h2>
            </div>
        </div> -->

        <ComparisonChartComponent :data="plotdata" :width="chart__width" :chartheight="chart__height"
            :establishment="establishment" :companies="comparisonData" :competitors="computedCompetitors"
            :timePeriod="selectedTimePeriod" :colors="colors" />
        <BaseLegend v-if="chartLoading == false" class="legend" :LegendData="legendData" :alignment="'horizontal'">
        </BaseLegend>
        <!-- <div class="head">
            <div class="app__title">
                <h2>Last reviews</h2>
            </div>
        </div> -->
        <div class="reviews__content">
            <p>Discover the latest feedback about your establishment. Click <a
                    @click="gotoReviewPage(establishment.competitor_tag, $route.params.tag)">here</a> to access all
                reviews.</p>
            <div class="reviews__pagination">
                <PaginationComponent v-if="visibleData.length > 0" :options="options" @next="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, language)
                }" @prev="(option) => {
                    loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, language)
                }" />
            </div>
            <CommentComponent v-if="reviewsLoading == false" :reviews="visibleData" :allReviews="establishment.reviews"
                :showEmoji="true" :categories="categories" @update-feeling="updateFeeling" />
            <div v-else role="status"
                class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                v-for="index in 20" :key="index">
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

            <PaginationComponent v-if="visibleData.length > 0" :options="options" @next="(option) => {
                loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, language)
            }" @prev="(option) => {
                loadReviews(companyId, option.page, option.limit, option.current, dateStart, dateEnd, selectedWebsites, selectedStars, language)
            }" />

            <aside v-if="lastReviews.length > 0">
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ all_items.rating.value - 3 }} reviews
                    remains</p>
                <div class="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
                    <a @click="gotoReviewPage(establishment.competitor_tag, $route.params.tag)"
                        class="see__more text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">See
                        more</a>
                </div>
            </aside>
        </div>
    </div>
    <div class="tablet_mobile__filter tablet">
        <div class="rating__customers">
            <div class="title">Rating by Customers</div>
            <div class="chart__rating">
                <Line :data="chartData" :options="chartConfig.options" />
            </div>
        </div>
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
        <DropdownComponent class="dropdown w-full" :showTitle="false" title="Compare to"
            placeholder="Select a competitor" :data="computedCompetitors" @submit="(competitor) => {
                selectedCompetitors = competitor.name
            }" :defaultObj="computedCompetitors[0]" :isDataObject="true" />
        <DropdownComponent :showTitle="false" class="dropdown w-full" title="Filter by plateform"
            placeholder="Select a website" :data="formattedWebsites" @submit="(website) => {
                selectedWebsites = website
            }" :default="formattedWebsites[0]" />
        <DropdownComponent :showTitle="false" class="dropdown w-full" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
            selectedTimePeriod = timePeriod
        }" :default="timePeriods[0]" />
        <div class="date__picker">
            <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
        </div>
        <div class="date__picker">
            <el-date-picker v-model="end_date" type="date" placeholder="Select the end date" :size="'large'" />
        </div>
    </div>
    <div class="tablet_mobile__filter" v-if="currentFilter == 'feedback'">
        <div class="rating__customers">
            <div class="title">Rating by Customers</div>
            <div class="chart__rating">
                <Line :data="chartData" :options="chartConfig.options" />
            </div>
        </div>
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

    <EstablishmentInfoMobile :establishment="establishment" :isLoading="establishmentLoading">
        <template #dashboard>
            <div class="dashboard_mobile mt-1">
                <DashboardMobile v-for="item in all_items" :item="item" :key="item" />
            </div>
        </template>
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
            <a href="#" v-if="!establishmentLoading">
                <div class="photo">
                    <div  v-if="establishment.url_source !== null" class="establishment__img">
                        <img id="logoimage" alt="" :class="widthimage(establishment.url_source)"/>
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
                <label class="society__name" v-if="!establishmentLoading">{{ establishment.name }}</label>
                <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                <div class="society__location">
                    <i
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Event' ? 'uil-schedule' : '', establishment.category == 'Other' ? 'uil-home ' : '']"></i>
                    <span v-if="!establishmentLoading" class="society__location">{{ establishment.category }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>
                <div class="society__location" v-if="establishment.country != null">
                    <i class="uil uil-map"></i>
                    <span v-if="!establishmentLoading" class="society__location">
                        {{ establishment.country }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>

                <div class="society__location">
                    <i class="uil uil-location-point"></i>
                    <span v-if="!establishmentLoading" class="society__location"> {{
                        establishment.city }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                </div>
                
            </div>
            <DropdownComponent class="dropdown" title="Compare to" placeholder="Select a competitor"
                :data="computedCompetitors" @submit="(competitor) => {
                    selectedCompetitors = competitor.name
                }" :defaultObj="computedCompetitors[0]" :isDataObject="true" />
            <DropdownComponent class="dropdown" title="Filter by plateform" placeholder="Select a website"
                :data="formattedWebsites" @submit="(website) => {
                    selectedWebsites = website
                }" :default="formattedWebsites[0]" />
            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                    :size="'large'" />
                <DropdownComponent :showTitle="false" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />
            </div>
            <!--  <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/trends`">
                <button class="btn trends">
                    <i class="uil uil-trophy"></i>
                    <span class="ml-2">Trends</span>
                </button>
            </RouterLink> -->
        </div>
    
        <div class="rating__customers">
            <div class="title">Rating by Customers</div>
            <div class="chart__rating">
                <Line :data="chartData" :options="chartConfig.options" />
            </div>
        </div>
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
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import CommentComponent from '@Components/utils/CommentComponent.vue';
import DashboardComponent from '@Components/utils/DashboardComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import ComparisonChartComponent from '@Components/utils/ComparisonChartComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import { ref, reactive, watch, onBeforeMount, computed, provide, inject, defineAsyncComponent,nextTick } from 'vue';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css'
import { useChartsStore } from "@Stores/charts.js"

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

const EstablishmentInfoMobile = defineAsyncComponent(
    () => import("@Components/utils/EstablishmentInfoMobile.vue")
)

const DashboardMobile = defineAsyncComponent(
    () => import("@Components/utils/DashboardMobileComponent.vue")
)

const options = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
})

const weatherModal = ref(false);
provide('showModal', weatherModal);
const route = useRoute();
const companyId = ref(route.params.id);
const router = useRouter();
const appStore = useAppStore();
const customerTag = inject('tag')

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `${route.path}`,
        isCurrent: true,
    },
]);

const chartsStore = useChartsStore();

const userStore = useUserStore();
const companiesStore = useCompanyStore();
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

const formatString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const formattedWebsites = computed(() => {
    return websites.value.map(website => formatString(website));
});

let establishment = ref({ reviews: [] });
let competitors = ref([]);
let computedCompetitors = computed(() => {
    let data = [{ name: 'Global' }];
    establishment.value['competitors'] && establishment.value['competitors'].forEach(c => {
        data.push(c);
    })
    return data;
});

let visibleData = ref([])
const starsData = ref([])

let comparisonData = ref([establishment.value, ...competitors.value]);
const all_items = ref({
    rating: { title: "Score", value: 0, icon: "uil-thumbs-up", description: "Average score from selected filters" },
    global: { title: "Global", value: 0, icon: "uil-star", description: "Current average score displayed on public platforms (considering all the history retained by the platforms)" },
    index: { title: "Index", value: 0, icon: "uil-analysis", description: "Index is an indicator betwenn 0 and 1 built on algorithms with differents metrics such as scores, AI reviews analysis, social media trends… The closer the indicator is to 1, the better your reputation." },
    reviews: { title: "Reviews", value: 0, icon: "uil-comment" },
    // competitors: { title: "Competitors", value: 0, icon: "uil-building" }
});
let currentFilter = ref('filter');

let plotdata = ref([]);
let legendData = ref([]);
const establishmentLoading = ref(true)
const reviewsLoading = ref(false)
const feedbackLoading = ref(false)
const semesterChartLoading = ref(false)
const chartLoading = ref(false)
const language = inject('language')
const start_date = inject('start_date');
const end_date = inject('end_date');
const categories = ref([])

let selectedTimePeriod = ref('');
let timePeriods = ref(['Days', 'Weeks', 'Months', 'Quarters', 'Semesters']);

let lastReviews = ref([]);
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0,
    score:0
});


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
console.log(_reviewFeedbackData)
        return _reviewFeedbackData;
        
}

const updateFeeling = (newFeedbackData) =>{
   
    reviewFeedbackData.value = newFeedbackData;
}

provide('reviewFeedbackData',reviewFeedbackData);
provide('calculSentimentAnalysis',calculSentimentAnalysis);

const colors = ref(['#f75842', '#337ecc', '#4682B4', '#6495ED', '#1E90FF', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']);

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

const formatSixMonthsChartData = (datas) => {
    let chartdata = {
        labels: [],
        datasets: []
    }

    const names = Object.keys(datas[0]).filter(v => v != 'name');
    const labels = datas.map(d => d.name);
    let index = 0

    names.forEach(k => {
        let tmp2 = []
        datas.forEach(dp => {
            tmp2.push(dp[k])
        })
        chartdata.datasets.push({
            data: tmp2,
            label: k,
            backgroundColor: colors.value[index]
        })
        index++
    })

    chartdata.labels = labels

    return chartdata
}

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

const loadDatasets = async () => {

    semesterChartLoading.value = true

    let eDate = new Date();
    let sDate = new Date();
    sDate.setMonth(sDate.getMonth() - 5);
    eDate.setMonth(eDate.getMonth() - 1);

    if (establishment && establishment.value['competitors']) {
        let competitorInfo = establishment.value['competitors'].find(c => c.name === selectedCompetitors.value)
        const tags = competitorInfo ? [companyId.value, competitorInfo.tag] : [companyId.value, ...establishment.value['competitors'].map(c => c.tag)]
        const website = (selectedWebsites.value == 'App (Private)') ? selectedWebsites.value : selectedWebsites.value.toLowerCase()
        let datas = await chartsStore.loadData(tags, selectedTimePeriod.value, moment(sDate).format('YYYY-M-DD'), moment(eDate).format('YYYY-M-DD'), website)
        chartData.value = formatSixMonthsChartData(datas);
        semesterChartLoading.value = false
    }
}

const viewData = async (establishment, establishmentTag, dateStart, dateEnd, website, competitors, timePeriods) => {
    chartLoading.value = true
    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
    }

    if (establishment && establishment['competitors']) {
        let competitorInfo = establishment['competitors'].find(c => c.name === competitors)
        const tags = competitorInfo ? [establishmentTag, competitorInfo.tag] : [establishmentTag, ...establishment['competitors'].map(c => c.tag)]
        website = (website == 'App (Private)') ? website : website.toLowerCase()

        //Global value to change
        plotdata.value = await chartsStore.loadData(tags, timePeriods, dateStart, dateEnd, website)
        legendData.value = companiesStore.generateLegend(plotdata.value, colors.value);
        
    }
    chartLoading.value = false;
    
}

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

const globalComparison = async (establishment, establishmentTag, dateStart, dateEnd, website, stars, language, competitors, timePeriods) => {
    viewData(establishment, establishmentTag, dateStart, dateEnd, website, competitors, timePeriods);
    loadReviews(establishmentTag, 1, 20, 1, dateStart, dateEnd, website, stars, language);
    
};

const gotoReviewPage = (id, tag) => {
    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Review',
            params: {
                id: id,
                tag: tag
            }
        })
    }, 100);
}

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
        const heightresize = 160; //hauteur div pour l'image
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var newWidth = 0;
        if(aspectRatio == 1){
            // ici carre
            newWidth =heightresize;
        }else{
            newWidth =heightresize * aspectRatio;
        }   
      //  let classy =   (newWidth>240)? "largeClass" : "smallClass";
        let classy;
        if (newWidth > 300) {
            classy = "largeClass"; // largeClass pour les images plus larges
        } 
        else if (newWidth >= 220 && newWidth <= 300) {
            classy = "mediumClass"; // Nouvelle classe pour les images entre 240 et 300 pixels
        } else {
            classy = "smallClass"; // smallClass pour les images plus petites
        }
        // pour le desktop
        var elem = document.getElementById("logoimage");
        elem.classList.add("fade-in");
        setTimeout(() => {
            elem.classList.add('show');
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
    });
   
}



/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const chart__width = ref(800);
const chart__height = ref(300);


watch([start_date, end_date, selectedWebsites], () => {
    globalComparison(establishment.value, companyId.value, start_date.value, end_date.value, selectedWebsites.value, '', language.value, selectedCompetitors.value, selectedTimePeriod.value)
})

watch([selectedCompetitors, selectedTimePeriod], async () => {
    viewData(establishment.value, companyId.value, start_date.value, end_date.value, selectedWebsites.value, selectedCompetitors.value, selectedTimePeriod.value)
})

let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = parseInt(star, 10);
};

watch(selectedStars, () => {
    loadReviews(companyId.value, 1, options.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, language.value);
});

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars, language) => {
    options.value.current = current;
    options.value.page = page;
    reviewsLoading.value = true

    let apiBase = '/review/by_establishment';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
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

    loadDatasets();
    await loadFeelingData(tag, dateStart, dateEnd, source);
    await loadStarData(tag, dateStart, dateEnd, source);
    await loadIndiceData(tag, dateStart, dateEnd);
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        reviewsLoading.value = false;
        visibleData.value = response.data['data'];

        // if (response.data['count'] <= 100) options.value.max = response.data['count'];
        // else options.value.max = 100;
        options.value.max = response.data['count'];
        all_items.value.reviews.value = response.data['count'];
        all_items.value.rating.value = response.data['rating'];
        all_items.value.global.value = response.data['global'];
        let feeling_score = calculSentimentAnalysis(response.data['feeling_score']);
       reviewFeedbackData.value = feeling_score;
    }
}

const loadFeelingData = async (tag, dateStart, dateEnd, source) => {
    let apiBase = 'charts/feeling';
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
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
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
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
        if (response.data && response.data.data) {
            starsData.value = formatStarsData(response.data.data)
        }
    }
}

const loadIndiceData = async (tag, dateStart, dateEnd) => {
    let apiBase = `establishment/${tag}/global/score`;
    let apiParams = "";

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
    } 
    apiParams += `&from=${dateStart}&to=${dateEnd}`;

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        if (response.data) {
            all_items.value.index.value = response.data['score'];
        }
    }
}

onBeforeMount(async () => {
   
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
    )

    appStore.isLoading = true;

    companiesStore.getEstablishment(customerTag.value, companyId.value).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            appStore.isLoading = false;
            establishment.value['tag'] = companyId.value;
            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value.name,
                icon: "uil-estate"
            });

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `${route.path}`,
                    isCurrent: true,
                },
            ]);
            
            establishmentLoading.value = false
            globalComparison(establishment.value, companyId.value, start_date.value, end_date.value, selectedWebsites.value, '', language.value, selectedCompetitors.value, selectedTimePeriod.value)
            websites.value = ['Global', 'App (Private)', ...establishment.value['websites']];
        }
    })
    await loadCategories(companyId.value)
});
</script>

<style scoped>
.fa-star{
    color:var(--color-warning);
}
.btn.trends {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border-radius: 5px;
    padding: 5px;
}

.mobile__filter__btn .btn {
    width: 100%;
    background-color: white;
    color: var(--color-primary);
    border-radius: 5px;
    padding: 5px;
}

* {
    transition: var(--transition);
}

.tablet,
.mobile__filter__btn {
    display: none;
}


.mobile__filter__btn .isactive,
.mobile__filter__btn button:hover {
    background-color: var(--color-primary);
    color: white !important;
}

.mobile__filter__btn .isactive i,
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
    width: 100%;
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

.establishment div {
    font-size: 13px;
    font-weight: 500;
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

.chart__rating {
    display: flex;
    padding: 5px;
}

.legend {
    margin: 15px auto;
}

.comment {
    overflow: hidden;
    text-align: justify;
}

#competitors__dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
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

.dashboard__content,
.chart__content,
.reviews__content {
    margin-top: 20px;
}

.chart__content {
    display: flex;
    justify-content: center;
}

.head .competitors {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.competitors .select__title {
    font-weight: 500;
}

.rating {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
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

.date__picker {
    width: 100% !important;
    margin: 0px 2px !important;
}

/* Css correction */

img {
    height: 200px;
}
@media screen and (max-width:2000px) {

.dashboard__content {
    margin-top: 12px;
}
}

@media screen and (max-width:1440px) {

    .dashboard__content {
        margin-top: 8px;
    }
}

@media screen and (max-width:1024px) {

    .breadcrumb__container {
        width: var(--container-width-md);
    }

    .dashboard__content {
        gap: 0.5rem;
    }
}

@media screen and (max-width: 975px) {

    .tablet,
    .mobile__filter__btn {
        display: block;
    }

    img {
        height: auto;
    }

    .dashboard__content,
    .dashboard {
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
    .establishment__info_tablet{
        margin-top:0px! important;
    }
    .smallClass{
        margin-top:0px! important;
    }
    .largeClass{
        margin-top:0px! important;
    }
    .mediumClass{
        margin-top:0px! important;
    }
}

.photo{
    width: 100%;
    /*margin-left: 50px;*/
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
</style>