<template>
	<div
	    id="chart__event"
		class="chart"
		:style="{
			'width': `${props.width}px`,
			'overflowX': 'auto'
		}"
	>
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
	 <GroupedBarChart 
	        v-else
			:plot-data="plotdata.notes"
            x-key="date"
            :width="custom_width.chart"
            :height="250"
            :margin="{ top: 20, bottom: 35, left: 55, right: 20 }"
            y-axis-label="Rating"
            :colors="['#6c63ff','#f75842','#aca8fd','#424890','#ff42e5','#58f742','#8eaca8','#fda458','#90fdac','#444278','#f7a142','#de90fd','#42d3ff','#e558f7','#a8ac42','#90fdd4','#784444','#58f7bf','#fdaa58','#90fdff']"
            :y-tick-format="d => `${d}`" />
       <div id="chartEvents" style="min-height: 60px; width: 100%; position: relative;"></div>
	</div>
	<div>
		<BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
        </BaseLegend>
	</div>
</template>
<script setup>
import moment from 'moment';
import { ElTooltip } from 'element-plus';
import {computed, onMounted, ref, watch, inject, onBeforeMount, defineAsyncComponent} from 'vue';
import services from '@Services/services.js';
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
	width:{
		type: Number,
		default: 800
	}
});

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const chartWidth = computed(()=>`${props.width}px`);
const chart_width = computed(()=>`${props.width}px`);
const route = useRoute();

const type = inject('type');
const date = inject('date');
const chartLoading = inject('chartLoading');
const loading = ref(true);
const plotdata = ref({notes:[], events_per_date:[]});
const custom_width = computed(()=>{
	let nb = plotdata.value.events_per_date.length;
	console.log(nb, plotdata.value.notes.length)
	let width = 1000;
	let widthEvent = 500;
	let gapFactor = 1 + (nb - 9) * 0.001;
	if(nb>9) {
		width = (width*nb)/9;
		widthEvent = (widthEvent*nb)/9
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
    const elementWidth = elements[0].getBoundingClientRect().width; // Supposons que tous les éléments ont la même largeur

    const chartEvents = document.getElementById("chartEvents");
    let eventGroups = {}; // Stocker les groupes d'événements identiques et leurs positions

    // Créer des groupes d'événements identiques
    plotdata.value.events_per_date.forEach((eventData, index) => {
      eventData.events.forEach(event => {
        let position = positions[index]; // Ajuster pour prendre en compte la largeur de l'élément
        if (!eventGroups[event.name]) {
          eventGroups[event.name] = { startPosition: position, endPosition: position };
        } else {
          eventGroups[event.name].endPosition = position;
        }
      });
    });

    // Afficher chaque groupe d'événements
    Object.keys(eventGroups).forEach((eventName, idx) => {
      let group = eventGroups[eventName];
      let topOffset = 5 + (idx * 15); // Positionnement vertical pour chaque groupe

      let textNode = document.createElement("span");
      let width = group.endPosition - group.startPosition + elementWidth; // Ajuster la largeur pour inclure l'élément de fin
      textNode.setAttribute("style", `left: ${group.startPosition - elementWidth / 2}px; width: ${width}px; top: ${topOffset}px; opacity: 1; height: 10px; position: absolute; font-size: 14px; font-weight: 500; cursor: pointer; color: green; background-color: ${generateColor(eventName)};`);
      textNode.setAttribute("title", eventName);
      chartEvents.appendChild(textNode);
    });
  }, 1000);
};



const legendData = computed(() => {
    let dates = plotdata.value.events_per_date;
    let nameSet = new Set();
    let data = [];

    dates.forEach((date) => {
        date.events.forEach((event) => {
            if (!nameSet.has(event.name)) {
                data.push({
                    name: event.name,
                    color: `${generateColor(event.name)}`
                });
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

const generateColor = (text) =>{
      const inputString = text;
      const hash = hashString(inputString);

      const red = (hash & 0xFF0000) >> 16;
      const green = (hash & 0x00FF00) >> 8;
      const blue = hash & 0x0000FF;

      return `rgb(${red}, ${green}, ${blue})`;
}


const getPlotData = async(period, rangedate, next)=>{
        period = period.toLowerCase();
        let format = 'YYYY-MM-DD';
        const companyId = route.params.id;
        let data = [];

        if(period == 'monthly'){
          format = 'MM-YYYY'
        }

        if(period == 'yearly'){
          format = 'YYYY'
        }

       const datefrom = moment(rangedate[0]).format(format);
       const dateto = moment(rangedate[1]).format(format);

       const response = await new Promise((resolve, reject) => {
          services.get_Record(`/establishment/${companyId}/${period}/${datefrom}/${dateto}/events`, (response) => {
                  resolve(response)
          });
      });
       console.log(response)
      if(response.status == 200){
        data = response.data;
      }
      next(data);
} 

onBeforeMount(async()=>{
	loading.value = true;
	const response = await new Promise((resolve, reject) => {
          getPlotData(type.value, date.value, (response)=>{
            resolve(response)
          })
   });
   plotdata.value = response;  
   if(plotdata.value){
    console.log("ito lasa aloha")
    deleteEvents()
    positionEvent()
   }
   loading.value = false;
})

// onMounted(()=>{
// 	console.log("ito lasa aloha")
//     deleteEvents()
//     positionEvent()
// })

watch([date, type],async()=>{
  if(date.value !== null){
  	  loading.value = true;
      const response = await new Promise((resolve, reject) => {
            getPlotData(type.value, date.value, (response)=>{
              resolve(response)
            })
     });
     plotdata.value = response;
	 deleteEvents()
	 positionEvent()
	 loading.value = false;
  }
});

</script>
<style scoped>
	ul.event{
		display: flex;
		margin-bottom: 1rem;
		align-items: center;
		position: relative;
		left: 10.5%;
	}

	.chart{
	    overflow-x: auto;
	}

	.chart::-webkit-scrollbar
	{
	    width: 6px;
	    height: 10px !important; 
	    background-color: white;
	}
</style>