<template>
    <div class="w-full" >
        <div class="inline-flex justify-end items-center my-3 w-full" style="gap:8px;">
            <el-dropdown  split-button type="primary">
                {{ filter != null ? filter.label : 'Filter by' }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="f in filters" :key="f.value" @click="() => change(f, 'filter')">{{
                            f.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown  split-button type="primary">
                {{ year != null ? year.label : 'Select Year' }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="y in years" :key="y.value" @click="year = y">{{ y.label
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown  split-button type="primary">
                {{ type != null ? type.label : 'Interval' }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="t in types" :key="t.value" @click="() => change(t, 'type')">{{ t.label
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <el-dropdown v-if="showPeriod"  split-button type="primary">
                {{ period != null ? period.label : 'Period' }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="p in periods" :key="p.value" @click="period = p">{{ p.label
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
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
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute } from "vue-router";
import { useSocialStore } from "@Stores/social.js";
import moment from 'moment';

const route = useRoute();
const companyId = route.params.id;
const socialStore = useSocialStore();
let barChartWidth = ref(620);
const lineChartContainer = ref(null);

const periods = ref([]);
const types = ref([
    { label: "Week", value: "weekly" },
    { label: "Month", value: "monthly" },
    { label: "Year", value: "yearly" }
]);

const filters = ref([
    { label: "Followers", value: "followers" },
    { label: "Posts", value: "posts" },
    { label: "Likes", value: "likes" }
]);

const years = ref([
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 }
])

const period = ref(null);
const type = ref(null);
const filter = ref(null);
const year = ref(null);
const showPeriod = ref(false);

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
            beginAtZero: true, // You can configure other options for the X-axis here
            title: {
                display: false,
                text: '',
            },
        },
        y: {
            beginAtZero: true, // You can configure other options for the Y-axis here
            title: {
                display: false,
                text: '',
            }
        },
    },
})

const updatePeriods = () => {
    periods.value = []
    showPeriod.value = true;
    const yearValue = year.value ? year.value.value : new Date().getFullYear()
    if (type.value.value == 'weekly') {
        const firstDay = new Date(yearValue, 0, 1)
        let monday = moment(new Date(firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1)));
        for (let i = 1; i <= 53; i++) {
            periods.value.push({
                label: monday.format('LL'),
                value: i
            })
            monday = monday.add(1, 'week')
        }
    }
    if (type.value.value == 'monthly') {
        periods.value = [
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' }
        ]
    }
    if (type.value.value == 'yearly') {
        showPeriod.value = false;
    }
}

const change = (value, element) => {
    if (element == 'type') {
        type.value = value
    }
    if (element == 'filter') {
        filter.value = value;
    }
}

const checkData = (data) => {
    let allzero = true;
    data.forEach(value=>{
        if(value != 0) allzero = false 
    })
    return allzero;
}

const updateData = async () => {
    const today = new Date().getDate();

    const yearValue = year.value ? year.value.value : new Date().getFullYear()
    const filterValue = filter.value ? filter.value.value : 'followers'
    const typeValue = type.value ? type.value.value : 'yearly'
    let periodValue = period.value ? period.value.value : ''

    if (typeValue == 'weekly' && periodValue != '') {
        periodValue = periodValue + '-' + yearValue
    }
    if (typeValue == 'monthly' && periodValue != '') {
        periodValue = periodValue + '-' + yearValue
    }
    if (typeValue == 'yearly') {
        periodValue = yearValue
        showPeriod.value = false
    }

    const datas = await socialStore.getGlobalStats(companyId, typeValue, periodValue)

    let data = {
        labels: [],
        datasets: []
    }

    const colors = {
        'facebook': '#1877F2',
        'instagram': '#E4405F',
        'linkedin': '#0A66C2',
        'tiktok': '#000000',
        'twitter': '#1DA1F2',
        'youtube': '#FF0000'
    };
    if (datas) {
        console.log(today)
        data.labels = datas.labels.filter(label=> label<=today);

        for (const [key, value] of Object.entries(datas.data)) {
            
            if(!checkData(value[filterValue])){
                data.datasets.push({
                    label: key,
                    backgroundColor: colors[key],
                    data: value[filterValue]
                })
            }
        }
        lineData.value = data;
        console.log(lineData.value)
    }
}
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
const setCurrentDate = ()=>{
      const currentDate = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     
      period.value = { 
        label: monthNames[currentDate.getMonth()], 
        value: (currentDate.getMonth() + 1).toString().padStart(2, '0') 
      }

      year.value =  { 
        label: currentDate.getFullYear().toString(), 
        value: currentDate.getFullYear() 
      }
}
onMounted(async () => {
    type.value = { label: "Month", value: "monthly" }
    setCurrentDate();
    filter.value = { label: "Followers", value: "followers" }
    const datas = await socialStore.getGlobalStats(companyId, 'monthly', `${period.value.value}-${year.value.value}`)

    let data = {
        labels: [],
        datasets: []
    }
    const colors = {
        'facebook': '#1877F2',
        'instagram': '#E4405F',
        'linkedin': '#0A66C2',
        'tiktok': '#000000',
        'twitter': '#1DA1F2',
        'youtube': '#FF0000'
    };

    data.labels = datas.labels;

    for (const [key, value] of Object.entries(datas.data)) {
         if(!checkData(value[filter.value.value])){
                data.datasets.push({
                    label: key,
                    backgroundColor: colors[key],
                    data: value[filter.value.value]
                })
        }
    }

    lineData.value = data;
});

watch([type], () => {
    updatePeriods();
});

watch([type, year, period, filter], () => {
    console.log(type.value)
    updateData();
})

window.onresize = () => {
    if (lineChartContainer.value.clientWidth > 400) {
        barChartWidth.value = lineChartContainer.value.clientWidth;
    } else {
        barChartWidth.value = 400;
    }
};

onBeforeUnmount(()=>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        ArcElement
    )
});
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