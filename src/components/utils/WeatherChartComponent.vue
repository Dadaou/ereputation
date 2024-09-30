<template>
  <div class="reviews__content weather__chart mb-10" ref="el" :style="{
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
              
                    <Line class="" :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" :width="custom_width" :height="200"  :data="weatherChartValue" id="confidence" :options="newOptions" 
                    /> 
              

                <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" /> 
            </div>

            <div id="weatherIcons" style="height: 58px; width: 100%; position: relative;">
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
    <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'"></BaseLegend>
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
  const colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']
const newOptions = {
    maintainAspectRatio: false,
    // scales: {
    // },
    // plugins: {
    //     legend: {
    //         display: false,
    //     }
        // beforeDraw: function (chart) {
        //     var ctx = chart.ctx;
        //     chart.data.datasets.forEach(function (dataset, i) {
        //         var meta = chart.getDatasetMeta(i);
        //         if (!meta.hidden) {
        //             meta.data.forEach(function (element, index) {
        //                 // Dessiner le texte sous chaque barre en fonction de sa valeur
        //                 var dataValue = dataset.data[index];
        //                 var text = '';
        //                 if (dataValue > 0.2) {
        //                     text = 'Positif';
        //                 } else if (dataValue < -0.2) {
        //                     text = 'Négatif';
        //                 } else {
        //                     text = 'Neutre';
        //                 }
        //                 var fontSize = 12;
        //                 var fontStyle = 'normal';
        //                 var fontFamily = 'Arial';
        //                 ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
        //                 var textWidth = ctx.measureText(text).width;
        //                 var elementX = element._model.x;
        //                 var elementY = element._model.y + 20; // Ajuster la valeur pour positionner le texte sous les barres
        //                 ctx.fillStyle = 'black';
        //                 ctx.fillText(text, elementX - textWidth / 2, elementY);
        //             });
        //         }
        //     });
        // }
    // }
};

const chartLoading = inject('chartLoading');
const legendData = inject('legendData');
const data = inject('data');
const date = inject('date');
const start_date = inject('start_date');
const weatherChartValue = ref([]);
const icons = inject('icons');
const el = ref(null);
const chartWidth = inject('chartWidth');
const { width, height } = useWindowSize();

const custom_width = computed(() => {
  let nb = data.value.length;
  let width = 800;
  if (nb > 9) {
    width = (width * nb) / 9;
  }

  return width;
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
  const weathers = document.getElementById("weatherIcons");
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
        scores.push(0);
        scores.push(5);

       plotData1.datasets.push({
              label: 'Note',
              backgroundColor: colors[2],
              borderColor: colors[2],
              data: scores,
              // pointRadius: 0,
              // fill: false,
              tension: 0.1
              })
     console.log(data.value)
     weatherChartValue.value=plotData1;
}

const positionIcons = () => {
  let positions = [];

  const elements = document.querySelectorAll(".weather__chart .boxLarge .xaxis g.tick");

  let intervale=38;
  let count = 0;
  data.value.forEach(e => {
    // if (intervale > 38) {
    //      // positions.push((e.getAttribute("transform").split(',')[0]).split('(')[1] -intervale);

    // } else {
    //      positions.push((e.getAttribute("transform").split(',')[0]).split('(')[1]);
    // }
    // console.log((e.getAttribute("transform").split(',')[0]).split('(')[1])
         positions.push(intervale);
          intervale+=88
    

  })

  const weathers = document.getElementById("weatherIcons");


  for (let i = 0; i < positions.length; i++) {
    let textNode = document.createElement("span");
    let tempTextNode = document.createElement("span");
    textNode.innerHTML = icons.value[i]['code'];
    tempTextNode.innerHTML = `${icons.value[i]['temperature'].toFixed(0)} ${icons.value[i]['unit']}`;
    textNode.setAttribute("style", `left: calc(${positions[i]}px - 12px); opacity: 1; top: -4px; position: absolute; font-size: 28px; cursor: pointer;width: 40px;`);
    tempTextNode.setAttribute("style", `left: calc(${positions[i]}px - 12px); opacity: 1; top: 28px; position: absolute; font-size: 14px;  cursor: pointer; width: 40px;`);
    textNode.setAttribute("title", icons.value[i]['title']);
    weathers.appendChild(textNode);
    weathers.appendChild(tempTextNode);
   
  }
}

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

watch(start_date, () => {
  deleteIcons();
   transformData(data)
   console.log(start_date.value)
  setTimeout(() => positionIcons(), 2000)
    ;
});

watch(data, () => {
  deleteIcons();
   transformData(data)
   console.log(start_date.value)
  setTimeout(() => positionIcons(), 2000)
    ;
});
watch( [data,start_date] , () => {
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

}, { immediate: true});
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
