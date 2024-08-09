<template>
    <div>
        <h1>Analytics</h1>
        <div class="date__filter">

            <el-select v-model="establishment" multiple size="large" class="space my-3" placeholder="All Etablishment">
                <el-option label="All Etablishment" :value="'all'" @click="handleEstablishmentDropdown('all')"
                    :disabled="establishment.length > 1 && !establishment.includes('all')" />
                <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                    :value="item.id" @click="handleEstablishmentDropdown('other')" />
            </el-select>
            <div class="date_picker">
                <el-date-picker v-model="start_date" type="date" :size="'large'" class="space my-3" />
            </div>
            <div class="date_picker">
                <el-date-picker v-model="end_date" type="date" :size="'large'" class="space my-3" />
            </div>
            <DropdownComponent :showTitle="false" class="dropdown w-full spaceSelect" :data="timePeriods" @submit="(timePeriod) => {
                selectedTimePeriod = timePeriod
            }" :default="timePeriods[0]" />

        </div>

        <div class="date__filter">
            <el-select v-model="sourceFilter" size="large" class="space" placeholder="All Source">
                <el-option label="All Source" value="" />
                <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-model="staffFilter" multiple size="large" class="space" placeholder="All Staff">
                <el-option label="All Staff" :value="''" @click="handleStaffDropdown('')"
                :disabled="staffFilter.length > 1 && !staffFilter.includes('')"/>
                <el-option v-for="item in staffs" :key="item.id" :label="item.name" :value="item.id" 
                    @click="handleStaffDropdown('other')"/>
            </el-select>
            <el-select v-model="unitsFilter" multiple size="large" class="space" placeholder="All Unit">
                <el-option label="All Unit" value="" />
                <el-option v-for="item in units" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </div>

        <div class="number">
            <div class="square bordure-bleu">
                <h5><i class="uil uil-user"></i> <span>Total visits</span></h5>
                <p>{{ nbrTotalVisit }}<sup :class="nbrGapVisit >= 0 ? 'texte-vert' : 'texte-rouge'">{{ nbrGapVisit >= 0
                    ? '+' : '' }}{{ nbrGapVisit }}</sup></p>
            </div>
            <div class="square square bordure-rouge">
                <h5><i class="uil uil-times"></i> <span>Total not submitted</span></h5>
                <p>{{ nbrNotSubmitted }}<sup :class="nbrGapNotSubmitted >= 0 ? 'texte-vert' : 'texte-rouge'">{{
                    nbrGapNotSubmitted >= 0 ? '+' : '' }}{{ nbrGapNotSubmitted }}</sup></p>
            </div>
            <div class="square bordure-vert">
                <h5><i class="uil-envelope-send"></i> <span>Total submissions</span></h5>
                <p>{{ nbrSubmitted }}<sup :class="nbrGapSubmitted >= 0 ? 'texte-vert' : 'texte-rouge'">{{
                    nbrGapSubmitted >= 0 ? '+' : '' }}{{ nbrGapSubmitted }}</sup></p>
            </div>
            <div class="square">
                <h5 class="iconfy">
                    <Icon icon="mdi:hand-tap" />
                    <span>Total social media clicks</span>
                </h5>
                <p>{{ nbrClickSocial }}<sup :class="nbrGapClickSocial >= 0 ? 'texte-vert' : 'texte-rouge'">{{
                    nbrGapClickSocial >= 0 ? '+' : '' }}{{ nbrGapClickSocial }}</sup></p>
            </div>
        </div>

        <!-- <div class="dashboard__chart"> -->
        <div class="grid max-[1080px]:grid-cols-1 grid-cols-2 min-[1920px]:grid-cols-3 grid-flow-row gap-4 mt-8">
            <div class="statistique">
                <ChartFeedbackSubmissions />
            </div>
            <div class="statistique">
                <ChartGateAndFeedbackVisit />
            </div>
            <div class="statistique">
                <PieChartService />
            </div>
            <div class="statistique">
                <ChartAboutGate />
            </div>
            <div class="statistique">
                <ChartPlatformsAndSocialmedia />
            </div>
            <div class="statistique">
                <PieChartReseauxSociaux />
            </div>

        </div>
        <br>
        <div class="dashboard__chart">

        </div>
        <br>
        <div class="dashboard__chart">

        </div>
    </div>
</template>

<script setup>
import { ref, provide, onBeforeMount } from 'vue'
import { Icon } from '@iconify/vue';
import { defineAsyncComponent, watch } from 'vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import { useUserStore } from "@Stores/user.js"
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';

const ChartFeedbackSubmissions = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartFeedbackSubmissions.vue")
)

const ChartAboutGate = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartAboutGate.vue")
)

const ChartGateAndFeedbackVisit = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartGateAndFeedbackVisit.vue")
)

const ChartPlatformsAndSocialmedia = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartPlatformsAndSocialmedia.vue")
)

const PieChartReseauxSociaux = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/PieChartReseauxSociaux.vue")
)

const PieChartService = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/PieChartService.vue")
)

const nbrTotalVisit = ref(null);
const nbrNotSubmitted = ref(null);
const nbrSubmitted = ref(null);
const nbrClickSocial = ref(null);
const nbrGapVisit = ref(null);
const nbrGapNotSubmitted = ref(null);
const nbrGapSubmitted = ref(null);
const nbrGapClickSocial = ref(null);
const userStore = useUserStore();
const timePeriods = ref(['daily', 'monthly', 'yearly']);

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
provide('staffs', staffs)

