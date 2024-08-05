<template>
    <h3>Gate & Feedback visits</h3>
    <div class="chart-container">
        <apexchart  type="line" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref , onBeforeMount , inject , watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import moment from 'moment';
import services from '@Services/services.js';

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const category = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const staff = inject('staffFilter');
const units = inject('unitsFilter');

// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
    },
    xaxis: {
        categories: [],
    },
    colors: ['#0a8964', '#FEB019'],
    legend: {
        position: 'bottom',
        horizontalAlign: 'center'
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    yaxis: {
        min: 0,
        max: 60,
        tickAmount: 6,
        labels: {
            formatter: function (val) {
                return val.toFixed(0);
            }
        }
    }
})

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, timePeriods , establishment , staff , units ) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/visitor/chart/sources?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
    if (establishment) {
        api = api + `&establishment=${establishment}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }
    if (units) {
        api = api + `&units=${units}`
    }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            
        dataChart.value = response.data;
        category.value = response.data.categories || [];
            series.value = response.data.series || [];
           
        chartOptions.value = {
            ...chartOptions.value,
            xaxis: {
            categories: category.value,
            },
        };
        } else {
        console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(async () => {
    await loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value);
});

watch([start_date, end_date, timePeriods , establishment,staff, units ], () => {
    loadData(start_date.value, end_date.value,timePeriods.value,establishment.value,staff.value , units.value )
})
</script>

<script>
export default {
    components: {
        apexchart: VueApexCharts
    }
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    max-width: 100%;
}
.chart-container {
    margin-top: 20px;
}
h3 {
    margin: 80px 0 0;
    text-align: center;
    padding: 2px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>