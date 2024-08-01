<template>
    <h3>Platforms & Social Media</h3>
    <div class="chart-container">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, inject, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import moment from 'moment';
import services from '@Services/services.js';

const route = useRoute();

const start_date = inject('start_date');
const end_date = inject('end_date');

const timePeriods = inject('timePeriods');

const establishment = inject('establishment');

const staff = inject('staffFilter');
const units = inject('unitsFilter');
const source = inject('sourceFilter');

const series = ref([]);




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


const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;


const loadData = async (start_date, end_date, timePeriods, establishment, source, units, staff) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/visitorclick/clicks?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source || 'all'}`
    if (establishment) {
        api = api + `&establishment=${establishment}`
    }
    if (units) {
        api = api + `&units=${units}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }

    // console.log("api du funnel " , api) ; 


    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            //console.log(response.data)
            if (response.data && Array.isArray(response.data.data)) {
                series.value = [{
                    name: response.data.name || 'Series 1', // Assurez-vous d'utiliser le bon nom de série
                    data: response.data.data
                }];
            } else {
                console.error('Expected array but got:', response.data);
                series.value = [];
            }
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(async () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, source.value, units.value, staff.value)
});

watch([start_date, end_date, timePeriods, establishment,source , units , staff], () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value ,source.value , units.value , staff.value)
})

// Données des séries
// const series = ref([
//     {
//         name: "Platforms",
//         data: [
//             {
//                 x: "Facebook",
//                 y: 1380
//             },
//             {
//                 x: "Google",
//                 y: 1100
//             },
//             {
//                 x: "Trip Advisor",
//                 y: 990
//             },
//             {
//                 x: "Booking",
//                 y: 880
//             },
//             {
//                 x: "Instagram",
//                 y: 740
//             },
//         ],
//     },
// ])
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