<template>
    <div class="screen__container">
        <div class="container flex flex-col items-center justify-start">
            <div class="inline-flex items-start justify-center w-full" style="margin-top: 100px; gap: 24px;">
                <div class="icon__container">
                    <img v-if="icon2Src" :src="icon2Src" :alt="`icon`">
                </div>
                <h1 class="boost__title"><strong>Happy Hour</strong></h1>
                <div class="icon__container">
                    <img v-if="iconSrc" :src="icon2Src" :alt="`icon`">
                </div>
            </div>
            <div class="inline-flex items-center justify-around w-full" style="margin-top: 20px; gap: 24px">
                <div>
                    <h1 class="boost__name">
                        Buy 1 Drink, Get 1 Free!
                    </h1>
                    <h2 class="boost_quantity">
                        Limited Quantity: <strong class="boost__quantity-nb">5</strong>
                    </h2>
                    <div style="margin-top: 32px">
                        <h4 class="boost_comment">Don't miss out on this excusive offer!</h4>
                    </div>
                </div>
                <div class="boost__qrcode">
                    <qrcode-vue :value="`/public/discount/validation/`" :size="400" level="H" />
                </div>

            </div>
            <div v-if="logo && logo.logo" class="customer__logo">
                <img :src="logo.logo">
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import QrcodeVue from 'qrcode.vue'
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js";

const iconSrc = ref(new URL('@/assets/images/boostIcon.svg', import.meta.url).href)
const icon2Src = ref(new URL('@/assets/images/discount.svg', import.meta.url).href)
const appStore = useAppStore();
const route = useRoute();
const logo = ref(null)

onBeforeMount(async () => {
    if (route.params.tag) {
        logo.value = await appStore.getCustomerLogo(route.params.tag)
    }
});
</script>
<style>
.screen__container {
    /* width: 100%; */
    /* height: 100%; */
    width: 1920px;
    height: 1080px;
    aspect-ratio: 16/9;
    background: linear-gradient(180deg, rgba(216, 217, 226, 1) 0%, white 100%);
    overflow: scroll;
    /* border: solid 1px red; */
}

.boost__title {
    font-family: brush script mt, cursive;
    font-size: 8rem;
    color: var(--color-bg2);
}

.icon__container {
    height: 80px;
    width: auto;
}

.icon__container img {
    height: 80px !important;
    width: auto;
}

.boost__name {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 4rem;
    font-weight: 600;
    margin-top: 24px;
    color: var(--color-primary);
}

.boost_quantity {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 4rem;
    font-weight: 400;
    margin-top: 14px;
}

.boost__quantity-nb {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 5rem;
    font-weight: 600;
    color: #db0113;
}

.boost__qrcode {
    width: 640px;
    aspect-ratio: 1/1;
    background: white;
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.boost_comment {
    font-size: 2rem;
    font-weight: 400;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--color-secondary);
}

.customer__logo {
    height: 104px;
    margin-left: 48px;
    align-self: flex-start;
}

.customer__logo img {
    width: auto;
    height: 100%;
}

/* .subscription-page-header .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.subscription-page-header .login-link {
    color: #111;
    font-weight: 600;
}

.subscription-page-header .login-link:hover {
    text-decoration: underline;
} */
</style>