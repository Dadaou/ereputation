<template>
  <h3 v-if="hasData">About Document Qrcodes</h3>
  <div v-if="hasData" style="position: relative;">

   


    <div class="chart-container">
      <apexchart type="bar" height="460" :options="chartOptions" :series="series"  @dataPointSelection="handleBarClick"/>
    </div>

  </div>
  <div v-else class="content-message">
    <div v-if="hasData">No scan<br>
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
const emits = defineEmits(['showModal','setSource','show-visitors','show-chart']);

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
 emits('setSource','Document');
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

  let api = `/customer/visitor/document?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}`
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

      // category.value = ["2025-02-26","2025-02-27","2025-02-28","2025-03-01","2025-03-02","2025-03-03","2025-03-04","2025-03-05","2025-03-06","2025-03-07","2025-03-08","2025-03-09","2025-03-10","2025-03-11","2025-03-12","2025-03-13","2025-03-14","2025-03-15","2025-03-16","2025-03-17","2025-03-18","2025-03-19","2025-03-20","2025-03-21","2025-03-22","2025-03-23","2025-03-24","2025-03-25","2025-03-26"];

      series.value = response.data.series || [];

      // series.value = [{"name":"Lico Caption","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Caption candie","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Caption Zomatel","data":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Caption LCC","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Lien Hotel Ibiza","data":[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Test MV","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}];

     // let response.data.series = series.value;

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
      if (total <= 0) {
          emits('show-chart','document_false');
      }else{
          emits('show-chart','document');
      }


    } else {
      console.error('Error fetching data:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

const getVisitors = async (start_date, end_date, timePeriods, establishment, staff, units,caption) => {



  let api = `/customer/visitor/document/list?tag=${route.params.tag}&from=${start_date}&to=${end_date}&caption=${caption}&type=${timePeriods || 'daily'}`
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