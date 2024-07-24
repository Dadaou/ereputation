<template>
    <h3>Number of form submitted by Units</h3>
    <div class="chart-container">
        <apexchart type="donut" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const chartOptions = ref({
    labels: ['Navette deux', 'Navette 3'], // Labels des séries
    colors: ['#0a8964', '#FEB019'], // Couleurs des séries
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(1) + "%"; // Formater la valeur avec un chiffre après la virgule
        }
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center'
    }
});
const series = ref([15, 13])

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
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>