<template>
    <h3>A propos du Gate</h3>
    <div>
        <apexchart width="500" type="treemap" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-treemap',
    },
    legend: {
        show: false
    },
    plotOptions: {
        treemap: {
            distributed: true,
            enableShades: true,
            shadeIntensity: 0.5,
            reverseNegativeShade: true,
            colorScale: {
                ranges: [{
                    from: 0,
                    to: 100,
                    color: '#00E396'
                }]
            }
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '18px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#fff']
        },
        formatter: function (text, op) {
            return [text, op.value].join(': ');
        }
    }
})

// Données des séries
const series = ref([{
    data: [
        {
            x: 'Reviews',
            y: 25
        },
        {
            x: 'Menu',
            y: 15
        },
        {
            x: 'Offers',
            y: 35
        },
        {
            x: 'Info',
            y: 10
        },
        {
            x: 'Follow us',
            y: 15
        }
    ]
}])
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