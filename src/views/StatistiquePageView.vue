<template>
    <div >
        <div class="filtre_content pb-4">
            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-7 lg:grid-cols-7 gap-4">
                <el-select v-model="establishment" multiple size="large" class="space" placeholder="All Etablishments">
                    <el-option label="All Etablishments" :value="'all'" @click="handleEstablishmentDropdown('all')"
                        :disabled="establishment.length > 1 && !establishment.includes('all')" />
                    <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                        :value="item.id" @click="handleEstablishmentDropdown('other')" />
                </el-select>

                <div class="date_picker">
                    <el-date-picker v-model="start_date" type="date" :size="'large'" class="space " />
                </div>

                <div class="date_picker">
                    <el-date-picker v-model="end_date" type="date" :size="'large'" class="space " />
                </div>

                <DropdownComponent :showTitle="false" class="dropdown " :data="timePeriods" @submit="(timePeriod) => {
                    selectedTimePeriod = timePeriod
                }" :default="timePeriods[0]" />

                <el-select v-model="sourceFilter" size="large" class="space" placeholder="All Sources">
                    <el-option label="All Sources" value="" />
                    <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>


                <el-select v-model="staffFilter" multiple size="large" class="space" placeholder="All Staffs">
                    <el-option label="All Staffs" :value="''" @click="handleStaffDropdown('')"
                        :disabled="staffFilter.length > 1 && !staffFilter.includes('')" />
                    <el-option v-for="item in staffs" :key="item.id" :label="item.name" :value="item.id"
                        @click="handleStaffDropdown('other')" />
                </el-select>


                <el-select v-model="unitsFilter" multiple size="large" class="space" placeholder="All Units">
                    <el-option label="All Units" :value="''" @click="handleUnitDropdown('')"
                        :disabled="unitsFilter.length > 1 && !unitsFilter.includes('')" />
                    <el-option v-for="item in units" :key="item.id" :label="item.name" :value="item.id"
                        @click="handleUnitDropdown('other')" />
                </el-select>

            </div>
        </div>

        <div ref="contentTop" class="number">
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



         <!-- modal liste visitors -->

                    <div v-if="modal" class="overlay" >
                    <div class="modal" @click.stop :style="{ top: modalTop + 'px',position: 'absolute' }">
                     <div >
                        <h6 v-if="isExternal == 'Feedback'" class="text-lg font-bold" style="text-align: center;color: gray;"> Feedback Form Submissions</h6>
                        <h6 v-if="isExternal == 'Discount'" class="text-lg font-bold" style="text-align: center;color: gray;"> Discount coupons</h6>
                        <h6 v-if="isExternal == 'External'" class="text-lg font-bold" style="text-align: center;color: gray;"> External Qrcodes</h6>
                        <h6 v-if="isExternal == 'Country'" class="text-lg font-bold" style="text-align: center;color: gray;"> Countries</h6>
                        <button class="btn text-lg close-btn" style="color: red;" @click="closeModal">x</button>
                     </div>
                      <div class="modal-content" >


                          <el-table :data="visitors" class="custom-header" style="font-size: 13px !important;padding: 0px !important;margin: 0px !important;">

                            <!--  <el-table-column label="Os" align="left" >
                                <template #default="scope">
                                  <span style="width: 3px !important;">
                                    {{ scope.row.os }}
                                  </span>

                                </template>
                              </el-table-column> -->

                               <el-table-column label="OS" align="center" prop="os" show-overflow-tooltip/>

                              <!--  <el-table-column label="Device" align="left" >
                                <template #default="scope">
                                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                                    {{ scope.row.device }}
                                  </span>

                                </template>
                              </el-table-column>
                 -->
                              <el-table-column label="Device" prop="device"  show-overflow-tooltip />

                              <el-table-column label="Country" prop="country" show-overflow-tooltip/>
                            <!--   <el-table-column label="Country" align="left" >
                                <template #default="scope">
                                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                                    {{ scope.row.country }}
                                  </span>

                                </template>
                              </el-table-column> -->

                              <el-table-column label="City" prop="city" show-overflow-tooltip/>
                              <!--  <el-table-column label="City" align="left" >
                                <template #default="scope">
                                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                                    {{ scope.row.city }}
                                  </span>

                                </template>
                              </el-table-column> -->

                               <el-table-column label="Gps" align="center" prop="gps"  show-overflow-tooltip/> 
                            <!--   <el-table-column label="Gps" align="left" >
                                <template #default="scope">
                                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                                    {{ scope.row.gps }}
                                  </span>

                                </template>
                              </el-table-column> -->
                            <el-table-column  label="Language" align="center" prop="language"  show-overflow-tooltip/> 
                            <el-table-column  label="User Agent" align="center" prop="ua"  show-overflow-tooltip/> 
                             <el-table-column label="ISP" align="center" prop="isp"  show-overflow-tooltip/> 

                              <el-table-column v-if="isExternal == 'Feedback' || isExternal == 'Country' || isExternal == 'Discount'" label="Contact" align="left" show-overflow-tooltip>
                                <template #default="scope">
                                  <span >
                                    {{ scope.row.email }}
                                  </span>

                                </template>
                              </el-table-column>
                             
                               <el-table-column label="Created at" prop="created_at" show-overflow-tooltip/>
                          <!--    <el-table-column label="Created At" align="left">
                                <template #default="scope">
                                  <span style=" word-wrap: break-word;word-break: break-word;white-space: normal">
                                     {{ scope.row.created_at ? moment(scope.row.created_at).format('YYYY-MM-DD HH:mm') : '' }}
                                  </span>

                                </template>
                              </el-table-column> -->
                         
                         
                           
                        </el-table>

                        
                      </div>
                      
                    </div>
                  </div>


                        <!-- Fin modal -->

  

        <!-- <div class="dashboard__chart"> -->
        <div class="grid max-[1080px]:grid-cols-1 grid-cols-2 min-[1920px]:grid-cols-3 grid-flow-row gap-4 mt-8">

            <div class="statistique" v-if = "showChart.submission">
                <ChartFeedbackSubmissions @show-chart="displayChart" @show-visitors="showVisitors" @showModal="showModal" @setSource="setExternal"/>
            </div>
            <div class="statistique" v-if = "showChart.gateAndFeedback">
                <ChartGateAndFeedbackVisit @show-chart="displayChart" />
            </div>
            <div class="statistique" v-if = "showChart.external">
                <ChartExternalUrl @show-chart="displayChart" @show-visitors="showVisitors" @showModal="showModal" @setSource="setExternal"/>
            </div>

            <div class="statistique" v-if = "showChart.service">
                <PieChartService @show-chart="displayChart" />
            </div>
            <div class="statistique" v-if = "showChart.gate">
                <ChartAboutGate @show-chart="displayChart" />
            </div>
            <div class="statistique" v-if = "showChart.platform">
                <ChartPlatformsAndSocialmedia @show-chart="displayChart" />
            </div>
            <div class="statistique" v-if = "showChart.sociaux">
                <PieChartReseauxSociaux @show-chart="displayChart" />
            </div>
            <div class="statistique" v-if = "showChart.discount == true">
                <ChartDiscount @show-chart="displayChart" @show-visitors="showVisitors" @showModal="showModal" @setSource="setExternal"/>
            </div>

            <div class="statistique" v-if = "showChart.country">
                <ChartCountry @show-chart="displayChart" @show-visitors="showVisitors" @showModal="showModal" @setSource="setExternal"/>
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
import { ref, provide, onBeforeMount,nextTick } from 'vue'
import { Icon } from '@iconify/vue';
import { defineAsyncComponent, watch } from 'vue';
import { ElOption, ElSelect, ElDatePicker,ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElTooltip } from 'element-plus';
import { useUserStore } from "@Stores/user.js"
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';
import moment from 'moment';


