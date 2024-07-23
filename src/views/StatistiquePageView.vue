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
                <h5 class="iconfy">
                    <Icon icon="pepicons-pencil:hand-point" />
                    <span>Total social media clicks</span>
                </h5>
                <p>14</p>
            </div>
        </div>

        <div class="date__filter">

            <el-select v-model="establishment" size="large" class="space" placeholder="Choose etablishment">
                <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                    :value="item.id" />
            </el-select>

            <el-date-picker v-model="start_date" type="date" :size="'large'" class="space" />
            <el-date-picker v-model="end_date" type="date" :size="'large'" />
            <DropdownComponent :showTitle="false" class="dropdown w-full spaceSelect" :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />

        </div>
        <div class="dashboard">
            <div class="statistique-left">
                <ChartComponent />
            </div>
            <div class="statistique-right">
                <Chart3Component />
            </div>
        </div>
        <br>
        <div class="dashboard">
            <div class="statistique-left ">
                <Chart2Component />
            </div>
            <div class="statistique-right">
                <Chart4Component />
            </div>
        </div>
        <div class="dashboard">
            <div class="statistique-left ">
                <PieChartReseauxSociaux />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, provide, onBeforeMount, inject, computed } from 'vue'
import { Icon } from '@iconify/vue';
import {defineAsyncComponent} from 'vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import { useUserStore } from "@Stores/user.js"
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';
import moment from 'moment';

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

const PieChartReseauxSociaux = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/PieChartReseauxSociaux.vue")
)

const staffs = inject('staffs')

let tableData = computed(() => {
    let data = [];
    staffs.value.forEach(staff_item => {
        staff_item['period'] = staff_item.dateto != null ? `${moment(staff_item.datefrom).format('YYYY MMM DD')} to ${moment(staff_item.dateto).format('YYYY MMM DD')}` : `${moment(staff_item.datefrom).format('YYYY MMM DD')} to -`;
        data.push(staff_item);
    })
    return data;
});

const search = ref('')
const filterTableData = computed(() => {
    let filterdata = tableData.value;
    filterdata = tableData.value.filter(
        (data) =>
            !search.value ||
            data.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
            data.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
            data.department.toLowerCase().includes(search.value.toLowerCase()) ||
            data.section.toLowerCase().includes(search.value.toLowerCase()) ||
            data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
    )
    console.log("filterdataaaaaaaaaaaa");
    console.log(filterdata);
    return filterdata
})

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
    filterTableData(); 
});






</script>
<style>
.iconfy{
    display: flex;
}
.iconify--pepicons-pencil{
    color: #000 !important;
    margin-right: 3px;
    margin-top: 2px;
}
.statistique-left{
    float: left;
    width: 45%;
    margin-left: 30px;
    
}

.statistique-right{
    float : right ; 
    width: 45%;
    margin-right: 30px;
    margin-top: -20px;
}

.date__filter {
    display: flex;
    margin: 2.5%;
}

.space {
    margin-right: 10px;
}

.spaceSelect {
    margin-left: 10px;
    margin-top : 0 !important
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
    /* display: flex; */
    width: 100%;
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