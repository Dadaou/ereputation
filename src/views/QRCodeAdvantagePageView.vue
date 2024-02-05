<template>
<div class="main__container" v-if="exist">
        <div class="container mx-auto advantage__qrc_content">
            <div class="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
                <h3 class="text-xl font-semibold mb-4">🎉 Exclusive Offer Just for You! 🎁</h3>
                <vue-qrious
                    class="qr__code mx-auto"
                    :value="`${baseurl}/establishment/${route.params.etab}/discount/validation/${route.params.discountTag}`"
                    @change="onDataUrlChange"
                />
                <h3 class="text-xl font-semibold mb-4" v-if="advantages">{{ advantages.adv_name }} <br>{{ advantages.establishment_name }}</h3>

                <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
                    <span id="cpnCode" class="border-dashed border text-white px-4 py-2 rounded-l">{{code}}</span>
                    <button id="cpnBtn1" :class="[isCopied?'btn-copy2':'btn-copy']" @click="copyCode(code)" v-if="isSupported">{{isCopied?'Copied':'Copy'}} <i class="uil uil-copy"></i></button>
                    <button id="cpnBtn2" class="btn-copy" @click="downloadQrcode">Download <i class="uil uil-qrcode-scan"></i></button>
                </div>

                <p class="text-sm" v-if="advantages">Valid Till: {{ moment(advantages.expired_at).format("DDMMM, YYYY") }}</p>

                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
            </div>
        </div>
</div>
<EstablishmentNotFound v-else/>
</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import VueQrious from 'vue-qrious';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import services from '@Services/services.js';
import { useClipboard } from '@vueuse/core'
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import 'element-plus/es/components/date-picker/style/css';


const code = ref('')
const { text, copy, copied, isSupported } = useClipboard()
let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const page=ref({
	title1: "",
    title2: "Discount QR Code",
    icon: "uil-qrcode-scan",
});

const route = useRoute();
const baseurl = window.location.origin
const base64Image = ref(null)
const qrcode = ref(null)
const isCopied = ref(false)
watch(isCopied, ()=>{
    if(isCopied.value == true){
        setTimeout(() => {
              isCopied.value = false;
        }, 3000);
    }
})

const advantages = ref(null)

const userStore = useUserStore();

const copyCode = (code)=>{
    isCopied.value = true
    copy(code)
}

const downloadQrcode = ()=>{
    let link = document.createElement('a');
    link.download = `${advantages.value.adv_name}-${advantages.value.contact_firstname}-discount-link.jpeg`;
    link.href = base64Image.value;
    link.click();
    downloaded.value = true;
}

const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
};

onBeforeMount(async () => {
    if (userStore.authenticated == null) services.setToken(import.meta.env.VITE_APP_TOKEN);
   
  
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantagecontacts/list?tag=${route.params.discountTag}`, (response) => {
                resolve(response);
            });
        });
        console.log(response)
        if (response.status === 200) {
            advantages.value = response.data[0];
            code.value = advantages.value.code;
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>

<style scoped>

.bg-gradient-to-br {
  background: linear-gradient(45deg, #f75842, #f96a57); 
}

.btn-copy,
.btn-download, .btn-copy2 {
    border: 1px solid #fff;
    background-color: #fff;
    color: #6B46C1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.btn-copy2, .btn-copy:hover,
.btn-download:hover {
    background-color: #6B46C1;
    color: #fff;
    border-color: #6B46C1;
}

.btn-download {
    margin-top: 8px;
}

.advantage__qrc_content {
    padding: 20px;
    border-radius: 10px;
    margin-top: 2rem;
}

.qrcode {
    padding: 10px;
   /* border: 1px solid #ddd;*/
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}

.qr__code {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}
</style>