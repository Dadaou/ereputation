<template>
    <div class="head">
        <div class="app__title">
            <h2>Staffs Histogram</h2>
        </div>
    </div>
    <div class="reviews__content" ref="el">
        <div v-if="chartLoading == true" :style="{
            'width': `100%`,
            'height': `200px`,
            'display': 'flex',
            'alignItems': 'center',
            'background': 'rgba(0, 0, 0, 0.1)',
            'opacity': 0.9,
            'justifyContent': 'center',
            'alignItems': 'center',
            'zIndex': 1,
            'marginTop': '10px',
            'marginBottom': '10px'
        }">
            <SpinnerComponent />
        </div>
        <!-- <StaffChartComponent v-else :width="barWidth" /> -->
        <div v-else class="chart" :style="{
            'maxWidth': '100%', // Set a maximum width
            'overflowX': isMobile ? 'scroll' : 'auto'
          }">
            <GroupedBarChart :plot-data="plotdata" x-key="date" :width="custom_width" :height="200"
              :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Rating"
              :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
              :y-tick-format="d => `${d}`" />
          </div>
          <div>
            <BaseLegend class="legend" style="margin-bottom: 50px;" :LegendData="legendData" :alignment="'vertical'">
            </BaseLegend>
          </div>
    </div>
    <div class="head">
        <div class="app__title">
            <h2>Staffs</h2>
        </div>
    </div>
    <div class="reviews__content">
        <StaffItemComponent v-if="staffLoading == false" />
        <div v-else role="status"
            class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
            v-for="index in 2">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                </div>
                <div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                </div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ElTooltip } from 'element-plus';
import { computed, onMounted, ref, watch, inject, defineAsyncComponent } from 'vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useAppStore } from "@Stores/app.js";
import services from '@Services/services.js';


const appStore = useAppStore();
appStore.isLoading = false;
const barWidth = inject('barWidth');
const chartLoading = inject('chartLoading');
const staffLoading = inject('staffLoading');

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
);

const StaffChartComponent = defineAsyncComponent(() =>
    import('@Components/utils/StaffChartComponent.vue')
);

const route = useRoute();

const type = inject('type');
const date = inject('date');
const plotdata = ref([]);
const custom_width = computed(() => {
  let nb = plotdata.value.length;
  let width = 800;
  if (nb > 9) {
    width = (width * nb) / 9;
  }

  return width;
})

const isMobile = ref(window.innerWidth <= 768);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});

const colors = ref(['#f75842', '#337ecc', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']);

const getPlotData = async (period, rangedate, next) => {
  period = period.toLowerCase();
  let format = 'YYYY-MM-DD';
  const companyId = route.params.id;
  let data = [];

  if (period == 'monthly') {
    format = 'MM-YYYY'
  }

  if (period == 'yearly') {
    format = 'YYYY'
  }

  const datefrom = moment(rangedate[0]).format(format);
  const dateto = moment(rangedate[1]).format(format);

  const response = await new Promise((resolve, reject) => {
    services.get_Record(`/establishment/${companyId}/${period}/${datefrom}/${dateto}/staff`, (response) => {
      resolve(response)
    });
  });
  if (response.status == 200) {
    data = response.data;
    chartLoading.value = false;
  }
  console.log(chartLoading.value)
  next(data);
}

const legendData = computed(() => {
  let data = [];
  let dates = plotdata.value;
  let nameSet = new Set();

  let n = 1;
  dates.forEach((date) => {
    for (const key in date) {
      if (key != "date" && key != "Score") {
        if (!nameSet.has(key)) {
          data.push({
            name: key,
            color: colors.value[n]
          });
          nameSet.add(key);
          n++;
        }
      }
    }
  });

  data.unshift({
    name: 'Score',
    color: colors.value[0]
  });

  return data;
});

onMounted(async () => {
  const response = await new Promise((resolve, reject) => {
    getPlotData(type.value, date.value, (response) => {
      resolve(response)
    })
  });
  plotdata.value = response;
  console.log(plotdata.value)
});

watch([date, type], async () => {
  if (date.value !== null) {
    chartLoading.value = true;
    const response = await new Promise((resolve, reject) => {
      getPlotData(type.value, date.value, (response) => {
        resolve(response)
      })
    });
    plotdata.value = response;
    console.log(response)
    // setTimeout(()=>{
    //    chartLoading.value = false;
    // }, 100);
  }
});

</script>
<style scoped>
.app__title {
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1 {
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2 {
    font-size: 18px;
    transition: var(--transition);
}

.reviews__content p {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-bg1);
}

.reviews__content a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}

.reviews__content a:hover {
    background-color: var(--color-danger);
    color: white;
}

.head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.reviews__content {
    margin-top: 20px;
}

.chart {
  overflow-x: auto;
  margin-bottom: 0px;
  /* margin bottom  */
}

@media (max-width: 768px) {
  .chart {
    overflow-x: scroll;
  }
}

.chart::-webkit-scrollbar {
  width: 6px;
  height: 10px !important;
  background-color: white;
}
</style>