<template>
    <h3>Feedback form submissions</h3>
    <div>
        <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { onBeforeMount, ref , watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import services from '@Services/services.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const dataChart = ref([]);
// Données des séries
const series = ref([])
const category = ref([])







// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
        stacked: true
    },
    xaxis: {
        // categories: category // Mois de l'année
        
        categories: category.value // Mois de l'année
        // categories :['2024-06-19','2024-06-20','2024-06-21','2024-06-22','2024-06-23','2024-06-24','2024-06-25']

    },
    colors: ['#0a8964', '#FEB019'], // Couleurs des séries
    legend: {
        position: 'bottom', // Position de la légende
        horizontalAlign: 'center'
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
        }
    }
})

const loadData = async () => {
    try {
        const response = await new Promise((resolve) => {
                services.get_Record(`/customer/visitor/reviews?tag=${route.params.tag}&from=2024-06-19&to=2024-06-25&type=daily`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            dataChart.value = response.data;
            category.value = response.data.categories || []
            series.value = response.data.series || []; 
            console.log(series.value);
            console.log("categorieeeeeeeeeeee")
            console.log(category.value);
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(async () => {
    await loadData();
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
h3 {
    margin: 40px 0 0;
    text-align: center;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>