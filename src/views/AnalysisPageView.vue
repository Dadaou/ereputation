<template>
    <div class="left__side">
        <div class="head w-full">
            <div class="app__title">
                <h2>Analysis</h2>
            </div>
        </div>
        <div id="ttv__container" style="margin-top: 25px;">
            <el-tabs v-model="activeName" type="card" class="demo-tabs">
                <el-tab-pane label="Categorization" name="categorization">

                    <AnalysisCategory text="Your customers appreciated your establishment for the following services"
                        :ratings="ratingsCondition1" condition='condition1' v-if="ratingsCondition1.length > 0"
                        class="mb-4" />

                    <AnalysisCategory
                        text="Your customers believe that you can improve the quality of the following services"
                        :ratings="ratingsCondition2" condition='condition2' v-if="ratingsCondition2.length > 0"
                        class="mb-4" />

                    <AnalysisCategory
                        text="It is necessary to establish actions in order to improve the following areas"
                        :ratings="ratingsCondition3" condition='condition3' v-if="ratingsCondition3.length > 0"
                        class="mb-4" />

                    <!-- <StrengthWeakness :weaknesses="ratingsCondition4" :strengths="ratingsCondition1"/> -->

                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']">
                        <div class="containerChart" ref="scrollContainer1"
                            @scroll="syncScroll('scrollContainer1', 'scrollContainer2')">
                            <div :class="['containerBody', !isLoading ? '' : 'loading']">
                                <Bar :data="ratingChart" id="rating" :options="options" />
                            </div>
                        </div>
                        <BaseLegend :class="['legend', !isLoading ? '' : 'loading']" :LegendData="legendData"
                            :alignment="'vertical'">
                        </BaseLegend>
                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>

                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']">
                        <div class="containerChart" ref="scrollContainer2"
                            @scroll="syncScroll('scrollContainer2', 'scrollContainer1')">
                            <div :class="['containerBody2 mt-5', !isLoading ? '' : 'loading']">
                                <Line :data="confidenceChart" id="confidence" :options="newOptions" />
                            </div>
                        </div>
                        <BaseLegend :class="['legend', !isLoading ? '' : 'loading']" :LegendData="dataLegend"
                            :alignment="'vertical'">
                        </BaseLegend>
                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Staff" name="staff">
                    <StaffRanking />
                </el-tab-pane>
                <el-tab-pane label="Events & weather" name="events_weather">
                    Coming soon ...
                </el-tab-pane>
                <el-tab-pane label="Sales" name="sales">
                    <div
                        v-if="salesAnalysis && salesAnalysis.avgCustomerCard != 0 && salesAnalysis.current.avgBookings != 0 && salesAnalysis.current.avgTTV != 0 && salesAnalysis.current.score != '0'">
                        <p class="analysis-sales-title" style="margin-top: 1rem;">
                            From <span class="analysis-date">{{ salesAnalysis.startDate }}</span> to <span
                                class="analysis-date"> {{ salesAnalysis.endDate }}
                            </span>
                            <i class="ml-1 uil uil-question-circle"
                                style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                                @mouseover="(e) => { buttonRef = e.currentTarget, desc.visible = true, desc.text = 'To obtain the most relevant results possible, please select an extended date range (several months minimum).' }"
                                @mouseleave="desc.visible = false">
                            </i>
                        </p>
                        <ul class="analysis-sales">

                            <li>
                                Your average customer cart is <span class="analysis-value"> {{
                                    salesAnalysis.avgCustomerCard
                                    }} {{
                                        salesAnalysis.currency }}</span>
                            </li>
                            <li>
                                Your overall score over the selected period is <span class="analysis-value">{{
                                    salesAnalysis.current.score }}</span> which corresponds to <span
                                    class="analysis-value">{{ salesAnalysis.current.avgBookings }}</span>
                                sales with <span class="analysis-value">{{ salesAnalysis.current.avgTTV }}
                                    {{ salesAnalysis.currency }}</span> by day with this
                                score on average.
                            </li>
                        </ul>
                        <p class="analysis-sales-title" style="margin-top: 2rem;"></p>
                        <ul v-if="(salesAnalysis.under && salesAnalysis.under.bookingDiff < 0) || (salesAnalysis.above && salesAnalysis.above.bookingDiff > 0)"
                            class="analysis-sales">
                            <li v-if="salesAnalysis.under && salesAnalysis.under.bookingDiff < 0">
                                Without taking into account contextual elements, we could consider that decrease of
                                <span class="analysis-value">{{ salesAnalysis.under.scoreDiff }}</span> in
                                the score will reduce your sales by <span class="analysis-value">{{
                                    salesAnalysis.under.bookingDiff }}</span> sales (loss -<span
                                    class="analysis-value">{{
                                        salesAnalysis.under.ttvDiff }} {{ salesAnalysis.currency
                                    }})</span>
                            </li>
                            <li v-if="salesAnalysis.above && salesAnalysis.above.bookingDiff > 0">
                                Without taking into account contextual elements, we could consider that an increase of
                                <span class="analysis-value">{{ salesAnalysis.above.scoreDiff }}</span>
                                will boost your sales by <span class="analysis-value">{{
                                    salesAnalysis.above.bookingDiff }}</span> sales (profit <span
                                    class="analysis-value">{{
                                        salesAnalysis.above.ttvDiff }} {{ salesAnalysis.currency
                                    }}</span>)
                            </li>

                        </ul>
                        <div v-if="salesAnalysis.events.length">
                            <p style="font-size: 1rem;">
                                These indicators doesn't take into account the following events :
                            </p>
                            <ul class="sales-event-list">
                                <li v-for="item in salesAnalysis.events" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Trends" name="trends">
                    Coming soon ...
                </el-tab-pane>
                <el-tab-pane label="Alerts" name="alerts">
                    Coming soon ...
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

    <div class="tablet_mobile__filter">
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
            <!-- <div class="society__location">
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
            </div> -->
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
        <div
            class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
            <!-- <DropdownComponent class="dropdown" title="Filter by sentiment analysis" placeholder="Select a sentiment"
                :data="feelings" @submit="(feeling) => {
                    selectedFeeling = feeling
                }" :default="feelings[0]" /> -->

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
                <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
                <el-date-picker class="mt-2" v-model="end_date" placeholder="End date" :size="'large'" />
            </div>
        </div>
        <CommunityFeedbackComponent :reviewFeedbackData="services.getScoreColor(avgScore)" />
        <el-tooltip ref="tooltipRef" :visible="desc.visible" :virtual-ref="buttonRef" virtual-triggering
            popper-class="singleton-tooltip" placement="top">
            <template #content>
                <span> {{ desc.text }} </span>
            </template>
        </el-tooltip>
    </div>
