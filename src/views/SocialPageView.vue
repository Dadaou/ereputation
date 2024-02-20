<template>
    <div class="left__side">
        <div class="head">
            <div class="app__title">
                <h2>Social</h2>
            </div>
        </div>
        <div class="reviews__content">
            <social-statistics></social-statistics>
        </div>
        <div class="head mb-4">
            <div class="app__title" style="margin-top: 50px;">
                <h2>Social List</h2>
            </div>
        </div>
        <el-tabs
            v-model="activeName"
            type="card"
            class="demo-tabs"
          >
            <el-tab-pane label="Socials" name="socials">
                <div class="reviews__content">
                    <socialPostFilterComponent
                        :current="currentSocial"
                        @update="(value)=> currentSocial = value"
                    />
                    <SocialPostComponent v-for="post in posts" :post="post" v-if="!postLoaded"/>
                    <div class="publication-container" v-for="index in 5" v-if="postLoaded">
                        <div class="publication bg-gray-200 animate-pulse">
                            <div class="post-info">
                                <div class="post-head flex justify-between">
                                    <span class="post-source h-4 bg-gray-300 rounded w-1/4"></span>
                                    <span class="post-date h-4 bg-gray-300 rounded w-1/4"></span>
                                </div>
                                <div class="post-title h-4 bg-gray-300 rounded w-full mt-4"></div>
                                <div class="post-footer flex justify-end text-sm mt-4">
                                    <ul class="flex gap-2">
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-comment" v-if="posts.length==0 && !postLoaded">
                        no social post available
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Social Tag" name="social_tag">
               <!--  <div class="tag_header">
                     <el-select v-model="selectedHashtag" placeholder="#hashtag" size="large" filterable>
                        <el-option v-for="(hashtag, index) in hashtags" :key="index" :label="hashtag.value"
                            :value="hashtag.id" />
                    </el-select>
                     <socialPostFilterComponent
                        :socials="filteredProviders"
                        :currentHashtag="currentHashtagSocial"
                        @updateHashtag="(value)=> currentHashtagSocial = value"
                     />
                </div> -->
                <div class="tag_header">
                    <div class="select_container">
                        <el-select v-model="selectedHashtag" placeholder="#hashtag" size="large" filterable>
                            <el-option v-for="(hashtag, index) in hashtags" :key="index" :label="hashtag.value" :value="hashtag.id" />
                        </el-select>
                    </div>
                    <div class="social_post_filter_container">
                        <socialPostFilterComponent :socials="filteredProviders" :currentHashtag="currentHashtagSocial"
                            @updateHashtag="(value)=> currentHashtagSocial = value" />
                    </div>
                </div>

               
                <SocialPostComponent v-for="post in hashtagData" :post="post" v-if="!postLoaded"/>
                    <div class="publication-container" v-for="index in 5" v-if="postLoaded">
                        <div class="publication bg-gray-200 animate-pulse">
                            <div class="post-info">
                                <div class="post-head flex justify-between">
                                    <span class="post-source h-4 bg-gray-300 rounded w-1/4"></span>
                                    <span class="post-date h-4 bg-gray-300 rounded w-1/4"></span>
                                </div>
                                <div class="post-title h-4 bg-gray-300 rounded w-full mt-4"></div>
                                <div class="post-footer flex justify-end text-sm mt-4">
                                    <ul class="flex gap-2">
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                        <li class="h-4 bg-gray-300 rounded w-1/4"></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-comment" v-if="hashtagData.length==0 && !postLoaded">
                        no social tag data available
                    </div>
                
            </el-tab-pane>
          </el-tabs>
    </div>

    <StatSlider v-if="establishment && establishment.socials" class="stat__cards_mobile" :items="trends"
        :websites="establishment.socials[0]"></StatSlider>
    <div class="tablet_mobile__filter">
         <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
                <el-date-picker v-model="end_date" placeholder="End date" :size="'large'" />
    </div>
    <div class="tablet_mobile__head">
        <div class="establishment__info_tablet">
            <label v-if="!dataLoading">{{ establishment.name }}</label>
            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
            <div>
                <i
                    :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '',establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '',establishment.category == 'Other' ? 'uil-home' : '']"></i>
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
            <div class="date__filter">
                <div class="text-sm title">Select a date range</div>
                <el-date-picker v-model="start_date" type="date" placeholder="Select the start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" type="date" placeholder="Select the end date"
                    :size="'large'" />
            </div>
             <DropdownComponent :showTitle="false" placeholder="" :data="types" @submit="(type) => {
                    selectedType = type
                }" :default="types[0]" />
        </div>
        <div v-if="establishment && socials && trends && trends.length > 0"
            class="stat__cards bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 py-4">
            <div class="stat__cards_default" v-if="establishment && socials">
                <StatComponent v-for="(slide, index) in trends" :key="index" :color="slide.color" :bgColor="slide.bgColor"
                    :value="slide.value" :description="slide.description" :icon="slide.icon" :iconStyle="slide.iconStyle"
                    :percentage="slide.percentage" :trend="slide.trend" :websites="socials" :site="slide.site">
                </StatComponent>
            </div>
        </div>
    </div>
