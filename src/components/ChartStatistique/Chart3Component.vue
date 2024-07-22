<template>
    <h3>Gate & Feedback visits</h3>
    <div>
        <apexchart width="500" type="line" :options="chartOptions" :series="series"></apexchart>
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





// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
    },
    xaxis: {
        categories: [], // Mois de l'année
    },
    colors: ['#0a8964', '#FEB019'], // Couleurs des séries
    legend: {
        position: 'bottom', // Position de la légende
        horizontalAlign: 'center'
    },
    stroke: {
        width: 2,
        curve: 'smooth' // Ligne lissée
    },
    markers: {
        size: 5,
    }
    // yaxis: {
    //     min: 0,
    //     max: 60,
    // }
})

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;


const loadData = async (start_date, end_date, timePeriods , establishment) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/count/navigation/visitor?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
    if (establishment) {
        api = api + `&establisment=${establishment}`
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
  await loadData(start_date.value, end_date.value,timePeriods.value,establishment.value);
});

watch([start_date, end_date, timePeriods , establishment], () => {
    loadData(start_date.value, end_date.value,timePeriods.value,establishment.value )
})




onBeforeMount(async () => {
  await loadData(start_date.value, end_date.value, timePeriods.value,establishment.value);
});

</script>

<script>
export default {
    components: {
        apexchart: VueApexCharts
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart-container {
    margin-top: 20px;
}
h3 {
    margin: 40px 0 0;
    text-align: center;
}
</style>