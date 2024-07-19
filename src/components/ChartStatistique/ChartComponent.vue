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

const category = ref([]);

// const category = ['2024-07-19', '2024-08-19']




// const tranformData = () =>{
//     // Assurez-vous que dataChart.value.categories est un tableau
//     if (Array.isArray(dataChart.value.categories)) {
//         category.value = dataChart.value.categories.map(item => item);
//         // ou utiliser forEach
//         // dataChart.value.categories.forEach(item => {
//         //     category.value.push(item);
//         // });
//     }

//     console.log("returnnnnnnnn");
//     console.log(category.value)
// }


// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
        stacked: true
    },
    xaxis: {
        // categories: category // Mois de l'année
        categories: category// Mois de l'année
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
                services.get_Record(`/customer/visitor/reviews?tag=${route.params.tag}&from=2024-06-19&to=2024-07-19&type=daily`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            console.log("data");
            dataChart.value = response.data;
            category.value = dataChart.value.categories;
            console.log(dataChart.value)
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(async () => {
   
    await loadData();
    // tranformData();
});

watch(() => dataChart.value.categories, (newCategories) => {
    if (Array.isArray(newCategories)) {
        chartOptions.value.xaxis.categories = newCategories;
    }
});


// Données des séries
const series = ref([
    {
        name: 'Feedback submitted',
        data: [30, 20]
    },
    {
        name: 'Feedback non submitted',
        data: [10, 20]
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