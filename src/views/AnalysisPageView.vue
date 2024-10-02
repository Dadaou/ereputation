<template>
    <div class="left__side">
        <div id="ttv__container">
            <el-tabs v-model="activeName" type="card" class="demo-tabs">
                <el-tab-pane label="Categorization" name="categorization">

                    <AnalysisCategory text="Your customers appreciated your establishment for the following services"
                        :ratings="ratingsCondition1" condition='condition1' v-if="ratingsCondition1.length > 0 && noScore !==false"
                        class="mb-4" @labelChange="handleLabelChange" />

                    <AnalysisCategory
                        text="Your customers believe that you can improve the quality of the following services"
                        :ratings="ratingsCondition2" condition='condition2' v-if="ratingsCondition2.length > 0 && noScore !==false"
                        class="mb-4" @labelChange="handleLabelChange" />

                    <AnalysisCategory
                        text="It is necessary to establish actions in order to improve the following areas"
                        :ratings="ratingsCondition3" condition='condition3' v-if="ratingsCondition3.length > 0 && noScore !==false"
                        class="mb-4" @labelChange="handleLabelChange" />

                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']" v-if="visibleData.length > 0">
                        <div class="containerChart" ref="scrollContainer1"
                            @scroll="syncScroll('scrollContainer1', 'scrollContainer2')">
                            <div :class="['containerBody', !isLoading ? '' : 'loading']">
                                <Bar :data="ratingChart" id="rating" :options="options" />
                            </div>
                        </div>

                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>
                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']" v-else style="display:none">
                        <div class="containerChart" ref="scrollContainer1"
                            @scroll="syncScroll('scrollContainer1', 'scrollContainer2')">
                            <div :class="['containerBody', !isLoading ? '' : 'loading']">
                                <Bar :data="ratingChart" id="rating" :options="options" />
                            </div>
                        </div>

                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>

                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']" v-if="showConfidenceChart && noScore !== false">
                        <div class="containerChart" ref="scrollContainer2"
                            @scroll="syncScroll('scrollContainer2', 'scrollContainer1')">
                            <div :class="['containerBody2 mt-5', !isLoading ? '' : 'loading']">
                                <Line :data="confidenceChart" id="confidence" :options="newOptions" />
                            </div>
                        </div>

                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>
                    <div :class="['chartBox mt-5', isLoading ? 'loaded' : '']" v-else style="display:none">
                        <div class="containerChart" ref="scrollContainer2"
                            @scroll="syncScroll('scrollContainer2', 'scrollContainer1')">
                            <div :class="['containerBody2 mt-5', !isLoading ? '' : 'loading']">
                                <Line :data="confidenceChart" id="confidence" :options="newOptions" />
                            </div>
                        </div>

                        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
                    </div>

                    <div class="reviews__content">
                        <div class="reviews__pagination">
                            <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" @prev="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" />
                        </div>
                        <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                            @reloadData="(review) => reloadData(review)" :categories="categories" @update-feeling="updateFeeling" via='analysis' />
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
                            <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" @prev="(option) => {
                                loadReviews(companyId, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                            }" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Competitors" name="analysis_competitors">
                    <AnalysisCompetitors />
                </el-tab-pane>
                <el-tab-pane label="Staff" name="staff">
                    <StaffRanking />
                </el-tab-pane>
                <el-tab-pane label="Events & weather" name="events_weather">
                    Coming soon ...
                </el-tab-pane>
                <!--  <el-tab-pane label="Sales" name="sales">
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
                </el-tab-pane> -->
                <el-tab-pane label="Trends" name="trends">
                    <AnalysisTrend />
                </el-tab-pane>
                <el-tab-pane label="Alerts" name="alerts">
                    <AnalysisAlert :from="start_date" :to="end_date" />
                </el-tab-pane>
                <el-tab-pane label="AI summary" name="ai_summary">
                    <AiSummary />
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
        <div class="px-2 w-full my-2" v-if="activeName !== 'trends' && activeName !== 'analysis_competitors'">
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
        </div>
        <div class="photo" v-if="!dataLoading">
            <div v-if="establishment.url_source !== null" class="establishment__img">
                <img :src="establishment.url_source" alt="" :class="widthimage(establishment.url_source)"
                    id="logoimagemobile" />
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
                    <img :src="establishment.url_source" alt="" :class="widthimage(establishment.url_source)"
                        id="logoimage" />
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
            <!-- <DropdownComponent class="dropdown" title="Filter by sentiment analysis" placeholder="Select a sentiment"
                :data="feelings" @submit="(feeling) => {
                    selectedFeeling = feeling
                }" :default="feelings[0]" /> -->

            <div class="date__filter" v-if="activeName !== 'trends'  && activeName !== 'analysis_competitors'">
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

            <!-- <DropdownComponent v-if="activeName === 'analysis_competitors'" :showTitle="false" placeholder=""
                :data="timePeriods" @submit="(timePeriod) => {
                selectedTimePeriod = timePeriod
            }" :default="timePeriods[0]" /> -->
        </div>

        <CommunityFeedbackComponent v-if="activeName !== 'trends' && activeName !== 'analysis_competitors' && showConfidenceChart && noScore !== false"
            :reviewFeedbackData="reviewFeedbackData" />
        <el-tooltip ref="tooltipRef" :visible="desc.visible" :virtual-ref="buttonRef" virtual-triggering
            popper-class="singleton-tooltip" placement="top">
            <template #content>
                <span> {{ desc.text }} </span>
            </template>
        </el-tooltip>
        <div class="content_legend" v-if="activeName !== 'trends' && activeName !== 'analysis_competitors' && legendData.length > 0">
            <div v-for="(item, index) in legendData" :key="index">
                <div class="container_legend" @click="handleLegendChange(item.name)">
                    <div class="card_legend" :style="{ backgroundColor: item.color}"></div> {{ item.name }}
                </div>
            </div>
        </div>
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
import CommentComponent from '@Components/utils/CommentComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';

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

