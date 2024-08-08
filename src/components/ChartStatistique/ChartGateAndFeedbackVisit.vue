<template>
    <h3>Gate & Feedback visits</h3>
    <div v-if="hasData">
        <div class="chart-container">
            <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
    <div v-else class="content-message">
        <div>No clicks for <br>
            <span v-if="IsValueOkay(establishment) && establishment[0] != 'all'"> establishment :
                <span v-for="(estab_id, index) in establishment" :key="estab_id">
                    <span v-for="estab_name in establishments" :key="estab_name.id">
                        <span v-if="estab_name.id == estab_id">
                            {{ estab_name.name }}<span v-if="index !== establishment.length - 1">, </span>
                        </span>
                    </span>
                </span><br>
            </span>

            <span v-if="IsValueOkay(source)">source : {{ source }}<br></span>

            <span v-if="IsValueOkay(units)">units :
                <span v-for="(unit_id, index) in units" :key="unit_id">
                    <span v-for="unite in unites" :key="unite.id">
                        <span v-if="unite.id == unit_id">
                            {{ unite.name }}<span v-if="index !== units.length - 1">, </span>
                        </span>
                    </span>
                </span><br>
            </span>

            <span v-if="IsValueOkay(staff)"> staff :
                <span v-for="(staff_id, index) in staff" :key="staff_id">
                    <span v-for="staff_name in staffs" :key="staff_name.id">
                        <span v-if="staff_name.id == staff_id">
                            {{ staff_name.name }}<span v-if="index !== staff.length - 1">, </span>
                        </span>
                    </span>
                </span>
            </span>
            <span v-if="IsValueOkay(start_date) && IsValueOkay(end_date)">date :
                from {{ formattedStartDate }} to {{ formattedEndDate }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, inject, watch, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import moment from 'moment';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js"

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const category = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const staff = inject('staffFilter');
const units = inject('unitsFilter');
const userStore = useUserStore();
const establishments = inject('establishments');
const staffs = inject('staffs');
const unites = inject('units');
const hasData = ref(false);
const formattedStartDate = computed(() => moment(start_date.value).format('ddd DD MMM YYYY'));
const formattedEndDate = computed(() => moment(end_date.value).format('ddd DD MMM YYYY'));

// Options du graphique
const chartOptions = ref({
    chart: {
        id: 'vuechart-example',
    },
    xaxis: {
        categories: [],
    },
    colors: userStore.user.partner ? (userStore.user.partner.back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']) : (userStore.user.customer.partner_back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']),
    legend: {
        position: 'bottom',
        horizontalAlign: 'center'
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    yaxis: {
        min: 0,
        max: 60,
        tickAmount: 6,
        labels: {
            formatter: function (val) {
                return val.toFixed(0);
            }
        }
    }
})

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, timePeriods, establishment, staff, units) => {
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    let api = `customer/visitor/chart/sources?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
    if (establishment) {
        api = api + `&establishment=${establishment}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }
    if (units) {
        api = api + `&units=${units}`
    }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {

            dataChart.value = response.data;
            category.value = response.data.categories || [];
            series.value = response.data.series || [];

            chartOptions.value = {
                ...chartOptions.value,
                xaxis: {
                    categories: category.value,
                },
            };
            const total = series.value.reduce((totalAcc, serie) => {
                return totalAcc + (serie.data ? serie.data.reduce((acc, curr) => acc + curr, 0) : 0);
            }, 0);

            hasData.value = total > 0;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(async () => {
    await loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value);
});

watch([start_date, end_date, timePeriods, establishment, staff, units], () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value)
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
.chart-container {
    width: 100%;
    max-width: 100%;
}

.chart-container {
    margin-top: 20px;
}

h3 {
    margin: 80px 0 0;
    text-align: center;
    /* padding: 2px; */
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}

.content-message {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    margin-top: 22px;
}
</style>