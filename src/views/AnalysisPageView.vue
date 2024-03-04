<template>
	<div class="left__side">
        <div class="head w-full">
            <div class="app__title">
                <h2>Analysis</h2>
            </div>
        </div>
       <div id="ttv__container" style="margin-top: 25px;">
       		<p class="mb-4">
        		Below are two sets of graphs representing score and rating of all reviews.
        		The first set illustrates ratings from all reviews, while the second set displays scores from all reviews and comments combined.
        	</p>
            <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody">
                        <Bar :data="data" :options="options" />
                    </div>
                </div>
                <!-- <BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
       				</BaseLegend> -->
                <!-- <div class="legend-container">
                    <span v-for="(legendValue, index) in legendValues" :key="`legend-badge-${index}`">
                        <span :style="{ 'background-color': legendValue.color }" class="badge"></span>
                        <span class="title">{{ legendValue.label }}</span>
                    </span>
                </div> -->
            </div>
        </div>

        <div id="ttv__container" style="margin-top: 25px;">
            <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody2">
                        <Bar :data="newdata" :options="newOptions" />
                    </div>
                </div>
                <BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
       				</BaseLegend>
            </div>
        </div>
        <div class="head w-full">
            <div class="app__title">
                <h2>Synthesis</h2>
            </div>
        </div>

        <div id="ttv__container" style="margin-top: 25px;">
        	<!-- <p class="mb-4">
        		In this part, we present the summurization of all graphs presented above. The graph below illustrate the gloabl value of 
        		scores and the sentiment analysis.
        	</p> -->
            <!-- <div class="chartBox">
                <div class="containerChart">
                    <div class="containerBody3">
                        <Pie :options="chartOptions" :data="chartData"/>
                    </div>
                </div>
            </div> -->
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
import { ref, watch, onBeforeMount, inject, computed } from 'vue';
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
  LinearScale,
  ArcElement
} from 'chart.js'

import { Bar, Pie } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true)
const customerTag = inject('tag')

const route = useRoute();

const companyId = route.params.id;
const dataLoading = ref(true)
let establishment = ref({});
const categories = ref([])
const _categories = computed(()=>{
	let data= []
	categories.value.forEach(category=>{
		data.push(category.category)
	})
	return data.join(',')
})
const categoryFilters = ref(['all'])
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);
let dataLegends = ref([]);
const legendData = ref([]);

// watch(dataLegends, ()=>{
// 	if(dataLegends.value.length>0){
// 		dataLegends.value.forEach((category) => {
// 	        legendData.value.push({
// 	            name: `${category.label}: Average score (${category.avg_score}) / Sentiment analysis: ${category.feeling}`,
// 	            color: category.color
// 	        });
// 	    });
// 	}
// })

const start_date = inject('start_date');
const end_date = inject('end_date');

const newdataTest = ref({
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
      data: [2.34, 4.12, 0.87, 3.45, 1.23, 5.00, 2.76, 0.98, 4.56, 3.21, 1.67, 4.89],
      scores: [-0.45, 0.88, -0.12, 0.34, -0.76, 0.65, -0.33, 0.91, -0.58, 0.09, -0.97, 0.43],
      avg_score: 0.5, // Par exemple, score globale
      feeling: 'positive', //sentiment analysis [negative, neutre, positive]

    },
    {
      label: 'Ménage',
      backgroundColor: '#587179',
      data: [1.72, 3.25, 4.11, 0.89, 2.45, 0.37, 4.98, 2.10, 3.76, 1.43, 0.56, 5.00],
      scores: [0.45, 0.87, -0.12, 0.93, 0.75, -0.59, 0.23, 0.01, 0.62, 0.38, 0.94, -0.51],
      avg_score: 0.75, // Par exemple, score globale
      feeling: 'positive', //sentiment analysis [negative, neutre, positive]
    }
  ],
})

