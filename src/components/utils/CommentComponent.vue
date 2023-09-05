<template>
<div class="reviews__content">
    <!-- <article v-for="review in reviews" v-if="reviews.length > 0" class="md:gap-8 md:grid md:grid-cols-3 review__card">
        <div class="review__info">
            <div class="flex items-center mb-2 space-x-4">
                <img v-if="review.profile_photo != null" class="w-10 h-10 rounded-full" :src="review.profile_photo" alt="">
                <div v-else class="relative inline-flex items-center justify-center w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
                    <span class="font-medium dark:text-white">{{ userStore.getInitialsV2(review.author) }} </span>
                </div>
                <div class="font-medium dark:text-white">
                    <p>{{ review.author }}</p>
                </div>
            </div>
            <ul class="text-sm text-gray-500 dark:text-gray-400 ml-2">
                <li class="flex items-center"><svg class="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15V9m4 6V9m4 6V9m4 6V9M2 16h16M1 19h18M2 7v1h16V7l-8-6-8 6Z"/>
            </svg>{{ review.source }}</li>
                        <li class="flex items-center"><svg class="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>{{ moment(review.date_review).format('D MMMM YYYY')}}</li>
            </ul>
        </div>
        <div class="mt-6 md:mt-0 review__comment">
            <div>
                <span v-if="showEmoji">
                    <span v-if="review.feeling=='positive'">😀</span>
                    <span v-if="review.feeling=='neutre'">😐</span>
                    <span v-if="review.feeling=='negative'">😕</span>
                </span>
                <p class="bg-yellow-100 text-yellow-800 font-semibold text-sm inline-flex items-center p-1.5 rounded dark:bg-yellow-200 dark:text-yellow-800">{{ formatRating(review.rating) }}</p>
            </div>
            <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
        </div>
    </article> -->

    <article v-for="review in reviews" v-if="reviews.length > 0">
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
                    </ul>
                </div>
            </div>
            <div>
                <span v-if="showEmoji">
                    <span v-if="review.feeling=='positive'">😀</span>
                    <span v-if="review.feeling=='neutre'">😐</span>
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
</div>
</template>
<script setup>
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";

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

const userStore = useUserStore();
const formatRating = (rating) => {
    rating = parseFloat(rating);
    if(rating > 5){
        rating = rating / 2;
    }
    return rating.toFixed(1);
}
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.author__initial{
    border: 2px solid rgb(211, 211, 211);
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