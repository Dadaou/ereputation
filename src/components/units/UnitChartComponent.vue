<template>
<div v-if="load == true" :style="{
            'width': `100%`,
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
<div v-else class="chart">
<GroupedBarChart :plot-data="plotdata" x-key="date" :width="custom_width" :height="200" :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label=""
:colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']" :y-tick-format="d => `${d}`" />
</div>
<div>
    <BaseLegend class="legend" style="margin-bottom: 50px;" :LegendData="legendData" :alignment="'horizontal'">
    </BaseLegend>
</div>	
</template>
<script setup>
import { ref, defineAsyncComponent, computed } from 'vue';

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
);

const props = defineProps({
	category:{
		type: String,
		required: true
	},
	plotdata:{
		type: Array,
		required: true
	},
	legendData: {
		type: Array,
		required: true
	},
	chartLoading: {
		type: Boolean,
		default: false 
	}
});

const isMobile = ref(window.innerWidth <= 768);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});

const custom_width = computed(() => {
  let nb = props.plotdata.length;
  let width = 800;
  if (nb > 9) {
    width = (width * nb) / 9;
  }

  return width;
});

const load = computed(()=>{
  return props.chartLoading
})
	
</script>
<style scoped>
	
</style>