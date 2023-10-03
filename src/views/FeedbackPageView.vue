<template>
<div class="main__container">
    <HeadComponent :page="page"></HeadComponent> 
    <div class="feedback__form">
        <div class="tablet_mobile__head">
                <div class="establishment__info">
                        <h1 class="society__name">{{ establishment.establishment_name }}</h1>
                        <div class="society__category">
                            <i :class="['uil', establishment.establishment_category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span class="ml-2">{{ establishment.establishment_category }}</span>
                        </div>
                        <div class="society__country" v-if="establishment.country != null">
                                <i class="uil uil-map"></i>
                                <span class="ml-2">{{ establishment.establishment_country }}</span>
                        </div> 
                        <div class="society__location">
                                <i class="uil uil-location-point"></i>
                                <span class="ml-2">{{ establishment.establishment_address1 }}, {{ establishment.establishment_city }}</span>
                         </div>
                    </div>
                <div class="photo">
                    <img v-if="establishment.url_source !== null" :src="establishment.url_source" alt="" />
                    <div v-else role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
            </div>
            <div class="feedback">
                <h3>Customer experiences feedback</h3>
                <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name <span>*</span></label>
                            <input type="text" id="first_name" v-model="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                            <input type="text" id="last_name" v-model="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address <span>*</span></label>
                            <input type="email" v-model="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Visited at <span>*</span></label>
                            <!-- <VueDatePicker v-model="dateVisit" :enable-time-picker="false" :format="format"/> -->
                             <el-date-picker
                                v-model="dateVisit"
                                :size="'large'"
                              />
                        </div>
                    </div>
                    <div class="mb-6 feedback__rating">
                       <label>Rating <span>*</span></label>
                       <RatingFeedbackComponent @updateValue="(rating)=>{
                        ratingCustomer = rating
                       }"/>
                    </div> 
                    <div class="feedback__text w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label for="comment" class="text-sm comment__label">Please leave a comment <span>*</span></label>
                            <textarea id="comment" v-model="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" required></textarea>
                        </div>
                        <div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                            <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                                <span v-show="!showSpinner">Post comment</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
    </div>
</div>
</template>

<script setup>
import { ref, onBeforeMount, provide, defineAsyncComponent } from 'vue';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import RatingFeedbackComponent from '@Components/utils/RatingFeedBackComponent.vue';
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import services from '@Services/services.js';
import { useCompanyStore } from '@Stores/company.js';
import { useFeedbackStore } from '@Stores/feedback.js';
import { ElMessage } from 'element-plus';
import moment from 'moment';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css'


const SpinnerComponent = defineAsyncComponent(()=>
    import('@Components/utils/SpinnerComponent.vue')
)
const route = useRoute();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const feedbackStore = useFeedbackStore();
const establishment = ref({});
let media = [];

const page=ref({
    title1: "Leave",
    title2: "your feedback",
    icon: "uil-signin",
});

provide('feeling', 'okay');
const showSpinner = ref(false);

onBeforeMount(async ()=>{
    if(userStore.authenticated==null) services.setToken(import.meta.env.VITE_APP_TOKEN);
     await services.get_Record(`establishment/${route.params.id}/media`, (response)=>{
        console.log(response)
            if(response.status == 200){ 
                establishment.value = response['data'][0];
                media.value = response['data'][0].url_source==null?[]:response['data'][0].url_source;
            }
      });
})

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}
const firstname = ref('');
const lastname = ref('');
const ratingCustomer = ref(null);
const comment = ref('');
const email = ref('');
const dateVisit = ref('');

const submit = async ()=>{
    showSpinner.value = true;
    let date_review = new Date();
    let review = {
        "author": `${firstname.value} ${lastname.value}`,
        "language": null,
        "rating": `${ratingCustomer.value.note}`,
        "comment": comment.value,
        "translated": null,
        "source": "App (Private)",
        "catering": null,
        "establishment": `/api/${companyStore.entity}/${route.params.id}`,
        "feeling": ratingCustomer.value.feeling,
        "score": 0,
        "confidence": 0,
        "authorUrl": null,
        "profilePhoto": null,
        "email": email.value,
        "staff": null,
        "optin": true,
        "dateVisit": moment(dateVisit.value, 'DD/MM/YYYY'),
        "dateReview": moment(date_review, 'DD/MM/YYYY')
    }

    try{
        if(firstname.value !== '' && ratingCustomer.value !== null && email.value !== '' && comment.value !== '' && dateVisit.value !== null){
            await feedbackStore.createReview(review, (response)=>{
                console.log(response);

                if(response.status == 201){
                    ElMessage({
                        message: `Thanks for your feedback!`,
                        type: 'success',
                    })
                    firstname.value = '';
                    lastname.value = '';
                    comment.value = '';
                    email.value = '';
                    dateVisit.value = null;
                    showSpinner.value = false;
                }
            })
        }
    }catch(error){
        console.log(error)
    }
    
};
</script>

<style scoped>

.feedback__form{
    width: 50%;
    margin: 3rem auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 15px;
    padding-top: 2rem;
}

input{
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span{
    color: red;
}

input, textarea{
    caret-color: var(--light-color-bg2);
}

.feedback__text:hover{
    border: 1px solid var(--light-color-bg2);
}

.feedback{
    width: 100%;
}

.tablet_mobile__head{
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 100%;
    border-radius: 5px;
    font-size: 14px;
}

.feedback__form h1{
    font-size: 17px;
    color: var(--color-primary);
    font-weight: 600;
}

.feedback__form h3{
    font-size: 14px !important;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--color-bg2);
}


.tablet_mobile__head span{
    font-weight: 500;
    color: var(--color-bg2);
}

i{
    color: var(--color-danger);
}

input:hover {
  border: 1px solid rgb(185, 185, 185) !important; /* Add a green border when focused */
}

input:focus {
  border-color: transparent !important;
}


.photo{
    flex-basis: 190px;
}

.photo div{
    height: 100%;
}

.photo img{
    height: 100%;
    width: 100%;
}

@media screen and (max-width:1075px) {
    .feedback__form{
        width: 60%;
    }
}

@media screen and (max-width:1024px) {
    .feedback__form{
        position: relative;
        top: 1rem !important;
        width: 70%;
    }
}

@media screen and (max-width:850px) {
    .feedback__form{
        width: 80%;
    }
}

@media screen and (max-width:750px) {
    .feedback__form{
        width: 90%;
    }
}
</style>