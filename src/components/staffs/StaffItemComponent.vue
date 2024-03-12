<template>
    <div class="staff__list" v-if="staffs.length>0">
        <div class="staff__card" v-for="staff in staffs" :key="staff.id">
            <div class="staff__qrcode">    
                <div>
                    <RouterLink :to="`/customer/${tag}/establishment/${$route.params.id}/staffs/list/${staff.tag}/reviews`" @Click="()=>{ selectedStaff = staff }">
                        <h5>{{ staff.firstname }} <span v-if="staff.lastname != null">{{ staff.lastname }}</span></h5>
                    </RouterLink>
                    <ul>
                        <li class="Gender">
                        <span class="label">Gender: </span> <i :class="['uil', (staff.gender=='M'&& staff.gender!='F' && staff.gender!='O')?'uil-mars':'', (staff.gender=='F'&& staff.gender!='M' && staff.gender!='O')?'uil-venus':'']"> </i>
                        </li>

                        <li><span class="label">Department: </span> <span>{{ staff.department }}</span></li>
                        <li class="period"><span class="label">Period: </span> <span>{{ moment(staff.datefrom).format('DD MMMM YYYY') }}</span> <span v-if="staff.dateto != null">{{ `to ${moment(staff.dateto).format('DD MMMM YYYY')}` }}</span></li>
                    </ul>
                </div>
                 <div>
                    <div id="qrcode__container mt-5" ref="qrcode">
                             <el-tooltip content="Click me to download The staff QRCode" placement="top">
                                 <vue-qrious
                                    class="qr__code"
                                    @click="showModal=true, staf = staff"
                                     :value="`${baseurl}/customer/${tag}/establishment/${staff.establishment_tag}/staffs/${staff.tag}/feedback`"
                                    @change="onDataUrlChange"
                                    />
                             </el-tooltip>
                    </div>   
                </div>
            </div>
             <div class="pie__chart">
                            <div>
                                <h3 class="mb-2">Before (<span class="rating">{{calculateAverageRating(staffRatingDataset(staff.data, 'beforeData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staff.data, 'beforeData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">During (<span class="rating">{{calculateAverageRating(staffRatingDataset(staff.data, 'duringData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staff.data, 'duringData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">After (<span class="rating">{{calculateAverageRating(staffRatingDataset(staff.data, 'afterData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staff.data, 'afterData')" 
                                    :options="options" 
                                />
                            </div>
                        </div>
                         <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
                        </BaseLegend>
             <div class="list__actions">
                     <button class="btn mr-2 reviews" @click="showReview(tag, staff.tag, $route.params.id, staff)">
                        <i class="uil uil-comment-alt-lines"></i> Reviews
                    </button>
            </div>
    </div>
</div>
    <div v-if="staffs.length==0">No staff</div>
    <ModalComponent :showModal="showModal " @close="showModal=false" :width="modalWidth" >
                    <template #content>
                        <div class="modal__header">
                            <div class="modal__title">
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    <i class="uil uil-qrcode-scan"></i> 
                                </h3>
                            </div>
                            <div class="modal__close">
                                <i class="uil uil-times-circle"  @click="showModal = false"></i>
                            </div>
                        </div>

                        <div  v-if="downloaded==false" class="establishment__review__qrcode">
                            <p class="mb-5">
                                Download this QR code to link staff <b>{{ staf.firstname }}</b> to the feedback page
                            </p>
                            <div id="qrcode__container  mt-5" ref="qrcode">
                                <vue-qrious
                                    class="qr__code_view"
                                     :value="`${baseurl}/customer/${tag}/establishment/${staf.establishment_tag}/staffs/${staf.tag}/feedback`"
                                    @change="onDataUrlChange"
                                    />
                                
                            </div>
                        </div>
                        <div v-else class="establishment__review__qrcode">
                            <p class="mb-5">
                                Your download is successfully complete!
                            </p>
                        </div>
                        <div class="mt-5 download__qr_btn">
                            <button v-if="
                            downloaded==false" class="btn__light_secondary" @click="downloadQrcode(staf.firstname)">
                                <i class="uil uil-download-alt"></i> Download 
                            </button>
                            <button v-else class="btn__light_secondary" @click="close()">
                                close
                            </button>
                        </div>
                    </template>
    </ModalComponent>
    <ModalComponent :showModal="showChart" @close="showChart=false">
                    <template #content>
                        <div class="modal__header">
                            <div class="modal__title">
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    <i class="uil uil-chart-pie-alt"></i> Graphic Chart
                                </h3>
                            </div>
                            <div class="modal__close">
                                <i class="uil uil-times-circle"  @click="showChart = false"></i>
                            </div>
                        </div>

                       <div class="pie__chart">
                            <div>
                                <h3 class="mb-2">Before (<span class="rating">{{calculateAverageRating(staffRatingDataset(staffComparison, 'beforeData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staffComparison, 'beforeData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">During (<span class="rating">{{calculateAverageRating(staffRatingDataset(staffComparison, 'duringData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staffComparison, 'duringData')" 
                                    :options="options" 
                                />
                            </div>
                            <div>
                                <h3 class="mb-2">After (<span class="rating">{{calculateAverageRating(staffRatingDataset(staffComparison, 'afterData'))}}</span>)</h3>
                                <Pie 
                                    :data="staffRatingDataset(staffComparison, 'afterData')" 
                                    :options="options" 
                                />
                            </div>
                        </div>
                         <BaseLegend class="legend" :LegendData="legendData" :alignment="'horizontal'">
                        </BaseLegend>
                    </template>
    </ModalComponent>
</template>
<script setup>
import {ref, inject, computed, defineAsyncComponent} from 'vue';
import moment from 'moment';
import VueQrious from 'vue-qrious';
import { useWindowSize } from '@vueuse/core';
import { ElTooltip  } from 'element-plus';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs';
import {useRouter} from 'vue-router';
import services from '@Services/services.js';

const ModalComponent = defineAsyncComponent(()=>
    import('@Components/utils/ModalComponent.vue')
)

ChartJS.register(ArcElement, Tooltip)
const router = useRouter();
const staffs = inject('staffs');
const selectedStaff = inject('selectedStaff')
const baseurl = window.location.origin;
const base64Image = ref(null);
const qrcode = ref(null);
const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
}
const { width } = useWindowSize()
const showModal = ref(false);
const showChart = ref(false);
const downloaded = ref(false);
const tag = inject('tag')

const legendData = ref([
    {name: '1 star', color: '#FF0000'},
    {name: '2 stars', color: '#FFA500'},
    {name: '3 stars', color: '#FFFF00'},
    {name: '4 stars', color: '#00FF00'},
    {name: '5 stars', color: '#008000'},
])

const downloadQrcode = (staffname) => {
  const filename = `${staffname}-feedback-link`;
  services.downloadQrcode(filename, base64Image.value);
  downloaded.value = true;
}



const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 45;
})

const staffComparison = ref({})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
        legend: {
            display: false,
        }
  },
  aspectRatio: 1,
};

const close = ()=>{
    showModal.value = false; 
    downloaded.value = false;
}

const staffRatingDataset = (periods, type)=> {
      return {
        labels: periods.labels,
        datasets: [
          {
            backgroundColor: [
            '#FF0000',
            '#FFA500',
            '#FFFF00',
            '#00FF00',
            '#008000',
            ],
            data: periods[`${type}`], //beforeData, duringData, afterData
          },
        ],
      };
};

const calculateAverageRating = (data) =>  {
  const starRatings = [1, 2, 3, 4, 5];
  const ratingsData = data.datasets[0].data;

  // Calcul de la somme pondérée des évaluations
  let weightedSum = 0;
  for (let i = 0; i < starRatings.length; i++) {
    weightedSum += starRatings[i] * ratingsData[i];
  }

  // Calcul de la moyenne
  const totalRatings = ratingsData.reduce((total, count) => total + count, 0);
  const averageRating = weightedSum / totalRatings;
  if(isNaN(averageRating.toFixed(1))) return 0;
  return averageRating.toFixed(1);
};

const showReview = (customer_tag, staff_tag, establishment_tag, staff)=>{
    selectedStaff.value = staff;
    router.push(`/customer/${customer_tag}/establishment/${establishment_tag}/staffs/list/${staff_tag}/reviews`);
};
</script>
<style scoped>

a{
    text-decoration: none;
}
.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 15px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap:1rem;
    flex-direction: column;
    margin-bottom: 10px;
}

span.rating{
    color: var(--color-danger);
    font-weight: 600;
}

.staff__card h5{
    color: var(--color-primary);
}

.uil-mars{
    color: blue;
}

.uil-venus{
    color: pink;
}

span{
    font-size: 14px;
    color: var(--color-bg2);
}
span.label{
    color: var(--color-bg1);
    font-size: 14px;
}

.qr__code{
    width: 100% !important;
    padding: 10px auto !important;
    cursor: pointer;
}

.qr__code_view{
    width: 30% !important;
    padding: 10px auto !important;
    margin: auto;
}
.modal__header{
    display: flex;
    justify-content: space-between;
}

.modal__header div{
    align-self: center;
}

.modal__close i{
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.establishment__review__qrcode p{
    font-size: 14px;
}

.modal__close i:hover{
    transform: rotate(360deg);
}

.download__qr_btn{
    display: flex;
    justify-content: center;
}

.download__qr_btn button{
    flex-basis: 50%;
}

.pie__chart{
    display: flex;
    gap: 1rem;
    justify-content: center;
    height: 150px;
}

.pie__chart div{
    width: 30% !important;
    height: 100px !important;
}

.pie__chart h3{
    text-align: center;
    font-weight: 500;
    color: var(--color-bg1);
    font-size: 14px;
}

.staff__qrcode{
    display: flex;
    justify-content: space-between;
}

.list__actions{
    display: flex;
    justify-content: flex-end;
}

.list__actions button{
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
}

.list__actions button.chart{
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.list__actions button.reviews{
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.list__actions button.chart:hover{
    color: white;
    background-color: var(--color-primary);
}

.list__actions button.reviews:hover{
   color: white;
   background-color: var(--color-danger);
}

.list__actions button:hover{
    transform: scale(0.95);
}


@media (max-width: 768px) {
        .pie__chart {
           
            display: flex;
            flex-wrap: wrap; /* Permet aux éléments de passer à la ligne lorsque la largeur est insuffisante */
            justify-content: center;
            gap: 10px; /* Ajoutez un espacement entre les graphiques */
        }

        .pie__chart div {
            width: calc(33.33% - 10px); /* Calculez la largeur des graphiques avec un espace entre eux */
            height: 150px !important;

        }

        .pie__chart h3 {
            text-align: center; 
            margin-bottom: 5px; 
            
        }
        
    }
</style>