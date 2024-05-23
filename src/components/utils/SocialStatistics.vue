<template>
    <div class="w-full">
        <div v-if="lineData" class="chart__container w-full" ref="lineChartContainer">
            <Line :data="lineData" :options="options" />
        </div>
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
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
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount, inject } from 'vue';
import { useRoute } from "vue-router";
import { useSocialStore } from "@Stores/social.js";
import moment from 'moment';
import services from '@Services/services.js'
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

const route = useRoute();
const companyId = route.params.id;
const socialStore = useSocialStore();
const barChartWidth = ref(620);
const lineChartContainer = ref(null);
const start_date = inject('start_date');
const end_date = inject('end_date');
const socials = inject('socials');
const type = inject('selectedType');

const lineData = ref({
    labels: [],
    datasets: []
})
const lineLegend = ref([]);

const options = ref({
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        }
    },
    scales:
    {
        x: {
            beginAtZero: true,
            title: {
                display: false,
                text: '',
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: false,
                text: '',
            }
        },
    },
})


const loadSocialData = async (tag, startDate, endDate, type) => {
    try {
        type = type.toLowerCase()
        const response = await new Promise((resolve) => {
            services.get_Record(
                `social/establishment/${companyId}/${type}/daily/${startDate}/${endDate}/new_statistique`,
                (response) => {
                    resolve(response)
                }
            )
        });

        if (response.status == 200) {
            lineData.value = response.data;
        }
    } catch (error) {
        console.log(error)
    }
}

const getLabels = (data, endDate) => {
    let labels = []
    endDate = new Date(endDate)
    for (const [key, value] of Object.entries(data)) {
        let date = new Date(key)
        if (date < endDate) labels.push(key)
    }
    const datesObjects = labels.map(dateString => new Date(dateString));
    datesObjects.sort((a, b) => a - b);
    labels = datesObjects.map(dateObject => dateObject.toISOString().slice(0, 10));
    return labels
}

const getData = (labels, data, social, type) => {
    const today = new Date()
    let values = []
    for (var i = 0; i < labels.length; i++) {
        let date = new Date(labels[i])

        if (date <= today) {
            if (data && data[`${labels[i]}`] && data[`${labels[i]}`][`${social}`] && data[`${labels[i]}`][`${social}`][`${type}`]) {
                values.push(data[`${labels[i]}`][`${social}`][`${type}`])
            }
        }
    }
    return values
}

const transformData = (data, start_date, end_date) => {
    data = data[`${companyId}`]['daily']

    let labels = getLabels(data, end_date)
    let datasets = {
        followers: [],
        likes: [],
        shares: [],
    }

    let chartDataset = {
        labels: labels,
        datasets: []
    }

    let type = "followers";
    const colors = {
        'facebook': '#1877F2',
        'instagram': '#E4405F',
        'linkedin': '#0A66C2',
        'tiktok': '#000000',
        'twitter': '#1DA1F2',
        'youtube': '#FF0000'
    };

    let socialsLabels = []
    for (const key in socials.value) socialsLabels.push(key)
    for (var i = 0; i < socialsLabels.length; i++) {
        let social = socialsLabels[i];
        chartDataset.datasets.push({
            label: social,
            backgroundColor: colors[social],
            data: getData(labels, data, social, "followers")
        })
    }

    lineData.value = chartDataset
}

watch([start_date, end_date, type], async () => {
    await loadSocialData(companyId, moment(new Date(start_date.value)).format('YYYY-MM-DD'), moment(new Date(end_date.value)).format('YYYY-MM-DD'), type.value)
})

onBeforeMount(async () => {
    await loadSocialData(companyId, start_date.value, end_date.value, type.value)
})

window.onresize = () => {
    if (ineChartContainer.value && lineChartContainer.value.clientWidth > 400) {
        barChartWidth.value = lineChartContainer.value.clientWidth;
    } else {
        barChartWidth.value = 400;
    }
};
</script>
<style scoped>
.chart__container {
    overflow: auto;
}

.el-dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
}

@media screen and (max-width: 768px) {
    .w-full {
        width: 100%;
    }

    .my-3 {
        margin: 10px 0;
    }

    .inline-flex {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .el-dropdown {
        width: 48%;
        font-size: 14px;
    }

    .el-dropdown-menu {
        max-height: 300px;
    }
}
</style>