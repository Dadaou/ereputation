import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';

export const type = 'LineChart';

export const data = [
  ['Year', 'Company1', 'Company2'],
  ['2014', 1000, 400],
  ['2015', 1170, 460],
  ['2016', 660, 1120],
  ['2017', 1030, 540],
];

export const options = {
  chart: {
    title: 'Company Performance',
    subtitle: 'Company1, Company2',
  },
  width: 800,
  height: 300,
};

export default defineComponent({
  name: 'GoogleChart',
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