const ChartFeedbackSubmissions = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartFeedbackSubmissions.vue")
)

const ChartAboutGate = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartAboutGate.vue")
)

const ChartExternalUrl = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartExternalUrl.vue")
)

const ChartDiscount = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartDiscount.vue")
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

const ChartCountry = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartCountry.vue")
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
const visitors = ref([]);
const modal = ref(false);
const isExternal=ref(false);
const scrollPosition = ref(0);
const contentTop = ref(null);
const modalTop = ref(0);

const showChart=ref({
    submission: true,
    gateAndFeedback: true,
    external: true,
    service: true,
    gate: true,
    platform: true,
    sociaux: true,
    discount: true,
    country: true
})

const displayChart = (_ch)=>{
    if (_ch == 'submission') {
        showChart.value.submission = true;
    }
    if (_ch == 'submission_false') {
        showChart.value.submission = false;
    }

    if (_ch == 'gateAndFeedback') {
        showChart.value.gateAndFeedback = true;
    }
     if (_ch == 'gateAndFeedback_false') {
        showChart.value.gateAndFeedback = false;
    }

    if (_ch == 'external') {
        showChart.value.external = true;
    }
    if (_ch == 'external_false') {
        showChart.value.external = false;
    }

      if (_ch == 'country') {
        showChart.value.country = true;
    }
    if (_ch == 'country_false') {
        showChart.value.country = false;
    }


    if (_ch == 'service') {
        showChart.value.service = true;
    }
     if (_ch == 'service_false') {
        showChart.value.service = false;
    }

    if (_ch == 'gate') {
        showChart.value.gate = true;
    }
    if (_ch == 'gate_false') {
        showChart.value.gate = false;
    }

    if (_ch == 'platform') {
        showChart.value.platform = true;
    }
    if (_ch == 'platform_false') {
        showChart.value.platform = false;
    }

    if (_ch == 'sociaux') {
        showChart.value.sociaux = true;
    }
     if (_ch == 'sociaux_false') {
        showChart.value.sociaux = false;
    }

    if (_ch == 'discount') {
        showChart.value.discount = true;
         console.log(showChart.value.discount)
    }
     if (_ch == 'discount_false') {
        showChart.value.discount = false;
        console.log(showChart.value.discount)
    }
}
const showVisitors = (_visitors) => {
    visitors.value=_visitors;
}

