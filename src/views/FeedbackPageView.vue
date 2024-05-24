<template>
    <div v-if="exist">
        <div class="feedback__form">
            <div class="tablet_mobile__head">
                <div class="establishment__info">
                    <h1 class="society__name">{{ establishment.name }}</h1>
                    <div class="society__category">
                        <i
                            :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                        <span class="ml-2">{{ establishment.category }}</span>
                    </div>
                    <div class="society__country" v-if="establishment.country != null">
                        <i class="uil uil-map"></i>
                        <span class="ml-2">{{ establishment.country }}</span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-location-point"></i>
                        <span class="ml-2">{{ establishment.city }}</span>
                    </div>
                </div>
                <div class="photo">
                    <div v-if="establishment.url_source !== null" class="establishment__img">
                        <img :src="establishment.url_source" alt="" />
                    </div>
                    <div v-else role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="feedback">
                <h3>{{ $t("feedback.soustitle") }}</h3>
                <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                    <div class="mb-6 feedback__rating">
                        <label>{{ $t("feedback.rating.title") }} <span>*</span></label>
                        <RatingFeedbackComponent @updateValue="(rating) => {
                            ratingCustomer = rating
                        }" />
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                                    $t("feedback.firstname") }} <span>*</span></label>
                            <input type="text" id="first_name" v-model="firstname"
                                oninvalid="this.setCustomValidity(getText())" oninput="this.setCustomValidity('')"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="last_name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                                    $t("feedback.lastname") }}</label>
                            <input type="text" id="last_name" v-model="lastname"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                        <!-- <div>
                            <label for="countries"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                                    $t("feedback.gender") }} </label>
                            <el-select v-model="gender" :placeholder="$t('feedback.placeholder_gender')" size="large">
                                <el-option v-for="item in genders" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div> -->
                        <div>

                            <label for="last_name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                                    $t("feedback.datevisit") }}<!-- <span>*</span> --></label>
                            <el-date-picker v-model="dateVisit" :placeholder="$t('feedback.placeholder_datevisit')"
                                :size="'large'" :disabled-date="disabledDate" type="datetime" :default-time="new Date()"
                                format="YYYY-MM-DD HH:mm" />
                        </div>

                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2 email">
                        <div class="author__email">
                            <!--  <span v-if="randomAdvantage">
                                <i class="uil uil-info-circle"></i>{{ $t("feedback.indice1") }}
                            </span> -->
                            <!--  <p v-if="randomAdvantage">
                                <b>{{ $t("feedback.promotion_day") }} </b> 
                            </p> choose_advantage-->
                           
                            <DiscountCheckList :establishment="route.params.id" :customer="route.params.tag"
                                @select="(value) => randomAdvantage = value" />
                            <span v-if="randomAdvantage">
                                <i class="uil uil-info-circle"></i>{{ $t("feedback.indice1") }}
                            </span>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {{ $t("feedback.email") }}
                            </label>
                            <input type="email" v-model="email" id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                        </div>
                    </div>
                    <div
                        class="feedback__text w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label for="comment" class="text-sm comment__label">{{ $t("feedback.comment") }} </label>
                            <textarea id="comment" v-model="comment" rows="4"
                                class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"></textarea>
                        </div>
                        <div>
                            <div class="checkbox-container">
                                <label>
                                    <input type="checkbox" id="agreeCheckbox"
                                        oninvalid="this.setCustomValidity(getText())"
                                        oninput="this.setCustomValidity('')" required>
                                </label>
                                {{ $t("feedback.indice2") }} <span @click="iframeVisible = !iframeVisible">{{
                                    $t("feedback.indice3") }}</span>
                                <div v-if="iframeVisible && appStore.account && appStore.account.cgu"
                                    id="conteneurIframe" v-html="appStore.account.cgu"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                            <button type="submit"
                                class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                                    v-if="showSpinner">Loading ...</span>
                                <span v-show="!showSpinner">{{ $t("feedback.post") }}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>

<script setup>

import { ref, onBeforeMount, defineAsyncComponent, onMounted, inject,watch } from 'vue';
import RatingFeedbackComponent from '@Components/utils/RatingFeedbackComponent.vue';
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';
import { useFeedbackStore } from '@Stores/feedback.js';
import { useAppStore } from "@Stores/app.js";
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { ElMessage, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'


const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
);

const DiscountCheckList = defineAsyncComponent(() =>
    import('@Components/utils/DiscountCheckListComponent.vue')
);

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)


const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const feedbackStore = useFeedbackStore();
const establishment = ref({});
let media = [];
const iframeVisible = ref(false);

let randomAdvantage = ref(null);

const showSpinner = ref(false);

onBeforeMount(async () => {
    appStore.setCurrentPage({
        title1: t("feedback.title1"),
        title2: t("feedback.title2"),
        icon: "uil-comment-alt"
    });
    services.setToken(import.meta.env.VITE_APP_TOKEN);
    await services.get_Record(`establishment/${route.params.id}/media`, (response) => {
        if (response.status == 200) {
            establishment.value = response['data'];
            media.value = response['data'].url_source == null ? [] : response['data'].url_source;
        }

        if (response.status == 404) {
            exist.value = false;
        }
    });

})

