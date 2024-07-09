<template>
    <div style="margin-top: 15px;">
        <!-- <ComparisonChartComponent :data="plotdata" :width="chart__width" :chartheight="chart__height"
            :establishment="establishment" :companies="comparisonData" :competitors="computedCompetitors"
            :timePeriod="selectedTimePeriod" :colors="colors" /> -->
        <div v-if="chartData" class="chart__container w-full" ref="lineChartContainer">
            <Line :data="chartData" :options="chartConfig" />
        </div>


        <!-- <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']">
            <div class="containerChart" ref="scrollContainer2"
                @scroll="syncScroll('scrollContainer2', 'scrollContainer1')">
                <div :class="['containerBody2 mt-5', !isLoading ? '' : 'loading']">
                    <Line :data="chartData" id="confidence" :options="chartConfig" />
                </div>
            </div>

            <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
        </div> -->

        <BaseLegend v-if="chartLoading == false" class="legend" :LegendData="legendData" :alignment="'horizontal'">
        </BaseLegend>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import ComparisonChartComponent from '@Components/utils/ComparisonChartComponent.vue';
import { ref, reactive, watch, onBeforeMount, computed, provide, inject, defineAsyncComponent } from 'vue';
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

const confidenceChart = ref({
    labels: [],
    datasets: []
})

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

const lineChartContainer = ref(null);
const barChartWidth = ref(620);

let selectedTimePeriod = ref('');
// let timePeriods = ref(['Days', 'Weeks', 'Months', 'Quarters', 'Semesters']);


let lastReviews = ref([]);
let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

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
        let datas = await chartsStore.loadData(tags, 'months', moment(sDate).format('YYYY-M-DD'), moment(eDate).format('YYYY-M-DD'), website)
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
        
        // plotdata.value = await chartsStore.loadData(tags, "Days", dateStart, dateEnd, website)
        let datachart= await chartsStore.loadData(tags, "Days", dateStart, dateEnd, website)

        chartData.value = formatSixMonthsChartData(datachart);
        
        // legendData.value = companiesStore.generateLegend(plotdata.value, colors.value);
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
            label: k,
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

        if (response.data['count'] <= 100) options.value.max = response.data['count'];
        else options.value.max = 100;
        all_items.value.reviews.value = response.data['count'];
        all_items.value.rating.value = response.data['rating'];
        all_items.value.global.value = response.data['global'];
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
    // loadDatasets();
    // ChartJS.register(
    //     CategoryScale,
    //     LinearScale,
    //     PointElement,
    //     LineElement,
    //     Title,
    //     Tooltip,
    // )

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


    // window.onresize = () => {
    //     if (lineChartContainer.value && lineChartContainer.value.clientWidth > 400) {
    //         barChartWidth.value = lineChartContainer.value.clientWidth;
    //     } else {
    //         barChartWidth.value = 400;
    //     }
    // };
});


</script>

<style scoped>
/* .chart__container {
    overflow: auto;
} */

.chart__container {
    width: 100%;
    max-width: 1200px;
    /* Ajustez cette valeur selon vos besoins */
    margin: 0 auto;
    /* Centre le conteneur */
    padding: 20px;
    /* Ajoute de l'espace autour du graphique */
   
}

.chart__container canvas {
    width: 100% !important;
    height: 500px !important;
    /* Hauteur fixe pour le graphique */
}

@media (max-width: 768px) {
    .chart__container {
        padding: 10px;
        /* Réduit le padding sur les petits écrans */
    }

    .chart__container canvas {
        height: 300px !important;
        /* Réduit la hauteur sur les petits écrans */
    }
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

@media screen and (max-width:1440px) {

    .dashboard__content {
        margin-top: 15px;
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
}
</style>