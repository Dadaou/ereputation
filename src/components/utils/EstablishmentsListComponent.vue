<template>
	<div class="list__item" v-for="company in establishments">
        <div class="society__info__container">
            <swiper 
            	v-if="company.url_source !== null"
            	@click="goToCompany(company)" 
            	class="society__logo" 
            	:modules="[Virtual]"  
            	:slides-per-view="1" 
            	:space-between="10" 
            	:virtual="true">
                <swiper-slide v-show="mediaStore.isImageFile(image)" v-for="image in [...company.url_source]">
                        <img :src="company.url_source">
                </swiper-slide>
            </swiper>
            <swiper 
            	v-else
            	@click="goToCompany(company)" 
            	class="society__logo" 
            	:modules="[Virtual]"   
            	:slides-per-view="1" 
            	:space-between="10" 
            	:virtual="true">
                <swiper-slide>
                    <div role="status" class="society__logo bg-gray-300 rounded-sm">
                        <svg class="text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                    </div>
                </swiper-slide>
            </swiper>
            <div class="list__main__content">
                <div class="list__main__info">
                    <div class="society__item">
                        <div class="society__main__info">
                            <div class="item__head">
                                <div class="society__info">
                                    <a 
                                    	class="establishment__link" 
                                    	@click="goToCompany(company)"
                                    >
                                    <label class="society__name">{{ company.name }}</label>
                                	</a>
                                    <div class="society__category">
                                        <i 
                                        	:class="['uil', company.category=='Restaurant'?'uil-restaurant':'', company.category=='Hotel'?'uil-bed-double':'', company.category=='Residence'?'uil-home':'']">	
                                        </i>
                                        <span>{{ company.category }}</span>
                                    </div>
                                    <div class="society__location" v-if="company.address1 != null && company.city !=null">
                                            <i class="uil uil-location-point"></i>
                                            <span>{{ company.address1 }}, {{ company.city }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RatingComponent 
                    	class="rating__content" 
                    	:reviews="company.totalReviews" 
                    	:rating="Number(company.rating).toFixed(1)"
                    />
                </div>
                <div class="list__actions">
                    <button class="btn mr-2" @click="showModal=true, establishment=company">QR Code <i class="uil uil-qrcode-scan"></i></button>
                    <button class="btn" @click="goToCompany(company)">More details</button>
                </div>
            </div>
        </div>
    </div>
    <ModalComponent 
    	:showModal="showModal" 
    	@close="showModal=false" 
    	:width="modalWidth"
    >
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
                    Download this QR code to link your client to the feedback page
                </p>
                <div id="qrcode__container mt-5" ref="qrcode">
                    <vue-qrious
                        class="qr__code"
                        :value="`${baseurl}/customer/${tag}/establishment/${establishment.competitor_tag}/feedback`"
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
                <button 
                	v-if="downloaded==false" 
                	class="btn__light_secondary" 
                	@click="downloadQrcode"
                >
                    <i class="uil uil-download-alt"></i> Download
                </button>
                <button 
                	v-else 
                	class="btn__light_secondary" 
                	@click="showModal=false, downloaded=false">
                    close
                </button>
            </div>

        </template>
    </ModalComponent>
</template>
<script setup>
import { ref, defineAsyncComponent, computed, inject } from 'vue';
import RatingComponent from '@Components/utils/RatingComponent.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import VueQrious from 'vue-qrious';
import { useWindowSize } from '@vueuse/core';
import * as htmlToImage from 'html-to-image';
import { useMediaStore } from "@Stores/media.js";
import { useAppStore } from "@Stores/app.js";
import { useRouter } from "vue-router";
import 'swiper/css';
import { useUserStore } from "@Stores/user.js";

const ModalComponent = defineAsyncComponent(()=>
	import('@Components/utils/ModalComponent.vue')
)

const router = useRouter();
const mediaStore = useMediaStore();
const appStore = useAppStore();
const props = defineProps({
	establishments: {
		type: Array,
		required: true
	}
}); 

const userStore = useUserStore();
const tag = inject('tag')

const establishment = ref(null);
const showModal = ref(false);
const downloaded = ref(false);
const { width, height } = useWindowSize();
const baseurl = window.location.origin;
const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 35;
});

const goToCompany = (establishment) => {
    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Establishment', 
            params: {
                id: establishment.competitor_tag,
                tag: userStore.user.customer.tag
            },
        });
    }, 100); 
}

const base64Image = ref(null);
const qrcode = ref(null);
const downloadQrcode = ()=>{
    let link = document.createElement('a');
    link.download = `${establishment.value.name}-feedback-link.jpeg`;
    link.href = base64Image.value;
    link.click();
    downloaded.value = true;
}

const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
};


	
</script>
<style scoped>
.list__item{
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
    border: 2px solid var(--light-color-bg1);
    transition: var(--transition);
}

.society__info__container{
    display: flex;
    gap: 1rem;
    font-size: 15px;
    color: var(--color-bg2);
    justify-content: space-between;
    flex-direction: row;
    transition: var(--transition);
}

.society__logo{
   width: 200px;
   height: 95px;
   z-index: 0;
   transform: var(--transition);
}

.society__logo img{
     object-fit: cover;
 /* height: 100%;
  width: 100%;
  object-fit: cover;*/
}

.society__logo svg{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.list__main__content{
    width: 600px;
    transition: var(--transition);
}

.list__main__info{
    display: flex;
    justify-content: space-between;
}

.society__item {
    display: flex;
    gap: 2rem;
}

.society__main__info{
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.society__item div{
    font-size: 13px;
    font-weight: 500;
}

.society__item i{
    color: var(--color-danger);
    margin-right: 5px;
}

.item__head{
    display: flex;
    justify-content: space-between;
}

.society__item label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.rating__content{
    align-self: center;
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
    transition: var(--transition);
}

.list__actions button:hover{
    background-color: var(--color-primary);
}

/*************
	Modal CSS
**************/
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
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn{
    display: flex;
    justify-content: center;
}

.download__qr_btn button{
    flex-basis: 50%;
}

.qr__code{
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}
.modal__close i:hover{
    transform: rotate(360deg);
}

@media screen and (max-width:779px) {
    .society__item label{
        font-size: 13px;
    }

    .society__item div{
        font-size: 12px;
    }
}

@media screen and (max-width:600px) {
    .society__info__container{
        flex-direction: column;
    }

    .list__main__content{
        width: inherit;
    }

    .society__logo{
        width: 100%;
        height: 150px;
    }

    .list__actions button{
        flex-grow: 1;
        margin: 10px 0px 0px 0px;
        padding: 5px 0px;
        background-color: var(--color-primary);
        color: white;
    }

    .society__location{
        display: flex;
    }
    .society__location span{
        display: block;
        flex-basis: 225px;
        line-height: 1.2;
    }

    .society__item label{
        font-size: 14px;
    }
}	
</style>