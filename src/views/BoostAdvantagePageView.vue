<template>
    <div class="screen__container">
        <div class="bg__circle"></div>
        <div v-if="discount" class="container flex flex-col items-center justify-start screen__content">
            <div class="inline-flex items-start justify-center w-full discount-container">
                <div class="icon__container">
                    <img v-if="icon2Src" :src="icon2Src" :alt="`icon`">
                </div>
                <h1 v-if="discount.name" class="boost__title"><strong>{{ discount.name }}</strong></h1>
                <div class="icon__container">
                    <img v-if="iconSrc" :src="icon2Src" :alt="`icon`">
                </div>
            </div>
            <div v-if="discount" class="inline-flex items-center justify-around w-full discount-content">
                <div v-if="discount.quantity > 0 && moment(discount.expired_at) >= moment()">
                    <h1 v-if="discount.description" class="boost__name">
                        {{ discount.description }}
                    </h1>
                    <!-- <p class="boost__description">
                        test
                    </p> -->
                    <h2 class="boost_quantity">
                        Limited Quantity: <strong class="boost__quantity-nb">{{ discount.quantity }}</strong>
                    </h2>
                    <div style="margin-top: 32px">
                        <h4 class="boost_comment">Don't miss out on this excusive offer!</h4>
                    </div>
                    <div v-if="logo && logo.logo" class="customer__logo">
                        <img :src="logo.logo">
                    </div>
                </div>
                <div v-else style="margin-top: 220px">
                    <h2 class="boost_quantity">
                        This benefit is sold out
                    </h2>
                    <div style="margin-top: 32px">
                        <h4 class="boost_comment">Stay tuned, new benefits are coming soon!</h4>
                    </div>
                    <div v-if="logo && logo.logo" class="customer__logo">
                        <img :src="logo.logo">
                    </div>
                </div>
                <div class="boost__qrcode">
                    <qrcode-vue
                        :value="`${baseurl}/public/${route.params.tag}/establishment/${route.params.id}/feedback?adv=${route.query.q}`"
                        :size="qrSize" level="H" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue';
import QrcodeVue from 'qrcode.vue'
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js";
import services from '@Services/services.js';
import { alertProps } from 'element-plus';
import moment from 'moment';

const baseurl = window.location.origin

const iconSrc = ref(new URL('@/assets/images/boostIcon.svg', import.meta.url).href)
const icon2Src = ref(new URL('@/assets/images/discount.svg', import.meta.url).href)
const appStore = useAppStore();
const route = useRoute();
const logo = ref(null);

const discount = ref(null);

const interval = ref(null);

const qrSize = computed(() => {
    let size = 550
    if (window.innerWidth <= 780) {
        size = 200
    } else if (window.innerWidth <= 1024) {
        size = 320
    } else if (window.innerWidth <= 1440) {
        size = 400
    } else {
        size = 550
    }
    return size
})