const staffFilter = ref(null);
provide('staffFilter', staffFilter)

const units = ref([])
provide('units', units)
const unitsFilter = ref(null);
provide('unitsFilter', unitsFilter)

const start_date = ref(oneMonthAgo.toISOString().split('T')[0]);
provide('start_date', start_date)

const end_date = ref(today.toISOString().split('T')[0]);
provide('end_date', end_date)

const establishment = ref([])
provide('establishment', establishment)
provide('establishments', userStore.user.customer.establishments)

const handleEstablishmentDropdown = (type) => {
    const filters = type == 'other' ? establishment.value.filter(name => name != 'all') : ['all']
    establishment.value = establishment.value.length > 0 ? filters : ['all']
}

const handleStaffDropdown = (type) => {
    const filterstaff = type == 'other' ? staffFilter.value.filter(name => name != '') : ['']
    staffFilter.value = staffFilter.value.length > 0 ? filterstaff : ['']
}

const totalVisit = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=all`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            nbrTotalVisit.value = response.data.visitor_now || 0;
            nbrGapVisit.value = response.data.gap || 0;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}
const totalNotSubmitted = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=no`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            nbrNotSubmitted.value = response.data.visitor_now || 0;
            nbrGapNotSubmitted.value = response.data.gap || 0;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const totalSubmitted = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=yes`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            nbrSubmitted.value = response.data.visitor_now || 0;
            nbrGapSubmitted.value = response.data.gap || 0;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const totalClickSocial = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitorclick/clicks/social?tag=${route.params.tag}&type=${type || 'daily'}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            nbrClickSocial.value = response.data.visitor_click_now || 0;
            nbrGapClickSocial.value = response.data.gap || 0;
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
            units.value = response.data;
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}


onBeforeMount(async () => {
    await totalVisit(selectedTimePeriod.value);
    await totalNotSubmitted(selectedTimePeriod.value);
    await totalSubmitted(selectedTimePeriod.value);
    await totalClickSocial(selectedTimePeriod.value);
    await loadStaff();
    await loadUnits();
});

watch([establishment, unitsFilter, staffFilter, selectedTimePeriod], () => {
    establishment.value = establishment.value.length > 0 ? establishment.value : ['all']
    staffFilter.value = staffFilter.value.length > 0 ? staffFilter.value : ['']
    totalVisit(selectedTimePeriod.value);
    totalNotSubmitted(selectedTimePeriod.value);
    totalSubmitted(selectedTimePeriod.value);
    totalClickSocial(selectedTimePeriod.value);
})

</script>
<style scoped>
.iconfy {
    display: flex;
    justify-content: center;
}

.iconify--pepicons-pencil {
    color: #000 !important;
    margin-right: 3px;
    margin-top: 2px;
}

.statistique-left,
.statistique-right {
    width: 50%;
}

.statistique-left {
    float: left;
    /* margin-left: 30px; */
}

.statistique-right {
    float: right;
    /* margin-right: 30px; */
    margin-top: -20px;
}

.date__filter {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.spaceSelect {
    margin-top: 12px !important
}

.bordure-vert {
    border-bottom: 2px solid;
    border-bottom-color: #0a8964;
}

.bordure-bleu {
    border-bottom: 2px solid;
    border-bottom-color: #7bc6e9;
}

.bordure-rouge {
    border-bottom: 2px solid;
    border-bottom-color: #e97b80;
}

.dashboard__chart {
    /* display: grid; */
    width: 100%;
    gap: 20px;
    height: auto !important;
    overflow: hidden;
}

.date_picker {
    display: flex;
    align-items: center;
    flex-grow: 1;
    min-width: 165px;
}

@media (max-width: 1281px) {
    .square.bordure-bleu h5 {
        margin-bottom: 15px !important;
    }
}

@media (max-width: 995px) {
    .dashboard__chart {
        display: flex;
        justify-content: space-around;
    }

}

.bas {
    margin-left: -50px;
}

.statistique {
    z-index: 2;
    width: 100%;
}

h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--color-primary);
}

.square {
    display: flex;
    flex-direction: column;
    /* Alignement vertical */
    justify-content: space-between;
    /* Espacement entre les enfants */
    align-items: center;
    width: 20%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.square h5 {
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
    font-size: 20px;
    color: black;
}

.square p sup {
    font-size: 12px;
}

.number {
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
}

.texte-vert {
    color: green !important;
}

.texte-rouge {
    color: red !important;
}


@media (min-width: 560px) and (max-width: 800px) {
    .number {
        /* justify-content: flex-start; */
        gap: 20px;
    }

    .square {
        padding: 2px !important;
    }

    .dashboard__chart {
        display: block;
        width: 100%;
        gap: 20px;
    }

    .statistique-left,
    .statistique-right {
        display: block !important;
        width: 95%;
        float: none;
    }
}

@media (max-width: 558px) {
    .dashboard__chart {
        display: block;
    }

    .statistique-left,
    .statistique-right,
    .square,
    .date__filter {
        display: block !important;
        width: 100%;
        float: none;
    }

    .statistique-right,
    .statistique-left {
        width: 99%;
        margin-left: 1%
    }

    .space {
        margin-bottom: 10px !important;
    }

    .spaceSelect {
        margin-bottom: 20px !important;
        margin-top: 10px !important;
    }

    .number {
        display: block;
        align-items: center;
    }

    .square span {
        font-size: 12px !important;
    }
}
</style>