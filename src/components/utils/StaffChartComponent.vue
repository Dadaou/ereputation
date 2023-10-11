<template>
	<div
		class="chart"
		:style="{
			'width': '800px',
			'overflowX': 'auto'
		}"
	>
  <suspense>
      <GroupedBarChart 
        :plot-data="plotdata"
        x-key="date"
        :width="custom_width"
        :height="300"
        :margin="{ top: 20, bottom: 35, left: 55, right: 20 }"
        x-axis-label="Dates"
        y-axis-label="Rating"
        :colors="['#6c63ff','#f75842','#aca8fd','#424890','#ff42e5','#58f742','#8eaca8','#fda458','#90fdac','#444278','#f7a142','#de90fd','#42d3ff','#e558f7','#a8ac42','#90fdd4','#784444','#58f7bf','#fdaa58','#90fdff']"
        :y-tick-format="d => `${d}`" />
      <template #fallback>
          Loading
      </template>    
  </suspense>
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
const route = useRoute();

const type = inject('type');
const date = inject('date');
const chartWidth = computed(()=>`${props.width}px`);
const chart_width = computed(()=>`${props.width}px`);
const plotdata = ref([]);
const custom_width = computed(()=>{
  let nb = plotdata.value.length;
  let width = 800;
  if(nb>9) {
    width = (width*nb)/9;
  }

  return width;
})

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
          services.get_Record(`/establishment/${companyId}/${period}/${datefrom}/${dateto}/staff`, (response) => {
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
      const response = await new Promise((resolve, reject) => {
            getPlotData(type.value, date.value, (response)=>{
              resolve(response)
            })
     });
     plotdata.value = response;
  }
});


</script>
<style scoped>
	ul{
		display: flex;
		gap: 3.5rem;
		margin-bottom: 1rem;
		align-items: center;
		margin: auto;
		position: relative;
		left: 60px;
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