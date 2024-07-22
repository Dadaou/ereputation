<template>
  <h3>Feedback form submissions</h3>
  <div class="inside">
    
    <div class="date__filter">
        <label for="countries" class="text-sm title" >Establishment
            </label>
        <el-select v-model="establishment" placeholder="Choose establishment" size="large">
            <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                :label="item.name" :value="item.id" />
        </el-select>
        <div class="text-sm title">Select a date range</div>
        <el-date-picker 
            v-model="start_date" 
            type="date" 
            placeholder="Select the start date" 
            :size="'large'" 
        />
        <el-date-picker 
            class="mt-2" 
            v-model="end_date" 
            type="date" 
            placeholder="Select the end date" 
            :size="'large'" 
        />
        <DropdownComponent :showTitle="false" class="dropdown w-full" placeholder="" :data="timePeriods" @submit="(timePeriod) => {
                selectedTimePeriod = timePeriod
            }" :default="timePeriods[0]" />
        
    </div>  
    <div>
      <apexchart 
        width="700" 
        type="bar" 
        :options="chartOptions" 
        :series="series" 
      />
    </div>
  </div>
</template>

<script setup>

import { ref, onBeforeMount,watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import services from '@Services/services.js';
import {  ElOption, ElSelect, ElDatePicker } from 'element-plus';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js"


const userStore = useUserStore();

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const category = ref([]);

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);



const start_date = ref(oneMonthAgo.toISOString().split('T')[0]);
const end_date = ref(today.toISOString().split('T')[0]);

const selectedTimePeriod = ref(null);
const timePeriods = ref(['daily', 'monthly', 'yearly']);
const establishment = ref(null)// Example time periods


const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
    stacked: true,
  },
  xaxis: {
    categories: [],
  },
  colors: ['#0a8964', '#FEB019'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
    },

  },
});



const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, selectedTimePeriod , establishment ) => {

    let api = `/customer/visitor/reviews?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${selectedTimePeriod || 'daily'}`
    if (establishment) {
        api = api + `&establisment=${establishment}`

    }
    console.log(api);
    if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
        start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
        end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
    }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
        dataChart.value = response.data;
        category.value = response.data.categories || [];
        series.value = response.data.series || [];
        chartOptions.value = {
            ...chartOptions.value,
            xaxis: {
            categories: category.value,
            },
        };
        } else {
        console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
};

watch([start_date, end_date, selectedTimePeriod , establishment], () => {
    loadData(start_date.value, end_date.value,selectedTimePeriod.value,establishment.value )
})




onBeforeMount(async () => {
  await loadData(start_date.value, end_date.value, selectedTimePeriod.value,establishment.value);
});


</script>


<script>
export default {
    components: {
        apexchart: VueApexCharts
    }
};
</script>

<style scoped>
.inside {
    display: flex;
    justify-content: center;
}
h3 {
  margin: 40px 0 0;
  text-align: center;
}

.inside {
  padding: 20px;
}

.date__filter {
  margin-bottom: 20px;
}

.text-sm {
  font-size: 0.875rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
