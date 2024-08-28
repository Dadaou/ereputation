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
       <GroupedBarChart class="chart" :plot-data="data" x-key="name" :width="custom_width" :height="200"
        :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
        :x-tick-format="d => `${d}`" :margin="{ top: 20, bottom: 35, left: 30, right: 20 }"/>
        <!--  <div id="weatherIcons" style="height: 58px; width: 100%; position: relative;">
         </div> -->
     </div>
     <div class="colLarge" id="colLarge">
      <div class="boxLarge">
        <GroupedBarChart class="chart" :plot-data="data" x-key="name" :width="custom_width" :height="200"
        :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
        :x-tick-format="d => `${d}`" :margin="{ top: 20, bottom: 35, left: 30, right: 20 }"/>
        <div id="weatherIcons" style="height: 58px; width: 100%; position: relative;">
        </div>
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

const chartLoading = inject('chartLoading');
const legendData = inject('legendData');
const data = inject('data');
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

const positionIcons = () => {
  let positions = [];

  const elements = document.querySelectorAll(".weather__chart .boxLarge .xaxis g.tick");


  elements.forEach(e => {
    positions.push((e.getAttribute("transform").split(',')[0]).split('(')[1]);
  })

  const weathers = document.getElementById("weatherIcons");

  for (let i = 0; i < positions.length; i++) {
    let textNode = document.createElement("span");
    let tempTextNode = document.createElement("span");
    textNode.innerHTML = icons.value[i]['code'];
    tempTextNode.innerHTML = `${icons.value[i]['temperature'].toFixed(0)} ${icons.value[i]['unit']}`;
    textNode.setAttribute("style", `left: calc(${positions[i]}px - 12px); opacity: 1; top: -4px; position: absolute; font-size: 28px; cursor: pointer;`);
    tempTextNode.setAttribute("style", `left: calc(${positions[i]}px - 15px); opacity: 1; top: 28px; position: absolute; font-size: 14px; font-weight:500; cursor: pointer; width: 40px;`);
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
});

watch(data, () => {
  deleteIcons();
  setTimeout(() => positionIcons(), 2000)
    ;
});
watch(() => data.value , () => {
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
}, { immediate: true, deep: true });
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
