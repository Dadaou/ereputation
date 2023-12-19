<template>
<div class="main__container" v-if="exist">
    <HeadComponent :page="page"></HeadComponent> 
    <div class="feedback__form">
        Thank you for your valuable feedback.
        If you have provided your email, you will soon receive a benefit to use at our establishment. We look forward to seeing you again soon and wish you a pleasant day.
    </div>
</div>
<EstablishmentNotFound v-else/>
</template>

<script setup>
import { ref, onBeforeMount, provide, defineAsyncComponent } from 'vue';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import RatingFeedbackComponent from '@Components/utils/RatingFeedbackComponent.vue';
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';
import { useFeedbackStore } from '@Stores/feedback.js';
import { useCompanyStore } from '@Stores/company.js';
import { useStaffStore } from '@Stores/staff.js';
import { ElMessage } from 'element-plus';
import moment from 'moment';
import { ElDatePicker } from 'element-plus';
import 'element-plus/es/components/date-picker/style/css';

const SpinnerComponent = defineAsyncComponent(()=>
    import('@Components/utils/SpinnerComponent.vue')
)

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const staffStore = useStaffStore();
const feedbackStore = useFeedbackStore();
const staff = ref(null);
let media = [];

const page=ref({
    title1: "Thanks",
    title2: "for your feedback",
    icon: "uil-feedback",
});
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