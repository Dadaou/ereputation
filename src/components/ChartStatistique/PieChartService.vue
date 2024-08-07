<template>

    <h3>Number of form submitted by Units</h3>
    <div v-if="hasData">
        <div class="chart-container">
            <apexchart :key="chartKey" type="donut" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
    <div v-else>

        <div class="no_data" >
  
            <div v-if="IsValueOkay(establishment) && establishment[0] != 'all'">No forms submitted for units of establishments 
                <span v-for="estab_id,index in establishment" :key="estab_id">
                <span v-for="estab_name in establishments" :key="estab_name.id">
                    <span v-if="estab_name.id == estab_id">
                        <span v-if="index != establishment.length - 1">{{ estab_name.name }} ,</span>
                        <span v-else>{{ estab_name.name }}</span>
                    </span>
                </span>
                </span>
            </div>
            <div v-else-if="IsValueOkay(units)">
                No forms submitted for units 
                <span v-for="unit_id,index in units" :key="unit_id">
                <span v-for="unite in unites" :key="unite.id">
                    <span v-if="unite.id == unit_id">
                        <span v-if="index != units.length - 1">{{ unite.name }} ,</span>
                        <span v-else>{{ unite.name }}</span>
                    </span>
                </span>
                </span>
            </div>

        </div>



    </div>
</template>


<script setup>
import { ref, onBeforeMount, inject, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router'
import moment from 'moment';
import services from '@Services/services.js'
import { useUserStore } from "@Stores/user.js"



const route = useRoute();
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter');

const unites = inject('units');
const units = inject('unitsFilter');
const source = inject('sourceFilter');
const hasData = ref(false);


const series = ref([]);
const labels = ref([]);
const userStore = useUserStore();

const chartOptions = ref({
    labels: labels.value, 
    colors: userStore.user.partner ? (userStore.user.partner.back_color == "#0a8964" ? ['#dcf4e4', '#B8D9D2', '#a8e4bc', '#85d9a1', '#73d393', '#62ce86', '#48c16c', '#30ab48', '#3b9358', '#215332', '#14331f'] : ['#CCCCFF', '#B3B3FF', '#8080FF', '#4D4DFF', '#3333FF', '#0000FF', '#0000CC', '#0000B3', '#000080', '#000066', '#00004D']) : 
    (userStore.user.customer.partner_back_color == "#0a8964" ? ['#dcf4e4', '#B8D9D2', '#a8e4bc', '#85d9a1', '#73d393', '#62ce86', '#48c16c', '#30ab48', '#3b9358', '#215332', '#14331f'] : ['#CCCCFF', '#B3B3FF', '#8080FF', '#4D4DFF', '#3333FF', '#0000FF', '#0000CC', '#0000B3', '#000080', '#000066', '#00004D']) ,
  // Couleurs des séries
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

    let api = `customer/visitor/units?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source || 'all'}`
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
        if (response.status === 200) {
            series.value = response.data.series;
            labels.value = response.data.labels;
            chartOptions.value.labels = labels.value;

            const total = series.value.reduce((acc, curr) => acc + curr, 0);
            hasData.value = total > 0;

            if (hasData.value) {
                chartOptions.value = {
                  ...chartOptions.value,
                  labels: labels.value
                };
             
            } else {
                
                console.warn('Data is present but the sum is zero.');
            }
        } else {
            console.error('Error fetching data:', response);
            hasData.value = false;
        }
    } catch (error) {
        console.error(error);
        hasData.value = false;
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

<style scoped>
.vue-apexcharts {
    height: 300px !important;
}
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
.no_data {
  
  text-align: center;
  font-weight: bold;
}
</style>