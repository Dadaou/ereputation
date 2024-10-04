<template>
    <div class="main__container">
        <div v-if="currentStep < steps.length" class="step-progress">
            <div v-for="(step, index) in steps" :key="index" class="step" @click="navigateToStep(index + 1)">
                <div :class="['step-number', { 'active-step': index + 1 === currentStep }]">
                    {{ index + 1 }}
                </div>
                <div v-if="index < steps.length - 1" class="step-line"
                    :class="{ 'completed': index + 1 < currentStep }"></div>
            </div>
        </div>

        <component :is="currentComponent"></component>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import Myestablichment from '../components/step/MyEstablishmentFormPageView.vue';
import Mypublicform from '../components/step/MyPublicFormPageView.vue';
import Platformready from '../components/step/PlatformReadyPageView.vue';

const steps = ref([1, 2, 3]);
const currentStep = ref(1);

const navigateToStep = (step) => {
    currentStep.value = step;
};

const currentComponent = computed(() => {
    switch (currentStep.value) {
        case 1:
            return Myestablichment;
        case 2:
            return Mypublicform;
        case 3:
            return Platformready;
        default:
            return null;
    }
});
</script>

<style>
.main__container {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    padding-bottom: 50px;
    margin-top: 5rem;
    min-height: calc(100dvh - 280px);
}

.step-progress {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step {
    display: flex;
    align-items: center;
    margin-top: 3rem;
}

.step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--light-color-bg2);
    background-color: #fff;
    color: #000;
}

.step-number:hover {
    background-color: rgba(128, 128, 128, 0.211);
    cursor: pointer;
}

.step-number.active-step {
    color: #fff;
    background-color: var(--light-color-bg2);
}

.step-line {
    height: 2px;
    width: 50px;
    background-color: #ccc;
    margin: 0 8px;
}
</style>