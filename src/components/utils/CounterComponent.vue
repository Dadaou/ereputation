<template>
     <div class="item">
            <div class="item__left">
                <div class="item__title">{{ item.title }}</div>
                <span class="item__value">{{ item.value }}</span>
            </div>
            <span class="item__icon">
                <i class="uil" :class="item.icon"></i> 
            </span>
    </div>
</template>

<script setup>
const props = defineProps({
    item:{
        type:Object,
        required: true
    }
})
</script>

<style scoped>
.item{
    display: flex;
    gap: 3rem;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.10);
    width: 25%;
    padding: 25px;
    border-radius: 10px;
}

.item__title{
    color: var(--color-bg2);
    font-size: 15px;
    font-weight: bold;
}

.item__value{
    color: var(--color-danger);
    font-size: 25px;
    font-weight: bolder;
}

.item__icon{
    color: var(--light-color-bg2);
    font-size: 25px;
}
</style>