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
        <div class="head">
            <div class="app__title" style="margin-top: 50px;">
                <h2>Social List</h2>
            </div>
        </div>
        <div class="reviews__content">
            <div class="social-list" v-if="!dataLoading">
                <!-- <ul v-if="socialPages.length > 0" class="social-list__content">
                            <li v-for="socialItem in getLastSocialPages(socialPages)" :key="socialItem.source"
                                class="social-item" :class="socialItem.socialPosts.length > 0 && 'posts'">
                                <div class="social-details">
                                    <h3><i :class="`uil uil-${socialItem.source}`"></i>
                                        <a :href="socials[socialItem.source]" target="_blank"><span>{{
                                            socialItem.source }}</span></a>
                                    </h3>
                                    <p><span>Followers:</span> {{ socialItem.followers }}</p>
                                    <p><span>Likes:</span> {{ socialItem.likes }}</p>
                                    <p><span>Posts:</span> {{ socialItem.posts }}</p>
                                </div>
                                <div class="social-posts" v-if="socialItem.socialPosts.length > 0">
                                    <h4>Social Posts</h4>
                                    <ul>
                                        <li v-for="(post, index) in socialItem.socialPosts" :key="index">
                                            <p><i class="uil uil-comment"></i>: <span>{{ post.comments }}</span> </p>
                                            <p><i class="uil uil-thumbs-up"></i>: <span>{{ post.likes }}</span> </p>
                                            <p><i class="uil uil-share"></i>: <span>{{ post.share }}</span></p>
                                            <p class="date"><i class="uil uil-calender"></i>: <span
                                                    v-if="post.published_at !== null">{{ moment(post.published_at)
                                                        .format('DD MMM YYYY') }}</span></p>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul> -->

                <div class="social-media-container" v-if="Object.keys(postData.data).length > 0">
                    <div v-for="(values, platform) in postData.data" :key="platform" class="platform">
                        <h3>{{ platform.charAt(0).toUpperCase() + platform.slice(1) }} <i
                                :class="`uil uil-${platform}`"></i></h3>
                        <div v-if="values.comments !== undefined"><i class="uil uil-comment"></i>: {{
                            values.comments }}</div>
                        <div v-if="values.likes !== undefined"><i class="uil uil-thumbs-up"></i>: {{ values.likes }}
                        </div>
                        <div v-if="values.share !== undefined"><i class="uil uil-share"></i>: {{ values.share }}
                        </div>
                    </div>
                </div>
                <p v-else>no social data</p>
            </div>


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
        </div>
    </div>

    <StatSlider v-if="establishment && establishment.socials" class="stat__cards_mobile" :items="trends"
        :websites="establishment.socials[0]"></StatSlider>
    <div class="tablet_mobile__filter">
        <!--  <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                <el-date-picker v-model="dateEnd" placeholder="End date" :size="'large'" /> -->
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
            <div class="date__filter">
                <!--  <div class="text-sm title">Select a date range</div>
                        <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                        <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" /> -->
            </div>
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
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import { useSocialStore } from "@Stores/social.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import { ref, watch, onBeforeMount, onMounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
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
import SocialHistogram from '@Components/utils/SocialHistogram.vue';
import SocialStatistics from '@Components/utils/SocialStatistics.vue';
import StatSlider from '@Components/utils/StatSlider.vue';
import StatComponent from '@Components/utils/StatComponent.vue';

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const socialStore = useSocialStore();

appStore.setCurrentPage({
    title1: "",
    title2: "Socials",
    icon: "uil-users-alt",
});

appStore.setIsExist(true);

const socialHistogramContainer = ref(null);
let lineChartWidth = ref(620)

window.onresize = () => {
    if (socialHistogramContainer.value.clientWidth > 400) {
        lineChartWidth.value = socialHistogramContainer.value.clientWidth;
    } else {
        lineChartWidth.value = 400;
    }
};

const route = useRoute();
const companyId = route.params.id;
const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;


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
const selectedSocials = ref('');
const establishment = ref({});
const socialPages = ref([]);
const socials = ref(['']);
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

// let followersType = ref(true);
// const maxPostsToShow = ref(2)

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

let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dateStart = ref(new Date());
const dateEnd = ref();
const dataLoading = ref(true);

const getLastSocialPages = (socialPages) => {
    const pages = []
    const sites = []

    socialPages.forEach(socialPage => {
        if (sites.includes(socialPage.source)) {
            for (let i = 0; i < pages.length; i++) {
                if (pages[i].source == socialPage.source && new Date(socialPage.created_at) >= new Date(pages[i].created_at)) {
                    pages[i] = socialPage
                }
            }
        } else {
            sites.push(socialPage.source)
            pages.push(socialPage)
        }
    })

    return pages
}

const capitalizeString = (str) => {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }

    if (str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const isURL = (string) => {
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?[^\s.]+\.[^\s]{2,}$/i;
    return urlPattern.test(string);
}

const getSocials = (socials) => {
    socials = (socials.length > 0) ? Object.entries(socials[0]) : socials;
    let data = [];
    socials.forEach(([key, value]) => {
        if (typeof (value) == 'string') {
            if (isURL(value) && key !== 'url') {
                data.push(capitalizeString(key));
            }
        }
    });
    return data;
}

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

function transformToSourceURL(obj) {
    const result = {};
    for (const key in obj) {
        const arr = obj[key];
        arr.forEach(item => {
            result[item.source] = item.url;
        });
    }
    return result;
}

onBeforeMount(async () => {
    const companyId = route.params.id;
    let company = null;
    appStore.isLoading = true;
    dataLoading.value = true

    companiesStore.getEstablishment(companyId).then((data) => {

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
            appStore.isLoading = false;

        }
    })

    const response = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/socials/posts?tag=${companyId}`, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        console.log(response.data)
        postData.value = response.data
        // establishment.value['socialPages'] = response.data['socialPages'];

        // let data = [];
        // let promises = [];
        // establishment.value.socialPages.forEach((social) => {
        //     let promise = services.get_Record(`/social_pages/${social.id}`, (response) => {
        //         data.push(response.data);
        //     });
        //     promises.push(promise);
        // })
        // Promise.all(promises).then(() => {
        //     socialPages.value = data;
        //     data.value = getFollowers(socialPages.value, calculType.value);
        // });
    }

    const socialResponse = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/settings?tag=${companyId}&type=Social`, (response) => {
            resolve(response)
        });
    });

    if (socialResponse.status == 200) {
        console.log(transformToSourceURL(socialResponse.data))
        establishment.value['socials'] = transformToSourceURL(socialResponse.data);
        socials.value = transformToSourceURL(socialResponse.data);
        dataLoading.value = false;
    }
    if (!socialStore.trendsByEstablishment[`${companyId}`]) {
        await socialStore.fetchEstablishmentTrends(companyId);
    }

});

onMounted(async () => {

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

    // if (socialHistogramContainer.value.clientWidth > 400) {
    //     lineChartWidth.value = socialHistogramContainer.value.clientWidth;
    // } else {
    //     lineChartWidth.value = 400;
    // }

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
.social-media-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    /* Alignement à gauche */
    gap: 20px;
    padding: 0px;
}

.platform {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    width: 100%;
    max-width: 200px;
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

@media (max-width: 768px) {
    .social-media-container {
        flex-direction: column;
    }
}

a {
    cursor: pointer;
}

li {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
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

ul {
    list-style: none;
    padding: 0;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
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
</style>