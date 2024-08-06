<template>
    <h3>Platforms & Social Media</h3>

    <div v-if="hasData">
       
        <div class="chart-container">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
  </div>
  <div v-else>

<div>No clicks for : <br>
    <span v-if="IsValueOkay(establishment) && establishment[0] != 'all'"> establishments[
    <span v-for="estab_id in establishment" :key="estab_id">{{ estab_id }}
    <span v-for="estab_name in establishments" :key="estab_name.id"><span v-if="estab_name.id == estab_id">{{ estab_name.name }} ,</span></span></span>]<br></span>
    
    <span v-if="IsValueOkay(source)">source : {{ source }}<br></span>

    <span v-if="IsValueOkay(units)">units [
    <span v-for="unit_id in units" :key="unit_id">
    <span v-for="unite in unites" :key="unite.id"><span v-if="unite.id == unit_id">{{ unite.name }} ,</span></span></span>]<br></span>
    
    <span v-if="IsValueOkay(staff)"> staff [
    <span v-for="staff_id in staff" :key="staff_id">
    <span v-for="staff_name in staffs" :key="staff_name.id"><span v-if="staff_name.id == staff_id">{{ staff_name.firstName }} ,</span></span></span>]</span>
</div>

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
const establishments = inject('establishments');
const staffs = inject('staffs');
const unites = inject('units');
const staff = inject('staffFilter');
const units = inject('unitsFilter');
const source = inject('sourceFilter');

const series = ref([]);
const hasData = ref(false);



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
    colors: ['#3EB489'], // Couleurs des séries



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
                hasData.value = response.data.data.length > 0;
              
                
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
    margin: 20px 0 0;
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>