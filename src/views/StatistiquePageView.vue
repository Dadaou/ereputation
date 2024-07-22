<template>
    <div>
        <h1>Analytics</h1>
        <div class="number">
            <div class="square bordure-bleu">
                
                <h5><i class="uil uil-user"></i> <span>Total visits</span></h5>
                <p>{{nbrTotalVisit}}</p>
            </div>
            <div class="square square bordure-rouge">
                <h5><i class="uil uil-times"></i> <span>Total not submitted</span></h5>
                <p>14</p>
            </div>
             <div class="square bordure-vert">
                <h5><i class="uil-envelope-send"></i> <span>Total submissions</span></h5>
                <p>14</p>
            </div>
            <div class="square">
                <h5><i class="uil uil-hand-pointer"></i><span>Total social media clicks</span></h5>
                <p>14</p>
            </div>
        </div>
       
        <div class="date__filter">
            
            <el-select v-model="establishment"  size="large" class="space" placeholder="Choose etablishment">
                <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                    :label="item.name" :value="item.id" />
            </el-select>
            
            <el-date-picker 
                v-model="start_date" 
                type="date" 
                :size="'large'" 
                class="space"
            />
            <el-date-picker 
                v-model="end_date" 
                type="date" 
                :size="'large'" 
            />
            <DropdownComponent :showTitle="false" class="dropdown w-full spaceSelect mt-0" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />
            
        </div>  
        <div class="dashboard">
            <div class="statistique">
                <ChartComponent />
            </div>
            <div class="statistique">
                <Chart3Component />
            </div>
        </div>
        <br>
        <div class="dashboard">
            <div class="statistique ">
                <Chart2Component />
            </div>
            <div class="statistique">
                <Chart4Component />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref , provide , onBeforeMount } from 'vue'
import {defineAsyncComponent} from 'vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import { useUserStore } from "@Stores/user.js"
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';

const nbrTotalVisit = ref(null) ;
const userStore = useUserStore();
const timePeriods = ref(['daily', 'monthly', 'yearly']);

const route = useRoute();

const selectedTimePeriod = ref(null);
provide('timePeriods', selectedTimePeriod)

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);


const start_date = ref(oneMonthAgo.toISOString().split('T')[0]);
provide('start_date', start_date)

const end_date = ref(today.toISOString().split('T')[0]);
provide('end_date', end_date)

const establishment = ref(null)
provide('establishment', establishment)

const ChartComponent = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartComponent.vue")
)

const Chart2Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart2Component.vue")
)

const Chart3Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart3Component.vue")
)

const Chart4Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart4Component.vue")
)


const totalVisit = async () =>{
   
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/nombre/visitor/current/month?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            console.log(response.data.nbr)
            nbrTotalVisit.value = response.data.nbr || 0;
        } else {
        console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(async () => {
  await totalVisit();
});






</script>
<style>
.date__filter {
    display: flex;
    margin: 30px;
}

.space {
    margin-right: 10px;
}

.spaceSelect {
    margin-left: 10px;
}

.bordure-vert{
    border-bottom: 2px solid;
    border-bottom-color: #0a8964;
}
.bordure-bleu{
    border-bottom: 2px solid;
    border-bottom-color: #7bc6e9;
}
.bordure-rouge{
    border-bottom: 2px solid;
    border-bottom-color: #e97b80;
}
.dashboard {
    display: flex;
}
@media (max-width: 995px) {
    .dashboard {
        display: flex;
        justify-content: space-around;
    }

}
    
.bas {
    margin-left : -50px ;
}
.statistique {
    z-index: 2;
}
h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--color-primary);
}
.square{
    width: 20%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.square h5{
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}

.square p {
    text-align: center;
    padding: 10px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
.number{
    display: flex;
    padding-top: 20px;
    justify-content: space-around;
}


</style>