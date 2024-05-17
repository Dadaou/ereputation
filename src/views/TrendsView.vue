<template>
        <div style="margin-top: 15px;">
            <div class="chart-container" >
                <div v-if="isLoading" class="chart-loading">
                    <svg class="spinner" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="10" fill="none" stroke-width="2"></circle>
                    </svg>
                </div>
                <Line :data="data" :options="options" v-else />
            </div>
        </div>
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute } from "vue-router";
import { ref, watch, onBeforeMount, provide, onUpdated, inject } from 'vue';
import { ElDatePicker } from 'element-plus';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useResizeObserver } from '@vueuse/core';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const isLoading = ref(false)

const appStore = useAppStore();
const route = useRoute();
const companiesStore = useCompanyStore();

appStore.setIsExist(true);

const dataLoading = ref(true)
const companyId = route.params.id;
const customerTag = inject('tag')

let timePeriods = ref(['Daily', 'Monthly', 'Yearly']);
let selectedTimePeriod = ref(timePeriods.value[0]);
const date = ref([]);

const start_date = inject('start_date');
const end_date = inject('end_date');
let data = ref({
    labels: [],
    datasets: []
})

const options = ref({
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        }
    },
    scales: {
        y: {
            min: 0,
            max: 6,
            ticks: {
                stepSize: 1,
                precision: 0,
                beginAtZero: true
            }
        }
    }
});

provide('date', date);
provide('type', selectedTimePeriod);
const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);

const IsValueOkay = (value) => (value == '' || value == null || value == undefined) ? false : true;
watch([start_date, end_date], () => {
    if (IsValueOkay(start_date.value) && IsValueOkay(end_date.value)) {
        date.value = [start_date.value, end_date.value]
    } else {
        date.value = [];
    }
})

const loadFromServer = async (type, company, datefrom, dateto) => {
     isLoading.value = true
    const response = await new Promise((resolve) => {
        services.get_Record(`establishment/trends?tag=${company}&dateFrom=${datefrom}&dateTo=${dateto}`, (response) => {
            resolve(response)
        });

    });

    if (response.status == 200) {
        data.value = transformData({ ...response.data })
    }
     isLoading.value = false;
}

watch([date, selectedTimePeriod], () => {
    if (date.value.length == 0) {

        date.value = [moment().subtract(10, 'days').format('YYYY-M-DD'), moment().format('YYYY-M-DD')];
    }
    
    let datefrom = moment(date.value[0]).format('YYYY-MM-DD');
    let dateto = moment(date.value[1]).format('YYYY-MM-DD');
    loadFromServer(selectedTimePeriod.value.toLowerCase(), companyId, datefrom, dateto);
})

onBeforeMount(async () => {
    await loadFromServer('daily', companyId, start_date.value, end_date.value)
})


const el = ref(null);
const chartWidth = ref(0);

onUpdated(() => {
    chartWidth.value = (el.value != null && el.value != undefined) ? Math.abs(el.value.offsetWidth) : chartWidth.value;
})

useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect;
    chartWidth.value = Math.abs(width);
});

const generateColor = (text, index) => {
    const colors = ['#f75842', '#337ecc', '#1E90FF', '#87CEFA', '#B0C4DE', '#4169E1', '#231db8'];

    return colors[index];
}

function transformData(inputData) {
    const labels = Object.keys(inputData.data);
    let datasets = {};
    let index = 3;

    labels.forEach(date => {
        Object.keys(inputData.data[date]).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).forEach(key => {
            if (!datasets[key]) {
                
                if (key == 'global') {
                    datasets[key] = {
                        label: key,
                        borderColor: '#FF0000',
                        borderWidth: 3,
                        backgroundColor: '#FF0000',
                        data: Array(labels.length).fill(0),
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1
                    };
                }else if(key == 'reviews'){
                    datasets[key] = {
                        label: key,
                        borderColor: '#337ecc',
                        borderWidth: 3,
                        backgroundColor: '#337ecc',
                        data: Array(labels.length).fill(0),
                    };
                } else {
                    datasets[key] = {
                        label: key,
                        borderColor: generateColor(key, index),
                        borderWidth: 3,
                        backgroundColor: generateColor(key, index),
                        data: Array(labels.length).fill(0)
                    };
                    index++;
                }
            }
            datasets[key].data[labels.indexOf(date)] = inputData.data[date][key];
        });
    });

    let global = Object.values(datasets).find(x => x.label == 'global');

    datasets = Object.values(datasets).filter(x => x.label != 'global' && x.label != 'events');
    datasets.unshift(global)

    const result = {
        labels: labels,
        datasets: datasets
    };

    return result;
}
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 500px; /* Ajustez la hauteur selon vos besoins */
}

.chart-loading {
    position: absolute; /* Positionner de manière absolue par rapport au conteneur parent */
    top: 30%; /* Centrer verticalement */
    left: 50%; /* Centrer horizontalement */
    transform: translate(-50%, -50%); /* Décaler de moitié de la taille du conteneur */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); /* Vous pouvez personnaliser la couleur et la transparence */
    border-radius: 50%;
}

.spinner {
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;
    z-index: 1000;
}

.path {
    stroke: #333;
    stroke-linecap: round;
    animation: dash 2s ease-in-out infinite; /* Ajustez la durée de l'animation ici */
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
</style>