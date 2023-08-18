<template>
<div class="reviews__content">
    <article v-for="review in reviews" v-if="reviews.length > 0">
        <div class="flex items-center review__item">
            <div class="flex items-center mb-6 space-x-4">
                <div class="space-y-1 font-medium dark:text-white info__reviews">
                    <p>{{ review.author }}</p>
                    <ul class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <li class="flex items-center"><i class="uil uil-calender"></i><span>
                            {{ moment(review.created_at).format('D MMMM YYYY')}}
                        </span></li>
                        <li class="flex items-center"><i class="uil uil-map-pin-alt"></i><span>
                            {{ review.source }}
                        </span></li>
                    </ul>
                </div>
            </div>
            <div>
                <span v-if="showEmoji">
                    <span v-if="review.score >= 0.5 && review.comment !== ''">😀</span>
                    <span v-if="(review.score >= 0.2 && review.score < 0.5) && review.comment !== ''">😊</span>
                    <span v-if="review.score > 0 && review.score < 0.2 && review.comment !== ''">😕</span>
                    <span v-if="review.score == 0 || review.comment == ''">😐</span>
                </span>
                <p class="bg-yellow-100 text-yellow-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-yellow-200 dark:text-yellow-800">{{ formatRating(review.rating) }}</p>
            </div> 
        </div>
        <div class="col-span-2 mt-6 md:mt-0">
            <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
        </div>
        <!-- <div class="flex items-center space-x-1 mb-5">
            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <svg class="w-4 h-4 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
        </div> -->
    </article>
    <article v-else>No reviews ...</article>
</div>
</template>
<script setup>
import moment from 'moment';
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
}
</style>