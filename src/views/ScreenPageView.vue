<template>
    <div class="screen__container">
        <div v-if="!stayTuned" style="background: white;" v-html="core"></div>
        <div v-else class="sreen__stay-tuned">
            <span>The offers will be available again soon.</span>
            <span>Stay tuned!</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, inject, computed, onBeforeUnmount } from 'vue';
import { useQrStore } from "@Stores/qrtemplate.js";
import services from '@Services/services.js';
import { useRoute } from 'vue-router';
import QRCode from 'qrcode';
import moment from 'moment';

const route = useRoute();
const qrStore = useQrStore();
const app_url = inject('app_url')
const core = ref('');
const interval = ref(null);
const slideInterval = ref(null);
const screen = ref(null);
const stayTuned = ref(false);

const qrSize = computed(() => {
    let size = 610
    if (window.innerWidth <= 780) {
        size = 240
    } else if (window.innerWidth <= 1024) {
        size = 440
    } else if (window.innerWidth <= 1440) {
        size = 510
    } else if (window.innerWidth <= 1980) {
        size = 660
    } else {
        size = 610
    }
    return size
})

const loadScreenDetails = () => {
    services.get_Record(`customer/screens/templates?tag=${route.params.tag}&id=${route.params.screen}`, (response) => {
        if (response && response.status === 200) {
            screen.value = response.data;

        } else {
            console.error('Error loading screen details:', response);
        }
    }, false, false);
};

const isCurrentAdvantage = (obj) => {

    // Obtenir le jour actuel (0 pour dimanche, 6 pour samedi)
    const today = new Date().getDay();

    // Créer un tableau qui mappe les jours de la semaine aux attributs d0 à d6
    const daysAllowed = [
        obj.d0, // Dimanche
        obj.d1, // Lundi
        obj.d2, // Mardi
        obj.d3, // Mercredi
        obj.d4, // Jeudi
        obj.d5, // Vendredi
        obj.d6  // Samedi
    ];

    // Vérifier si le jour actuel est activé (true) dans l'objet
    if (!daysAllowed[today]) {
        return false;
    }

    // Obtenir la date actuelle
    const dateNow = moment();

    // Convertir les chaînes de dates de l'objet en objets Date

    let dateFrom = moment().subtract(1, 'days');
    let dateTo = moment().add(1, 'days');

    if (obj.date_from) {
        dateFrom = moment(new Date(obj.date_from).toDateString())
    } else if (obj.hour_from || obj.minute_from || obj.seconde_from) {
        dateFrom = moment();
    }

    if (obj.date_to) {
        dateTo = moment(new Date(obj.date_to).toDateString())
    } else if (obj.hour_to || obj.minute_to || obj.seconde_to) {
        dateTo = moment();
    }

    let expiredAt = moment(new Date(obj.adv_expired_at).toDateString() + " " + obj.hour_to || 23 + ":" + obj.minute_to || 59 + ":" + obj.seconde_to || 59)

    if (dateNow > expiredAt) {
        return false;
    }

    if (obj.hour_from) {
        dateFrom.set({ hour: obj.hour_from })
    } else {
        dateFrom.set({ hour: moment().hour() })
    }

    if (obj.minute_from) {
        dateFrom.set({ minute: obj.minute_from })
    } else {
        dateFrom.set({ minute: 0 })
    }

    if (obj.seconde_from) {
        dateFrom.set({ second: obj.seconde_from })
    } else {
        dateFrom.set({ second: 0 })
    }

    if (obj.hour_to) {
        dateTo.set({ hour: obj.hour_to })
    } else {
        dateTo.set({ hour: moment().hour() })
    }

    if (obj.minute_to) {
        dateTo.set({ minute: obj.minute_to })
    } else {
        dateTo.set({ minute: 59 })
    }

    if (obj.seconde_to) {
        dateTo.set({ second: obj.seconde_to })
    } else {
        dateTo.set({ second: 59 })
    }

    // Vérifier si l'heure actuelle est dans l'intervalle
    return dateNow.isBetween(dateFrom, dateTo)
}

const setCurrentAdvantage = () => {
    if (screen.value && screen.value.advantages.length > 0) {
        const currentAdvantages = screen.value.advantages.filter(adv => isCurrentAdvantage(adv))
        if (currentAdvantages.length > 0) {
            stayTuned.value = false;
            generateCore(screen.value.screentemplates.core, screen.value.screentemplates, currentAdvantages[0]);
        } else {
            stayTuned.value = true;
        }
    } else if (screen.value && screen.value.advantages.length == 0) {
        stayTuned.value = true;
    } else {
        stayTuned.value = false;
    }
}


onMounted(() => {
    const screenId = route.params.screen;
    if (screenId) {
        loadScreenDetails(screenId);
    }

    setCurrentAdvantage();

    interval.value = setInterval(() => {
        setCurrentAdvantage()
    }, 2000); // Intervalle de 1000 ms (1 seconde)

});

onBeforeUnmount(() => {
    if (interval.value) {
        clearInterval(interval.value);
    }
    if (slideInterval.value) {
        clearInterval(slideInterval.value);
    }
})

const generateCore = async (_core, _screen, _adv) => {
    qrStore.setQrCodeValue(`${app_url.value}/public/${route.params.tag}/establishment/${route.params.id}/feedback?adv=${_adv.adv_id}`)
    let tmp = _core;
    tmp = tmp.replace('{{textgreeting}}', "");
    tmp = tmp.replace('{{advantage_name}}', _adv.adv_name || '');
    // tmp = tmp.replace('{{text1}}', _screen.text1 || '');
    if (_adv.available == 'available') {
        tmp = tmp.replace('{{text1}}', _screen.text1 || '');
        tmp = tmp.replace('{{advantage_limit}}', _adv.adv_advantage_limit || '');
    } else if (_adv.available == 'infinity') {
        tmp = tmp.replace('{{text1}}', _screen.text1 || '');
        tmp = tmp.replace('Limited Quantity :', '');
        tmp = tmp.replace('{{advantage_limit}}', '');
    } else {
        tmp = tmp.replace('{{text1}}', "<p style=\"text-align:center;font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;font-size: 3rem;\">This benefit is sold out</p>");
        tmp = tmp.replace('Limited Quantity :', '');
        tmp = tmp.replace('{{advantage_limit}}', '');
    }

    tmp = tmp.replace('{{text2}}', _screen.text2 || '');
    tmp = tmp.replace('{{text3}}', _screen.text3 || '');
    tmp = tmp.replace('{{textclosing}}', "");
    const qrData = qrStore.qrcodeValue; // Data you want to encode
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const qrCanvas = await QRCode.toCanvas(canvas, qrData, { width: qrSize.value, errorCorrectionLevel: 'H' });
    const qrCodeDataURL = qrCanvas.toDataURL('image/png', 1.0); // Convert to base64
    tmp = tmp.replace('{{qrcodeimg}}', `<img src="${qrCodeDataURL}" style="width: 100%;">`)


    tmp = tmp.replace('{{logo}}', `<img src="data:image/png;base64,${_screen.logo_base64}" >`);
    core.value = tmp;
}





</script>

<style>
.screen__container {
    width: 100%;
}

.sreen__stay-tuned {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
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
    font-size: 3.5rem;
    font-weight: 600;
    color: var(--color-primary);
}

.boost_quantity {
    font-size: 3rem;
    font-weight: 400;

}

.boost_sold {
    font-size: 3rem;
    font-weight: 400;

}

.boost__quantity-nb {
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
    color: var(--color-secondary);
}

.boost_stay {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--color-secondary);
}

.boost__description {
    font-size: 2rem;
    font-weight: 400;
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