</template>

<script setup>
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import { useSocialStore } from "@Stores/social.js";
import { ref, watch, onBeforeMount, onMounted, provide, inject, computed } from 'vue';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import SocialStatistics from '@Components/utils/SocialStatistics.vue';
import StatSlider from '@Components/utils/StatSlider.vue';
import StatComponent from '@Components/utils/StatComponent.vue';
import { ElDatePicker, ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import SocialPostComponent from '@Components/utils/SocialPostComponent.vue';
import SocialPostFilterComponent from '@Components/utils/SocialPostFilterComponent.vue';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
)

const companiesStore = useCompanyStore();
const appStore = useAppStore();
const socialStore = useSocialStore();
const currentSocial = ref('facebook');
const activeName = ref('socials'); // ou social tag
const postLoaded = ref(false);
const providers = ref([]);
provide('postLoaded', postLoaded);
appStore.setCurrentPage({
    title1: "",
    title2: "Socials",
    icon: "uil-users-alt",
});

appStore.setIsExist(true);

const socialHistogramContainer = ref(null);
const lineChartWidth = ref(620);
let startDate = moment().subtract(30, 'days').format('YYYY-M-DD');
let endDate = moment().format('YYYY-M-DD');
const selectedType = ref('Followers')
provide('selectedType', selectedType)
const types = ref(["Followers", "Shares", "likes"])
const customerTag = inject('tag')

const filteredProviders = computed(() => {
    let data = providers.value.slice(); 
    data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    data = data.filter(item => item.category === 'Hashtag'); 
    return data.map(value => ({
        name: value.name.split(' ')[0].toLowerCase(),
        id: value.uri.split('/').slice(-1)[0] 
    }));
});

const socialsHashtag = computed(()=>{
    let data = filteredProviders.value.filter(provider=>provider.name == 'facebook');
    return data.length>0? data[0]: {id: '', name: ''}
})
const currentHashtagSocial = ref({id: '', name: ''})
const selectedHashtag = ref('')
const hashtags = ref([])

watch(socialsHashtag, async()=>{
    currentHashtagSocial.value = socialsHashtag.value
    await loadHashtags(companyId, currentHashtagSocial.value.id)
})


let start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'));
let end_date = ref(moment().format('YYYY-M-DD'));
provide('start_date', start_date)
provide('end_date', end_date)
const posts = ref([])
provide('posts', posts)
const colors = {
    'facebook': '#1877F2',
    'instagram': '#E4405F',
    'linkedin': '#0A66C2',
    'tiktok': '#000000',
    'twitter': '#1DA1F2',
    'youtube': '#FF0000'
};

window.onresize = () => {
    if (socialHistogramContainer.value.clientWidth > 400) {
        lineChartWidth.value = socialHistogramContainer.value.clientWidth;
    } else {
        lineChartWidth.value = 400;
    }
};

const route = useRoute();
const companyId = route.params.id;

appStore.setBreadcrumbs([
    {
        title: "Establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Socials",
        path: `${route.path}`,
        isCurrent: true
    }
])

const calculType = ref('Followers')
const establishment = ref({});
const socialPages = ref([]);
const socials = ref(['']);
provide('socials',socials )
const postData = ref({
    data: {
        facebook: {
            comments: 6,
            likes: 10,
            share: 0
        },
        youtube: {
            comments: 10,
            likes: 5,
            share: 0
        },
        instagram: {
            comments: 8,
            likes: 10,
            share: 0
        }
    },
    totalPages: 1,
    length: 3
})
const hashtagData = ref([])
const data = ref({
    labels: [],
    datasets: [
        {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: []
        }
    ]
})
const legendData = ref([]);

const { trendsByEstablishment } = storeToRefs(socialStore);
const trends = ref([]);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dataLoading = ref(true);