const newdata = ref({
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
      data: [-0.45, 0.88, -0.12, 0.34, -0.76, 0.65, -0.33, 0.91, -0.58, 0.09, -0.97, 0.43],
    },
    {
      label: 'Ménage',
      backgroundColor: '#587179',
      data: [0.45, 0.87, -0.12, 0.93, 0.75, -0.59, 0.23, 0.01, 0.62, 0.38, 0.94, -0.51],
    }
  ],
})

const data = ref({
	labels: [
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
	datasets:[
		{
	      label: 'Acceuil',
	      backgroundColor: '#f87979',
	      data: [2.34, 4.12, 0.87, 3.45, 1.23, 5.00, 2.76, 0.98, 4.56, 3.21, 1.67, 4.89],
	    },
	    {
	      label: 'Ménage',
	      backgroundColor: '#587179',
	      data: [1.72, 3.25, 4.11, 0.89, 2.45, 0.37, 4.98, 2.10, 3.76, 1.43, 0.56, 5.00],
	    }
	]
})

const newOptions = {
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    scales: {
        y: {
            suggestedMin: -1, // suggère une valeur minimale pour l'axe Y
            suggestedMax: 1, // suggère une valeur maximale pour l'axe Y
            // Assure que l'axe Y commence à -1 et se termine à 1
            ticks: {
                stepSize: 1, // Définit l'intervalle des graduations sur l'axe Y
                    callback: function(value, index, values) {
                        // Affiche uniquement les valeurs 1, 0 et -1
                        return value === 1 || value === 0 || value === -1 ? value : '';
                    }
            }
        }
    },
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

const options = {
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    scales: {
        y: {
            suggestedMin: 5,
            suggestedMax: 0,
            ticks: {
                stepSize: 1,
            }
        }
    },
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

const IsValueOkay = (value)=> (value == '' || value == null || value == undefined || value == [])?false:true;

const hashString = (inputString) => {
      let hash = 0;
      for (let i = 0; i < inputString.length; i++) {
        hash = (hash << 5) - hash + inputString.charCodeAt(i);
      }
      return hash;
}

const generateColor = (text) =>{
      const inputString = text;
      const hash = hashString(inputString);

      const red = (hash & 0xFF0000) >> 16;
      const green = (hash & 0x00FF00) >> 8;
      const blue = hash & 0x0000FF;

      return `rgb(${red}, ${green}, ${blue})`;
}

const loadAnalysisData = async(tag, dateStart, dateEnd, categories)=>{
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
    }else{
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

    if (response.status == 200) {
    	console.log(response.data)
    	const containerBody = document.querySelector('.containerBody');
        
        let totalLabels = response.data.lables.length;
        
        if (totalLabels > 11) {
            let new_width = totalLabels * 150
            containerBody.style.width = `${new_width}px`
        } else {
            containerBody.style.width = '';
        }
       await transformData(response.data)

    }
}

watch([categoryFilters, end_date, start_date], async()=>{
 await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)	
})

const transformData = (chartData)=>{
	const {lables, datasets} = chartData;
	let plotData = {
		labels: lables,
		datasets: []
	}
	let legends = []

	datasets.forEach(category=>{
		const {avg_score, feeling, ...dataset} = category 
		plotData.datasets.push({dataset, backgroundColor: generateColor(dataset.label)})
		legends.push({
			label: dataset.label,
			color: generateColor(dataset.label),
			avg_score,
			feeling
		})
	})

	data.value = plotData;
	console.log(data.value)

	if(legends.length>0){
		legendData.value = []
		legends.forEach((category) => {
	        legendData.value.push({
	            name: `${category.label}: Average score (${category.avg_score}) / Sentiment analysis: ${category.feeling}`,
	            color: category.color
	        });
	    });
	}
}

onBeforeMount(async () => {
    appStore.isLoading = true;

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
    // await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
     appStore.isLoading = false;
});


</script>
<style scoped>
	.legend, p{
		color: black;
		font-weight: 500;
		margin-top: 2rem;
		font-size: 14px;
	}

</style>