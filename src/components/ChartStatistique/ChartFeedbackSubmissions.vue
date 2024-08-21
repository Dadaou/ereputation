<template>
  <h3>Feedback form submissions</h3>

  <div v-if="hasData">
    <div class="chart-container">
      <apexchart type="bar" height="460" :options="chartOptions" :series="series" />
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
      <span v-if="IsValueOkay(start_date) && IsValueOkay(end_date)"> date :
        from {{ formattedStartDate }} to {{ formattedEndDate }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, inject, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import services from '@Services/services.js';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js"

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const category = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter');
const staffs = inject('staffs');
const unites = inject('units');
const units = inject('unitsFilter');
const userStore = useUserStore();
const hasData = ref(false);
const formattedStartDate = computed(() => moment(start_date.value).format('ddd DD MMM YYYY'));
const formattedEndDate = computed(() => moment(end_date.value).format('ddd DD MMM YYYY'));
const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
    stacked: true,
  },
  xaxis: {
    categories: [],
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
  },
  // colors: userStore.user.partner ? (userStore.user.partner.back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']) : (userStore.user.customer.partner_back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']),
  colors: userStore.user.partner ? [userStore.user.partner.back_color, userStore.user.partner.title_color] : [userStore.user.customer.partner_back_color, userStore.user.customer.partner_title_color],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
    },
  },
});

const getMaxData = (data1, data2) => {
  let max1 = Math.ceil(Math.max(...data1) / 10) * 10;
  let max2 = Math.ceil(Math.max(...data2) / 10) * 10;

  if (max2 > max1) {
    max1 = max2;
  }
  return max1;
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, timePeriods, establishment, staff, units) => {

  if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
    start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
    end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
  }

  let api = `/customer/visitor/reviews?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
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
      const maxValue = response.data.series.length > 0 ? getMaxData(response.data.series[0].data, response.data.series[1].data) : 0;
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
          categories: category.value,
        },
        yaxis: {
          max: maxValue,
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

watch([start_date, end_date, timePeriods, establishment, staff, units], () => {
  loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value)
})

onBeforeMount(async () => {
  await loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value);
});


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

.inside {
  display: flex;
  justify-content: center;
}

h3 {
  /* margin: 40px 0 0; */
  text-align: center;
  padding: 20px;
  font-weight: 600;
  font-size: 14px;
  color: rgb(101, 101, 101);
}

.inside {
  padding: 20px;
}

.date__filter {
  margin-bottom: 20px;
}

.text-sm {
  font-size: 0.875rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.content-message {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 22px;
}
</style>
