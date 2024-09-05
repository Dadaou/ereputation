<template>
    <div class="rating__feedback">
        <div :class="[feelingCustomer=='negative'?'clicked':'']" @click="selectFeeling('negative')">
            <span class="emoji">😕</span>
            <span>Negative</span>
        </div>
        <div :class="[feelingCustomer=='neutral'?'clicked':'']" @click="selectFeeling('neutral')">
            <span class="emoji">😐</span>
            <span>Neutral</span>
        </div>
        <div :class="[feelingCustomer=='positive'?'clicked':'']" @click="selectFeeling('positive')">
            <span class="emoji">😀</span>
            <span>Positive</span>
        </div>  
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';

const emit = defineEmits(['updateValue']);
let feeling = inject('feeling');
let feeling_review = inject('feeling_review');
let modal = inject('modal');

const feelingCustomer = ref(modal.value.type != 'feeling_review' ? feeling_review.value : feeling.value );

const selectFeeling = (feel)=>{
    feelingCustomer.value = feel;
    emit('updateValue', feelingCustomer.value);
}

selectFeeling(feeling.value);

</script>
<style scoped>
.emoji{
    font-size: 100px;
}

.rating__feedback{
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: auto;
    margin-top: 1rem;
}

.rating__feedback div{
    display: flex;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    width: 6rem;
    border-radius: 5px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    cursor: pointer;
}

.rating__feedback i{
    font-size: 25px;
    color: var(--color-primary);
}

.rating__feedback span{
    font-size: 14px;
    color: var(--color-primary);
}

.rating__feedback .clicked{
    border: 2px solid var(--color-primary);
}

.clicked i, .clicked span{
    color: var(--color-danger) !important;
}

@media screen and (max-width:1400px) {
    .rating__feedback{
        width: 90% !important;

    }
}

@media screen and (max-width:670px) {
    .rating__feedback{
        width: 100% !important;

    }
}

@media screen and (max-width:600px) {
    .rating__feedback div{
        width: 5rem !important;
    }

    .rating__feedback i{
        font-size: 20px !important;
    }

    .rating__feedback span{
        font-size: 13px !important;
    }
}
</style>