const AnalysisTrend = defineAsyncComponent(() =>
    import('@Views/TrendsView.vue')
)

const AnalysisCompetitors = defineAsyncComponent(() =>
    import('@Views/AnalysisCompetitors.vue')
)
const AnalysisAlert = defineAsyncComponent(() =>
    import('@Views/AlertView.vue')
)
const AiSummary = defineAsyncComponent(() =>
    import('@Views/AiSummaryView.vue')
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
let noScore = ref(false);
provide('categories', categories)
const avgScore = ref(0)

// calcul feedBack

let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});

// calcul sentiment analysis
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
        console.log(_score)
           console.log(rawWidth)
        return _reviewFeedbackData;
}

const updateFeeling = (newFeedbackData) =>{
   
    reviewFeedbackData.value = newFeedbackData;
}

provide('reviewFeedbackData',reviewFeedbackData);
provide('calculSentimentAnalysis',calculSentimentAnalysis);

//Fin
const _categories = computed(() => {
    let data = []
    categories.value.forEach(category => {
        data.push(category.category)
    })
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
let timePeriods = ref(['Daily', 'Weeks', 'Months']);
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
const showConfidenceChart=ref(true);
const showRatingChart=ref(true)
const ratings = ref([])

const salesAnalysis = ref(null)




const ratingsCondition1 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating >= 0.5)
   
    return data
})

const ratingsCondition2 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 0.5 && value.avg_rating >= 0)
   
    return data
})

const ratingsCondition3 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 0)
 
    return data
})

appStore.setCurrentPage({
    title1: "",
    title2: "Analysis",
    icon: "uil-estate",
});


const ratingsCondition4 = computed(() => {
    let data = ratings.value;
    data = data.filter(value => value.avg_rating < 4)
        console.log('< 4',data)
    return data
})
const starParams = route.query.star;

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

const optionsReview = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
})

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

const handleLegendChange = (name) => {
    categoryFilters.value = [name];
}

const onChange = () => {
    loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value);
};
const handleLabelChange = (selectedLabel) => {
    categoryFilters.value = [selectedLabel];
    onChange()
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
}

const IsValueOkay = (value) => (value == '' || value == null || value == undefined || value == []) ? false : true;

