<template>
  <el-tabs v-model="activeName" type="card" class="demo-tabs">    
      <el-tab-pane label="Staff" name="staffs">
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
          <div v-else class="chart" :style="{
            'maxWidth': '100%', // Set a maximum width
            'overflowX': isMobile ? 'scroll' : 'auto'
          }">
            <GroupedBarChart :plot-data="plotdata" x-key="date" :width="custom_width" :height="200"
              :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Reviews"
              :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']"
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
            v-for="index in 2" :key="index">
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
      </el-tab-pane>
      <el-tab-pane label="Points of sale" name="pointsOfSale">
          Coming soon...
      </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import moment from 'moment';
import { computed, onMounted, ref, watch, inject, defineAsyncComponent } from 'vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js";
import services from '@Services/services.js';
import { ElTabs, ElTabPane } from 'element-plus';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

const activeName = ref('staffs')
const appStore = useAppStore();
appStore.isLoading = false;
const chartLoading = inject('chartLoading');
const staffLoading = inject('staffLoading');

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
);

const route = useRoute();
const companyId = route.params.id;
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

const colors = ref(['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']);

const getPlotData = async (period, rangedate, companyId, next) => {
  period = period.toLowerCase();
  let format = 'YYYY-MM-DD';
  let data = [];

  if (period == 'monthly') {
    format = 'MM-YYYY'
  }

  if (period == 'yearly') {
    format = 'YYYY'
  }

  const datefrom = moment(rangedate[0]).format(format);
  const dateto = moment(rangedate[1]).format(format);

  console.log(`/establishment/${companyId}/${period}/${datefrom}/${dateto}/staff`)
  const response = await new Promise((resolve) => {
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

const getUnitServices = async(tag)=>{
   const response = await new Promise((resolve) => {
    services.get_Record(`/customer/establishments/unit?establishment=${tag}`, (response) => {
      resolve(response)
    });
  });
   console.log(response)
  if (response.status == 200) {
    console.log(response.data)
  }
}

function reordonnerObjets(listeObjets) {
  return listeObjets.map(objet => {
    const {Score, ...autresProprietes} = objet;

    let nouvelObjet = {Score };

    Object.keys(autresProprietes).forEach(propriete => {
      nouvelObjet[propriete] = autresProprietes[propriete];
    });

    return nouvelObjet;
  });
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
  const response = await new Promise((resolve) => {
    getPlotData(type.value, date.value, companyId, (response) => {
      resolve(response)
    })
  });
  plotdata.value = reordonnerObjets(response);

  await getUnitServices(companyId)
  console.log(plotdata.value)
});

watch([date, type], async () => {
  if (date.value !== null) {
    chartLoading.value = true;
    const response = await new Promise((resolve) => {
      getPlotData(type.value, date.value, companyId, (response) => {
        resolve(response)
      })
    });
    plotdata.value = reordonnerObjets(response);
    
  }
});

</script>
<style scoped>
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