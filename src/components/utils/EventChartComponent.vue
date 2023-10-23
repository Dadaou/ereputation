<template>
	<div
		class="chart"
		:style="{
			'width': `${props.width}px`,
			'overflowX': 'auto'
		}"
	>
	  <suspense>
	      <GroupedBarChart 
			:plot-data="plotdata.notes"
            x-key="date"
            :width="custom_width.chart"
            :height="250"
            :margin="{ top: 20, bottom: 35, left: 55, right: 20 }"
            y-axis-label="Rating"
            :colors="['#6c63ff','#f75842','#aca8fd','#424890','#ff42e5','#58f742','#8eaca8','#fda458','#90fdac','#444278','#f7a142','#de90fd','#42d3ff','#e558f7','#a8ac42','#90fdd4','#784444','#58f7bf','#fdaa58','#90fdff']"
            :y-tick-format="d => `${d}`" />
	      <template #fallback>
	          Loading
	      </template>    
	  </suspense>
        <ul class="event" :style="{
        	'gap': `${custom_width.gap}px`,
			'width': `${custom_width.events}px`,
		}">
		<li v-for="date in plotdata.events_per_date">
			<div v-if="date.events.length>0">
				<el-tooltip
					v-for="event in date.events"
			        class="box-item"
			        effect="light"
			        :content="event.name"
			        placement="top"
			    >
					<div  
						:style="{
							'width': '60.5px',
					        'height': '10px',
					        'margin': 'auto',
					        'marginBottom': '3px',
					        'backgroundColor': `${generateColor(event.name)}`,
					        'backgroundPosition': 'center',
					        'cursor': 'pointer',
						}"
					></div>
				</el-tooltip>
			</div>
			<div v-else>
				<div 
					:style="{
						'width': '60.5px',
				        'height': '10px',
				        'margin': 'auto',
				        'marginBottom': '3px',
				        'backgroundColor': 'white',
				        'backgroundPosition': 'center'
					}"
				></div>
			</div>
		</li>
	</ul>
	</div>
	<div>
		<BaseLegend class="legend" :LegendData="legendData" :alignment="'vertical'">
        </BaseLegend>
	</div>
</template>
<script setup>
import moment from 'moment';
import { ElTooltip } from 'element-plus';
import {computed, onMounted, ref, watch, inject} from 'vue';
import services from '@Services/services.js';
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
	width:{
		type: Number,
		default: 800
	}
});

const chartWidth = computed(()=>`${props.width}px`);
const chart_width = computed(()=>`${props.width}px`);
const route = useRoute();

const type = inject('type');
const date = inject('date');
const chartLoading = inject('chartLoading');
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

onMounted(async()=>{
   const response = await new Promise((resolve, reject) => {
          getPlotData(type.value, date.value, (response)=>{
            resolve(response)
          })
   });
   plotdata.value = response;
});

watch([date, type],async()=>{
  if(date.value !== null){
  	  chartLoading.value = true;
      const response = await new Promise((resolve, reject) => {
            getPlotData(type.value, date.value, (response)=>{
              resolve(response)
            })
     });
     plotdata.value = response;
     chartLoading.value = false;
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
	    height: 1px !important; 
	    background-color: white;
	}
</style>