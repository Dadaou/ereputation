<template>
    <div>
        <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']">
            <div class="containerChart" ref="scrollContainer2"
                @scroll="syncScroll('scrollContainer2', 'scrollContainer1')">
                <div :class="['containerBody2 mt-5', !isLoading ? '' : 'loading']">
                    <Line :data="chartData" id="confidence" :options="chartConfig" />
                </div>
            </div>

            <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
        </div>

        <BaseLegend v-if="chartLoading == false" class="legend" :LegendData="legendData" :alignment="'horizontal'">
        </BaseLegend>
    </div>
    <div class="relative overflow-x-auto" style="margin-top: 15px;">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Establishment
                    </th>
                    <th scope="col" class="px-6 py-3" @click="toggleSort('average_score')">
                        <span v-if="sortBy === 'average_score' && sortAsc" class="arrow-up">&#9650;</span>
                        <span v-if="sortBy === 'average_score' && !sortAsc" class="arrow-down">&#9660;</span>
                        Global score average within the date range
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Current score
                    </th>
                </tr>
            </thead>
            <tbody v-if="sortedCompetitorData.length > 0">
                <tr v-for="competitorDatas in sortedCompetitorData" :key="competitorDatas.id"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ competitorDatas.name }}
                    </th>
                    <td class="px-6 py-4">
                        {{ competitorDatas.average_score }}
                    </td>
                    <td class="px-6 py-4">
                        {{ competitorDatas.current_score }}
                    </td>

                </tr>
            </tbody>
            <tbody v-else>
                <tr class="no__staff">
                    <td colspan="4">
                        <div style="text-align: center;">
                            <span>no staff</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import { ref, watch, onMounted ,computed, provide, inject, defineAsyncComponent , nextTick } from 'vue';
import 'element-plus/es/components/date-picker/style/css'
import { useChartsStore } from "@Stores/charts.js"

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
// } from 'chart.js'
import { Line } from 'vue-chartjs';




const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
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
const companiesStore = useCompanyStore();
let selectedCompetitors = ref('Global');
let selectedWebsites = ref('Global');
let websites = ref(['Global']);

let establishment = ref({ reviews: [] });



let visibleData = ref([])
const starsData = ref([])


const all_items = ref({
    rating: { title: "Score", value: 0, icon: "uil-thumbs-up", description: "Average score from selected filters" },
    global: { title: "Global", value: 0, icon: "uil-star", description: "Current average score displayed on public platforms (considering all the history retained by the platforms)" },
    index: { title: "Index", value: 0, icon: "uil-analysis", description: "Index is an indicator betwenn 0 and 1 built on algorithms with differents metrics such as scores, AI reviews analysis, social media trends… The closer the indicator is to 1, the better your reputation." },
    reviews: { title: "Reviews", value: 0, icon: "uil-comment" },
    // competitors: { title: "Competitors", value: 0, icon: "uil-building" }
});

let legendData = ref([]);
const reviewsLoading = ref(false)
const feedbackLoading = ref(false)
const semesterChartLoading = ref(false)
const chartLoading = ref(false)
const language = inject('language')
const start_date = inject('start_date');
const end_date = inject('end_date');
const categories = ref([])
const isLoading = ref(false);



let selectedTimePeriod = ref('');
// let timePeriods = ref(['Days', 'Weeks', 'Months', 'Quarters', 'Semesters']);

let competitorData = ref([]);


let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

const colors = ref(['#f75842', '#337ecc', '#4682B4', '#6495ED', '#1E90FF', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']);

let chartConfig = {
    maintainAspectRatio: false,
    scales: {
        y: {
            min: 0,
            max: 5
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'x',
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'x',
            }
        },
        beforeDraw: function (chart) {
            var ctx = chart.ctx;
            chart.data.datasets.forEach(function (dataset, i) {
                var meta = chart.getDatasetMeta(i);
                if (!meta.hidden) {
                    meta.data.forEach(function (element, index) {
                        // Dessiner le texte sous chaque barre en fonction de sa valeur
                        var dataValue = dataset.data[index];
                        var text = '';
                        if (dataValue > 0.2) {
                            text = 'Positif';
                        } else if (dataValue < -0.2) {
                            text = 'Négatif';
                        } else {
                            text = 'Neutre';
                        }
                        var fontSize = 12;
                        var fontStyle = 'normal';
                        var fontFamily = 'Arial';
                        ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                        var textWidth = ctx.measureText(text).width;
                        var elementX = element._model.x;
                        var elementY = element._model.y + 20; // Ajuster la valeur pour positionner le texte sous les barres
                        ctx.fillStyle = 'black';
                        ctx.fillText(text, elementX - textWidth / 2, elementY);
                    });
                }
            });
        }
    }
};

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
        let datachart = await chartsStore.loadDataCompetitor(establishmentTag, "daily", dateStart, dateEnd, website)
       
        await chartsStore.fetchDataCompetitor(establishmentTag, "daily", dateStart, dateEnd, website, (data) => {
            // let data = response.data.data
            competitorData.value = data;
        })


        
        chartData.value = formatSixMonthsChartData(datachart);
        

        await nextTick();

        const containerBody = document.querySelector('.containerBody');
        const containerBody2 = document.querySelector('.containerBody2');

        let totalLabels = chartData.value.labels.length;

        if (totalLabels > 11 && containerBody2 && containerBody) {
            let new_width;
            if (window.innerWidth <= 975) {
                new_width = totalLabels * 5 * chartData.value.datasets.length;
            } else {
                new_width = totalLabels * 2 * chartData.value.datasets.length;
            }
            containerBody.style.width = `${new_width}vw !important`
            containerBody2.style.width = `${new_width}vw !important`

        } else {
            containerBody.style.width = '';
            containerBody2.style.width = '';
        }
        
        legendData.value = companiesStore.generateLegend(datachart, colors.value);
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
    await  viewData(establishment, establishmentTag, dateStart, dateEnd, website, competitors, timePeriods);
    // loadReviews(establishmentTag, 1, 20, 1, dateStart, dateEnd, website, stars, language);
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

let sortBy = ref('average_score');
let sortAsc = ref(true);

const sortByCurrentScore = (data, sortBy, sortAsc) => {
    const sortedData = data.slice().sort((a, b) => {
        if (sortAsc.value) {
            return a[sortBy.value] - b[sortBy.value];
        } else {
            return b[sortBy.value] - a[sortBy.value];
        }
    });
    return sortedData;
};

const sortedCompetitorData = computed(() => {
    return sortByCurrentScore(competitorData.value, sortBy, sortAsc);
});

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortAsc.value = !sortAsc.value;
    } else {
        sortBy.value = column;
        sortAsc.value = true; // Tri ascendant par défaut lorsque vous changez la colonne de tri
    }
};


onMounted(async () => {
    appStore.isLoading = true;

    const data = await companiesStore.getEstablishment(customerTag.value, companyId.value);

    if (!data) {
        appStore.setIsExist(false);
        appStore.isLoading = false;
    } else {
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

        await globalComparison(establishment.value, companyId.value, start_date.value, end_date.value, selectedWebsites.value, '', language.value, selectedCompetitors.value, selectedTimePeriod.value);
        websites.value = ['Global', 'App (Private)', ...establishment.value['websites']];
    }

    await loadCategories(companyId.value);
});


</script>

<style scoped>
.arrow-up,
.arrow-down {
    cursor: pointer;
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