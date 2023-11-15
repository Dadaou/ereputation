<template>
    <div class="rating__feedback">
        <div :class="[ratingCustomer.terrible.clicked?'clicked':'']" @click="selectRating('terrible')">
            <i class="uil uil-angry"></i>
            <span>Terrible</span>
        </div>

        <div :class="[ratingCustomer.bad.clicked?'clicked':'']" @click="selectRating('bad')">
            <i class="uil uil-sad"></i>
            <span>Bad</span>
        </div>

        <div :class="[ratingCustomer.okay.clicked?'clicked':'']" @click="selectRating('okay')">
            <i class="uil uil-smile"></i>
            <span>Okay</span>
        </div>

        <div :class="[ratingCustomer.good.clicked?'clicked':'']" @click="selectRating('good')">
            <i class="uil uil-laughing"></i>
            <span>Good</span>
        </div>

        <div :class="[ratingCustomer.amazing.clicked?'clicked':'']" @click="selectRating('amazing')">
            <i class="uil uil-grin"></i>
            <span>Amazing</span>
        </div>
          
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';

const emit = defineEmits(['updateValue']);

const ratingCustomer = ref({
    terrible: { note: 1, clicked: false, feeling: 'negative'},
    bad: { note: 2, clicked: false, feeling: 'negative'},
    okay: { note: 3, clicked: false, feeling: 'positive'},
    good: { note: 4, clicked: false, feeling: 'positive'},
    amazing: { note: 5, clicked: false, feeling: 'positive'},
});

const selectRating = (selectedRating)=>{
    for(const key in ratingCustomer.value){
        if(key == selectedRating){
            ratingCustomer.value[key].clicked = true;
            emit('updateValue', ratingCustomer.value[key])
        }
        else ratingCustomer.value[key].clicked = false;
    }
}

selectRating('okay');


</script>
<style scoped>
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
        gap:5px;
    }
}

@media screen and (max-width:600px) {
    .rating__feedback div{
        width: 5rem !important;
    }

    .rating__feedback i{
        font-size: 15px !important;
    }

    .rating__feedback span{
        font-size: 10px !important;
        font-weight: 500;
    }
}
</style>