<template>
    <h3>Number of total media clicks</h3>
    <div v-if="hasData">
        <div class="chart-container">
            <apexchart type="donut" height="510" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
    <div v-else class="no_data">
        No clicks <br>
        <div v-if="IsValueOkay(establishment) && establishment[0] != 'all'">for establishments :
            <span v-for="estab_id, index in establishment" :key="estab_id">
                <span v-for="estab_name in establishments" :key="estab_name.id">
                    <span v-if="estab_name.id == estab_id">
                        <span v-if="index != establishment.length - 1">{{ estab_name.name }} ,</span>
                        <span v-else>{{ estab_name.name }}</span>
                    </span>
                </span>
            </span>
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
import { generateShadedPaletteByOpacity } from "@Services/theme.js"


const route = useRoute();
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter');

const units = inject('unitsFilter');
const source = inject('sourceFilter');

const series = ref([]);
const labels = ref([]);
const hasData = ref(false);
const userStore = useUserStore();

const chartOptions = ref({
    labels: labels.value,
    colors: userStore.user.partner ? generateShadedPaletteByOpacity(userStore.user.partner.back_color, 15) : generateShadedPaletteByOpacity(userStore.user.customer.partner_back_color, 15),
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
            const data = response.data;

            // Combine labels and series into an array of objects
            const combined = data.labels.map((label, index) => ({ label, series: data.series[index] }));

            // Sort the array of objects by the series value in descending order
            let sortedCombined = combined.sort((a, b) => b.series - a.series);

            // Only use series greater than zero.
            sortedCombined = sortedCombined.filter(item => item.series > 0)

            // Separate the sorted array of objects back into labels and series arrays
            const sortedData = {
                labels: sortedCombined.map(item => item.label),
                series: sortedCombined.map(item => item.series)
            };

            series.value = sortedData.series;
            labels.value = sortedData.labels;
            chartOptions.value = {
                ...chartOptions.value,
                labels: labels.value,
                colors: userStore.user.partner
                    ? generateShadedPaletteByOpacity(userStore.user.partner.back_color, series.value.length)
                    : generateShadedPaletteByOpacity(userStore.user.customer.partner_back_color, series.value.length),
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
    /* margin: 17px 0 0; */
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}

.no_data {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
}
</style>