</template>
<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import CommunityFeedbackComponent from "@Components/utils/CommunityFeedbackComponent.vue";
import { ref, watch, onBeforeMount, onMounted, inject, computed, defineAsyncComponent, provide } from 'vue';
import { ElDatePicker, ElOption, ElSelect, ElTabs, ElTabPane, ElTooltip } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   ArcElement
// } from 'chart.js'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { Line, Bar } from 'vue-chartjs'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const Categorization = defineAsyncComponent(() =>
    import('@Components/analysis/CategorizationComponent.vue')
)

const AnalysisCategory = defineAsyncComponent(() =>
    import('@Components/utils/AnalysisDescComponent.vue')
)

const StrengthWeakness = defineAsyncComponent(() =>
    import('@Components/utils/StrengthWeaknessComponent.vue')
)

const StaffRanking = defineAsyncComponent(() =>
    import('@Views/StaffRankingPageView.vue')
)

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true)
const customerTag = inject('tag')

const route = useRoute();

const companyId = route.params.id;
const dataLoading = ref(false)
const isLoading = ref(false)
let establishment = ref({});
const categories = ref([])
provide('categories', categories)
const avgScore = ref(0)
const _categories = computed(() => {
    let data = []
    categories.value.forEach(category => {
        data.push(category.category)
    })
    console.log(categories.value)
    return data.join(',')
})
provide('_categories', _categories)
const categoryFilters = ref(['all'])
provide('categoryFilters', categoryFilters)

const desc = ref({
    text: '',
    visible: false
})
const buttonRef = ref()

const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
const dataLegend = ref([]);
const legendData = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const ratingChart = ref({
    labels: [],
    datasets: []
})
const colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']

const confidenceChart = ref({
    labels: [],
    datasets: []
})
const ratings = ref([])

const salesAnalysis = ref(null)

const ratingsCondition1 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating >= 4)
    return data
})

const ratingsCondition2 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 4 && value.avg_rating >= 3)
    return data
})

const ratingsCondition3 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 3)
    return data
})

const ratingsCondition4 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 4)
    return data
})

const activeName = ref('categorization');
const newOptions = {
    maintainAspectRatio: false,
    scales: {
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

const options = {
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 10
        }
    },
    scales: {
        y: {
            suggestedMin: 5,
            suggestedMax: 0,
            ticks: {
                stepSize: 1,
            },
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
        }
    }
};

const scrollContainer1 = ref(null);
const scrollContainer2 = ref(null);

const syncScroll = (source, target) => {
    const sourceElement = source === 'scrollContainer1' ? scrollContainer1.value : scrollContainer2.value;
    const targetElement = target === 'scrollContainer1' ? scrollContainer1.value : scrollContainer2.value;

    if (sourceElement && targetElement) {
        targetElement.scrollLeft = sourceElement.scrollLeft;
    }
}

const calculateAvg = (data) => {
    let m = 0;
    data.forEach(value => {
        m = (m + value) / 2
    })
    return Number(m.toFixed(1))
}

const handleCategoryDropdown = (type) => {
    const filters = type == 'other' ? categoryFilters.value.filter(category => category != 'all') : ['all']
    categoryFilters.value = categoryFilters.value.length > 0 ? filters : ['all']
}

const loadCategories = async (tag) => {
    const api = `establishment/${tag}/categories`
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        console.log(response.data)
        if (response.data && response.data.data) {
            categories.value = response.data.data
        }
    }
}

const IsValueOkay = (value) => (value == '' || value == null || value == undefined || value == []) ? false : true;

