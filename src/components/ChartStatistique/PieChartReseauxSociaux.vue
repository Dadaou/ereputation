<template>
    <h3>Number of total media click</h3>

    <div v-if="hasData">
       
        <div class="chart-container">
        <apexchart type="donut" height="350" :options="chartOptions" :series="series"></apexchart>
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
import { useRoute } from 'vue-router'
import moment from 'moment';
import services from '@Services/services.js'


const route = useRoute();
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter');
const staffs = inject('staffs');
const unites = inject('units');
const units = inject('unitsFilter');
const source = inject('sourceFilter');

const series = ref([]);
const labels = ref([]);
const hasData = ref(false);

const chartOptions = ref({
    labels: labels.value, 
    colors: ['#dcf4e4', '#B8D9D2', '#a8e4bc', '#85d9a1', '#73d393', '#62ce86', '#48c16c', '#30ab48', '#3b9358', '#215332', '#14331f'], 
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(1) + "%";
        }
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center'
    }
});



const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;


const loadData = async (start_date, end_date, timePeriods, establishment, source, units, staff) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/count/visitorclick/media/establishment?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source || 'all'}`
    if (establishment) {
        api = api + `&establishment=${establishment}`
    }
    if (units) {
        api = api + `&units=${units}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        
        if (response.status === 200 && response.data) {
                series.value = response.data.series;
                labels.value = response.data.labels;
                chartOptions.value = {
                  ...chartOptions.value,
                  labels: labels.value
                };

                const total = series.value.reduce((acc, curr) => acc + curr, 0);
                hasData.value = total > 0;
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
.vue-apexcharts {
    height: 300px !important;
}
.chart-container {
    width: 100%;
    max-width: 100%;
}

h3 {
    margin: 17px 0 0;
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>