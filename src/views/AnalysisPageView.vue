<template>
	<Bar :data="data" :options="options" />
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
const appStore = useAppStore();
appStore.setCurrentPage({
    title1: "",
    title2: "Analysis",
    icon: "uil-analytics"
});

const data = {
  labels: [
	  '2024-02-15',
	  '2024-02-16',
	  '2024-02-17',
	  '2024-02-18',
	  '2024-02-19',
	  '2024-02-20',
	  '2024-02-21',
	  '2024-02-22',
	  '2024-02-23',
	  '2024-02-24',
	  '2024-02-25'
  ],
  datasets: [
    {
      label: 'Acceuil',
      backgroundColor: '#f87979',
      data: [4.05, 2.14, 1.20, 3.79, 0.99, 4.32, 3.98, 1.80, 3.46, 2.10, 0.90, 1.11]
    },
    {
      label: 'Ménage',
      backgroundColor: '#587179',
      data: [3.45, 1.87, 4.12, 0.93, 2.75, 4.59, 1.23, 3.01, 0.62, 4.38, 2.94, 0.51]
    }
  ]
}

const options = {
    // responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    plugins: {
        legend: {
            display: false,
            // position: 'bottom'
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'x',
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'x',
            }
        }
    }
}
</script>