<template>
    <div class="staff__list">
        <div class="staff__card" v-if="staffs.length>0" v-for="staff in staffs">
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
                    
                        <vue-qrious
                                class="qr__code"
                        :value="`${baseurl}/companies/${$route.params.id}/staffs/${staff.id}/feedback`"
                        @change="onDataUrlChange"
                        />
                        <button class="btn__light_secondary" @click="showModal=true, staf = staff">QR Code <i class="uil uil-qrcode-scan"></i></button>
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
                                    :value="`${baseurl}/companies/${$route.params.id}/staffs/${staf.id}/feedback`"
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
                            <button v-else class="btn__light_secondary" @click="showModal=false, downloaded=false, staf=null">
                                close
                            </button>
                        </div>

                    </template>
    </ModalComponent>
</template>
<script setup>
import {ref, inject, computed} from 'vue';
import moment from 'moment';
const staffs = inject('staffs');
import VueQrious from 'vue-qrious';
import * as htmlToImage from 'html-to-image';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import { useWindowSize } from '@vueuse/core';

const baseurl = window.location.origin;
const base64Image = ref(null);
const qrcode = ref(null);
const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
}
const { width, height } = useWindowSize()
const showModal = ref(false);
const downloaded = ref(false);

const downloadQrcode = (staffname)=>{
    // htmlToImage.toJpeg(qrcode.value, { quality: 0.95 })
    // .then(function (dataUrl) {
    //     var link = document.createElement('a');
    //     link.download = `${establishment.value.name}-feedback-link.jpeg`;
    //     link.href = dataUrl;
    //     link.click();
    //     downloaded.value = true;
    // });
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
})
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.staff__list{
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    width: 70%;
    margin: auto;
}

.staff__card{
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
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
}
.qr__code_view{
    width: 50% !important;
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
</style>