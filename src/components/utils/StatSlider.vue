<template>
    <div class="carousel">
        <div class="carousel__inner">
            <StatSlideItem v-for="(stat, index) in items" :key="`item-${index}`" :slide="stat" :current-slide="currentSlide"
                :index="index">
            </StatSlideItem>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import StatSlideItem from '@Components/utils/StatSlideItem.vue';
const props = defineProps(["items"]);
let currentSlide = ref(0);
let slideInterval = ref(null);

onMounted(() => {
    console.log("Mounted")
    slideInterval.value = setInterval(() => {
        const index = currentSlide.value < props.items.length - 1 ? currentSlide.value + 1 : 0;
        currentSlide.value = index;
    }, 4000)
});

onBeforeUnmount(() => {
    clearInterval(slideInterval.value);
});
</script>
<style scoped>
.carousel {
    display: flex;
    justify-content: center;
    width: 100%;
}

.carousel__inner {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 136px;
}
</style>