<template>
    <h3>About platforms & Social Media</h3>
    <div v-if="hasData">
        <div class="chart-container">
            <apexchart type="bar" height="460" :options="options" :series="series"></apexchart>
        </div>
    </div>
    <div v-else class="content-message">
        <div>No clicks <br>
            <span v-if="IsValueOkay(establishment) && establishment[0] != 'all'">for establishments :
                <span v-for="(estab_id, index) in establishment" :key="estab_id">
                    <span v-for="estab_name in establishments" :key="estab_name.id">
                        <span v-if="estab_name.id == estab_id">
                            {{ estab_name.name }}<span v-if="index !== establishment.length - 1">, </span>
                        </span>
                    </span>
                </span><br>
            </span>
            <span v-if="IsValueOkay(source)">for source : {{ source }}<br></span>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, inject, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router'
import moment from 'moment'
import services from '@Services/services.js'
import { useUserStore } from "@Stores/user.js"
import { generateShadedPaletteByLight } from "@Services/theme.js"

const route = useRoute()

const start_date = inject('start_date')
const end_date = inject('end_date')
const timePeriods = inject('timePeriods')
const establishment = inject('establishment')
const establishments = inject('establishments')
const staff = inject('staffFilter')
const units = inject('unitsFilter')
const source = inject('sourceFilter')

const series = ref([])
const hasData = ref(false)
const userStore = useUserStore()

const options = ref({
    series: [],
    chart: {
        type: 'bar',
        height: 350,
    },
    plotOptions: {
        bar: {
            borderRadius: 0,
            horizontal: true,
            distributed: true,
            barHeight: '80%',
            isFunnel: true,
        }
    },
    colors: userStore.user.partner ? generateShadedPaletteByLight(userStore.user.partner.title_color, 5) : generateShadedPaletteByLight(userStore.user.customer.partner_title_color, 5),
    dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
            return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`;
        },
        dropShadow: {
            enabled: true,
        }
    },
    xaxis: {
        categories: [],
    },
    legend: {
        show: false,
    },
})

const IsValueOkay = (value) => ['', 'Global', 0, null, undefined].indexOf(value) === -1

const loadData = async () => {
    let formatted_start_date = IsValueOkay(start_date.value) ? moment(new Date(start_date.value)).format('YYYY-MM-DD') : ''
    let formatted_end_date = IsValueOkay(end_date.value) ? moment(new Date(end_date.value)).format('YYYY-MM-DD') : ''

    let api = `customer/visitorclick/clicks?tag=${route.params.tag}&from=${formatted_start_date}&to=${formatted_end_date}&type=${timePeriods.value || 'daily'}&source=${source.value || 'all'}`
    if (IsValueOkay(establishment.value)) api += `&establishment=${establishment.value}`
    if (IsValueOkay(units.value)) api += `&units=${units.value}`
    if (IsValueOkay(staff.value)) api += `&staff=${staff.value}`

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
            if (response.data && Array.isArray(response.data.data)) {
                series.value = [{
                    name: response.data.name || 'Series 1',
                    data: response.data.data
                }]

                hasData.value = response.data.data.length > 0

                options.value.xaxis.categories = response.data.data.map(item => item.x) || []
            } else {
                console.error('Expected array but got:', response.data);
                series.value = [];
            }
        } else {
            console.error('Error fetching data:', response)
            series.value = []
        }
    } catch (error) {
        console.error(error)
    }
}

onBeforeMount(async () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, source.value, units.value, staff.value)
});

watch([start_date, end_date, timePeriods, establishment, source, units, staff], () => {
    loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, source.value, units.value, staff.value)
})

watch([start_date, end_date, timePeriods, establishment, source, units, staff], loadData)
</script>

<script>
export default {
    components: {
        apexchart: VueApexCharts,
    }
}
</script>

<style scoped>
.chart-container {
    width: 100%;
    max-width: 100%;
}

.content-message {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    margin-top: 22px;
}

h3 {
    /* margin: 20px 0 0; */
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
</style>
