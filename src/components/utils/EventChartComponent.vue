<template>
  <div id="chart__event" class="chart_content" :style="{
    'width': `${props.width}px`,
    'overflowX': 'auto'
  }">
    <div v-if="loading == true" :style="{
      'width': `100%`,
      'minHeight': `200px`,
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

        <GroupedBarChart style="display: none !important;" class="chart" :plot-data="plotdata.notes" x-key="date" :width="custom_width.chart" :height="200"
          :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Reviews"
          :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']"
          :y-tick-format="d => `${d}`" />

         <!--  <div class="chart" x-key="date" :width="custom_width.chart" :height="200" 
              :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Reviews"
            :y-tick-format="d => `${d}`">
              
                    <Line class="chart" x-key="date" :width="custom_width.chart" :height="200" 
              :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Reviews"
            :y-tick-format="d => `${d}`"  :data="eventChartValue" id="confidence" :options="newOptions" 
                    />
              

              <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
            </div> -->

      </div>
    <!--    <div class="colLarge" id="colLar">
        <div class="boxLarge">
 -->     <div class="" id="">
          <div class="">
           <!--   <GroupedBarChart  style="display: none;" class="chart" :plot-data="plotdata.notes" x-key="date" :width="custom_width.chart" :height="200"
            :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label="Reviews"
            :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']"
            :y-tick-format="d => `${d}`" /> -->

            <!--  <LineChart class="chart" :plot-data="plotdata.notes"
                       x-key="date"
                       :width="custom_width.chart"
                       :height="200"
                       :margin="{ top: 20, bottom: 35, left: 55, right: 20 }"
                       :use-time-scale-x-axis="true"
                       :x-axis-label-shift="{dy: -5}"
                       x-axis-label="Dates"
                       :y-min="0"
                       y-axis-label="Reviews"
                       :show-points="true"
                       :point-radius="3"
                       :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']"
                       :x-tick-format="d => moment(new Date(d)).format('YYY-MM-DD')" /> -->


             <div  >
              
                    <Line :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" :width="custom_width.chart" :height="200"  :data="eventChartValue" id="confidence" :options="newOptions" 
                    />
              

              <SpinnerComponent :size="'large'" v-if="isLoading" class="loader" />
            </div>
            
          <div id="chartEvents" style="min-height: 60px; width: 100%;position: relative;"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="chartLegend">
    <BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
    </BaseLegend>
    <BaseLegend class="legend" :LegendData="legendDataPublic" :alignment="'vertical'">
    </BaseLegend>
  </div>
</template>
<script setup>
import moment from 'moment';
import { ElTooltip } from 'element-plus';
import { computed, onMounted, ref, watch, inject, onBeforeMount, defineAsyncComponent,nextTick } from 'vue';
import services from '@Services/services.js';
import { useRoute, useRouter } from "vue-router";
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

const props = defineProps({
  width: {
    type: Number,
    default: 800
  },
  establishment: {
    type: Object,
    required: true
  }
});

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

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

const chartWidth = computed(() => `${props.width}px`);
const chart_width = computed(() => `${props.width}px`);
const route = useRoute();

const type = inject('type');
const date = inject('date');
const chartLoading = inject('chartLoading');
const loading = ref(true);
const eventChartValue = ref([]);
const plotdata = ref({ notes: [], events_per_date: [] });
const custom_width = computed(() => {
  let nb = plotdata.value.events_per_date.length;
  let width = 1000;
  let widthEvent = 500;
  let gapFactor = 1 + (nb - 9) * 0.001;
  if (nb > 9) {
    width = (width * nb) / 9;
    widthEvent = (widthEvent * nb) / 9
  }

  let gap = 41 * gapFactor;

  return {
    chart: width,
    event: widthEvent,
    gap: gap
  }
})

const deleteEvents = () => {
  // const events = document.getElementById("events");
  // events.innerHTML = "";
}

const positionEvent = () => {
  setTimeout(() => {
    const elements = document.querySelectorAll(".xaxis g.tick");
    let positions = Array.from(elements).map(e => parseFloat(e.getAttribute("transform").match(/translate\(([^)]+)\)/)[1]));
    const elementWidth = elements[0].getBoundingClientRect().width;
    const elementsRect = document.querySelectorAll("g rect");
    let n = 2;
    elementsRect.forEach(rect => {
      rect.setAttribute("class", 'reconstituate')
    })

    const chartEvents = document.getElementById("chartEvents");
    let eventGroups = {};

    plotdata.value.events_per_date.forEach((eventData, index) => {
      eventData.events.forEach(event => {
        let position = positions[index];
        let name = event.isPublic ? `${props.establishment.locality_name}: ${event.name}` : event.name
        if (!eventGroups[name]) {
          eventGroups[name] = { startPosition: position, endPosition: position };
        } else {
          eventGroups[name].endPosition = position;
        }
      });
    });

    Object.keys(eventGroups).forEach((eventName, idx) => {
      let group = eventGroups[eventName];
      let topOffset = 5 + (idx * 15);

      let textNode = document.createElement("span");
      let width = group.endPosition - group.startPosition + elementWidth;
      textNode.setAttribute("style", `left: ${group.startPosition - elementWidth / 2}px; width: ${width}px; top: ${topOffset}px; opacity: 1; height: 10px; position: absolute; font-size: 14px; font-weight: 500; cursor: pointer; color: green; background-color: ${generateColor(eventName.split(': ')[eventName.split(': ').length - 1])};`);
      textNode.setAttribute("title", eventName);
      chartEvents.appendChild(textNode);
    });
  }, 1000);
};

const changeColor = () => {
  const elementsRect = document.querySelectorAll("g rect");
  elementsRect.forEach(rect => {
    rect.setAttribute("fill", "#606266")
  })
}

