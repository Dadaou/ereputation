<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="app__container">
            <div class="left__side">
                <div class="head">
                    <div class="app__title">
                        <h2>Social</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <div class="reviews__content_linechart" ref="lineChartContainer">
                        <LineChart v-if="test && test.length > 0" :plot-data="test" x-key="date" :width="lineChartWidth"
                            height="300"
                            :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
                            x-axis-label="Time" y-axis-label="Followers" :y-min="0" :point-radius="3" :show-points="true"
                            :margin="{ top: 20, bottom: 30, left: 50, right: 20 }">
                        </LineChart>
                        <!-- <Line :data="testdata" :options="testdataoptions" /> -->
                    </div>
                </div>
                <div class="head">
                    <div class="app__title">
                        <h2>Social Histogram</h2>
                    </div>
                </div>
                <social-histogram :width="lineChartWidth"></social-histogram>
                <div class="reviews__content">

                </div>

                <div class="head">
                    <div class="app__title">
                        <h2>Social List</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <div class="social-list" v-if="!dataLoading">
                        <ul v-if="socialPages.length > 0">
                            <li v-for="socialItem in getLastSocialPages(socialPages)" :key="socialItem.source">
                                <div class="social-details">
                                    <h3><i :class="`uil uil-${socialItem.source}`"></i><a
                                            :href="establishment.socials[0][socialItem.source]" target="_blank"><span>{{
                                                socialItem.source }}</span></a></h3>
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
                        </ul>
                        <p v-else>no social data</p>
                    </div>
                    <div v-else>
                        Loading...
                    </div>
                </div>
            </div>
            <!-- <el-dropdown split-button type="primary" class="mb-4 stat__cards_mobile">
                {{ calculType }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="calculType = 'Followers'">Followers</el-dropdown-item>
                        <el-dropdown-item @click="calculType = 'Likes'">Likes</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown> -->

            <StatSlider v-if="establishment && establishment.socials" class="stat__cards_mobile" :items="trends"
                :websites="establishment.socials[0]"></StatSlider>
            <div class="tablet_mobile__filter">
                <DropdownComponent class="dropdown" :showTitle="false" title="Filter by social"
                    placeholder="Select a social network" :data="socials" @submit="(social) => {
                        selectedSocials = social
                    }" :default="socials[0]" />
                <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" />
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
                        <span v-if="!dataLoading">{{ establishment.address1 }}, {{ establishment.city }}</span>
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
                            <span v-if="!dataLoading" class="society__location">{{ establishment.address1 }}, {{
                                establishment.city }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                    </div>

                    <DropdownComponent class="dropdown" title="Filter by social" placeholder="Select a social network"
                        :data="socials" @submit="(social) => {
                            selectedSocials = social
                        }" :default="socials[0]" />
                    <div class="date__filter">
                        <div class="text-sm title">Select a range of date</div>
                        <el-date-picker v-model="dateStart" placeholder="Start date" :size="'large'" />
                        <el-date-picker class="mt-2" v-model="dateEnd" placeholder="End date" :size="'large'" />
                    </div>
                </div>
                <div
                    class="stat__cards bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 py-4">
                    <div class="stat__cards_default" v-if="establishment && establishment.socials">
                        <StatComponent v-for="(slide, index) in trends" :key="index" :color="slide.color"
                            :bgColor="slide.bgColor" :value="slide.value" :description="slide.description"
                            :icon="slide.icon" :iconStyle="slide.iconStyle" :percentage="slide.percentage"
                            :trend="slide.trend" :websites="establishment.socials[0]" :site="slide.site">
                        </StatComponent>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
// import { useWindowSize } from '@vueuse/core';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import { useSocialStore } from "@Stores/social.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import { ref, watch, onBeforeMount, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
// import { Pie, Line } from 'vue-chartjs'
import SocialHistogram from '@Components/utils/SocialHistogram.vue';
import StatSlider from '@Components/utils/StatSlider.vue';
import StatComponent from '@Components/utils/StatComponent.vue';


ChartJS.register(ArcElement, Tooltip)
const page = ref({
    title1: "",
    title2: "Socials",
    icon: "uil-users-alt",
});

const lineChartContainer = ref(null);
let lineChartWidth = ref(620)

window.onresize = () => {
    if (lineChartContainer.value.clientWidth > 400) {
        lineChartWidth.value = lineChartContainer.value.clientWidth;
    } else {
        lineChartWidth.value = 400;
    }
};

const route = useRoute();
const companyId = route.params.id;