const showModal = (_modal) => {
    modal.value=_modal;
    modalTop.value = window.scrollY;
    // scrollPosition.value = window.scrollY; 

    // nextTick(() => {
    //     if (contentTop.value) {
    //       const rect = contentTop.value.getBoundingClientRect();
    //       window.scrollTo({
    //         top: window.scrollY + rect.bottom - 80,
    //         behavior: "smooth",
    //       });
    //     }
    // });
    
}
const closeModal = () => {
    modal.value=false;
    // nextTick(() => {
    //     window.scrollTo({ top: scrollPosition.value, behavior: "smooth" });
    // });
    
}
const setExternal = (_isExternal) => {
  
    isExternal.value = _isExternal;
}

const sources = ref([
    { id: "gates", name: 'Gates' },
    { id: "feedback", name: 'Feedback' },
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

const handleUnitDropdown = (type) => {
    const filterunit = type == 'other' ? unitsFilter.value.filter(name => name != '') : ['']
    unitsFilter.value = unitsFilter.value.length > 0 ? filterunit : ['']
}

const totalVisit = async (type) => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=all&from=${moment(start_date.value).format('YYYY-MM-DD')}&to=${moment(end_date.value).format('YYYY-MM-DD')}`, (response) => {
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
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=no&from=${moment(start_date.value).format('YYYY-MM-DD')}&to=${moment(end_date.value).format('YYYY-MM-DD')}`, (response) => {
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
            services.get_Record(`/customer/visitor/indicator?tag=${route.params.tag}&type=${type || 'daily'}&reviews=yes&from=${moment(start_date.value).format('YYYY-MM-DD')}&to=${moment(end_date.value).format('YYYY-MM-DD')}`, (response) => {
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
            services.get_Record(`/customer/visitorclick/clicks/social?tag=${route.params.tag}&type=${type || 'daily'}&from=${moment(start_date.value).format('YYYY-MM-DD')}&to=${moment(end_date.value).format('YYYY-MM-DD')}`, (response) => {
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

watch([establishment, unitsFilter, staffFilter, selectedTimePeriod, start_date, end_date], () => {
    establishment.value = establishment.value.length > 0 ? establishment.value : ['all']
    staffFilter.value = staffFilter.value.length > 0 ? staffFilter.value : ['']
    unitsFilter.value = unitsFilter.value.length > 0 ? unitsFilter.value : ['']
    totalVisit(selectedTimePeriod.value);
    totalNotSubmitted(selectedTimePeriod.value);
    totalSubmitted(selectedTimePeriod.value);
    totalClickSocial(selectedTimePeriod.value);
    showChart.value.submission = true;
    showChart.value.discount = true;
    showChart.value.gate = true;
    showChart.value.gateAndFeedback = true;
    showChart.value.sociaux = true;
    showChart.value.platform = true;
    showChart.value.service = true;
    showChart.value.external = true;
    showChart.value.country = true;
})

</script>
<style scoped>

.modal {
 
 background: white;
 opacity: 1;
  padding: 15px;
  padding-top: 40px;
  margin-top: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 500px;
  overflow: auto; 
  display: flex;
  flex-direction: column;
  z-index: 9 !important;
  scrollbar-width: none;

}

.modal-content {
  flex-grow: 1;
  overflow-x: auto; 
  overflow-y: auto; 
  border: 1px solid #ccc;
  padding: 5px;
    width: 100%;
  white-space: nowrap; 
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 25px;
  color: red;
  cursor: pointer;

}



.filtre_content {
    width: 100% !important;
}

.dropdown {
    margin-top: 0% !important;
}


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

/*.spaceSelect {
    margin-top: 12px !important
}*/

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

/*.date_picker {
    display: flex;
    align-items: center;
    flex-grow: 1;
    min-width: 165px;
}*/

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

    /*.space {
        margin-bottom: 10px !important;
    }

    .spaceSelect {
        margin-bottom: 20px !important;
        margin-top: 10px !important;
    }*/

    .number {
        display: block;
        align-items: center;
    }

    .square span {
        font-size: 12px !important;
    }
}
</style>