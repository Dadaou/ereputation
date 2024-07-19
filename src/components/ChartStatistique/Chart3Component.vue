<template>
    <h3>Gate & Feedback visits</h3>
    <div>
        <apexchart width="500" type="line" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Mois de l'année
    },
    colors: ['#00E396', '#008FFB'], // Couleurs des séries
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
    },
    yaxis: {
        min: 10,
        max: 60,
    }
})

// Données des séries
const series = ref([
    {
        name: 'Gate visits',
        data: [35, 45, 30, 55, 40, 50, 49]
    },
    {
        name: 'Feedback visits',
        data: [20, 35, 40, 20, 35, 10, 45]
    }
])
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