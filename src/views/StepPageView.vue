<template>
    <div class="main__container-bg">
        <div class="main__container">

            <div class="step-progress">

                <div v-for="(item, index) in stepRoute" :key="item.step" class="step">

                    <RouterLink :to="{ name: item.name }" class="step-number">
                        {{ item.step }}
                    </RouterLink>

                    <div v-if="index < stepRoute.length - 1" class="step-line"></div>
                </div>

            </div>

            <div>
                <RouterView></RouterView>
            </div>

        </div>
    </div>

</template>

<script setup>
import { onMounted } from 'vue';
import services from '@Services/services.js';
import { onBeforeUnmount } from 'vue';

const stepRoute = [
    { step: 1, name: 'firstStep' },
    { step: 2, name: 'secondStep' },
    { step: 3, name: 'thirdStep' },
]

onMounted(() => {
    services.mountChatWidget()
})

onBeforeUnmount(() => {
    services.unmountChatWidget()
})
</script>

<style scoped>
.main__container-bg {
    background: url("@/assets/images/fond.svg");
    /* margin-block: 80px 0 !important; */
    padding-inline: 4rem;
    background-position: top left;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 70vh;
}

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
    /*margin-top: 3rem;*/
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

.step-line {
    height: 2px;
    width: 60px;
    background-color: #ccc;
    margin-left: 7em;
}

.router-link-active {
    color: #fff;
    background-color: var(--light-color-bg2);
}
</style>
<style>
    footer {
    margin-top: 0 !important;
}
</style>