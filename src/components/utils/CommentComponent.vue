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