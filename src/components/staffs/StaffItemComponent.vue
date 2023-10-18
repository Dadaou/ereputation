<template>
    <div class="staff__list">
        <div class="staff__card" v-if="staffs.length>0" v-for="staff in staffs">
            <div class="staff__qrcode">    
                <div>
                    <h5>{{ staff.firstname }} <span v-if="staff.lastname != null">{{ staff.lastname }}</span></h5>
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
                                     :value="`${baseurl}/establishment/${staff.establishment_competitor_tag}/staffs/${staff.tag}/feedback`"
                                    @change="onDataUrlChange"
                                    />
                             </el-tooltip>
                    </div>   
                </div>
            </div>
            <div class="pie__chart">
                <div>
                    <h3 class="mb-2">Before (<span class="rating">{{calculateAverageRating(staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['before']))}}</span>)</h3>
                    <Pie 
                        :data="staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['before'])" 
                        :options="options" 
                    />
                </div>
                <div>
                    <h3 class="mb-2">During the staff period  (<span class="rating">{{calculateAverageRating(staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['between']))}}</span>)</h3>
                    <Pie 
                        :data="staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['between'])" 
                        :options="options" 
                    />
                </div>
                <div>
                    <h3 class="mb-2">After  (<span class="rating">{{calculateAverageRating(staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['after']))}}</span>)</h3>
                    <Pie 
                        :data="staffRatingDataset(companiesStore.calculateStaffRatingV2(establishment, staff)['after'])" 
                        :options="options" 
                    />
                </div>
            </div>
    </div>
</div>
    <div v-if="staffs.length==0">No staff</div>
    <ModalComponent :showModal="showModal " @close="showModal=false" :width="modalWidth" >
                    <template #content>
                        <div class="modal__header">
                            <div class="modal__title">
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    <i class="uil uil-qrcode-scan"></i> QR Code
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
                                     :value="`${baseurl}/establishment/${staf.establishment_competitor_tag}/staffs/${staf.tag}/feedback`"
                                    @change="onDataUrlChange"
                                    />
                                }
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
</template>
<script setup>
import {ref, inject, computed, defineAsyncComponent} from 'vue';
import moment from 'moment';
import VueQrious from 'vue-qrious';
import * as htmlToImage from 'html-to-image';
import { useWindowSize } from '@vueuse/core';
import { ElTooltip  } from 'element-plus';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs';
import { useCompanyStore } from "@Stores/company.js";

const ModalComponent = defineAsyncComponent(()=>
    import('@Components/utils/ModalComponent.vue')
)

ChartJS.register(ArcElement, Tooltip)
const staffs = inject('staffs');
const baseurl = window.location.origin;
const base64Image = ref(null);
const qrcode = ref(null);
const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
}
const { width, height } = useWindowSize()
const showModal = ref(false);
const downloaded = ref(false);
const companiesStore = useCompanyStore();
const establishment = inject('establishment')

const downloadQrcode = (staffname)=>{
    let link = document.createElement('a');
    link.download = `${staffname}-feedback-link.jpeg`;
    link.href = base64Image.value;
    link.click();
    downloaded.value = true;
}

const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 35;
})

const props = defineProps({
    staf: {
        type: Object,
    }, 
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
        legend: {
            display: false,
        }
  },
};

const close = ()=>{
    showModal.value = false; 
    downloaded.value = false; 
    staf=null;
}

const staffRatingDataset = (eventRating)=> {
      return {
        labels: [
          "0 star",
          "1 star",
          "2 stars",
          "3 stars",
          "4 stars",
          "5 stars",
        ],
        datasets: [
          {
            backgroundColor: [
            '#6c63ff',
            // '#00bf8e',
            // '#fd1f1f',
            // '#2e3267',
            // '#424890',
            // '#aca8fd',
             '#FF0000',
            '#FFA500',
            '#FFFF00',
            '#00FF00',
            '#008000',
            ],
            data: [
              eventRating["0"],
              eventRating["1"],
              eventRating["2"],
              eventRating["3"],
              eventRating["4"],
              eventRating["5"],
            ],
          },
        ],
      };
};

const calculateAverageRating = (data) =>  {
  const starRatings = [0, 1, 2, 3, 4, 5];
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
</script>
<style scoped>

.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap:1rem;
    flex-direction: column;
    height: 275px;
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
</style>