const updateInfo = () => {
    interval.value = setInterval(async () => {
        try {
            if (route.query.q) {
                const response = await new Promise((resolve, reject) => {
                    services.get_Record(`/customer/establishments/advantages/quantity?id=${route.query.q}`, (response) => {
                        resolve(response);
                    });
                });

                if (response.status === 200) {
                    discount.value = response.data
                } else {
                    console.error('Error fetching advantage:', response);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }, 10000)
}

onMounted(async () => {
    appStore.isLoading = true;
    try {
        if (route.query.q) {
            const response = await new Promise((resolve, reject) => {
                services.get_Record(`/customer/establishments/advantages/quantity?id=${route.query.q}`, (response) => {
                    resolve(response);
                });
            });

            if (response.status === 200) {
                discount.value = response.data
            } else {
                console.error('Error fetching advantage:', response);
            }
        }
    } catch (e) {
        console.log(e)
    }
    updateInfo();
    appStore.isLoading = false;
})

onBeforeMount(async () => {
    appStore.isLoading = true;
    if (route.params.tag) {
        logo.value = await appStore.getCustomerLogo(route.params.tag)
    }
    appStore.isLoading = false;
});

onBeforeUnmount(() => {
    clearInterval(interval.value)
    interval.value = null
})
</script>
<style>
.screen__container {
    width: 100vw;
    height: auto;
    /* height: 100vh; */
    /* width: 1920px;
    height: 1080px; */
    aspect-ratio: 16/9;
    background: linear-gradient(180deg, rgba(216, 217, 226, 1) 0%, white 100%);
    overflow: hidden;
    position: relative;
    border: red solid 5px;
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
    font-size: 6.5rem;
    color: var(--el-color-primary);
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
    font-family: Montserrat, sans-serif;
    ;
    font-size: 5rem;
    font-weight: 600;
    margin-top: 68px;
    color: var(--color-primary);
}

.boost_quantity {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 5.5rem;
    font-weight: 400;
    margin-top: 108px;
}

.boost__quantity-nb {
    font-family: Montserrat, sans-serif;
    ;
    font-size: 7rem;
    font-weight: 600;
    color: #db0113;
}

.boost__qrcode {
    margin-top: 80px;
    aspect-ratio: 1/1;
    background: transparent;
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.boost_comment {
    font-size: 3rem;
    font-weight: 400;
    font-family: Montserrat, sans-serif;
    ;
    color: var(--color-secondary);
}

.boost__description {
    font-size: 3rem;
    font-weight: 400;
    font-family: Montserrat, sans-serif;
    ;
    color: var(--color-bg2);
}

.customer__logo {
    height: 104px;
    margin-top: 200px;
    align-self: flex-start;
}

.customer__logo img {
    width: auto;
    height: 100%;
}

.discount-content {
    margin-top: 80px;
    gap: 48px
}

@media screen and (min-width: 1441px) {

    .discount-container {
        margin-top: 250px;
        gap: 24px;
    }

    .boost__title {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 6.5rem;
        color: var(--el-color-primary);
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
        font-family: Montserrat, sans-serif;
        ;
        font-size: 5rem;
        font-weight: 600;
        margin-top: 68px;
        color: var(--color-primary);
    }

    .boost_quantity {
        font-family: Montserrat, sans-serif;
        ;
        font-size: 5.5rem;
        font-weight: 400;
        margin-top: 108px;
    }

    .boost__quantity-nb {
        font-family: Montserrat, sans-serif;
        ;
        font-size: 7rem;
        font-weight: 600;
        color: #db0113;
    }

    .boost__qrcode {
        margin-top: 80px;
        aspect-ratio: 1/1;
        background: transparent;
        border-radius: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .boost_comment {
        font-size: 3rem;
        font-weight: 400;
        font-family: Montserrat, sans-serif;
        ;
        color: var(--color-secondary);
    }

    .boost__description {
        font-size: 3rem;
        font-weight: 400;
        font-family: Montserrat, sans-serif;
        ;
        color: var(--color-bg2);
    }

    .customer__logo {
        height: 104px;
        margin-top: 200px;
        align-self: flex-start;
    }

    .customer__logo img {
        width: auto;
        height: 100%;
    }

    .discount-content {
        margin-top: 80px;
        gap: 48px
    }
}

@media screen and (max-width: 1440px) {

    .discount-container {
        margin-top: 110px;
        gap: 24px;
    }

    .boost__title {
        font-size: 3rem;
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
        font-size: 3.5rem;
        margin-top: 40px;

    }

    .boost_quantity {
        font-size: 3.5rem;
        margin-top: 24px;
    }

    .boost__quantity-nb {
        font-size: 3rem;
    }

    .boost__qrcode {
        margin-top: 20px;
    }

    .boost_comment {
        font-size: 1.4rem;
    }

    .boost__description {
        font-size: 1.4rem;
    }

    .customer__logo {
        height: 56px;
        margin-top: 108px;
    }
}

@media screen and (max-width: 1024px) {

    .discount-container {
        margin-top: 68px;
        gap: 24px;
    }

    .boost__title {
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
        font-size: 2.5rem;
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
        margin-top: 48px;
        gap: 24px;
    }

    .boost__title {
        font-size: 2rem;
    }

    .icon__container {
        height: 24px;
        width: auto;
    }

    .icon__container img {
        height: 24px !important;
        width: auto;
    }

    .boost__name {
        font-size: 2rem;
        margin-top: 36px;

    }

    .boost_quantity {
        font-size: 2rem;
        margin-top: 14px;
    }

    .boost__quantity-nb {
        font-size: 2.5rem;
    }

    .boost__qrcode {
        margin-top: 0px;
    }

    .boost_comment {
        font-size: 1rem;
    }

    .boost__description {
        font-size: 1rem;
    }

    .customer__logo {
        height: 48px;
        margin-top: 48px;
    }
}
</style>