<template>
  <h3>About external Qrcodes</h3>
  <div v-if="hasData" style="position: relative;">

    <div v-if="showModal" class="overlay" >
      <div class="modal" @click.stop>
       <div>
          <h3 class="text-lg font-bold" style="margin: -15px;">Visitors {{visitors[0].os}}</h3>
          <button class="btn text-lg close-btn" style="color: red;" @click="showModal = false">x</button>
       </div>
        <div class="modal-content">


            <el-table :data="visitors" class="custom-header" style="font-size: 13px !important;padding: 0px !important;margin: 0px !important;">
           
              <el-table-column label="Os" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style=" width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.os }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="OS" align="center" prop="os"/> -->

               <el-table-column label="Device" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.device }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="Device" prop="device"   /> -->

              <!-- <el-table-column label="Country" prop="country" /> -->
              <el-table-column label="Country" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.country }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="City" prop="city"/> -->
               <el-table-column label="City" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.city }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="Gps" align="center" prop="gps"  show-overflow-tooltip/> -->
              <el-table-column label="Gps" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.gps }}
                  </span>

                </template>
              </el-table-column>
             
              <!-- <el-table-column label="Visited at" prop="created_at" /> -->
            <el-table-column label="created_at" align="left" >
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                     {{ scope.row.created_at ? moment(scope.row.created_at).format('YYYY-MM-DD HH:mm') : '' }}

                  </span>

                </template>
              </el-table-column>
             
          </el-table>

          
        </div>
        
      </div>
    </div>


    <div class="chart-container">
      <apexchart type="bar" height="460" :options="chartOptions" :series="series"  @dataPointSelection="handleBarClick"/>
    </div>

  </div>
  <div v-else class="content-message">
    <div>No scan<br>
      <span v-if="IsValueOkay(establishment) && establishment[0] != 'all'"> for establishment :
        <span v-for="(estab_id, index) in establishment" :key="estab_id">
          <span v-for="estab_name in establishments" :key="estab_name.id">
            <span v-if="estab_name.id == estab_id">
              {{ estab_name.name }}<span v-if="index !== establishment.length - 1">, </span>
            </span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, inject } from 'vue';
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import services from '@Services/services.js';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js"
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElInput, ElOption, ElSelect, ElDatePicker, ElTooltip
} from 'element-plus'

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const visitors = ref([]);
const category = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter'); 
const units = inject('unitsFilter');
const userStore = useUserStore();
const hasData = ref(false);
const showModal = ref(false);
const emits = defineEmits(['showModal','isExternal','show-visitors']);

function interpolateColor(color1, color2, steps) {
    const c1 = color1.match(/\w\w/g).map(c => parseInt(c, 16));
    const c2 = color2.match(/\w\w/g).map(c => parseInt(c, 16));
    const colors = [];

    for (let i = 0; i <= steps; i++) {
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * (i / steps));
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * (i / steps));
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * (i / steps));
        colors.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`);
    }
    return colors;
}



const chartOptions = ref({
  chart: {
    id: 'vuechart-example2',
    stacked: true,
  },
  events: {
      dataPointSelection: (event, chartContext, config) => {
       
        handleBarClick(event, chartContext, config);
      }
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
  colors: interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, 3),
  // colors: userStore.user.partner ? [userStore.user.partner.back_color, userStore.user.partner.title_color] : [userStore.user.customer.partner_back_color, userStore.user.customer.partner_title_color],
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

const handleBarClick = (event, chartContext, config)=> {
 
  const { dataPointIndex } = config;
  const serieName = series.value[config.seriesIndex]?.name;
  
    getVisitors(chartOptions.value.xaxis.categories[dataPointIndex], chartOptions.value.xaxis.categories[dataPointIndex], timePeriods.value, establishment.value, staff.value, units.value,serieName);
  emits('showModal',true);
 emits('isExternal',true);
  // showModal.value = true;
  
}

const getMaxData = (_series) => {
 const maxIndex = _series[0].data.length;
const sums = Array.from({ length: maxIndex }, (_, i) => 
  _series.reduce((sum, s) => sum + s.data[i], 0)
);

const maxData = Math.max(...sums);
  return maxData;
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, timePeriods, establishment, staff, units) => {

  if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
    start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
    end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
  }

  let api = `/customer/visitor/external?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
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
      const maxValue = response.data.series.length > 0 ? getMaxData(response.data.series) : 0;
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
          categories: category.value,
        },
        yaxis: {
          max: maxValue,
        },
        colors : interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, response.data.series.length)
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

const getVisitors = async (start_date, end_date, timePeriods, establishment, staff, units,caption) => {



  let api = `/customer/visitor/external/list?tag=${route.params.tag}&from=${start_date}&to=${end_date}&caption=${caption}&type=${timePeriods || 'daily'}`
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
       let visiteurs=[];
      response.data.forEach((_d)=>{
        _d['created_at']=moment(_d['created_at']).format('YYYY-MM-DD HH:mm')
        // visitors.value.push(_d);
        visiteurs.push(_d);
      })
    
      emits('show-visitors',visiteurs);
      // visitors.value = response.data;
      // emits('show-visitors',response.data);

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

  .modal {
  position: absolute;
  top: 0%;
  left: -5%;
 background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  width: 110%;
  height: 90%;
  overflow: auto; 
  display: flex;
  flex-direction: column;
  z-index: 1000 !important;
  scrollbar-width: none;
}

.modal-content {
  flex-grow: 1;
  overflow-x: auto; 
  overflow-y: auto; 
  border: 1px solid #ccc;
  padding: 5px;
  white-space: nowrap; 
}

.close-btn {
  position: absolute;
  top: 1px;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;

}



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