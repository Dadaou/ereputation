<template>
    <h3>About the gate</h3>
    <div class="chart-container">
        <apexchart  type="treemap" :options="chartOptions" :series="series"></apexchart>
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
    chart: {
        id: 'vuechart-treemap',
    },
    legend: {
        show: false
    },
    plotOptions: {
        treemap: {
            // distributed: true,
            enableShades: false,
            // shadeIntensity: 0.5,
            // reverseNegativeShade: true,
            colorScale: {
                ranges: [
                    // {
                    // from: 0,
                    // to: 1,
                    // color: '#dcf4e4'
                    // },
                    // {
                    // from: 1,
                    // to: 2,
                    // color: '#B8D9D2'
                    // },
                    // {
                    // from: 2,
                    // to: 3,
                    // color: '#a8e4bc'
                    // },
                    // {
                    // from: 0,
                    // to: 2,
                    // color: '#85d9a1'
                    // },
                    // {
                    // from: 3,
                    // to: 10,
                    // color: '#73d393'
                    // },
                    // {
                    // from: 11,
                    // to: 15,
                    // color: '#62ce86'
                    // },
                    {
                    from: -1,
                    to: 0,
                    color: '#48c16c'
                    },
                    {
                    from: 1,
                    to: 10,
                    color: '#30ab48'
                    },
                    {
                    from: 11,
                    to: 100,
                    color: '#3b9358'
                    },
                    {
                    from: 101,
                    to: 8000000000,
                    color: '#215332'
                    }
                   
            ]
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

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;


const loadData = async (start_date, end_date, timePeriods, establishment, source, units, staff) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/visitorclick/clicks/options?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source || 'all'}`
    if (establishment) {
        api = api + `&establishment=${establishment}`
    }
    if (units) {
        api = api + `&units=${units}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }

    //console.log("api pour le chart 2 " , api )

    // console.log("api du funnel " , api) ; 


    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            //console.log(response.data)
            series.value = response.data.series;
            // if (response.data && Array.isArray(response.data.data)) {
            //     series.value = [{
            //         name: response.data.name || 'Series 1', // Assurez-vous d'utiliser le bon nom de série
            //         data: response.data.data
            //     }];
            // } else {
            //     console.error('Expected array but got:', response.data);
            //     series.value = [];
            // }
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

watch([start_date, end_date, timePeriods, establishment, source, units, staff], () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, source.value, units.value, staff.value)
})

// Données des séries
// const series = ref([{
//     data: [
//         {
//             x: 'Reviews',
//             y: 25
//         },
//         {
//             x: 'Menu',
//             y: 15
//         },
//         {
//             x: 'Offers',
//             y: 35
//         },
//         {
//             x: 'Info',
//             y: 10
//         },
//         {
//             x: 'Follow us',
//             y: 15
//         }
//     ]
// }])
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
/* .chart-container {
    width: 100%;
    max-width: 100%;
} */

h3 {
    /* margin: 40px 0 0; */
    margin-bottom: 22px;
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>