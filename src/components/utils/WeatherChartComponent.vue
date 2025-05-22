<template>
  <div class="reviews__content weather__chart" ref="el" :style="{
    'overflowX': 'auto'
  }
    ">
    <div v-if="chartLoading == true" :style="{
      'width': '100%',
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
    <div v-else class="chart_content" :style="{
        'display': 'flex',
        'width': '100%',
     }">
     <div class="colSmall">
       <GroupedBarChart style="display: none;" class="chart" :plot-data="data" x-key="name" :width="custom_width" :height="200"
        :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
        :x-tick-format="d => `${d}`" :margin="{ top: 20, bottom: 35, left: 30, right: 20 }"/>
        <!--  <div id="weatherIcons" style="height: 58px; width: 100%; position: relative;">
         </div> -->
     </div>

 <!--    <div class="colLarge" id="colLarge">
      <div class="boxLarge">  -->
    <div class="" id="">
      <div class="">

             <div  >
              
                    <Line class="" :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" :width="custom_width" :height="200"  :data="weatherChartValue" id="confidence" :options="newOptions"  ref="myLineChart"
                    /> 
              

                <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" /> 
            </div>

            <!--<div v-if="weatherChartValue.labels.length !== 0" style="border: 1px solid #ddd; margin-top:  30px;"></div>-->

            <!--<div id="weatherTable" style="width: 97%; margin: 20px 0px 15px 15px;">
                <table id="weatherIconsTable" style="width: 100%; border-collapse: collapse;">
                    <tbody id="weatherTableBody">

                    </tbody>
                </table>
            </div> -->

            <div id="weatherTable"  style="width: 97%;  margin : 0 15px">
              <table id="weatherIconsTable" style="width: 100%; border-collapse: collapse;">
                <tbody id="weatherTableBody">
                  <!-- Date row -->
                  <!--<tr>
                    <td 
                      v-for="(item, index) in data" 
                      :key="'date-'+index"
                      style="padding: 5px; text-align: center; color: #5D6166; font-size: 12px;"
                    >
                      {{ item.name }}
                    </td>
                  </tr>-->
                  
                  <!-- Icons row -->
                  <tr :style="{ display: 'flex', justifyContent: 'space-between', gap: gapValue + 'px' }">
                    <td 
                      v-for="(icon, index) in icons" 
                      :key="'icon-'+index"
                      style="padding: 2px; text-align: center;"
                    >
                      <span v-html="icon.code" style="font-size: 28px; display: block; color: #5D6166;"></span>
                      <span v-if="icon.temperature !== 0" style="font-size: 12px; display: block; color: #5D6166;">
                        {{ icon.temperature.toFixed(0) }} {{ icon.unit }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

         <!--    <LineChart class="chart" :plot-data="data"
                       x-key="name"
                       :width="custom_width"
                       :height="200"
                       :margin="{ top: 20, bottom: 35, left: 30, right: 20 }"
                       :use-time-scale-x-axis="true"
                       :x-axis-label-shift="{dy: -5}"
                       x-axis-label="Dates"
                       :y-min="0"
                       y-axis-label="Reviews"
                       :show-points="true"
                       :point-radius="3"
                       :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
                       :x-tick-format="d => `${d}`" /> -->

     

      </div>
     </div>

    </div>
    <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'" style="margin-top: 20px;"></BaseLegend>
  </div>
</template>

<script setup>
import { ref, inject, defineAsyncComponent, computed, onMounted, watch, nextTick } from 'vue';
import { useResizeObserver, useWindowSize } from '@vueuse/core';
const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
);

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { Line, Bar } from 'vue-chartjs'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)


const icons = inject('icons');
const myLineChart = ref(null);
const gapValue = ref(0);


const getXAxisGap = (chart) => {

  if (!chart || !chart.scales['x']) return 0;

  const meta = chart.getDatasetMeta(0);
  if (!meta.data || meta.data.length < 2) return 0;

  // Obtenir les positions X des deux premiers points
  const point1 = meta.data[0].x;
  const point2 = meta.data[1].x;
  
  return point2 - point1; // Retourne la différence en pixels
}

const colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']
const newOptions = {
    maintainAspectRatio: false,
    scales: {

        y: {
          beginAtZero: true,
          suggestedMin: 0, 
          suggestedMax: 5,
          ticks: {
            stepSize: 1 ,
            padding: 10
            
          },
          grid: {
            
            drawBorder: true,
            drawOnChartArea: true
          
          }

        },
    },
    plugins: {
      legend: {
        display: false
      }
    },

    animation: {
      onComplete: () => {
        if (myLineChart.value) {
          console.clear();
          const chartInstance = myLineChart.value.chart;
          const gap = getXAxisGap(chartInstance);
          //console.log(gap)
          //gapValue.value = gap;
        }
      },
  },
  
};

const chartLoading = inject('chartLoading');
const legendData = inject('legendData');
const data = inject('data');
const date = inject('date');
const start_date = inject('start_date');
const weatherChartValue = ref([]);

const el = ref(null);
const chartWidth = inject('chartWidth');
const { width, height } = useWindowSize();

