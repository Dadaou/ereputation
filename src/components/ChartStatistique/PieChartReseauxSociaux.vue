<template>
    <h3>Nombre de click de reseaux sociaux </h3>
    <div class="chart-container">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Options du graphique
const chartOptions = ref({

    plotOptions: {
        bar: {
            horizontal: true,
            isFunnel: true,
        },
    },
    legend: {
        show: false
    },
    colors: ['#0a8964'], // Couleurs des séries



    dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
            return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`;
        },
        dropShadow: {
            enabled: true,
        },
    },


})

// Données des séries
const series = ref([
    {
        name: "Platforms",
        data: [
            {
                x: "Facebook",
                y: 1380
            },
            {
                x: "Google",
                y: 1100
            },
            {
                x: "Trip Advisor",
                y: 990
            },
            {
                x: "Booking",
                y: 880
            },
            {
                x: "Instagram",
                y: 740
            },
        ],
    },
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
    width: 100%;
    max-width: 100%;
}

h3 {
    margin: 40px 0 0;
    text-align: center;
}
</style>