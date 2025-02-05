<template>
    <div class="main__container qrcontainer" v-if="exist">
        <div class="container mx-auto advantage__qrc_content" v-if="!isExpired">
            <div
                class="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
                <h3 class="text-xl font-semibold mb-4 text-center"> {{ $t("coupon.title") }} </h3>
                <div id="qrcode__container" ref="qrcode">
                    <vue-qrious class="qr__code mx-auto"
                        :value="`${baseurl}/public/customer/${route.params.tag}/discount/auth/${route.params.discountTag}`"
                        @change="onDataUrlChange" size="5000" />
                </div>

                <div class="text-center">
                    <span id="cpnCode" class="border-dashed border text-white px-4 py-2 rounded-l">{{ code }}</span>
                </div>
                <h3 class="text-xl font-semibold mb-4 mt-4 text-center" v-if="advantages">{{ advantages.adv_name }}
                    <br>{{
                        advantages.establishment_name }}
                </h3>
                <div v-if="advantages" class="text-center">
                    <div v-if="advantages.created_at != null && advantages.expired_at != null">
                        <h3 class="text-xl font-semibold mb-4 mt-4">
                            {{ $t("coupon.utilisation") }} {{ moment(advantages.created_at).format('YYYY-MM-DD') }} {{
                                $t("coupon.et") }} {{
                                moment(advantages.expired_at).format('YYYY-MM-DD') }}
                        </h3>
                    </div>
                </div>
                <div class="text-xl read-more text-center" @click.stop="showMore(index)"> {{ $t("feedback.read_more") }}
                </div>

                <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
                    <button id="cpnBtn1" :class="[isCopied ? 'btn-copy2' : 'btn-copy']" @click="copyCode(code)"
                        v-if="isSupported">{{ isCopied ? 'Copied' : 'Copy' }} <i class="uil uil-copy"></i></button>
                    <button id="cpnBtn2" class="btn-copy" @click="downloadQrcode">Download <i
                            class="uil uil-qrcode-scan"></i></button>
                </div>
                <p class="text-sm text-center" v-if="advantages">Valid till: {{
                    moment(advantages.expired_at).format("DDMMM, YYYY")
                    }}</p>


                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6">
                </div>
                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6">
                </div>
                <transition name="modal-flip">
                    <div v-if="showModal" class="modal">
                        <div class="modal-content" style="width: 350px;">
                            <div v-if="adv_logo" class="modal-header__img">
                                <img :src="adv_logo">
                            </div>
                            <div class="modal-header" style="color: black !important ">
                                <div class="modal__close">
                                    <i class="uil uil-times-circle mb-8" @click="showModal = false"></i>
                                </div>
                            </div>

                            <div class="inline-flex items-baseline gap-2 modal-content-name"
                                style="max-width: calc(100% - 20px)">
                                <h4 class="modal-discount-name"><strong>{{ advantages.adv_name }}</strong>
                                </h4>
                                <span class="modal-discount-category">{{ adv_category }}</span>
                            </div>
                            <h6 class="modal-discount-establishment">
                                {{ advantages.establishment_name }}
                            </h6>
                            <div class="inline-flex items-center gap-2 w-full mt-4">
                                <div class="flex flex-col items-center w-full">
                                    <div v-if="value" class="modal-discount-offer">
                                        <div>{{ value }}<span>{{ adv_metric }}</span>
                                        </div>
                                    </div>
                                    <ul class="modal-discount-other text-center">
                                        <li v-if="from && from !== 'Invalid date'">From {{
                                            from }}</li>
                                        <li v-if="to && to !== 'Invalid date'">To {{ to }}
                                        </li>
                                        <li v-if="expired_at && expired_at !== 'Invalid date'">
                                            Expired at {{ moment(expired_at).format("DD-MM-YYYY") }} </li>
                                        <li v-if="adv_validity && adv_validity !== 'Invalid date'">Valid within
                                            {{ adv_validity }} days</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div class="modal-discount-description"
                                    v-if="adv_description && adv_description !== 'null'" v-html="adv_description">
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
import { ref, onBeforeMount, watch } from 'vue';
import VueQrious from 'vue-qrious';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';
import { useClipboard } from '@vueuse/core'
import 'element-plus/es/components/date-picker/style/css';
import QRCodeAdvantagePageViewExpired from '@Views/QRCodeAdvantagePageViewExpired.vue';