const custom_width = computed(() => {
  let nb = data.value.length;
  let width = 800;
  if (nb > 9) {
    width = (width * nb) / 9;
  }

  return chartWidth.value;
});

const containerStyles = computed(() => ({
  maxWidth: '100%',
  overflowX: 'auto',
}));

const getData=()=>{
    console.log(data)
}

const getWidth = () => {
  const defaultWidth = 900;
  if (width.value >= 1500) {
    return `${defaultWidth}px`;
  }
  const percentage = 0.8;

  return `${Math.min(width.value * percentage, 850)}px`;
};

const deleteIcons = () => {
  const weathers = document.getElementById("weatherTable");
  if(weathers) weathers.innerHTML = "";
}

const transformData=(_data)=>{
    let plotData1 = {
        labels: [],
        datasets: []
      }
      let scores=[];
        _data.value.forEach((_note)=>{
        scores.push(_note.reviews);
        plotData1.labels.push(_note.name)
      });
        // scores.push(0);
        // scores.push(5);

       plotData1.datasets.push({
              label: 'Note',
              backgroundColor: colors[2],
              borderColor: colors[2],
              data: scores,
              // pointRadius: 0,
              // fill: false,
              tension: 0.1
              })

     weatherChartValue.value=plotData1;
}

const positionIcons = () => {

 /*const tableBody = document.getElementById("weatherTableBody");
 if (!tableBody) return; 


  const indexRow = document.createElement("tr");
  const iconRow = document.createElement("tr");

  for (let i = 0; i < icons.value.length; i++) {

   const dateCell = document.createElement("td");
   //dateCell.style.border = "1px solid #ddd";
   dateCell.style.padding = "5px";
   dateCell.style.textAlign = "center";
   dateCell.style.color = "	#5D6166"; 
   dateCell.style.fontSize = "12px";
   dateCell.innerText = data.value[i].name;

    // Cellule pour l'icône et la température
    const iconCell = document.createElement("td");
    //iconCell.style.border = "1px solid #ddd";
    iconCell.style.padding = "2px";
    iconCell.style.textAlign = "center";

    const iconSpan = document.createElement("span");
    iconSpan.innerHTML = icons.value[i]['code'];
    iconSpan.style.fontSize = "28px";
    iconSpan.style.display = "block";
    iconSpan.style.color = "#5D6166";

    const tempSpan = document.createElement("span");
    tempSpan.innerHTML = icons.value[i]['temperature'] != 0 ? `${icons.value[i]['temperature'].toFixed(0)} ${icons.value[i]['unit']}` : '';
    tempSpan.style.fontSize = "14px";
    tempSpan.style.display = "block";
    tempSpan.style.color = "	#5D6166";

    iconCell.appendChild(iconSpan);
    iconCell.appendChild(tempSpan);

    indexRow.appendChild(dateCell);
    iconRow.appendChild(iconCell);
  }

  tableBody.appendChild(indexRow);
  tableBody.appendChild(iconRow);*/
};


useResizeObserver(el, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;
  chartWidth.value = Math.abs(width);
});

onMounted(() => {
  deleteIcons();
  positionIcons();
  transformData(data)

    nextTick(() => {
        const colLargeElement = document.getElementById("colLarge");
        if (colLargeElement) {
            const div = document.getElementsByClassName("chart")[0].children;
            const widthp = parseInt(div[0].getAttribute("width"));
            const longueur = widthp * data.value.length;
            colLargeElement.scrollLeft += longueur;
            colLargeElement.scrollLeft = longueur;
        }
    });
 
});

// Combine les watchers pour data et start_date en un seul
watch([data, start_date], () => {
  deleteIcons();
  
  transformData(data);
  
  nextTick(() => {
    const colLargeElement = document.getElementById("colLarge");
    if (colLargeElement) {
      const chartDiv = document.getElementsByClassName("chart")[0]?.children[0];
      if (chartDiv) {
        const widthp = parseInt(chartDiv.getAttribute("width"));
        const longueur = widthp * data.value.length;
        colLargeElement.scrollLeft = longueur;
      }
    }

    nextTick(() => {
      positionIcons();
    });
  });
}, { 
  immediate: true,
  deep: true
});
</script>

<style scoped>
.colLarge {
  overflow-x: scroll; 
  width: 100%;
  margin-left: -25px;
}

@media screen and (min-width:976px) {
    .colSmall {
        max-width:56px;
        overflow: hidden;
    }

    .boxLarge {
        max-width:800px;
        margin-left:-60px;
    }
}

@media screen and (min-width:769px) and (max-width: 975px) {
    .colSmall {
        max-width:56px;
        overflow: hidden;
    }

    .boxLarge {
        max-width:90%;
        margin-left:-60px;
    }
}

@media screen and (min-width:469px) and (max-width: 768px) {
    .colSmall {
        max-width:56px;
        overflow: hidden;
    }

    .boxLarge {
        max-width:700px;
        margin-left:-60px;
    }
}

@media screen and (max-width:468px) {
    .colSmall {
        max-width:56px;
        overflow: hidden;
    }

    .boxLarge {
        max-width:700px;
        margin-left:-60px;
    }
}
</style>
