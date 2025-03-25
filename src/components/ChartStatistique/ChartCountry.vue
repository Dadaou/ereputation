<template>
  <h3 v-if="hasData">About Countries</h3>
  <div v-if="paginatedSeries.length > 0" ref="chartWrapper"   style="position: relative;" class="chart-wrapper">

   



        <div class="chart-container" >
            <apexchart type="donut" 
        :height="chartHeight"  :options="chartOptions" :series="series"></apexchart>
        </div>

          <div class="legend-container">

            <div class ="legend-label">
            <ul ref="legendList">
              <li v-for="(label,index) in paginatedSeries" :key="index">
                <span class="legend-dot" :style="{ backgroundColor: chartOptions.colors[index] }"></span>
               {{ label}}
              </li>
            </ul>
            </div>

            <div class="pagination-buttons" v-if="labels.length / dynamicItemsPerPage > 1">
              <button @click="prevPage" :disabled="currentPage === 0">⬅</button>
              <button @click="nextPage" :disabled="(currentPage + 1) * dynamicItemsPerPage >= labels.length">➡</button>
            </div>

          </div>
  <!--   <div class="chart-container">
      <apexchart type="bar" height="460" :options="chartOptions" :series="series"  @dataPointSelection="handleBarClick"/>
    </div> -->

  </div>
 <!--  <div v-else class="content-message">
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
  </div> -->
</template>

<script setup>
import { ref, onBeforeMount, watch, inject,computed,nextTick,onMounted,watchEffect } from 'vue';
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import services from '@Services/services.js';
import {pays} from '@Services/countries.js';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js"
import { generateShadedPaletteByOpacity } from "@Services/theme.js"
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
const source = inject('sourceFilter')
const hasData = ref(false);
const showModal = ref(false);
const emits = defineEmits(['showModal','setSource','show-visitors','show-chart']);
const labels = ref([]);
const chartHeight = ref(480);




const currentPage = ref(0);
const dynamicItemsPerPage = ref(19);
const chartWrapper = ref(null);
const legendList = ref(null);

// const itemsPerPage = ref(5);

// const paginatedLabels = computed(() => {
//   const start = currentPage.value * itemsPerPage.value;
//   return labels.value.slice(start, start + itemsPerPage.value);
// });

// const nextPage = () => {
//   if ((currentPage.value + 1) * itemsPerPage.value < labels.value.length) {
//     currentPage.value++;
//   }
// };

// const prevPage = () => {
//   if (currentPage.value > 0) {
//     currentPage.value--;
//   }
// };
const paginatedSeries = computed(() => {
  const start = currentPage.value * dynamicItemsPerPage.value;
  return labels.value.slice(start, start + dynamicItemsPerPage.value);
});

const calculateItemsPerPage = async() => {
  
 await nextTick();
  setTimeout(()=>{

    if (!chartWrapper.value || !legendList.value || !paginatedSeries.value) return;

    const containerHeight = chartWrapper.value.clientHeight; 
    const legendItems = legendList.value.children; 

    if (legendItems.length === 0) return;
 
    let totalHeight = 0;
    let count = 0;

    for (let item of legendItems) {
      const itemHeight = item.clientHeight;
      if (totalHeight + itemHeight > containerHeight) break;
      totalHeight += itemHeight;
      count++;
    }
 console.log(count)
    dynamicItemsPerPage.value = count > 0 ? count : 19; 

  },1000)

};




const nextPage = () => {

  if ((currentPage.value + 1) * dynamicItemsPerPage.value < labels.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {

  if (currentPage.value > 0) {
    currentPage.value--;
     
  }
};
window.addEventListener("resize", ()=>{
   if (parseInt((75 * window.innerWidth)/100) > 480) {
        chartHeight.value =480
      } else {
        if (window.innerWidth <= 380) {
              chartHeight.value = window.innerWidth -20;
          }else if(window.innerWidth > 380 && window.innerWidth <= 600){
            chartHeight.value = parseInt((85 * window.innerWidth)/100);
          }else{
             chartHeight.value = parseInt((75 * window.innerWidth)/100);
          }
        
      }
       // if (window.innerWidth <= 380) {
       //      chartHeight.value = window.innerWidth -20;
       //  }else{
       //    if ((window.innerWidth / 2) > 480) {
       //      chartHeight.value = 480;
       //    } else {
       //      chartHeight.value = 420;
       //    }
          
       //  }
    });
// Recalcul après le rendu
onMounted(() => {

     // if (window.innerWidth <= 380) {
     //        chartHeight.value = window.innerWidth ;
     //    }else{
     //      if ((window.innerWidth / 2) > 480) {
     //        chartHeight.value = 480;
     //      } else {
     //        chartHeight.value = 420;
     //      }
          
     //    }
  nextTick(() => {
    if (parseInt((75 * window.innerWidth)/100) > 480) {
        chartHeight.value =480
      } else {
        if (window.innerWidth <= 380) {
              chartHeight.value = window.innerWidth -20;
          }else if(window.innerWidth > 380 && window.innerWidth <= 600){
            chartHeight.value = parseInt((85 * window.innerWidth)/100);
          }else{
             chartHeight.value = parseInt((75 * window.innerWidth)/100);
          }
        
      }
   setTimeout(()=>{

     if (chartWrapper.value) {
      calculateItemsPerPage();
      window.addEventListener("resize", calculateItemsPerPage);
      }else{
        console.log('next')
      }

   },1000)
  });

});


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

const truncateText = (text, maxLength = 20) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const chartOptions = ref({
    labels: labels.value,
    colors: userStore.user.partner ? generateShadedPaletteByOpacity(userStore.user.partner.title_color, 15) : generateShadedPaletteByOpacity(userStore.user.customer.partner_title_color, 15),
    // Couleurs des séries
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(0) + "%";
        }
    },
    legend: {
      show: false
        // position: 'right',
        // horizontalAlign: 'top',
        // floating: false,
        // formatter: (seriesName) => truncateText(seriesName, 20)
    }
});

