<template>
    <div :style="{ width: width }">
        <div class="inline-flex items-center my-3 w-full pr-6">
            <el-date-picker class="mt-2" v-model="dateEnd" placeholder="Search a date" :size="'large'" />
            <!-- <VueDatePicker class="mb-2 mt-2" v-model="dateEnd" :format="format2" /> -->
        </div>
        <div v-if="data && data.length > 0" class="chart__container" :style="{ width: width }" ref="barChartContainer">
            <!-- <Bar v-if="data" :data="data" :options="options" :style="{ height: '200px', width: '100%' }" /> -->
            <GroupedBarChart v-if="data && data.length > 0" :plot-data="data" x-key="website" :width="900" :height="300"
                :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Website" y-axis-label=""
                :y-tick-format="d => `${d}`" />
        </div>
    </div>
</template>

<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { ElDatePicker } from 'element-plus';
// import { Bar } from 'vue-chartjs'
import { ref, watch, onBeforeMount } from 'vue';
import { useRoute } from "vue-router";
import { useSocialStore } from "@Stores/social.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const route = useRoute();
const companyId = route.params.id;

const props = defineProps(["width"]);
const socialStore = useSocialStore();
let barChartWidth = ref(620);
const barChartContainer = ref(null);

const dateEnd = ref();

const data = ref([])

// const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     legend: {
//         display: false
//     }
// };

// const data = computed(() => {
//     return props.values;
// })

const getHisto = async (dateEnd) => {
    const res = await socialStore.getHistogram(companyId, dateEnd.value)
    const tmp = []
    if (res) {
        for (const [key, value] of Object.entries(res)) {
            const d = {
                "website": key,
                "Followers": value[0] ? value[0] : 0,
                "Likes": value[1] ? value[1] : 0,
                "Posts": value[2] ? value[2] : 0
            }
            tmp.push(d)
        }
    }
    data.value = tmp
};

onBeforeMount(() => {
    getHisto(new Date());
})

watch([dateEnd], () => {
    getHisto(dateEnd);
});

window.onresize = () => {
    if (barChartContainer.value.clientWidth > 400) {
        barChartWidth.value = barChartContainer.value.clientWidth;
    } else {
        barChartWidth.value = 400;
    }
};

</script>
<style scoped>
.chart__container {
    overflow: auto;
}
</style>