<template>
    <h3>A propos du feedback</h3>
    <div>
        <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
        stacked: true
    },
    xaxis: {
        categories: ['Mars', 'Avril', 'Mai', 'Juin'] // Mois de l'année
    },
    colors: ['#00E396', '#FEB019'], // Couleurs des séries
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

// Données des séries
const series = ref([
    {
        name: 'Feedback submitted',
        data: [30, 20, 40, 50, 10, 20, 30, 20]
    },
    {
        name: 'Feedback non submitted',
        data: [10, 20, 30, 20, 30, 20, 40, 50]
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