// const chartOptions = ref({
//   chart: {
//     id: 'vuechart-example2',
//     stacked: true,
//   },
//   events: {
//       dataPointSelection: (event, chartContext, config) => {
       
//         handleBarClick(event, chartContext, config);
//       }
//   },
//   xaxis: {
//     categories: [],
//   },
//   yaxis: {
//     min: 0,
//     max: 60,
//     tickAmount: 6,
//     labels: {
//       formatter: function (val) {
//         return val.toFixed(0);
//       }
//     }
//   },
//   colors: interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, 3),
//   // colors: userStore.user.partner ? [userStore.user.partner.back_color, userStore.user.partner.title_color] : [userStore.user.customer.partner_back_color, userStore.user.customer.partner_title_color],
//   legend: {
//     position: 'bottom',
//     horizontalAlign: 'center',
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 0,
//     },
//   },
// });

const handleBarClick = (event, chartContext, config)=> {
 
  const { dataPointIndex } = config;
  const serieName = series.value[config.seriesIndex]?.name;
  
    getVisitors(chartOptions.value.xaxis.categories[dataPointIndex], chartOptions.value.xaxis.categories[dataPointIndex], timePeriods.value, establishment.value, staff.value, units.value,serieName);
  emits('showModal',true);
 emits('setSource','Country');
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

  let api = `/customer/visitor/chart/country?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source.value || 'all'}`
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



        const data = response.data;
        const color_generated=userStore.user.partner
                        ? generateShadedPaletteByOpacity(userStore.user.partner.title_color, data.series.length)
                        : generateShadedPaletteByOpacity(userStore.user.customer.partner_title_color, data.series.length);
        let newLabels=[];
        let newColors=[];
        let c=0;

          data.labels.forEach((_d)=>{
           
            const france = pays.find(_pays => _pays.nom.toLowerCase() === _d.toLowerCase())

            if (france) {
              _d=`${france.nom} ${france.drapeau} : ${data.count[c]}`;
              newLabels.push(_d);
              newColors.push(generateShadedPaletteByOpacity(france.couleur,5)[0]);
            }else{
              newColors.push(color_generated[c]);
              newLabels.push(_d+' : '+data.count[c]);
            }
             c++;
          });

            // Combine labels and series into an array of objects
            const combined = newLabels.map((label, index) => ({ label, color: newColors[index],series: data.series[index] }));

            // Sort the array of objects by the series value in descending order
            let sortedCombined = combined.sort((a, b) => b.series - a.series);

            // Only use series greater than zero.
            sortedCombined = sortedCombined.filter(item => item.series > 0)

            // Separate the sorted array of objects back into labels and series arrays
            const sortedData = {
                labels: sortedCombined.map(item => item.label),
                colors: sortedCombined.map(item => item.color),
                series: sortedCombined.map(item => item.series)
            };

            series.value = sortedData.series;
            labels.value = sortedData.labels;
//             labels.value = ["Madagascar 🇲🇬 : 273",
// "Saudi Arabia 🇺🇸 : 5",
// "Congo (Kinshasa) 🇬🇧 : 1","Hungary 🇲🇬 : 273",
// "North Macedonia 🇺🇸 : 5",
// "Marshall Islands 🇬🇧 : 1",
// "Congo (Kinshasa) 🇬🇧 : 1","Netherlands 🇲🇬 : 273",
// "North Macedonia 🇺🇸 : 5",
// "Marshall Islands 🇬🇧 : 1",
// "Congo (Kinshasa) 🇬🇧 : 1","Lithuania 🇲🇬 : 273",
// "North Macedonia 🇺🇸 : 5",
// "Marshall Islands 🇬🇧 : 1",
// "Congo (Kinshasa) 🇬🇧 : 1","Australia 🇲🇬 : 273",
// "Austria 🇺🇸 : 5",
// "Germany 🇬🇧 : 1",
// "United States of America 🇺🇸 : 5",
// "United Kingdom of Great Britain and Northern Ireland 🇬🇧 : 1","Belgium 🇲🇬 : 273",
// "Congo (Brazzaville) 2 🇺🇸 : 5",
// "Saint-Vincent-et-les-Grenadines 2 🇬🇧 : 1","Spain 🇲🇬 : 273",
// "Papouasie-Nouvelle-Guinée 🇺🇸 : 5",
// "Saint Vincent and the Grenadines 🇬🇧 : 1","France 🇲🇬 : 273"];
            chartOptions.value.labels = labels.value;

            const total = series.value.reduce((acc, curr) => acc + curr, 0);
            hasData.value = total > 0;
             if (total <= 0) {
                      emits('show-chart','country_false');
                  }else{
                    emits('show-chart','country');
                  }

            if (hasData.value) {
                chartOptions.value = {
                    ...chartOptions.value,
                    labels: labels.value,
                    colors: sortedData.colors,
                };

            } else {

                console.warn('Data is present but the sum is zero.');
            }


      // dataChart.value = response.data;
      // category.value = response.data.categories || [];
      // let seriesFormatted=[];
      // let chart_colors=[];
      //  response.data.series.forEach((_d)=>{
        
      //   const france = pays.find(_pays => _pays.nom.toLowerCase() === _d['name'].toLowerCase())

      //   if (france) {
      //     _d['name']=`${france.drapeau} ${france.nom}`;
      //     chart_colors.push(france.couleur);
      //   }else{
      //     chart_colors.push(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color);
      //   }
      //   seriesFormatted.push(_d);
      // })

      // series.value = seriesFormatted || [];
      // const maxValue = response.data.series.length > 0 ? getMaxData(response.data.series) : 0;
      
     
      
      // chartOptions.value = {
      //   ...chartOptions.value,
      //   xaxis: {
      //     categories: category.value,
      //   },
      //   yaxis: {
      //     max: maxValue,
      //   },
      //   colors : chart_colors
      //   // colors : interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, response.data.series.length)
      // };
      // const total = series.value.reduce((totalAcc, serie) => {
      //   return totalAcc + (serie.data ? serie.data.reduce((acc, curr) => acc + curr, 0) : 0);
      // }, 0);
     

      // hasData.value = total > 0;
      // if (total <= 0) {
      //     emits('show-chart','country_false');
      // }else{
      //     emits('show-chart','country');
      // }


    } else {
      console.error('Error fetching data:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

const getVisitors = async (start_date, end_date, timePeriods, establishment, staff, units,country) => {



  let api = `/customer/visitor/chart/country?tag=${route.params.tag}&from=${start_date}&to=${end_date}&country=${country}&type=${timePeriods || 'daily'}&source=${source.value || 'all'}`
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

  .legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%; 
  display: inline-block;
  margin-right: 2px;
}
  .chart-wrapper {
  display: flex;
  align-items: top;
  justify-content: space-around;
  flex-direction: row;
  align-content: top;
  width: 100%;
  height: 100%;

}

@media screen and (max-width:980px) {

    .chart-wrapper {
        display: flex;
        align-items: top;
        justify-content: center;
        flex-direction: column;
          width: 100% !important;
           border: 1px solid blue;
    }
    .chart-container {
    /* 2/3 de l'espace */
      width: 100% !important;
      border: 1px solid red;
      flex: 1; 

    }
   
    .legend-container{
      flex: 2; 
       display: flex;
      flex-direction: column !important;
      align-items: center;
      justify-content: flex-start;
  

     
    }
}

.vue-apexcharts {
    height: 300px !important;
}

.chart-container {
    width: 100%;
    max-width: 100%;
}

.legend-container{
/*   flex: 1; */
   display: flex;
  flex-direction: column !important;
  align-items: left;
  justify-content: flex-start;
/*  max-height: 300px;*/
/*  min-width: 10%;*/
/*  padding: 3px;*/
/*  margin-left: -40px;*/
  width: 100%;
    max-width: 100%;

 
}

.legend-container ul {
  list-style: none;
/*  padding: 0;
  margin-right: 3px;
  padding-right: 5px;*/
/*  padding: 5px;*/
  font-size: 14px;
 color: rgb(101, 101, 101);

}


.pagination-buttons {
  display: flex;
  gap: 5px;
}

.pagination-buttons button {
  background-color: var(--color-bgp);
  color: white;
  border: none;
  padding: 1px 2px;
  cursor: pointer;
  border-radius: 4px;
  width: 50px;
  height: 20px;
}

.pagination-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}




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