onMounted(() => {

    appStore.setCurrentPage({
        title1: t("feedback.title1"),
        title2: t("feedback.title2"),
        icon: "uil-comment-alt"
    });

    try {
        if (window.FingerprintApp && window.FingerprintApp.default && typeof window.FingerprintApp.default.main === 'function') {
            window.FingerprintApp.default.main();
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'exécution de FingerprintG2A :", error);
    }

})

watch(()=>{
    appStore.setCurrentPage({
        title1: t("feedback.title1"),
        title2: t("feedback.title2"),
        icon: "uil-comment-alt"
    });
})

const disabledDate = (time) => {
    return time.getTime() > Date.now()
}
const app_url = inject('app_url')
const firstname = ref('');
const lastname = ref('');
const ratingCustomer = ref(null);
const comment = ref('');
const email = ref('');
const dateVisit = ref(new Date());

const resetForm = () => {
    firstname.value = '';
    lastname.value = '';
    // gender.value = '';
    comment.value = '';
    email.value = '';
    dateVisit.value = null;
    showSpinner.value = false;
}

const submit = async () => {
    var lg = localStorage.getItem("langue")
    let visitorId = localStorage.getItem("visitId")
    let date_review = new Date();
    let review = {
        "author": `${firstname.value} ${lastname.value}`,
        "language": null,
        "rating": `${ratingCustomer.value.note}`,
        "comment": comment.value,
        "translated": null,
        "source": "App (Private)",
        "catering": null,
        "establishment": `/api/establishments/${establishment.value.id}`,
        "feeling": ratingCustomer.value.feeling,
        "score": 0,
        "confidence": 0,
        "authorUrl": null,
        "profilePhoto": null,
        "email": email.value,
        "optin": true,
        "dateVisit": moment(dateVisit.value, 'DD/MM/YYYY'),
        "dateReview": moment(date_review, 'DD/MM/YYYY'),
        "visitor": visitorId ? `/api/visitors/${visitorId}` : null
    };

    let contactData = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        establishments: [`/api/establishments/${establishment.value.id}`]
    };


    try {
        if (firstname.value !== '' && ratingCustomer.value !== null) {
            showSpinner.value = true;

            await feedbackStore.createReview(review, async (response) => {
                if (response.status == 201) {
                    if (email.value !== null || email.value !== '') {
                        await services.createRecord('contacts', contactData, async (contactResponse) => {
                            if (contactResponse.status == 201) {
                                if (visitorId) {
                                    services.patchRecord('visitors', visitorId, { 'contact': contactResponse.data['@id'] }, (res) => {
                                        // Do nothing
                                    })
                                }

                                if (randomAdvantage.value) {
                                    let coupons = {
                                        advantage: randomAdvantage.value.id,
                                        establishment: route.params.id,
                                        firstname: firstname.value,
                                        lastname: lastname.value,
                                        email: email.value,
                                        language: (lg.toLowerCase() == 'sp') ? 'es' : lg.toLowerCase(),
                                        app_url: app_url.value,
                                        template: 'workflow_en'
                                    }
                                    await services.createRecord('workflow', coupons, (res) => {
                                        resetForm()
                                    });
                                }
                            }
                        });
                    }
                    router.push({
                        name: 'SuccessFeedback',
                        params: {
                            etab: route.params.id,
                            tag: route.params.tag,
                            share: parseFloat(review.rating) >= 4 ? 'message-and-join-us' : 'message'
                        },
                    });
                }
                if (response.status == 200) {
                    ElMessage.error(t('feedback.alreadysend'));
                }
            });
        } else {
            ElMessage.error(t('feedback.requiredinputs'));
        }
    } catch (error) {
        console.log(error);
    } finally {
        showSpinner.value = false;
    }
};
</script>

<style scoped>
.feedback__form {
    width: 50%;
    margin: 1rem auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 15px;
    padding-top: 2rem;
}

.gate__body {
    border-radius: 0 0 5px 5px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 8px;
}

.email {
    display: flex;
    flex-direction: column;
}

.author__email span {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
    color: var(--color-primary)
}

.author__email p {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
}

.author__email p b {
    color: var(--color-danger)
}

.author__email i {
    font-size: 15px;
}

.checkbox-container {
    margin: 15px;
}

input {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input,
textarea {
    caret-color: var(--light-color-bg2);
}

.feedback__text:hover {
    border: 1px solid var(--light-color-bg2);
}

.feedback {
    width: 100%;
}

.tablet_mobile__head {
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 100%;
    border-radius: 5px;
    font-size: 14px;
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
}

.tablet_mobile__head img {
    height: 125px !important;
}

.feedback__form h1 {
    font-size: 17px;
    color: var(--color-primary);
    font-weight: 600;
}

.feedback__form h3 {
    font-size: 14px !important;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--color-bg2);
}


.tablet_mobile__head span {
    font-weight: 500;
    color: var(--color-bg2);
}

i {
    color: var(--color-danger);
}

input:hover {
    border: 1px solid rgb(185, 185, 185) !important;
    /* Add a green border when focused */
}

input:focus {
    border-color: transparent !important;
}


.photo {
    flex-basis: 190px;
}

.photo div {
    height: 100%;
}

.photo img {
    height: 100%;
    width: 100%;
}

img {
    height: 100%;
}

.checkbox-container div {
    height: 500px;
    overflow-y: auto;
}

.checkbox-container span {
    color: var(--color-danger);
    font-weight: 500;
    cursor: pointer;
}

@media screen and (max-width:1075px) {
    .feedback__form {
        width: 60%;
    }
}

@media screen and (max-width:1024px) {
    .feedback__form {
        position: relative;
        top: 1rem !important;
        width: 70%;
    }
}

@media screen and (max-width:850px) {
    .feedback__form {
        width: 80%;
    }
}

@media screen and (max-width:750px) {
    .feedback__form {
        width: 90%;
    }
}
</style>