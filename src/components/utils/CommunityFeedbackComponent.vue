<template>
    <div class="community__feedback">
        <div class="title">Community Feedback</div>
        <!-- <h2 v-if="reviewFeedbackData.feeling > 0">Mostly Positive (+{{ reviewFeedbackData.score }})</h2>
        <h2 v-else>Mostly Negative (-{{ reviewFeedbackData.score }})</h2> -->
        <h2 v-if="reviewFeedbackData.feeling > 0">Mostly Positive </h2>
        <h2 v-if="reviewFeedbackData.feeling < 0">Mostly Negative </h2>
        <div class="reviews__content1">
            <div class="review h-2 bg-gray-200 rounded dark:bg-gray-700" style="position: relative">
                <div v-if="reviewFeedbackData.feeling > 0" class="h-2 rounded review-feedback__positive"
                    :style="{ 'width': reviewFeedbackData.width + '%', 'background': `linear-gradient(90deg, rgba(255,255,0,1) 0%, rgba( ${reviewFeedbackData.red},${reviewFeedbackData.green},0,1) 100%)` }">
                </div>
                <div v-else class="h-2 rounded review-feedback__negative"
                    :style="{ 'width': reviewFeedbackData.width + '%', 'background': `linear-gradient(90deg, rgba(255,255,0,1) 0%, rgba( ${reviewFeedbackData.red},${reviewFeedbackData.green},0,1) 100%)` }">
                </div>
                <div class="review-feedback__labels">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    reviewsConfidence: {
        type: Number,
        default: 0
    },
    reviewFeedbackData: {
        type: Object,
        default: {
            width: 0,
            red: 0,
            green: 0,
            feeling: 0,
            score: 0
        }
    }
});
</script>
<style scoped>
.community__feedback {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: 125px;
    padding: 15px;
    margin: 15px auto;
}

.community__feedback .title {
    font-weight: 600;
    font-size: 15px;
}

.community__feedback h2 {
    margin: 5px auto;
    font-size: 14px;
}

.review-feedback__labels {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
}

.review-feedback__labels span {
    margin: 0 !important;
    font-size: 12px;
    font-weight: 600;
    color: var(--light-color-bg2);
}

.review-feedback__negative {
    transform: rotate(180deg);
    transform-origin: center left;
    position: relative;
    left: 50%;
}

.review-feedback__positive {
    position: relative;
    left: 50%;
}
</style>