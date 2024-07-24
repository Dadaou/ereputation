<template>
    <div>
        <h1>Analytics</h1>
        <div class="number">
            <div class="square bordure-bleu">
                <h5><i class="uil uil-user"></i> <span>Total visits</span></h5>
                <p :class="nbrTotalVisit >= 0 ? 'texte-vert' : 'texte-rouge'">{{ nbrTotalVisit }}</p>
            </div>
            <div class="square square bordure-rouge">
                <h5><i class="uil uil-times"></i> <span>Total not submitted</span></h5>
                <p>14</p>
            </div>
            <div class="square bordure-vert">
                <h5><i class="uil-envelope-send"></i> <span>Total submissions</span></h5>
                <p :class="avisSoumis >= 0 ? 'texte-vert' : 'texte-rouge'">{{ avisSoumis }}</p>
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
        <div class="date__filter">
            <el-select v-model="sourceFilter" size="large" class="space" placeholder="Choose source">
                <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-model="staffFilter" size="large" class="space" placeholder="Choose staff">
                <el-option v-for="item in staffs" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-model="unitsFilter" size="large" class="space" placeholder="Choose unit">
                <el-option v-for="item in units" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
import { ref, provide, onBeforeMount} from 'vue'
import { Icon } from '@iconify/vue';
import { defineAsyncComponent, watch } from 'vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import { useUserStore } from "@Stores/user.js"
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';

const nbrTotalVisit = ref(null);
const avisSoumis = ref(null)
const userStore = useUserStore();
const timePeriods = ref(['daily', 'monthly', 'yearly']);

// const sources = ref(['all', 'gates', 'feedback']);

const sources = ref([
    { id: "all", name: 'All' },
    { id: "gates", name: 'Gates' },
    { id: "feedback", name: 'Feedback' },
    // Ajoutez d'autres éléments ici
]);
const sourceFilter = ref(null);
provide('sourceFilter', sourceFilter)





const route = useRoute();

const selectedTimePeriod = ref(null);
provide('timePeriods', selectedTimePeriod)

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const staffs = ref([]);

const staffFilter = ref(null);
provide('staffFilter', staffFilter)

const units = ref([])
const unitsFilter = ref(null);
provide('unitsFilter', unitsFilter)






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



const totalVisit = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            nbrTotalVisit.value = response.data || 0;
        } else {
        console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const loadStaff = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/staffs?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            staffs.value = response.data
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const loadUnits = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/units?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            units.value = response.data ;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}



const loadAvisSoumis = async (establishment, units, staff) => {
    let api = `customer/visitor/reviews/comparaison?tag=${route.params.tag}`
    if (establishment) {
        api = api + `&establisment=${establishment}`
    }
    if (units) {
        api = api + `&units=${units}`
    }
    if (staff) {
        api = api + `&staff=${staff}`
    }

     console.log("api du comparaison " , api) ; 


    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            console.log("avis soumis comparaison")
            console.log(response.data)
            avisSoumis.value = response.data.count || 0 ;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
};


onBeforeMount(async () => {
    await totalVisit(selectedTimePeriod.value);
    await loadStaff();
    await loadUnits(); 
    await loadAvisSoumis(establishment.value, unitsFilter.value, unitsFilter.value);
});

watch([establishment, unitsFilter, staffFilter, selectedTimePeriod], () => {
    totalVisit(selectedTimePeriod.value);
    loadAvisSoumis(establishment.value, unitsFilter.value , staffFilter.value)
})





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

.spaceSelect2 {
    margin-top: 0 !important ;
    margin-right: 10px;
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

.texte-vert {
    color: green !important;
}

.texte-rouge {
    color: red !important;
}

</style>