const code = ref('')
const { text, copy, copied, isSupported } = useClipboard()
let exist = ref(true);

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
const isExpired = ref(false);
const adv_description = ref('')
const adv_date_from = ref('');
const adv_date_to = ref('');
const adv_validity = ref('');
const adv_category = ref('');
const showModal = ref(false);
const adv_logo = ref('');
const adv_metric = ref('');
const adv_amount = ref('');
const adv_advantage_limit = ref('');
const from = ref(null);
const to = ref(null);
const expired_at = ref(null);
const value = ref(null);

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
            adv_description.value = advantages.value.adv_description;
            adv_date_from.value = advantages.value.adv_date_from;
            adv_date_to.value = advantages.value.adv_date_to;
            adv_validity.value = advantages.value.adv_validity;
            adv_category.value = advantages.value.adv_category;
            adv_logo.value = advantages.value.adv_logo;
            adv_metric.value = advantages.value.adv_metric;
            adv_amount.value = advantages.value.adv_amount;
            adv_advantage_limit.value = advantages.value.adv_advantage_limit;

            switch (advantages.value.adv_category) {
                case 'Gift':
                    from.value = null;
                    to.value = null;
                    adv_category.value = 'Gift';
                    expired_at.value = dateExperied.value;
                    value.value = null;
                    adv_metric.value = null;
                    break;

                case 'Lottery':
                    from.value = adv_date_from.value;
                    to.value = adv_date_to.value;
                    adv_category.value = 'Lottery';
                    expired_at.value = dateExperied.value;
                    value.value = adv_advantage_limit.value;
                    adv_metric.value = null;
                    break;

                case 'Discount':
                    from.value = null;
                    to.value = null;
                    adv_category.value = 'Discount';
                    expired_at.value = dateExperied.value;
                    value.value = adv_amount.value;
                    adv_metric.value = adv_metric.value === 'percent' ? '%' : '$';
                    break;

                case 'Free':
                    from.value = null;
                    to.value = null;
                    adv_category.value = 'Free';
                    expired_at.value = dateExperied.value;
                    value.value = 'F';
                    adv_metric.value = 'ree';
                    adv_validity.value = null
                    break;

                default:
                    console.error('Unknown category:', advantages.value.adv_category);
                    break;
            }


            localStorage.setItem('nameAdvantage', advantages.value.adv_name);

            if (dateJour != null) {
                if (dateJour > dateExperied.value) {
                    isExpired.value = true;
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
    /* padding: 25px; */
    border-radius: 16px 16px 5px 5px;
    /*overflow: auto; */
    max-width: 90%;
    min-width: 300px;
    position: relative;
    padding-bottom: 2px;
}

.modal-body {
    padding: 1rem;
}

.modal-content-name {
    width: 100%;
    padding: 16px 0px 0px 16px;
}

.modal-discount-description {
    padding: 7px 7px 2px !important;
    margin: 0px 15px 15px 15px;
    font-size: .7rem;
    color: #000;
    font-weight: 500;
    max-height: 200px;
    min-height: 100px;
    overflow-y: auto;
    border: 0 1px solid var(--color-primary);
    padding: 8px;
    border-radius: 12px;
    box-shadow: 1px -1px 4px color-mix(in srgb, var(--color-primary) 50%, white 50%) inset;
    background: color-mix(in srgb, var(--color-primary) 8%, white);
    padding-left: 2px;
}

.modal-discount-category {
    text-transform: uppercase;
    font-size: .65rem;
    padding: 4px 8px;
    border-radius: 16px;
    background: var(--color-primary);
    height: 22px;
    color: white;
    font-weight: 600;
}

.modal-discount-offer {
    text-transform: uppercase;
    color: white;
    font-size: 2.8rem;
    padding: 16px;
    border-radius: 100%;
    max-width: 150px;
    aspect-ratio: 1/1;
    background: #D3B302;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-family: 'Courier New', Courier, monospace;
}

.modal-discount-name {
    text-transform: uppercase;
    font-size: .9rem;
    color: #000;
}

.modal-discount-establishment {
    font-size: .7rem;
    color: #707067;
    font-weight: 500;
    text-align: left;
    margin-left: 16px;
}

ul.modal-discount-other {
    margin: 10px 0px;
    padding: 0;
    display: block;
    white-space: nowrap;
    color: #000;
}

.modal-discount-other li {
    font-size: .7rem;
    font-weight: 600;
}

.modal-discount-other li:before {
    content: "\1F449";
}

.modal-header__img {
    width: 100%;

}

.modal-header__img img {
    border-radius: 16px 16px 0 0;
    max-height: 240px;
    height: 100%;
}

.read-more {
    font-size: 9px;
    font-weight: 400;
}

.qrcontainer {
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