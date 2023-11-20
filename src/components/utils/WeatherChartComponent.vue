<template>
  <div class="reviews__content" ref="el" :style="containerStyles">
    <div
      v-if="chartLoading == true"
      :style="{
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
      }"
    >
      <SpinnerComponent />
    </div>
    <GroupedBarChart
      v-else
      :plot-data="data"
      x-key="name"
      :width="custom_width"
      :height="200"
      :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']"
      :x-tick-format="d => `${d}`"
    />
    <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'"></BaseLegend>
  </div>
</template>

<script setup>
import { ref, inject, defineAsyncComponent, computed } from 'vue';
import { useResizeObserver, useWindowSize } from '@vueuse/core';
const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
);

const chartLoading = inject('chartLoading');
const legendData = inject('legendData');
const data = inject('data');
const el = ref(null);
const chartWidth = inject('chartWidth');

const custom_width = computed(() => {
  let nb = data.value.length;
  let width = 800;
  if (nb > 9) {
    width = (width * nb) / 9;
  }

  return width;
});

const containerStyles = computed(() => ({
  maxWidth: '100%', // Set a maximum width
  overflowX: 'auto', // Add horizontal scroll when content exceeds the width
}));

useResizeObserver(el, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;
  chartWidth.value = Math.abs(width);
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
