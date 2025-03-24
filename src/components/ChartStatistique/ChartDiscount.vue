<template >
  <h3 v-if="hasData">Discount coupons</h3>
  <div v-if="hasData" style="position: relative;" >

    
 <div v-if="showModal" class="overlay" style="z-index: 9999 !important;">
    <div class="modal" @click.stop style="z-index: 9999 !important;">
     <div style="z-index: 9999 !important;">
        <h3 class="text-lg font-bold" style="margin: -15px;">Visitors</h3>
        <button class="btn text-lg close-btn" style="color: red;" @click="showModal = false">x</button>
     </div>
      <div class="modal-content" style="z-index: 9999 !important;">


          <el-table :data="visitors" class="custom-header" style="font-size: 13px !important;padding: 0px !important;margin: 0px !important;">

            <!--  <el-table-column label="Os" align="left" >
                <template #default="scope">
                  <span style="width: 3px !important;">
                    {{ scope.row.os }}
                  </span>

                </template>
              </el-table-column> -->

               <el-table-column label="OS" align="center" prop="os" show-overflow-tooltip/>

              <!--  <el-table-column label="Device" align="left" >
                <template #default="scope">
                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.device }}
                  </span>

                </template>
              </el-table-column>
 -->
              <el-table-column label="Device" prop="device"  show-overflow-tooltip />

              <el-table-column label="Country" prop="country" show-overflow-tooltip/>
            <!--   <el-table-column label="Country" align="left" >
                <template #default="scope">
                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.country }}
                  </span>

                </template>
              </el-table-column> -->

              <el-table-column label="City" prop="city" show-overflow-tooltip/>
              <!--  <el-table-column label="City" align="left" >
                <template #default="scope">
                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.city }}
                  </span>

                </template>
              </el-table-column> -->

               <el-table-column label="Gps" align="center" prop="gps"  show-overflow-tooltip/> 
            <!--   <el-table-column label="Gps" align="left" >
                <template #default="scope">
                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.gps }}
                  </span>

                </template>
              </el-table-column> -->

              <el-table-column label="Contact" align="left" show-overflow-tooltip>
                <template #default="scope">
                  <span >
                    {{ scope.row.email }}
                  </span>

                </template>
              </el-table-column>
             
               <el-table-column label="Created at" prop="created_at" show-overflow-tooltip/>
          <!--    <el-table-column label="Created At" align="left">
                <template #default="scope">
                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                     {{ scope.row.created_at ? moment(scope.row.created_at).format('YYYY-MM-DD HH:mm') : '' }}
                  </span>

                </template>
              </el-table-column> -->
         
         
           
        </el-table>

        
      </div>
      
    </div>
  </div>


   

    <div class="chart-container" >
      <apexchart  type="bar" height="460" :options="chartOptions" :series="series" @dataPointSelection="handleBarClick"/>
      
    </div>
  </div>
  <div v-else class="content-message">
    <div v-if="hasData">No clicks for <br>
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
const staffs = inject('staffs');
const unites = inject('units');
const units = inject('unitsFilter');
const userStore = useUserStore();
const hasData = ref(false);

const showModal = ref(false);
const selectedData = ref(null);

const emits = defineEmits(['showModal','setSource','show-visitors','show-chart']);


const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
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
  // colors: userStore.user.partner ? (userStore.user.partner.back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']) : (userStore.user.customer.partner_back_color == "#0a8964" ? ['#0a8964', '#48c16c'] : ['#00569D', '#009DCF']),
  colors: userStore.user.partner ? [userStore.user.partner.title_color,userStore.user.partner.back_color] : [userStore.user.customer.partner_title_color,userStore.user.customer.partner_back_color],
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
  if (serieName=='Discount email link') {
    getVisitors(chartOptions.value.xaxis.categories[dataPointIndex], chartOptions.value.xaxis.categories[dataPointIndex], timePeriods.value, establishment.value, staff.value, units.value,'advantagecontact');
  } else {
    getVisitors(chartOptions.value.xaxis.categories[dataPointIndex], chartOptions.value.xaxis.categories[dataPointIndex], timePeriods.value, establishment.value, staff.value, units.value,'discount');
  }

 emits('showModal',true);
 emits('setSource','Discount');

  //showModal.value = true;
  
}

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

  let api = `/customer/visitor/discount?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
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
      if (total <= 0) {
          emits('show-chart','discount_false');
          console.log('discount_false')
      }else{
         emits('show-chart','discount');
         console.log('discount')
      }

    } else {
      console.error('Error fetching data:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

// GET VISITORS

const getVisitors = async (start_date, end_date, timePeriods, establishment, staff, units,source) => {

 

  let api = `/customer/visitor/discount/list?tag=${route.params.tag}&from=${start_date}&to=${end_date}&source=${source}&type=${timePeriods || 'daily'}`
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
        visitors.value.push(_d);
        visiteurs.push(_d);
      })
    
      emits('show-visitors',visiteurs);
    } else {
      console.error('Error fetching visitors:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

// 

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
  left: -8%;
 background: white;
 opacity: 1;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  width: 110%;
  height: 90%;
  overflow: auto; 
  display: flex;
  flex-direction: column;
  z-index: 9999 !important;
  scrollbar-width: none;
}

.modal-content {
  flex-grow: 1;
  overflow-x: auto; 
  overflow-y: auto; 
  border: 1px solid #ccc;
  padding: 0px;
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
  z-index: 1 !important;
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