watch([start_date, end_date, selectedHashtag], async()=>{
 // await loadSocialData(companyId, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'), type.value)
    if(activeName.value == 'socials'){
        await loadPostData(companyId, currentSocial.value, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
    }else{
        await loadPostHashtagData(companyId, currentHashtagSocial.value.id, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'), selectedHashtag.value)
    }
})

watch(activeName, async()=>{
 await loadPostHashtagData(companyId, currentHashtagSocial.value.id, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
})

const generatedLegend = (colors, dataType) => {
    let legends = [];

    dataType.forEach((type, index) => {
        let legend = {};
        legend['name'] = type;
        legend['color'] = colors[index];
        legends.push(legend);
    })
    return legends;
}

function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const getFollowers = (datasets, type) => {
    let dataChart = {
        labels: [],
        datasets: [
            {
                backgroundColor: ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff'],
                data: []
            }
        ]
    }

    datasets.forEach(social => {
        const exists = dataChart['labels'].some(item => item === social.source);
        if (exists == false) {
            dataChart['labels'].push(social.source)
            if (type == 'Likes') {
                dataChart['datasets'][0]['data'].push(social.likes);
            } else {
                dataChart['datasets'][0]['data'].push(social.followers);
            }
        }
    })
    legendData.value = generatedLegend(
        dataChart['datasets'][0]['backgroundColor'],
        dataChart['labels']
    );
    return dataChart;
}

const transformToSourceURL = (obj) =>{
    const result = {};
    for (const key in obj) {
        const arr = obj[key];
        arr.forEach(item => {
            result[item.source] = item.url;
        });
    }
    return result;
}
const IsValueOkay = (value) => (value == ''|| value == 0 || value == null || value == undefined) ? false : true;
const loadPostData = async(tag, source, dateStart, dateEnd)=>{
    let apiBase = 'establishment/socials/posts';
    let apiParams = `tag=${tag}`;
    postLoaded.value = true;

    if (IsValueOkay(source)) {
        apiParams += `&source=${source}`;
    }

    if (IsValueOkay(dateStart)) {
        apiParams += `&fromDate=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        apiParams += `&toDate=${dateEnd}`;
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    console.log(response)
    if (response.status == 200) {
       posts.value = response.data.data
       setTimeout(()=>{
         postLoaded.value = false
       }, 5000)
    }

}

const loadPostHashtagData = async(tag, source, dateStart, dateEnd, hashtag)=>{
    let apiBase = 'get/social/post/by/hashtag';
    let apiParams = `establishment=${tag}`;
   
    postLoaded.value = true;

    if (IsValueOkay(source)) {
        apiParams += `&provider=${source}`;
    }

    if (IsValueOkay(dateStart)) {
        apiParams += `&datefrom=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        apiParams += `&dateto=${dateEnd}`;
    }

    if (IsValueOkay(hashtag)) {
        apiParams += `&hashtag=${hashtag}`;
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    console.log(response)
    if (response.status == 200) {
       hashtagData.value = response.data
       postLoaded.value = false
    }
}

const loadHashtags = async(tag, source)=>{
    let apiBase = '/get/settings/by/provider';
    let apiParams = `establishment=${tag}`;

    if (IsValueOkay(source)) {
        apiParams += `&provider=${source}`;
    }

    const api = apiBase + '?' + apiParams;
    console.log(api)

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
   
    if (response.status == 200) {
       hashtags.value = response.data
    }

}

watch([currentSocial, currentHashtagSocial], async()=>{
  // await loadPostData(companyId, currentSocial.value, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))  
  if(activeName.value == 'socials'){
         await loadPostData(companyId, currentSocial.value, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
    }else{
         await loadPostHashtagData(companyId, currentHashtagSocial.value.id, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
         await loadHashtags(companyId, currentHashtagSocial.value.id)
    }
})

onBeforeMount(async () => {
    appStore.isLoading = true;
    dataLoading.value = true

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`providers`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            const data = response.data['hydra:member'];

            data.forEach(item => {
                providers.value.push({
                    category: item.category,
                    name: item.name,
                    url: item.url,
                    uri: `/api/providers/${item.id}`
                })
            })

        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }

    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value.name,
                icon: "uil-users-alt",
            });

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Socials",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            appStore.isLoading = false;

        }
    })

    if(activeName.value == 'socials'){
         await loadPostData(companyId, currentSocial.value, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
    }else{
         await loadPostHashtagData(companyId, currentHashtagSocial.value.id, moment(start_date.value).format('YYYY-MM-DD'), moment(end_date.value).format('YYYY-MM-DD'))
    }

    const response = await new Promise((resolve) => {
        services.get_Record(`/establishment/socials/pages?tag=${companyId}`, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        postData.value = response.data
    }

    const socialResponse = await new Promise((resolve) => {
        services.get_Record(`/establishment/settings?tag=${companyId}&type=Social`, (response) => {
            resolve(response)
        });
    });

    if (socialResponse.status == 200) {
        establishment.value['socials'] = transformToSourceURL(socialResponse.data);
        socials.value = transformToSourceURL(socialResponse.data);
        console.log(socials.value)
        dataLoading.value = false;
    }
    if (!socialStore.trendsByEstablishment[`${companyId}`]) {
        await socialStore.fetchEstablishmentTrends(companyId);
    }

});


watch([socialPages, calculType], () => {
    data.value = getFollowers(socialPages.value, calculType.value);
});

watch([trendsByEstablishment, calculType], () => {
    if (socialStore.trendsByEstablishment[`${companyId}`]) {
        const tmp = [];
        let value = 0;
        let percentage = "0%";
        let trend = "linear";
        let description = "Total Followers";
        socialStore.trendsByEstablishment[`${companyId}`].forEach((item) => {
            switch (calculType.value) {
                case 'Likes':
                    value = Array.isArray(item.likes) ? 0 : item.likes.count
                    percentage = Array.isArray(item.likes) || !item.likes.percentage ? '0%' : `${item.likes.percentage}%`
                    trend = Array.isArray(item.likes) ? 'linear' : `${item.likes.trend}`
                    description = "Total Likes"
                    break
                case 'Followers':
                    value = Array.isArray(item.followers) ? 0 : item.followers.count
                    percentage = Array.isArray(item.followers) || !item.followers.percentage ? '0%' : `${item.followers.percentage}%`
                    trend = Array.isArray(item.followers) ? 'linear' : `${item.followers.trend}`
                    description = "Total Followers"
                    break
            };

            switch (item.site) {
                case 'tiktok':
                    tmp.push({
                        site: "tiktok",
                        color: "#010101",
                        bgColor: "#010101",
                        icon: "iconoir:tiktok",
                        iconStyle: "rect",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
                case 'linkedin':
                    tmp.push({
                        site: "linkedin",
                        color: "#0072b1",
                        bgColor: "#0072b1",
                        icon: "ri:linkedin-line",
                        iconStyle: "rect",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
                case 'youtube':
                    tmp.push({
                        site: "youtube",
                        color: "red",
                        bgColor: "radial-gradient(circle, rgba(107,92,9,1) -7475%, rgba(254,254,255,1) -5600%, rgba(252,220,18,1) -4712%, rgba(219,193,45,1) -2750%, rgba(252,220,18,1) -1791%, rgba(238,238,233,1) 0%, rgba(255,119,119,1) 0%, rgba(255,0,0,1) 100%)",
                        icon: "uit:youtube",
                        iconStyle: "rounded",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
                case 'facebook':
                    tmp.push({
                        site: "facebook",
                        color: "#4267b2",
                        bgColor: "linear-gradient(180deg, rgba(107,92,9,1) -7475%, rgba(254,254,255,1) -5600%, rgba(252,220,18,1) -4712%, rgba(219,193,45,1) -2750%, rgba(252,220,18,1) -1791%, rgba(66,103,178,1) 65%, rgba(107,153,245,1) 100%, rgba(210,188,251,1) 100%)",
                        icon: "ri:facebook-fill",
                        iconStyle: "rounded",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
                case 'instagram':
                    tmp.push({
                        site: "instagram",
                        color: "#833AB4",
                        bgColor: "linear-gradient(160deg, rgba(107,92,9,1) -7475%, rgba(254,254,255,1) -5600%, rgba(252,220,18,1) -4712%, rgba(219,193,45,1) -2750%, rgba(252,220,18,1) -1791%, rgba(64,93,230,1) 0%, rgba(91,81,216,1) 5%, rgba(131,58,180,1) 15%, rgba(193,53,132,1) 34%, rgba(225,48,108,1) 48%, rgba(253,29,29,1) 63%, rgba(245,96,64,1) 75%, rgba(252,175,69,1) 90%, rgba(255,220,128,1) 100%, rgba(210,188,251,1) 100%)",
                        icon: "mdi:instagram",
                        iconStyle: "rect",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
                case 'twitter':
                    tmp.push({
                        site: "twitter",
                        color: "#1DA1F2",
                        bgColor: "#1DA1F2",
                        icon: "mingcute:twitter-line",
                        iconStyle: "rect",
                        description: description,
                        value: value,
                        percentage: percentage,
                        trend: trend
                    });
                    break;
            };
        });
        trends.value = tmp.filter(slide => slide.value > 0);

    } else {
        trends.value = [];
    }
});
</script>

<style scoped>

/*.tag_header{
    display: flex;
    justify-content: space-between;
    gap:20rem;
}*/

.tag_header {
    display: flex;
    justify-content: space-between;
}

.select_container,
.social_post_filter_container {
    flex: 1; 
    margin-right: 10px; 
}

@media screen and (max-width: 600px) {
    .tag_header {
        flex-direction: column; /* Change la direction du flux pour une disposition en colonne sur les écrans étroits */
    }

    .select_container,
    .social_post_filter_container {
        flex: none; /* Annule la flexibilité pour revenir à la largeur par défaut */
        width: 100%; /* Les éléments prennent maintenant toute la largeur sur les écrans étroits */
        margin-bottom: 20px; /* Augmente la marge en bas pour espacer davantage les éléments sur mobile */
    }
}


.social-media-container {
    display: flex;
    padding: 0;
    flex-wrap: wrap;
    gap: 1rem;
}

.platform {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    margin: 15px 0;
    flex-grow: 1;
    width: 40%;
}



.platform:hover {
    transform: translateY(-5px);
}

h3 {
    color: #333;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 10px;
}



@media screen and (max-width: 768px) {
    .social-media-container {
        flex-direction: column;
    }

    .platform {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        width: 100%;
        max-width: 100% !important;
    }
}

a {
    cursor: pointer;
}

li {
    padding: 10px;
    font-size: 14px;
    /*border-bottom: 1px solid #ccc;*/
}

li:first-child {
    background-color: #f2f2f2;
}

li:nth-child(odd) {
    background-color: #f9f9f9;
}

.head .competitors {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.social-list .social-list__content {
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.social-item {
    width: 50%;
}

.social-item.posts {
    width: 100%;
}

.social-details {
    flex: 1;
    padding-right: 20px;
    border-right: 1px solid #ccc;
}

.social-details h3 {
    font-size: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.social-details h3 span {
    font-size: 17px;
    font-weight: 600;
}

.social-details p {
    font-weight: 500;
}

.social-details p span {
    color: var(--color-primary)
}

.social-posts {
    flex: 2;
    padding-left: 20px;
    max-height: 250px;
    overflow: auto;
}

.social-posts h4 {
    font-size: 16px;
    margin-bottom: 10px;
}

.social-posts ul {
    list-style: none;
    padding: 0;
    min-width: 200px;
}

.social-posts li {
    margin-bottom: 10px;
}

.social-posts li span {
    font-weight: 500;
}

.date {
    width: 150px !important;
}

.uil-youtube {
    color: red;
}

.uil-linkedin {
    color: #0A66C2;
}

.uil-facebook {
    color: #1877F2;
}

.uil-twitter {
    color: #1DA1F2;
}

.uil-instagram {
    color: #BC2A8D;
}

.uil-comment {
    color: var(--color-danger);
}

.uil-thumbs-up {
    color: #1DA1F2;
}

.uil-share {
    color: #1DA1F2;
}

.stat__cards {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    border: 1px solid var(--light-color-bg2);
}

.stat__cards_mobile {
    display: none;
}

.stat__cards_default {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    flex-grow: 1;
}

@media screen and (max-width: 975px) {

    .stat__cards_mobile {
        display: flex;
    }

    .stat__cards_default {
        display: none;
    }

    .social-item {
        display: flex;
        flex-direction: column;
    }

    .social-list .social-details {
        padding-inline: 8px;
        border-right: none;
        border-bottom: 1px solid #ccc;
        width: 100%;
        padding-bottom: 16px;
    }

    .social-list .social-posts {
        padding-top: 12px;
        padding-inline: 0;
        max-height: 250px;
        overflow: auto;
        width: 100%;
    }
}

.publication {
   margin-bottom: 20px;
   padding: 10px;
   transition: var(--transition);
   box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
   border-radius: 5px;
}

.comments {
  max-height: 500px; 
  overflow-y: auto; 
  transition: max-height 0.5s ease; 
}

.publication-container {
  max-width:  95%;
  margin:  0 auto;
 /* padding:  20px;*/
}

.publication {
  display: flex;
  flex-direction: column;
  margin-bottom:  20px;
}

.post-title{
     background-color: #f7fbff;
     padding: 15px;
     margin-top: 10px;
     font-size: 14px;
     border-radius: 5px;
}

.post-head{
    display: flex;
    justify-content: space-between;
}

.post-footer{
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
}

.post-footer ul{
    display: flex;
    gap: 0.5rem;
}

.post-date{
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary)
}

.post-btn-comment{
    cursor: pointer;
}

.post-info{
    z-index: 1
}
</style>