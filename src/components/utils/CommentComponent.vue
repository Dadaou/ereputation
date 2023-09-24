<template>
<div class="reviews__content">
    <article v-for="review in reviews" v-if="reviews.length > 0" :class="[review.source=='App (Private)'?'intern__comment':'']">
        <div class="flex items-center review__item">
            <div class="flex items-center mb-1 space-x-4">
                <div class="review__info space-y-1 dark:text-white info__reviews">
                    <div class="flex items-center mb-2 space-x-4">
                        <img v-if="review.profile_photo != null" class="w-10 h-10 rounded-full" :src="review.profile_photo" alt="">
                        <div v-else class="relative inline-flex items-center justify-center w-8 h-8 p-1 rounded author__initial">
                            <span class="font-medium dark:text-white">{{ userStore.getInitialsV2(review.author) }} </span>
                        </div>
                        <div class="font-medium dark:text-white">
                            <p id="author__name">{{ review.author }}</p>
                        </div>
                    </div>
                    <ul class="space-y-1 text-gray-500 dark:text-gray-400">
                        <li v-if="review.date_review != null" class="flex items-center"><i class="uil uil-calender"></i><span>
                            {{ moment(review.date_review).format('D MMMM YYYY')}}
                        </span></li>
                        <li class="flex items-center"><i class="uil uil-map-pin-alt"></i><span>
                            {{ review.source }}
                        </span></li>
                         <!-- <li class="flex items-center"  v-if="review.staff !== null"> <span>Staff review: </span>
                            <span class="ml-2">{{ review.staff.firstname }} {{ review.staff.lastname }}</span>
                        </li> -->
                    </ul>
                </div>
            </div>
            <div>
                <span class="emoji" v-if="showEmoji" @click="editReview(review)">
                    <span v-if="review.feeling=='positive'">😀</span>
                    <span v-if="review.feeling=='neutre' || review.feeling=='neutral'">😐</span>
                    <span v-if="review.feeling=='negative'">😕</span>
                </span>
                <p class="bg-yellow-100 text-yellow-800 font-semibold text-sm inline-flex items-center p-1.5 rounded dark:bg-yellow-200 dark:text-yellow-800">{{ formatRating(review.rating) }}</p>
            </div> 
        </div>
        <div class="col-span-2">
            <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
        </div>
    </article>
    <article v-else>No reviews ...</article>
    <ModalComponent :showModal="showModal" @close="showModal=false" :width="modalWidth">
            <template #content>
                <div class="modal__header">
                    <div class="modal__title">
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                            <i class="uil uil-edit"></i> Review Feeling
                        </h3>
                    </div>
                    <div class="modal__close">
                        <i class="uil uil-times-circle"  @click="showModal = false"></i>
                    </div>
                </div>
                <div class="mb-6 feedback__rating">
                       <FeelingFeedbackComponent @updateValue="(feeling)=>{
                        feel = feeling
                       }"/>
                </div>
                <div class="mt-5 download__qr_btn">
                <button class="btn__light_secondary" @click="updateReview">
                    <i class="uil uil-save"></i> Save
                </button>
            </div> 
            </template>
        </ModalComponent>
</div>
</template>
<script setup>
import { ref, provide, computed } from 'vue';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import ModalComponent from '@Components/utils/ModalComponent.vue';
import FeelingFeedbackComponent from '@Components/utils/FeelingFeedbackComponent.vue';
import { useFeedbackStore } from '@Stores/feedback.js';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
    reviews: {
        type: Array,
        required: true,
        default: []
    },
    allReviews: {
        type: Array,
        required: false
    },
    showEmoji: {
        type: Boolean,
        default: false
    }
});

const { width, height } = useWindowSize();
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const modalWidth= computed(()=>{
    let windowSize = 1500;
    let gap = (windowSize - width.value)/19;
    console.log(gap)
    return gap + 35;
})
const formatRating = (rating) => {
    rating = parseFloat(rating);
    if(rating > 5){
        rating = rating / 2;
    }
    return rating.toFixed(1);
}

const showModal = ref(false);
const feel = ref('okay');
const id = ref('');
provide('feeling', feel);

const editReview = (review) => {
   feel.value = review.feeling;
   review.feeling = feel.value;
   id.value =review.id;

   if(feel.value=='neutre') feel.value = 'neutral';
   showModal.value = true;
}

const reloadData = (reviewUpdated)=>{
    if(userStore.user.customer != null){
        userStore.user.customer.establishments.forEach((element, index) => {
            if(element.id == reviewUpdated.establishment['id']){
              userStore.user.customer.establishments[index].reviews.forEach((review, index2)=>{
                if(review.id == reviewUpdated.id){
                    userStore.user.customer.establishments[index].reviews[index2].feeling = reviewUpdated.feeling;
                }
              })
            }
        });
    }
  }

const updateReview = async () => {
    let updatedValue = {
        feeling: feel.value
    }

    try {
        await feedbackStore.updateReview(id.value, updatedValue, response=>{
            if(response.status==200){
                reloadData(response.data)
                setTimeout(()=>{
                    showModal.value = false;
                }, 100)
            } 
        })   
    } catch (error) {
        console.log(error);
    }
}

</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

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

.emoji{
    cursor: pointer;
}

.author__initial{
    border: 2px solid rgb(211, 211, 211);
}

.intern__comment{
    background-color: rgb(249, 244, 255);
    border: 1px solid var(--color-primary);
}

.review__info{
    font-weight: 600;
}

#author__name{
    font-size: 16px;
    color: var(--color-primary);
}

.review__info ul{
    font-size: 13px !important;
    color: var(--color-bg1);
}
.review__item{
    justify-content: space-between !important;
}

.reviews__content article{
   margin: 10px auto;
   border-radius: 10px;
   padding: 20px;
   box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.info__reviews i{
    margin-right: 5px;
    color: var(--color-danger);
}
</style>