const loadAnalysisData = async (tag, dateStart, dateEnd, categories) => {
    isLoading.value = true
    let apiBase = `get/chart/review/by/etablishment`;
    let apiParams = `etablishment=${tag}`;

    if (IsValueOkay(dateStart)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD')
        apiParams += `&from=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD')
        apiParams += `&to=${dateEnd}`;
    }

    if (IsValueOkay(categories) && categories[0] !== 'all') {
        apiParams += `&category=${categories.join(',')}`;
    } else {
        apiParams += `&category=${_categories.value}`;
    }

    const api = `${apiBase}?${apiParams}`;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    isLoading.value = false

    if (response.status == 200) {
        const containerBody = document.querySelector('.containerBody');
        const containerBody2 = document.querySelector('.containerBody2');


        let totalLabels = response.data.labels.length;

        if (totalLabels > 11 && containerBody2 && containerBody) {
            let new_width;
            if (window.innerWidth <= 975) {
                new_width = totalLabels * 5 * response.data.datasets.length;
            } else {
                new_width = totalLabels * 5 * response.data.datasets.length;
            }
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
    isLoading.value = true
    let apiBase = `establishment/analysis/sales`;
    let apiParams = `tag=${tag}`;

    if (IsValueOkay(dateStart)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD')
        apiParams += `&dateFrom=${dateStart}`;
    }

    if (IsValueOkay(dateEnd)) {
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD')
        apiParams += `&dateTo=${dateEnd}`;
    }

    const api = `${apiBase}?${apiParams}`;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
    isLoading.value = false

    if (response.status == 200) {
        salesAnalysis.value = response.data
    }
}

watch([categoryFilters, end_date, start_date], async () => {
    await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
    await loadSalesAnalysisData(companyId, start_date.value, end_date.value)
})

const transformData = (chartData) => {



    const { labels, datasets,categorizations } = chartData;
    //scores or confidence chart
    let plotData1 = {
        labels: labels,
        datasets: []
    }

    let score = 0;
    let scoreLength = 0;

    //rating chart
    let plotData2 = {
        labels: labels,
        datasets: []
    }

    let legends = []
    ratings.value = []
    let label_category=[];
     noScore.value=false;
   
    
    datasets.forEach((category, index) => {
        const { avg_score, feeling, scores, data, label } = category
        // const color = services.generateColor(label)
        const color = colors[index]
        const allScoresZero = scores.every(score => score == 0)
       
      
       let categoryShow=false;
       let addInChart = false;
       categorizations.forEach((_categorization)=>{

            if (_categorization.category == label) {
                categoryShow = true;
            }

            if (_categorization.category == label && _categorization.feeling) {
                addInChart = true;
             
            }

       });

         if (!allScoresZero && addInChart == true) {
            noScore.value =true;
           
        }


        if (categoryShow == true) {
             
            if (addInChart == true) {
                plotData1.datasets.push({
                label: label,
                backgroundColor: color,
                borderColor: color,
                data: scores,
                // pointRadius: 0,
                // fill: false,
                tension: 0.1
                })
            }
            plotData2.datasets.push({
                label: label,
                backgroundColor: color,
                data: data,
                fill: false
            })
            ratings.value.push({
                label: label,
                avg_rating: calculateAvg(scores),
                color: color
            })

            label_category.push(label);

             scores.forEach((_sco)=>{
                 if (_sco != 0) {
                scoreLength++;
                score += _sco;
                }
             })

            legends.push({
            label: label,
            color: color,
            avg_score,
            feeling
            })
        }

      

     
    })

    ratingChart.value = plotData2;
      if (plotData2.datasets.length <= 0) {
            showRatingChart.value = false;
        }
    
  

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

    if (label_category.length <= 0) {
        if (legends.length > 0) {
            label_category = ['all'];
        } else {
            label_category = ['123'];
        }
    }
    //let missing_category_response = getReviewsNoClassificate(companyId, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, label_category, language.value)

   // missing_category_response.then((rep)=>{
        // let newDatasetsFilter={
        //     labels:plotData1.labels,
        //     datasets:plotData1.datasets.filter(_dat=>rep.includes(_dat.label) == false)
        // }

        if ( noScore.value == false ) {
            showConfidenceChart.value = false;
            noScore.value=false
 
        }else{

             confidenceChart.value = plotData1;
             console.log(confidenceChart.value)
              
            if (scoreLength > 0) {
                avgScore.value = score/scoreLength;
            } else {
                avgScore.value = 0;
            }

            let feeling_score = calculSentimentAnalysis(avgScore.value);
            reviewFeedbackData.value = feeling_score;
              showConfidenceChart.value = true;

        }
     
        
   // })

  
    loadReviews(companyId, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, label_category, language.value)
}


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

const language = inject('language')
let selectedWebsites = ref('Global');
let websites = ref(['Global']);
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
let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = star;
};


watch([start_date, end_date, selectedWebsites, categoryFilters], () => {
    categoryFilters.value = categoryFilters.value.length > 0 ? categoryFilters.value : ['all']
    //loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
   loadReviews(companyId, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value);
})


const getReviewsNoClassificate = async (tag, page, limit, current, dateStart, dateEnd, source, stars, category, language) => {
  

    let apiBase = '/review/by_establishment';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}&platform=${'all'}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }


    if (category != 'all') {
        apiParams += `&category=${category.join(',')}`
    }

    const api = apiBase + '?' + apiParams;
    let reviews_missing_categ = '';
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {

       
       let cats=[];
       const responses = response.data['data'];
        let allCategories=[];

       
        responses.forEach((_rev)=>{
           
            _rev.classifications.forEach((_cat)=>{
                  
                 if (_cat.feeling != null) {
                     cats.push(_cat.category);
                 }
                 allCategories.push(_cat.category);
            });
           
        })

     
        allCategories.forEach((_cat)=>{

            let isMissing=true;

            cats.forEach((_val)=>{

                if (_val == _cat) {
                    isMissing = false
                }

            });

            if (isMissing) {

                    if (reviews_missing_categ == '') {
                        reviews_missing_categ = _cat
                    } else {
                        reviews_missing_categ = reviews_missing_categ+','+ _cat
                    }

            }

        })

        return reviews_missing_categ;
    }
}



const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars, category, language) => {
    optionsReview.value.current = current;
    optionsReview.value.page = page;
    reviews_loader.value = true;

    let apiBase = '/review/by_establishment';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}&platform=${'all'}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }


    if (category != 'all') {
        apiParams += `&category=${category.join(',')}`
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        reviews_loader.value = false;
        optionsReview.value.max = response.data['count'];
        visibleData.value = response.data['data'];
    }
}

const reloadData = (reviewUpdated) => {
    visibleData.value.forEach((review, index) => {
        if (review.id == reviewUpdated.id) {
            visibleData.value[index].feeling = reviewUpdated.feeling;
        }
    })
}


onBeforeMount(async () => {
    appStore.isLoading = true;
    isLoading.value = true
    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
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
    //await loadReviews(companyId, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value)
    appStore.isLoading = false;


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
const widthimage = (event) => {
    // Loadging establishment__img
    if (event != undefined) {
        var imgmobile = document.getElementById("logoimagemobile");
        if (imgmobile !== null) {
            imgmobile.classList.add("fade-in");
        }
        document.getElementsByClassName("establishment__img").innerText = "Loading image...";
        return getMeta(event, (err, img) => {
            //if(img!=null){
            const heightresize = 160; //hauteur div pour l'image
            var aspectRatio = img.naturalWidth / img.naturalHeight;
            var newWidth = 0;
            if (aspectRatio == 1) {
                // ici carre
                newWidth = heightresize;
            } else {
                newWidth = heightresize * aspectRatio;
            }
            // let classy = (newWidth > 200) ? "largeClass" : "smallClass";
            let classy;
            if (newWidth > 300) {
                classy = "largeClass"; // largeClass pour les images plus larges
            } else if (newWidth > 220 && newWidth <= 300) {
                classy = "mediumClass"; // Nouvelle classe pour les images entre 240 et 300 pixels
            } else {
                classy = "smallClass"; // smallClass pour les images plus petites
            }
            // pour le desktop
            var elem = document.getElementById("logoimage");
            elem.classList.add("fade-in");
            setTimeout(() => {
                elem.classList.add('show');
                elem.style.display = "block";
            }, 10);
            elem.classList.add(classy);
            elem.src = event;
            //new Promise(resolve=>{elem.onload = resolve})

            //pour le mobile
            var elemmob = document.getElementById("logoimagemobile");
            if (elemmob !== null) {
                elemmob.classList.add(classy);

                elemmob.src = event;
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
}
</script>
<style scoped>
.containerBody,
.containerBody2 {
    min-width: 100% !important;
}

@media screen and (min-width: 540px) and (max-width: 975px) {

    .establishment__info_tablet {
        margin-top: 60px ! important;
    }

    .smallClass {
        width: auto !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 70px;
        margin-top: 0px;
        border-radius: 10px;
    }
    .mediumClass {
        margin-top: 10px ! important;
        margin-bottom: 10px;
    }
    .largeClass {
        margin-top: 10px ! important;
        margin-bottom: 10px;
    }
}

@media screen and (max-width: 520px) {

    .establishment__info_tablet {
        margin-top: 60px ! important;
    }

    .smallClass {
        width: auto !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 70px;
        margin-top: 0px;
        border-radius: 10px;
    }
    
    .mediumClass {
        margin-top: 0px ! important;
        margin-bottom: 10px;
    }
    
    .largeClass {
        margin-top: 60px ! important;
        margin-bottom: 10px;
    }
}

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
    height: 400px;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0.9;
    z-index: 1;
    position: relative;
    flex-direction: column;
}

.legend {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: auto;
    padding: 15px;
    margin: 15px auto;
    margin-top: 15px !important;
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

.smallClass {
    width: auto !important;
    height: 120% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
    border-radius: 10px;
}
.largeClass {
    width: 100% !important;
    height: auto !important;
    /* margin-top: 50px; */
    border-radius: 10px;
}
.mediumClass{
    border-radius: 10px;
}

.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}

.fade-in.show {
    opacity: 1;
}

.content_legend {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: auto;
    padding: 15px;
    margin: 15px auto;
    margin-top: 15px !important;
}

.container_legend {
    gap: 3px;
    align-items: center;
    display: flex;
}

.container_legend:hover {
    cursor:pointer;
}

.card_legend {
    width:16px;
    height: 12px;
}

.society__location {
    font-size: 13px;
    font-weight: 500;
}
</style>