const legendData = computed(() => {
  let dates = plotdata.value.events_per_date;
  let nameSet = new Set();
  let data = [];

  dates.forEach((date) => {
    date.events.forEach((event) => {
      if (!nameSet.has(event.name) && !event.isPublic) {
        data.push({
          name: `${event.name} from ${event.datefrom} to ${event.dateto}`,
          color: `${generateColor(event.name)}`
        });
        nameSet.add(event.name);
      }
    });
  });
  return data;
});

const legendDataPublic = computed(() => {
  let dates = plotdata.value.events_per_date;
  let nameSet = new Set();
  let data = [];

  dates.forEach((date) => {
    date.events.forEach((event) => {
      if (!nameSet.has(event.name) && event.isPublic) {
        if (event.locality_name && event.locality_name != "" && event.locality_name != null) {
           data.push({
              name: `${event.locality_name}: ${event.name} from ${event.datefrom} to ${event.dateto}`,
              color: `${generateColor(event.name)}`
            });
        } else {

           data.push({
              name: `${event.name} from ${event.datefrom} to ${event.dateto}`,
              color: `${generateColor(event.name)}`
            });

        }
        nameSet.add(event.name);
      }
    });
  });
  return data;
});

const hashString = (inputString) => {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = (hash << 5) - hash + inputString.charCodeAt(i);
  }
  return hash;
}
const colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']
const generateColor = (text) => {
  const inputString = text;
  const hash = hashString(inputString);

  const red = (hash & 0xFF0000) >> 16;
  const green = (hash & 0x00FF00) >> 8;
  const blue = hash & 0x0000FF;

  return `rgb(${red}, ${green}, ${blue})`;
}

const decomposeData = (data) => {
  // Do nothing
}

const getPlotData = async (period, rangedate, next) => {
  period = period.toLowerCase();
  let format = 'YYYY-MM-DD';
  const companyId = route.params.id;
  let data = [];

  if (period == 'monthly') {
    format = 'YYYY-MM'
  }

  if (period == 'yearly') {
    format = 'YYYY'
  }

  const datefrom = moment(new Date(rangedate[0])).format(format);
  const dateto = moment(new Date(rangedate[1])).format(format);

  const response = await new Promise((resolve, reject) => {
    services.get_Record(`/establishment/${companyId}/${period}/${datefrom}/${dateto}/events`, (response) => {
      resolve(response)
    });
  });
  if (response.status == 200) {
    data = response.data;
    decomposeData(data.notes);
    plotdata.value=data;
 
// ;
//         if (plotdata.value) {
//     deleteEvents()
//     positionEvent()
//   }
      let plotData1 = {
        labels: [],
        datasets: []
      }
      let scores=[];
        data.notes.forEach((_note)=>{
        scores.push(_note.note);
        plotData1.labels.push(_note.date)
      });
        scores.push(0);
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
     
     eventChartValue.value=plotData1;
     console.log(data)
  }
  next(data);
}

onBeforeMount(async () => {
  loading.value = true;
  const response = await new Promise((resolve, reject) => {
    getPlotData(type.value, date.value, (response) => {
      resolve(response)
    })
  });
  plotdata.value = response;
 

  if (plotdata.value) {
    deleteEvents()
    positionEvent()
      let plotData1 = {
        labels: [],
        datasets: []
      }
      let scores=[];
       let c=0;
        response.notes.forEach((_note)=>{
        scores.push(_note.note);
        plotData1.labels.push(_note.date)
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
     
     eventChartValue.value=plotData1;
     console.log( plotdata.value)
  }
  loading.value = false;
})

watch([date, type], async () => {
  if (date.value !== null) {
    loading.value = true;
    const response = await new Promise((resolve, reject) => {
      getPlotData(type.value, date.value, (response) => {
        resolve(response)
      })
    });
    plotdata.value = response;
    deleteEvents()
    positionEvent()
    loading.value = false;
  }
});


watch(() => plotdata.value.events_per_date , () => {
    nextTick(() => {
        const colLargeElement = document.getElementById("colLar");
        if (colLargeElement) {
            const div = document.getElementsByClassName("chart")[0].children;
            const widthp = parseInt(div[0].getAttribute("width"));
            const longueur = widthp * plotdata.value.events_per_date.length;
            colLargeElement.scrollLeft += longueur;
            colLargeElement.scrollLeft = longueur;
        }
    });
}, { immediate: true, deep: true });

</script>
<style scoped>
ul.event {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  position: relative;
  left: 10.5%;
}

.chart_content {
  overflow-x: auto;
}

.chart_content::-webkit-scrollbar {
  width: 6px;
  height: 5px !important;
  background-color: white;
}

.chartLegend {
  display: flex;
  justify-content: space-between;
}

rect.reconstituate {
  border: 5px solid red;
}

.colLarge {
  overflow-x: scroll;
  width: 100%;
}

@media screen and (min-width:976px) {
  .colSmall {
    max-width: 56px;
    overflow: hidden;
  }

  .boxLarge {
    max-width: 800px;
    margin-left: -60px;
  }
}

@media screen and (min-width:769px) and (max-width: 975px) {
  .colSmall {
    max-width: 56px;
    overflow: hidden;
  }

  .boxLarge {
    max-width: 90%;
    margin-left: -60px;
  }
}

@media screen and (min-width:469px) and (max-width: 768px) {
  .colSmall {
    max-width: 56px;
    overflow: hidden;
  }

  .boxLarge {
    max-width: 700px;
    margin-left: -60px;
  }
}

@media screen and (max-width:468px) {
  .colSmall {
    max-width: 56px;
    overflow: hidden;
  }

  .boxLarge {
    max-width: 700px;
    margin-left: -60px;
  }
}
</style>