const breadcrumbData = [
    {
        title: "Back",
        path: `/establishment/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Socials",
        path: `${route.path}`,
        isCurrent: true
    }
]
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const socialStore = useSocialStore();
const calculType = ref('Followers')
let selectedSocials = ref('');
let establishment = ref({});
let socialPages = ref([]);
let socials = ref(['']);

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
const legendData = ref([])

const test = ref([])

const { trendsByEstablishment } = storeToRefs(socialStore);
const trends = ref([]);

// const labels = ['Avr', 'Mai', 'Juin', 'Juil', 'Aug', 'Sept']
// const datas = [1560, 2310, 1700.20, 2500, 998, 100];
// const datas2 = [1460, 2710, 1710, 1500, 1200, 300];
// const datas3 = [1260, 2810, 1410, 1300, 1200, 600];

// const testdata = {
//     labels: labels,
//     datasets: [
//         {
//             label: 'Facebook',
//             data: datas,
//             borderWidth: 1,
//             fill: false,
//             borderColor: 'rgb(255, 0, 0)',
//             backgroundColor: 'rgb(255, 0, 0)',
//             tension: 0.2
//         },
//         {
//             label: 'Instagram',
//             data: datas2,
//             borderWidth: 1,
//             fill: false,
//             borderColor: 'rgb(0, 255, 0)',
//             backgroundColor: 'rgb(0, 255, 0)',
//             tension: 0.2
//         },
//         {
//             label: 'LinkedIn',
//             data: datas3,
//             borderWidth: 1,
//             fill: false,
//             borderColor: 'rgb(0, 255, 255)',
//             backgroundColor: 'rgb(0, 255, 255)',
//             tension: 0.2
//         },
//     ],
// };

// const testdataoptions = {
//     responsive: true,
//     maintainAspectRatio: false,
// }

// const options = {
//     responsive: true,
//     maintainAspectRatio: false
// }
let media = [];
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const dateStart = ref(new Date());
const dateEnd = ref();
// const enableDateEnd = ref(false);
const dataLoading = ref(true);

// const format2 = (date) => {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}/${month}/${day}`;
// }

// const handleDate = (modelData) => {
//     enableDateEnd.value = (modelData != null) ? true : false;
//     dateEnd.value = null;
// }

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

    console.log(pages)

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
    socials = Object.entries(socials[0]);
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

// const showMorePosts = () => {
//     maxPostsToShow.value += 2;
// }
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

onBeforeMount(async () => {
    appStore.isLoading = true;
    const response = await new Promise((resolve, reject) => {
        services.get_Record(`/establishment/${companyId}/detail`, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        establishment.value = response.data;
        socials.value = [" ", ...getSocials(establishment.value.socials)];
        let data = [];
        let promises = [];
        establishment.value.socialPages.forEach((social) => {
            let promise = services.get_Record(`/social_pages/${social.id}`, (response) => {
                data.push(response.data);
            });
            promises.push(promise);
        })
        Promise.all(promises).then(() => {
            socialPages.value = data;
            data.value = getFollowers(socialPages.value, calculType.value);
            dataLoading.value = false;
        });
        all_items.value[1].value = establishment.value.reviews.length;
        all_items.value[0].value = companiesStore.calculateRatingV2(establishment.value.reviews);
        appStore.isLoading = false;
    }

    if (userStore.user.customer !== null) {
        userStore.user.customer.establishments.forEach(async (company, index) => {
            if (company.id == companyId) {
                userStore.user.customer.establishments[index].media.forEach(item => {
                    media.push(item.url_source);
                });
            }
        });
    }
    if (!socialStore.trendsByEstablishment[`${companyId}`]) {
        await socialStore.fetchEstablishmentTrends(companyId);
    }

    await socialStore.getGlobalStats(companyId, 'monthly', 2023);

});

onMounted(async () => {

    if (lineChartContainer.value.clientWidth > 400) {
        lineChartWidth.value = lineChartContainer.value.clientWidth;
    } else {
        lineChartWidth.value = 400;
    }
    const datas = await socialStore.getGlobalStats(companyId, 'monthly', 2023);
    console.log(datas)
    let tmp = []
    // const datas = socialStore.globalStats[`${companyId}`]['monthly'][2023]
    for (let i = 0; i < datas.dates.length; i++) {
        tmp.push({
            "date": `${datas.dates[i]}-23`,
            "Facebook": datas.websites.facebook['followers'][i],
            "Instagram": datas.websites.instagram['followers'][i],
            "LinkedIn": datas.websites.linkedin['followers'][i],
            "Tiktok": datas.websites.tiktok['followers'][i],
            "Twitter": datas.websites.twitter['followers'][i],
            "Youtube": datas.websites.youtube['followers'][i]
        })
    }
    test.value = tmp;
    // do nothing
    //     [
    // {
    //     "date": "01/01/2023",
    //     "Utilities": 5921,
    //     "Rent": 1026,
    //     "Insurance": 2324
    // },
    // {
    //     "date": "01/02/2023",
    //     "Utilities": 1539,
    //     "Rent": 1560,
    //     "Insurance": 1257
    // },]

});

watch(selectedSocials, () => {
    if (selectedSocials.value != '') {
        //do nothing
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
        trends.value = tmp;
    } else {
        trends.value = [];
    }
})
</script>

<style scoped>
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

* {
    transition: var(--transition);
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

.reviews__content1 {
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    margin-top: 15px;
}

.reviews__content1 .review {
    flex-grow: 1;
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
    width: 1300px;
    padding: 50px 5px;
}

.left__side .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
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

.modal__header {
    display: flex;
    justify-content: space-between;
}

.modal__header div {
    align-self: center;
}

.modal__close i {
    float: right;
    font-size: 25px;
    color: red;
    cursor: pointer;
    transition: var(--transition);
}

.establishment__review__qrcode p {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.qr__code {
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__close i:hover {
    transform: rotate(360deg);
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

.star__barre {
    cursor: pointer;
}

.social-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.uil-calender {
    console: var(--color-primary)
}

.reviews__content_linechart {
    width: 100%;
    overflow: auto;
    min-width: 300px;
    padding: 16px;
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

    .left__side {
        width: 1000px !important;
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
        height: 100%;
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

    .reviews__content_linechart {
        min-width: 300px;
        padding: 8px;
    }

    .stat__cards_mobile {
        display: flex;
    }

    .stat__cards_default {
        display: none;
    }

    .social-list ul li {
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
}

@media screen and (max-width:800px) {
    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
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
</style>