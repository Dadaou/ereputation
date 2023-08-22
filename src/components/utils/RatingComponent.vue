<template>
<div class="society__rating">
    <div class="reviews">
       <div class="rating__observation">
        <span v-if="Number(props.rating) >=5">Excellent</span>
        <span v-if="Number(props.rating) >= 4 && Number(props.rating)<=4.99">Good</span>
        <span v-if="Number(props.rating) >= 3 && Number(props.rating)<=3.99">Fine</span>
        <span v-if="Number(props.rating) >= 2 && Number(props.rating)<=2.99">Not Good</span>
        <span v-if="Number(props.rating) >= 0 && Number(props.rating)<=2.99">Bad</span>
       </div>
       <div class="reviews__value">{{ props.reviews }} <span v-if="Number(props.reviews) >= 2">reviews</span> <span v-else>review</span> </div>
    </div>
    <div class="global__rating">
        {{ props.rating }}
    </div>
</div>
</template>

<script setup>
const props = defineProps(['reviews', 'rating']);

</script>

<style scoped>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .society__rating{
        display: flex;
        align-items: center;
        width: 110px;
    }

    .reviews{
        flex-basis: 150px;
        font-size: 11px;
    }

    .reviews__value, .reviews__value span{
        color: rgb(150, 150, 150);
        font-weight: 500 !important;
        font-size: 11px;
    }

    .global__rating{
        flex-grow: 1;
        flex-basis: 50px;
        background-color: var(--color-danger);
        text-align: center;
        color: white;
        font-weight: 600;
        font-size: 11px;
        padding: 6px 3px;
        border-radius: 5px 5px 5px 0px;
    }

    .society__rating a{
        font-size: 12px;
        font-weight: 600;
    } 

    .society__rating .rating__observation{
        font-size: 13px;
        font-weight: bold;
    }

</style>