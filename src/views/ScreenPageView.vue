<template>
    <div v-if="Object.keys(screenDetails).length" class="screen__container">
        <div class="bg__circle"></div>
        <div v-for="(screen, id) in screenDetails" :key="id"
            class="container flex flex-col items-center justify-start screen__content">
            <div class="inline-flex items-start justify-center w-full discount-container">
                <div class="icon__container">
                    <img v-if="icon2Src" :src="icon2Src" :alt="`icon`">
                </div>
                <h1 class="boost__title"><strong>{{ screen.name }}</strong></h1>
                <div class="icon__container">
                    <img v-if="iconSrc" :src="icon2Src" :alt="`icon`">
                </div>

            </div>
            <div v-html="screen.coreProcessed"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import services from '@Services/services.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const screenDetails = reactive({});
const iconSrc = ref(new URL('@/assets/images/boostIcon.svg', import.meta.url).href)
const icon2Src = ref(new URL('@/assets/images/discount.svg', import.meta.url).href)


const loadScreenDetails = (id) => {
    services.get_Record(`screentemplates/1`, (response) => {
        if (response && response.status === 200) {
            const data = response.data;
            screenDetails[id] = {
                ...data,
                coreProcessed: processCore(data.core, data)
            };
        } else {
            console.error('Error loading screen details:', response);
        }
    }, false, false);
};


onMounted(() => {
    const screenId = route.params.screen;
    if (screenId) {
        loadScreenDetails(screenId);
    }
});

const processCore = (core, screen) => {
    return core
        .replace('{{textgreeting}}', screen.name)
        .replace('{{text1}}', screen.text1 || '')
        .replace('{{text2}}', screen.text2 || '')
        .replace('{{text3}}', screen.text3 || '');
};
</script>

<style>
.screen__container {
    width: 100vw;
    /* height: 100vh; */
    /* height: 100vh; */
    /* width: 1920px;
    height: 1080px; */
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(180deg, rgba(216, 217, 226, 1) 0%, white 40%);
    overflow: hidden;
    position: relative;
    display: flex;

}

.bg__circle {
    position: absolute;
    background: white;
    border-radius: 100%;
    top: -400px;
    right: -1900px;
    width: 3000px;
    height: 3000px;
    z-index: 0;
}

.screen__content * {
    z-index: 9;

}

.boost__title {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 4rem;
    color: var(--el-color-primary);
}

.icon__container {
    height: 50px;
    width: auto;
}

.icon__container img {
    height: 50px !important;
    width: auto;
}

.boost__name {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 3.5rem;
    font-weight: 600;
    color: var(--color-primary);
}

.boost_quantity {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 3rem;
    font-weight: 400;

}

.boost_sold {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 3rem;
    font-weight: 400;

}

.boost__quantity-nb {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 4rem;
    font-weight: 600;
    color: #db0113;
}

.boost__qrcode {
    margin-top: 20px;
    aspect-ratio: 1/1;
    background: transparent;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.boost_comment {
    font-size: 2rem;
    font-weight: 400;
    font-family: Montserrat, sans-serif;
    ;
    color: var(--color-secondary);
}

.boost_stay {
    font-size: 1.5rem;
    font-weight: 400;
    font-family: Montserrat, sans-serif;
    ;
    color: var(--color-secondary);
}

.boost__description {
    font-size: 2rem;
    font-weight: 400;
    font-family: Montserrat, sans-serif;
    ;
    color: var(--color-bg2);
}

.customer__logo {
    height: 80px;
    align-self: flex-start;
}

.customer__logo img {
    width: auto;
    height: 100%;
}

@media screen and (max-width: 1980px) {
    .discount-container {
        gap: 24px;
    }

    .boost__title {
        margin-top: 50px;
        font-size: 5rem;

    }

    .icon__container {
        height: 40px;
        width: auto;
    }

    .icon__container img {
        margin-top: 60px;
        height: 70px !important;
        width: auto;
    }

    .boost__name {
        margin-top: 40px;
        font-size: 3.75rem;

    }

    .boost_quantity {
        margin-top: 18px;
        font-size: 3rem;
    }

    .boost_sold {
        margin-right: 200px;
        margin-top: -150px;
        font-size: 3.8rem;
    }

    .boost__quantity-nb {
        font-size: 4rem;
    }

    .boost__qrcode {
        margin-right: -100px;
        margin-top: 100px;
    }

    .boost_comment {
        margin-top: 10px;
        font-size: 2.1rem;
    }

    .boost_stay {
        margin-bottom: 10px;
        font-size: 2.1rem;
    }

    .boost__description {
        font-size: 1.4rem;
    }

    .customer__logo {
        height: 100px;
        margin-top: 60px;
    }
}

@media screen and (max-width: 1440px) {
    .discount-container {
        gap: 24px;
    }

    .boost__title {
        margin-top: 40px;
        font-size: 3rem;

    }

    .icon__container {
        height: 40px;
        width: auto;
    }

    .icon__container img {
        margin-top: 130%;
        height: 40px !important;
        width: auto;
    }

    .boost__name {
        margin-top: 40px;
        font-size: 3rem;

    }

    .boost_quantity {
        margin-top: 18px;
        font-size: 2.5rem;
    }

    .boost_sold {
        margin-top: -150px;
        font-size: 2.5rem;
    }

    .boost__quantity-nb {
        font-size: 3rem;
    }

    .boost__qrcode {
        margin-right: -30px;
        margin-top: 60px;
    }

    .boost_comment {
        margin-top: 10px;
        font-size: 1.4rem;
    }

    .boost_stay {
        margin-bottom: 10px;
        font-size: 1.4rem;
    }

    .boost__description {
        font-size: 1.4rem;
    }

    .customer__logo {
        height: 60px;
        margin-top: 60px;
    }
}

@media screen and (max-width: 1024px) {

    .discount-container {
        margin-top: 68px;
        gap: 24px;
    }

    .boost__title {
        margin-top: 38px;
        font-size: 2.5rem;
    }

    .icon__container {
        height: 26px;
        width: auto;
    }

    .icon__container img {
        height: 26px !important;
        width: auto;
    }

    .boost__name {
        font-size: 2rem;
        margin-top: 40px;

    }

    .boost_quantity {
        font-size: 2.5rem;
        margin-top: 24px;
    }

    .boost__quantity-nb {
        font-size: 3rem;
    }

    .boost__qrcode {

        margin-top: 20px;
    }

    .boost_comment {
        font-size: 1.2rem;
    }

    .boost__description {
        font-size: 1.2rem;
    }

    .customer__logo {
        height: 48px;
        margin-top: 48px;
    }
}

@media screen and (max-width: 768px) {

    .discount-container {
        margin-top: 68px;
        gap: 24px;
    }

    .boost__title {
        margin-top: 20px;
        font-size: 2rem;
    }

    .icon__container {
        height: 24px;
        width: auto;
    }

    .icon__container img {
        margin-top: 120%;
        height: 24px !important;
        width: auto;
    }

    .boost__name {
        margin-left: 16px;
        font-size: 2rem;
        margin-top: 36px;

    }

    .boost_quantity {
        margin-left: 16px;
        font-size: 1.5rem;
        margin-top: 14px;
    }

    .boost__quantity-nb {
        font-size: 2rem;
    }

    .boost__qrcode {
        margin-right: 20px;
        margin-top: 30px;
    }

    .boost_comment {
        margin-left: 16px;
        font-size: 0.9rem;
    }

    .boost__description {
        margin-left: 16px;
        font-size: 1rem;
    }

    .customer__logo {
        margin-left: 16px;
        height: 48px;
        margin-top: 28px;
    }
}
</style>
