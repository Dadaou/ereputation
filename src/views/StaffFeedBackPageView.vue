<template>
<div class="main__container" v-if="exist">
    <HeadComponent :page="page"></HeadComponent> 
    <div class="feedback__form">
        <div class="tablet_mobile__head">
            <div class="staff__card" v-if="staff !== null">
		            <div>
		                <h5>{{ staff.firstname }} <!-- <span v-if="staff.lastname != null">{{ staff.lastname }}</span> --></h5>
		                <ul>
                            <li><span class="label">Department: </span> <span>{{ staff.department }}</span></li>
		                    <li class="Gender">
		                    Internal use only, your comment will not be posted on the public platforms.
		                    </li>
		                </ul>
                        <button class="btn mt-2  btn-primary staffs__btn" @click="showModal=true">Staffs list <i class="uil uil-users-alt"></i></button>
		            </div>
                    <!-- <div>
                        <button class="btn mr-2 btn-primary staffs__btn" @click="showModal=true">staffs <i class="uil uil-users-alt"></i></button>
                    </div> -->
		        </div>
		     </div>
            <div class="feedback">
                <h3>Customer experiences feedback</h3>
                <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                     <div class="mb-6 feedback__rating">
                       <label>Rating <span>*</span></label>
                       <RatingFeedbackComponent @updateValue="(rating)=>{
                        ratingCustomer = rating
                       }"/>
                    </div> 
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name <span>*</span></label>
                            <input type="text" id="first_name" v-model="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                            <input type="text" id="last_name" v-model="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                         <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender <span>*</span></label>
                            <el-select v-model="gender" placeholder="Choose gender" size="large">
                                <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"/>
                            </el-select>
                        </div>
                         <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date visit<!--  <span>*</span> --></label>
                             <!-- <el-date-picker
                                v-model="dateVisit"
                                :size="'large'"
                              /> -->
                              <el-date-picker
                                v-model="dateVisit"
                                type="datetime"
                                placeholder="Select date and time"
                                :size="'large'"
                              />
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2 email">
                        <div class="author__email">
                            <span>
                               <i class="uil uil-info-circle"></i> If you wish to obtain discounts or benefits, please provide your email address below.
                            </span>
                            <p v-if="randomAdvantage">
                                <b>Promotion of the day:</b>  {{randomAdvantage.name}}
                            </p>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address <!-- <span>*</span> --></label>
                            <input type="email" v-model="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                        </div>
                        <!-- <div>
                             <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Language</label>
                             <LanguageOption/>
                        </div> -->
                    </div>

                   
                    <div class="feedback__text w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label for="comment" class="text-sm comment__label">Please leave a comment</label>
                            <textarea id="comment" v-model="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"></textarea>
                        </div>
                         <div>
                            <div class="checkbox-container">
                              <label>
                                <input type="checkbox" id="agreeCheckbox" required>
                                By using our services and checking the box above, you agree to the terms outlined in this Privacy Policy
                              </label>
                            </div>
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
<EstablishmentNotFound v-else/>
<ModalComponent 
        :showModal="showModal" 
        @close="showModal=false" 
        :width="modalWidth"
    >
        <template #content>
            <div class="modal__header">
                <div class="modal__title">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        <i class="uil uil-users-alt"></i> Staff's links for feedback
                    </h3>
                </div>
                <div class="modal__close">
                    <i class="uil uil-times-circle"  @click="showModal = false"></i>
                </div>
            </div>
            <div class="modal__container">
                <a class="staff__card mb-1" v-if="staffs.length>0" :href="`/customer/${route.tag}/establishment/${staff.establishment_competitor_tag}/staffs/${staff.tag}/feedback`" v-for="staff in staffs">
                        <div class="staff__qrcode">    
                            {{staff.firstname}} {{staff.lastname}}
                        </div>
                </a>
            </div>
        </template>
    </ModalComponent>
</template>

<script setup>
import { ref, onBeforeMount, provide, defineAsyncComponent, computed } from 'vue';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import RatingFeedbackComponent from '@Components/utils/RatingFeedbackComponent.vue';
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';
import { useFeedbackStore } from '@Stores/feedback.js';
import { useCompanyStore } from '@Stores/company.js';
import { useStaffStore } from '@Stores/staff.js';
import moment from 'moment';
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus';
import { useWindowSize } from '@vueuse/core';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const SpinnerComponent = defineAsyncComponent(()=>
    import('@Components/utils/SpinnerComponent.vue')
)

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const ModalComponent = defineAsyncComponent(()=>
    import('@Components/utils/ModalComponent.vue')
)

// const LanguageOption = defineAsyncComponent(()=>
//     import('@Components/utils/LanguageOptionComponent.vue')
// )

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const staffStore = useStaffStore();
const feedbackStore = useFeedbackStore();
const staff = ref(null);
const staffs = ref([]);
let media = [];
const showModal = ref(false);
const companyId = route.params.etab;
let randomAdvantage = ref(null);
const { width, height } = useWindowSize()
const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    return gap + 45;
})
const establishment = ref({});

const page=ref({
    title1: "Leave",
    title2: "your feedback",
    icon: "uil-comment-alt",
});