const loadAnalysisData = async (tag, dateStart, dateEnd, categories) => {
    isLoading.value = true
    let apiBase = `get/chart/review/by/etablishment`;
    let apiParams = `etablishment=${tag}`;

    if (IsValueOkay(dateStart)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD')
        apiParams += `&from=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        dateEnd = moment(dateEnd).format('YYYY-MM-DD')
        apiParams += `&to=${dateEnd}`;
    }

    if (IsValueOkay(categories) && categories[0] !== 'all') {
        apiParams += `&category=${categories.join(',')}`;
    } else {
        apiParams += `&category=${_categories.value}`;
    }

    const api = `${apiBase}?${apiParams}`;
    console.log(api)

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    console.log(response)
    isLoading.value = false

    if (response.status == 200) {
        console.log(response.data)
        const containerBody = document.querySelector('.containerBody');
        const containerBody2 = document.querySelector('.containerBody2');


        let totalLabels = response.data.labels.length;

        if (totalLabels > 11 && containerBody2 && containerBody) {
            let new_width = totalLabels * 75 * response.data.datasets.length
            containerBody.style.width = `${new_width}px`
            containerBody2.style.width = `${new_width}px`
        } else {
            containerBody.style.width = '';
            containerBody2.style.width = '';
        }
        await transformData(response.data)
    }
}

const loadSalesAnalysisData = async (tag, dateStart, dateEnd) => {
    console.log("Entrée ici...")
    isLoading.value = true
    let apiBase = `establishment/analysis/sales`;
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD')
        apiParams += `&dateFrom=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        dateEnd = moment(dateEnd).format('YYYY-MM-DD')
        apiParams += `&dateTo=${dateEnd}`;
    }

    const api = `${apiBase}?${apiParams}`;
    console.log(api)

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    // console.log(response)
    isLoading.value = false

    if (response.status == 200) {
        console.log(response.data)
        salesAnalysis.value = response.data
    }
}

watch([categoryFilters, end_date, start_date], async () => {
    await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
    await loadSalesAnalysisData(companyId, start_date.value, end_date.value)
})

const transformData = (chartData) => {
    const { labels, datasets } = chartData;
    //scores or confidence chart
    let plotData1 = {
        labels: labels,
        datasets: []
    }

    let score = 0;

    //rating chart
    let plotData2 = {
        labels: labels,
        datasets: []
    }

    let legends = []
    ratings.value = []

    datasets.forEach((category, index) => {
        const { avg_score, feeling, scores, data, label } = category
        // const color = services.generateColor(label)
        const color = colors[index]
        plotData1.datasets.push({
            label: label,
            backgroundColor: color,
            borderColor: color,
            data: scores,
            // pointRadius: 0,
            // fill: false,
            tension: 0.1
        })
        score = + avg_score;

        plotData2.datasets.push({
            label: label,
            backgroundColor: color,
            data: data,
            fill: false
        })

        legends.push({
            label: label,
            color: color,
            avg_score,
            feeling
        })

        ratings.value.push({
            label: label,
            avg_rating: calculateAvg(data),
            color: color
        })
    })

    ratingChart.value = plotData2;
    confidenceChart.value = plotData1;
    console.log(plotData2)
    score = score / datasets.length;
    avgScore.value = score;

    if (legends.length > 0) {
        legendData.value = []
        dataLegend.value = []
        legends.forEach((category) => {
            legendData.value.push({
                name: category.label,
                color: category.color
            });

            dataLegend.value.push({
                name: `${category.label}`,
                color: category.color
            });
        });
    }
}

onBeforeMount(async () => {
    appStore.isLoading = true;
    isLoading.value = true
    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
        }
        else {
            establishment.value = data;
            appStore.setCurrentPage({
                title1: "",
                title2: "Analysis",
                icon: "uil-analytics"
            });

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
                    isCurrent: false,
                },
                {
                    title: "Analysis",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
        }
    })
    await loadCategories(companyId)
    await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
    await loadSalesAnalysisData(companyId, start_date.value, end_date.value)
    appStore.isLoading = false;
});
</script>
<style scoped>
#rating .y-axis {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 2;
}

.loaded {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0.9;
    z-index: 1;
}

.legend,
p {
    color: black;
    font-weight: 500;
    margin-top: 2rem;
    font-size: 14px;
}

.loading {
    display: none;
}

.loader {
    position: absolute;
}


.analysis-date {
    color: black;
    font-weight: 700;
    font-size: 14px;
}

.analysis-value {
    color: black;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 6px;
    background-color: color-mix(in srgb, var(--color-warning) 30%, #FFF);
    border-radius: 4px;
}

.analysis-sales li {
    margin: 12px 0;
}

.analysis-sales li::before {
    content: "\1F449"
}

.sales-event-list li {
    margin: 6px 0;
}

.sales-event-list li::before {
    content: "\268A"
}

.analysis-sales-title {
    border-bottom: 1px solid color-mix(in srgb, var(--color-warning) 50%, #FFF);
    width: 100%;
    margin-bottom: .5rem;
    font-size: 1rem;
}
</style>