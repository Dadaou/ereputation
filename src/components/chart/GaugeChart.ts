import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';

export const type = 'PieChart';

export const data = [
  ['Task', 'Companies'],
  ['Company1', 11],
  ['Company2', 2],
];

export const options = {
  title: 'Reviews from Customer',
  pieHole: 0.4,

  width: 600,
  height: 600,
};

export default defineComponent({
  name: 'GaugeChart',
  components: {
    GChart,
  },
  setup() {
    return () =>
      h(GChart, {
        data,
        options,
        type,
      });
  },
});
