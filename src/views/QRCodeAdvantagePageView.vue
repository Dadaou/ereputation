<template>
    <div class="main__container qrcontainer" v-if="exist">
        <div class="container mx-auto advantage__qrc_content" v-if="isNotExpired">
            <div
                class="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
                <h3 class="text-xl font-semibold mb-4">🎉 {{ $t("coupon.title") }} 🎁</h3>
                <div id="qrcode__container" ref="qrcode">
                    <vue-qrious class="qr__code mx-auto"
                        :value="`${baseurl}/public/customer/${route.params.tag}/discount/validation/${route.params.discountTag}`"
                        @change="onDataUrlChange" size="5000" />
                </div>
                  
                
                
                <span id="cpnCode" class="border-dashed border text-white px-4 py-2 rounded-l">{{ code }}</span>
                <br>
                <h3 class="text-xl font-semibold mb-4 mt-4" v-if="advantages">{{ advantages.adv_name }} <br>{{
                    advantages.establishment_name }}</h3>
                <div v-if="advantages">
                    <div v-if="advantages.adv_date_to != null && advantages.adv_date_from != null">
                        <h3 class="text-xl font-semibold mb-4 mt-4"
                            v-if="advantages.adv_date_to && advantages.adv_date_from">
                            {{ $t("coupon.utilisation") }} {{ advantages.adv_date_from }} {{ $t("coupon.et") }} {{
                                advantages.adv_date_to }}
                        </h3>
                    </div>
                </div>
                <h7 class="text-xl read-more " @click.stop="showMore(index)"> {{ $t("feedback.read_more") }}  </h7>

                <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
                    <button id="cpnBtn1" :class="[isCopied ? 'btn-copy2' : 'btn-copy']" @click="copyCode(code)"
                        v-if="isSupported">{{ isCopied ? 'Copied' : 'Copy' }} <i class="uil uil-copy"></i></button>
                    <button id="cpnBtn2" class="btn-copy" @click="downloadQrcode">Download <i
                            class="uil uil-qrcode-scan"></i></button>
                </div>
                <p class="text-sm" v-if="advantages">Valid Till: {{ moment(advantages.expired_at).format("DDMMM, YYYY")
                    }}</p>
                

                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6">
                </div>
                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6">
                </div>
                <transition name="modal-flip">
                    <div v-if="showModal" class="modal">
                        <div class="modal-content" style="width: 350px; padding: 1rem;">
                            <div class="modal-header" style="color: black !important ">
                                <h2><strong>{{ $t("feedback.description") }}</strong></h2>
                                <div class="modal__close">
                                    <i class="uil uil-times-circle mb-8" @click="showModal = false"></i>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div class="inline-flex items-baseline gap-2" style="max-width: calc(100% - 20px)">
                                    <h4 style="color: black !important"> {{ adv_description }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <QRCodeAdvantagePageViewExpired v-else />
    </div>

</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import VueQrious from 'vue-qrious';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';
import { useClipboard } from '@vueuse/core'
import 'element-plus/es/components/date-picker/style/css';


const code = ref('')
const { text, copy, copied, isSupported } = useClipboard()
let exist = ref(true);
const QRCodeAdvantagePageViewExpired = defineAsyncComponent(() =>
    import("@Views/QRCodeAdvantagePageViewExpired.vue")
)

const page = ref({
    title1: "",
    title2: "Discount QR Code",
    icon: "uil-qrcode-scan",
});

const route = useRoute();
const router = useRouter();
const baseurl = window.location.origin
const base64Image = ref(null)
const qrcode = ref(null)
const isCopied = ref(false)
const appStore = useAppStore();
const dateJour = moment().format('YYYY-MM-DD HH:mm:ss');
const dateExperied = ref(null);
const isNotExpired = ref(true);
const date_to = ref(null);
const adv_description = ref('')

const listAdvantage = ref([]);

const showModal = ref(false);

const showMore = () => {
  showModal.value = true;
}

watch(isCopied, () => {
    if (isCopied.value == true) {
        setTimeout(() => {
            isCopied.value = false;
        }, 3000);
    }
})

const advantages = ref(null)

const userStore = useUserStore();

const copyCode = (code) => {
    isCopied.value = true
    copy(code)
}

const downloadQrcode = () => {
    const filename = `${advantages.value.adv_name}-${advantages.value.contact_firstname}-discount-link`;;
    services.downloadQrcode(filename, base64Image.value);
}

const onDataUrlChange = (dataUrl) => {
    base64Image.value = dataUrl;
};

onBeforeMount(async () => {
    appStore.header = false;
    appStore.setCurrentPage({
        title1: "",
        title2: "Advantages",
        icon: "uil-comment-alt"
    });

    const response = await new Promise((resolve) => {
        services.get_Record(`public/customer/establishments/advantagecontacts/list`, (response) => {
            resolve(response);
        }, true);
    });
    response.data.forEach(obj => {
        listAdvantage.value.push(obj.tag);
    });

    // if (!listAdvantage.value.includes(route.params.discountTag)) {
    //     router.push({ name: 'NotFound' })
    // }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`public/customer/establishments/advantagecontacts/list?tag=${route.params.discountTag}`, (response) => {
                resolve(response);
            }, true);
        });
        
        if (response.status === 200) {
            advantages.value = response.data[0];
            code.value = advantages.value.code;
            dateExperied.value = advantages.value.expired_at;
            date_to.value = advantages.value.adv_date_to;
            adv_description.value = advantages.value.adv_description;
            localStorage.setItem('nameAdvantage', advantages.value.adv_name);

            if (dateJour != null || date_to.value != null) {
                if (dateJour > dateExperied.value || dateJour > date_to.value) {
                    isNotExpired.value = false;
                }
            }

        } else {
            console.error('Error fetching advantages: 1', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>

<style scoped>
.read-more:hover {
  text-decoration: underline;
  cursor: pointer;
}
.modal__close i {
  position: absolute;
  top: 0;
  right: 8px;
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.modal__close i:hover {
  transform: rotate(360deg);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.modal-content {
  background-color: #fff;
  margin: 6rem auto;
  padding: 25px;
  border-radius: 16px 16px 5px 5px;
  /*overflow: auto; */
  max-width: 90%;
  min-width: 300px;
  position: relative;
}

.modal-body {
  padding: 1rem;
}
.read-more {
  font-size: 9px;
  font-weight: 400;
}
.qrcontainer{
    margin-top: 8rem; 
}

.head__container {
    background-color: transparent !important;
}

.bg-gradient-to-br {
    background: linear-gradient(45deg, #f75842, #f96a57);
}

.btn-copy,
.btn-download,
.btn-copy2 {
    border: 1px solid #fff;
    background-color: #fff;
    color: #6B46C1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.btn-copy2,
.btn-copy:hover,
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

img {
    height: 50px;
    object-fit: cover;
    width: 100%;
}

#qrcode__container {
    padding: 5px;
}

img.qr__code {
    width: 200px;
    height: 200px;
    border: 1px solid #ddd;
    padding: 25px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}
</style>