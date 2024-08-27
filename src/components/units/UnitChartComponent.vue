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
<div v-else class="chart_content" :style="{
    'display': 'flex',
    'width': '100%',
 }">
  <div class="colSmall">
    <GroupedBarChart  class="chart" :plot-data="plotdata" x-key="date" :width="custom_width" :height="200" :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label=""
    :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']" :y-tick-format="d => `${d}`"/>
  </div>
  <div class="colLarge" id="colLarge">
    <div class="boxLarge">
      <GroupedBarChart  class="chart" :plot-data="plotdata" x-key="date" :width="custom_width" :height="200" :margin="{ top: 20, bottom: 35, left: 55, right: 20 }" x-axis-label="Dates" y-axis-label=""
    :colors="['#337ecc', '#f75842', '#00BFFF', '#87CEFA', '#87CEEB', '#ADD8E6', '#B0C4DE', '#4169E1']" :y-tick-format="d => `${d}`"/>
    </div>
  </div>
</div>
<div>
    <BaseLegend class="legend" style="margin-bottom: 50px;" :LegendData="legendData" :alignment="'horizontal'">
    </BaseLegend>
</div>	
</template>
<script setup>
import { ref, defineAsyncComponent, computed, nextTick, watch} from 'vue';

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
watch(() => props.plotdata, () => {
    nextTick(() => {
        const colLargeElement = document.getElementById("colLarge");
        if (colLargeElement) {
            const div = document.getElementsByClassName("chart")[0].children;
            const widthp = parseInt(div[0].getAttribute("width"));
            const longueur = widthp * props.plotdata.length;
            colLargeElement.scrollLeft += longueur;
            colLargeElement.scrollLeft = longueur;
        }
    });
}, { immediate: true, deep: true });

const load = computed(()=>{
  return props.chartLoading
});
	
</script>
<style scoped>
.colLarge {
  overflow-x: scroll; 
  width: 100%;
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