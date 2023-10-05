<template>
    <Transition name="slide-in">
        <div class="carousel__item" v-show="currentSlide == index">
            <StatComponent :color="slide.color" :bgColor="slide.bgColor" :value="slide.value"
                :description="slide.description" :icon="slide.icon" :iconStyle="slide.iconStyle"
                :percentage="slide.percentage" :trend="slide.trend">
            </StatComponent>
        </div>
    </Transition>
</template>
<script setup>
import StatComponent from '@Components/utils/StatComponent.vue';
const props = defineProps(["slide", "currentSlide", "index"]);
</script>
<style scoped>
.carousel__item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: all 4s ease-in-out;
}

.slide-in-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-in-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>