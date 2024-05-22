<template>
    <div class="mb-2">
        Your customers appreciated your establishment for the following sercices:
        <span v-for="rating in ratings">
            {{ rating.avg_rating >= 4 ? rating.label : '' }}
        </span>
    </div>
    <div class="mb-2">
        Your customers believe that you can improve the quality of the following services:
        <span v-for="rating in ratings">
            {{ (rating.avg_rating < 4 && rating.avg_rating >= 3) ? rating.label : '' }}
        </span>
    </div>
    <div class="mb-2">
        It is necessary to establish actions in order to improve the following areas:
        <span v-for="rating in ratings">
            {{ rating.avg_rating < 3 ? rating.label : '' }} </span>
    </div>
    <div :class="['chartBox', isLoading ? 'loaded' : '']">
        <div class="containerChart">
            <div :class="['containerBody', !isLoading ? '' : 'loading']">
                <Bar :data="ratingChart" id="rating" :options="options" />
            </div>

            <div :class="['containerBody2', !isLoading ? '' : 'loading']">
                <Bar :data="confidenceChart" id="confidence" :options="newOptions" />
            </div>
        </div>
        <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
        <BaseLegend :class="['legend', !isLoading ? '' : 'loading']" :LegendData="legendData" :alignment="'vertical'">
        </BaseLegend>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, watch, onMounted, defineAsyncComponent, inject, computed } from 'vue';
import services from '@Services/services.js';
import { useCompanyStore } from "@Stores/company.js";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'vue-chartjs';
import { useRoute } from "vue-router";
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const companiesStore = useCompanyStore();
const route = useRoute();
const companyId = route.params.id;
const start_date = inject('start_date');
const end_date = inject('end_date');
const categoryFilters = inject('categoryFilters');
const _categories = inject('_categories');
const isLoading = ref(true);
const avgScore = ref(0);
const legendData = ref([]);
const ratingChart = ref({
    labels: [],
    datasets: []
});
const ratings = ref([])

const confidenceChart = ref({
    labels: [],
    datasets: []
})
const activeName = ref('categorization');
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
                callback: function (value, index, values) {
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
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
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

const IsValueOkay = (value) => (value == '' || value == null || value == undefined || value == []) ? false : true;

const hashString = (inputString) => {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = (hash << 5) - hash + inputString.charCodeAt(i);
    }
    return hash;
}

const generateColor = (text) => {
    const inputString = text;
    const hash = hashString(inputString);

    const red = (hash & 0xFF0000) >> 16;
    const green = (hash & 0x00FF00) >> 8;
    const blue = hash & 0x0000FF;

    return `rgb(${red}, ${green}, ${blue})`;
}

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

const calculateAvg = (data) => {
    let m = 0;
    data.forEach(value => {
        m = (m + value) / 2
    })
    return Number(m.toFixed(1))
}

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

    datasets.forEach(category => {
        const { avg_score, feeling, scores, avg_rating, data, label } = category
        const color = generateColor(label)
        plotData1.datasets.push({
            label: label,
            backgroundColor: color,
            data: scores,
            fill: false
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
            avg_rating: calculateAvg(data)
        })
    })

    ratingChart.value = plotData2;
    confidenceChart.value = plotData1;
    score = score / datasets.length;
    avgScore.value = score;

    if (legends.length > 0) {
        legendData.value = []
        legends.forEach((category) => {
            legendData.value.push({
                name: category.label,
                color: category.color
            });
        });
    }
};

watch(_categories, async () => {
    await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
});
// onMounted(async () => {
//    await loadAnalysisData(companyId, start_date.value, end_date.value, categoryFilters.value)
// });
</script>
<style scoped>
.loaded {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
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
</style>