const showSpinner = ref(false);
const allAdvantages = ref(null)

function getRandomValue(n) {
    return Math.floor(Math.random() * (n + 1));
}

onBeforeMount(async ()=>{
    if(userStore.authenticated==null) services.setToken(import.meta.env.VITE_APP_TOKEN);

    await services.get_Record(`establishment/${route.params.etab}/media`, (response)=>{
        console.log(response)
            if(response!== undefined &&response.status == 200){ 
                establishment.value = response['data'];
            }

            if(response!== undefined && response.status == 404) {
                    exist.value = false;
            }
      });
  
    await services.get_Record(`staffs/${route.params.id}/descriptions`, (response)=>{
        console.log(response)
            if(response.status == 200){ 
               staff.value = response.data[0];
               console.log(staff.value)
            }

            if(response.status == 404) exist.value=false
    });

    let advantage_promises = [];
    try {
        const response = await new Promise((resolve, reject) => {
            services.get_Record(`advantage/list`, (response) => {
                resolve(response);
            });
        });
        console.log('Raw Advantage Data:', response.data);
        if (response.status === 200) {
            allAdvantages.value = response.data;
            if(allAdvantages.value.length > 0) randomAdvantage.value = allAdvantages.value[getRandomValue(allAdvantages.value.length)];

            console.log('Processed Advantage Data:', allAdvantages.value);
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }

    try{
         const responseEstablishment = await new Promise((resolve, reject) => {
            services.get_Record(`/establishment/${companyId}/detail`, (response) => {
                resolve(response)
            });
        });

        if (responseEstablishment.status == 200) {
            staffs.value = responseEstablishment.data['staffs']
        }
    }catch{

    } 
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
const gender = ref('');
const genders = [
  {
    value: 'M',
    label: 'Male',
  },
  {
    value: 'F',
    label: 'Female',
  },
  {
    value: 'O',
    label: 'Other',
  }
]

const submit = async ()=>{
    let date_review = new Date();
    let review = {
        "author": `${firstname.value} ${lastname.value}`,
        "language": null,
        "rating": `${ratingCustomer.value.note}`,
        "comment": comment.value,
        "translated": null,
        "source": "App (Private)",
        "catering": null,
        "establishment": null,
        "feeling": ratingCustomer.value.feeling,
        "score": 0,
        "confidence": 0,
        "authorUrl": null,
        "profilePhoto": null,
        "email": email.value,
        "staff": `/api/staff/${staff.value.id}`,
        "optin": true,
        "dateVisit": moment(dateVisit.value, 'DD/MM/YYYY'),
        "dateReview": moment(date_review, 'DD/MM/YYYY')
    }
    let contactData = {
        gender: gender.value, 
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        establishment: `/api/establishments/${establishment.value.id}`
    };

    try{
        if(firstname.value !== '' && ratingCustomer.value !== null){
            showSpinner.value = true;
            await feedbackStore.createReview(review, async(response)=>{
                if(response.status == 201){
                    await services.createRecord('contacts', contactData, (contactResponse) => {
                        console.log(contactResponse);
                        if (contactResponse.status == 201) {
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
                                router.push({
                                    name: 'SuccessFeedback',
                                    params: {
                                        etab: route.params.etab,
                                        tag: route.params.tag
                                    }
                                })
                        }
                    });
                    
                }
            })
        }else ElMessage.error(`Please, provide all needed information`);
    }catch(error){
        console.log(error)
    }
    
};
</script>

<style scoped>

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

.qr__code{
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__close i:hover{
    transform: rotate(360deg);
}

.staff__qrcode{
    font-weight: 500;
    font-size: 15px;
    color: var(--color-primary);
}

.modal__container .staff__card:hover{
    background: var(--color-primary);
}

.modal__container .staff__card:hover .staff__qrcode{
    color: white;
}

.staffs__btn{
    border-radius: 5px !important;
    color: white !important;
    padding: 1px 10px !important;
    background-color: var(--color-primary) !important;
    font-size: 13px;
}

.staffs__btn i{
    color: white !important;
}

.email{
    display: flex;
    flex-direction: column;
}

.author__email p{
 font-size: 14px;
 line-height: 1;
 font-weight: 500;
}

.author__email p b{
 color: var(--color-danger)
}

.author__email span{
 font-size: 14px;
 line-height: 1;
 font-weight: 500;
 color: var(--color-primary)
}

.author__email i{
 font-size: 15px;
}

.checkbox-container {
      margin: 15px;
}

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
  border: 1px solid rgb(185, 185, 185) !important;
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

.staff__card span{
    font-size: 14px;
    color: var(--color-bg2);
}
span.label{
    color: var(--color-bg1);
    font-size: 14px;
}

@media screen and (max-width:1075px) {
    .feedback__form{
        width: 60%;
    }
}

@media screen and (max-width:1024px) {
    .feedback__form{
        position: relative;
        /*top: 10.5rem !important;*/
        width: 70%;
    }
}

@media screen and (max-width:850px) {
    .feedback__form{
        width: 80%;
        /*top:0rem !important;*/
    }
}

@media screen and (max-width:750px) {
    .feedback__form{
        width: 90%;
    }
}
</style>