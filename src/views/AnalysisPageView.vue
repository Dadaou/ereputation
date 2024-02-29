<template>
	<div class="left__side">
        <div class="head w-full">
            <div class="app__title">
                <h2>Analysis</h2>
            </div>
        </div>
       <div id="ttv__container" style="margin-top: 25px;">
            <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody">
                        <Bar :data="data" :options="options" />
                    </div>
                </div>
                <!-- <div class="legend-container">
                    <span v-for="(legendValue, index) in legendValues" :key="`legend-badge-${index}`">
                        <span :style="{ 'background-color': legendValue.color }" class="badge"></span>
                        <span class="title">{{ legendValue.label }}</span>
                    </span>
                </div> -->
            </div>
        </div>
        
    </div>
    
    <div class="tablet_mobile__filter">
    	<!-- <DropdownComponent class="dropdown" title="Filter by sentiment analysis" placeholder="Select a sentiment"
                :data="feelings" @submit="(feeling) => {
                    selectedFeeling = feeling
                }" :default="feelings[0]" /> -->
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
                <el-option v-for="(item, index) in categories" :key="index" :label="item.category" :value="item.category"
                    @click="handleCategoryDropdown('other')" />
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
    </div>
</template>
<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import { ref, watch, onBeforeMount, inject } from 'vue';
import { ElDatePicker, ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true)
const customerTag = inject('tag')

const route = useRoute();

const companyId = route.params.id;
const dataLoading = ref(true)
let establishment = ref({});
const categories = ref([])
const categoryFilters = ref(['all'])
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
let dataLegends = ref([]);

const data = ref({
	labels:  [
	  '2024-02-15',
	  '2024-02-16',
	  '2024-02-17',
	  '2024-02-18',
	  '2024-02-19',
	  '2024-02-20',
	  '2024-02-21',
	  '2024-02-22',
	  '2024-02-23',
	  '2024-02-24',
	  '2024-02-25'
  ],
   datasets: [
    {
      label: 'Acceuil',
      backgroundColor: '#f87979',
      data: [4.05, 2.14, 1.20, 3.79, 0.99, 4.32, 3.98, 1.80, 3.46, 2.10, 0.90, 1.11],
      // avg_score: 4.5, //exemple
      // feeling: 'positive'
    },
    {
      label: 'Ménage',
      backgroundColor: '#587179',
      data: [3.45, 1.87, 4.12, 0.93, 2.75, 4.59, 1.23, 3.01, 0.62, 4.38, 2.94, 0.51],
      // avg_score: 3, //exemple
      // feeling: 'negative'
    }
  ],
})

const options = {
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    plugins: {
        legend: {
            display: false,
            // position: 'bottom'
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
        if (response.data && response.data.data) {
            categories.value = response.data.data
        }
    }
}

const transformData = (data)=>{
	const {labels, datasets} = data;
	let plotData = {
		labels: labels,
		datasets: []
	}
	let legends = []

	datasets.forEach(category=>{
		const {avg_score, feeling, ...dataset} = category 
		plotData.datasets.push(dataset)
		legends.push({
			label: dataset.label,
			color: dataset.backgroundColor,
			avg_score,
			feeling
		})
	})

	data.value = plotData;
	dataLegends


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
            appStore.setCurrentPage({
			    title1: "",
			    title2: "Analysis",
			    icon: "uil-analytics"
			});

            appStore.setBreadcrumbs([
			    {
			        title: "Establishment",
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
            dataLoading.value = false;
        }
    })
    await loadCategories(companyId)
});


</script>