<template>
    <div class="main__container" v-if="exist">
        <div class="feedback__form">
            <p> {{ $t("success") }} </p>
            <div class="mt-6" v-if="route.params.share !== 'message'">
                <h2 v-if="links.length > 0">{{ $t("success_text") }}</h2>
                <ul v-if="links.length > 0" class="logoSrc">
                    <li v-for="link in links">
                        <a :href="link.url" target="_blank">
                            <el-tooltip :content="`${$t('success_text')} ${link.name}`" placement="top">
                <img v-if="link.name.toLowerCase().includes('booking')" src="@/assets/images/logo/Booking.svg" alt="Booking" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('camping')" src="@/assets/images/logo/Camping.png" alt="Camping" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('expedia')" src="@/assets/images/logo/Expedia.svg" alt="Expedia" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('google')" src="@/assets/images/logo/Google.svg" alt="Google" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('hotel')" src="@/assets/images/logo/Hotel.svg" alt="Hotel" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('maeva')" src="@/assets/images/logo/Maeva.svg" alt="Maeva" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('opentable')" src="@/assets/images/logo/Opentable.svg" alt="Opentable" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('thefork')" src="@/assets/images/logo/Thefork.svg" alt="Thefork" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('tripadvisor')" src="@/assets/images/logo/Tripadvisor.svg" alt="Tripadvisor" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('trustpilot')" src="@/assets/images/logo/Trustpilot.svg" alt="Trustpilot" width="24" height="24">
                <img v-if="link.name.toLowerCase().includes('yelp')" src="@/assets/images/logo/Yelp.svg" alt="Yelp" width="24" height="24">
            
            </el-tooltip>
                        </a>
                    </li>
                </ul>
                <h2 v-if="socials.length > 0">{{ $t("success_text2") }}</h2>
                <ul v-if="socials.length > 0" class="social">
                    <li v-for="link in socials">
                        <a :href="link.url" target="_blank">
                            <el-tooltip :content="`${$t('success_text2')} ${link.name}`" placement="top">
                <img v-if="link.name.toLowerCase().includes('facebook')" src="@/assets/images/logo/Facebook.svg" alt="Facebook" >
                <img v-if="link.name.toLowerCase().includes('instagram')" src="@/assets/images/logo/Instagram.svg" alt="Instagram" >
                <img v-if="link.name.toLowerCase().includes('twitter')" src="@/assets/images/logo/Twitter.svg" alt="Twitter" >
                <img v-if="link.name.toLowerCase().includes('youtube')" src="@/assets/images/logo/Youtube.svg" alt="Youtube" >
                <img v-if="link.name.toLowerCase().includes('tiktok')" src="@/assets/images/logo/Tiktok.svg" alt="Tiktok" >              
                <Icon icon="logos:linkedin-icon" width="1.6rem" height="1.6rem"
                 v-if="link.name.toLowerCase().includes('linkedin')"></Icon>    
                            </el-tooltip>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>

<script setup>
import { ref, onBeforeMount, defineAsyncComponent, onMounted, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { Icon } from '@iconify/vue';
import { useCompanyStore } from "@Stores/company.js";
import { useRoute } from 'vue-router';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import services from '@Services/services.js';
import 'element-plus/es/components/tooltip/style/css';
import { ElTooltip } from 'element-plus'

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

const { t } = useI18n();

const page = ref({

});
const links = ref([])
const socials = ref([])
const route = useRoute();
const companyStore = useCompanyStore();
const userStore = useUserStore();
const appStore = useAppStore();

onBeforeMount(async () => {

    appStore.setCurrentPage({
        title1: t("feedback.title1"),
        title2: t("feedback.title2"),
        icon: "uil-comment-alt"
    });

    if (userStore.authenticated == null) services.setToken(import.meta.env.VITE_APP_TOKEN);
    links.value = await companyStore.loadLinksByEstablishment(route.params.etab)
    console.log(links.value)
    socials.value = links.value.filter((link) => {
        return link.category == 'Social'
    })

    links.value = links.value.filter((link) => {
        return link.category == 'Platform'
    })
    console.log(links.value)
})
onMounted(() => {
    /** Charger le titre par defaut */
    page.value = {
        title1: t("thanks_title1"),
        title2: t("thanks_title2"),
        icon: "uil-comment-alt",
    };
})



watch(() => {
    /** Mettre le titre en watch */
    appStore.setCurrentPage({
        title1: t("feedback.title1"),
        title2: t("feedback.title2"),
        icon: "uil-comment-alt"
    });
});

</script>

<style scoped>
p {
    /* text-align: center;*/
    font-weight: 500;
}

.logoSrc{
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 2%;
    margin-bottom: 2%;
   
}
.social{
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 2%;
}

.link li {
    /* border: 1px solid black;*/
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 500;
    color: white;
   
}

.link li:hover {
    background: var(--light-color-bg2);
}

h2 {
    /*text-align: center;*/
    font-weight: 500;
    font-size: 14px;
    /*color: var(--color-danger);*/
    /* font-family: Arial, sans-serif; */
}

.socials {
    display: flex;
    gap: 1rem;
    align-items: center;
    /* justify-content: center;*/
    margin-top: 1rem;
}

.feedback__form {
    width: 50%;
    margin: 3rem auto;
    /* box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;*/
    /* border: 1px solid var(--light-color-bg2);*/
    border-radius: 5px;
    padding: 15px;
    padding-top: 2rem;
}

input {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input,
textarea {
    caret-color: var(--light-color-bg2);
}

.feedback__text:hover {
    border: 1px solid var(--light-color-bg2);
}

.feedback {
    width: 100%;
}

.tablet_mobile__head {
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 100%;
    border-radius: 5px;
    font-size: 14px;
}

.feedback__form h1 {
    font-size: 17px;
    color: var(--color-primary);
    font-weight: 600;
}

.feedback__form h3 {
    font-size: 14px !important;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--color-bg2);
}


.tablet_mobile__head span {
    font-weight: 500;
    color: var(--color-bg2);
}

i {
    color: var(--color-danger);
}

input:hover {
    border: 1px solid rgb(185, 185, 185) !important;
}

input:focus {
    border-color: transparent !important;
}

.photo {
    flex-basis: 190px;
}

.photo div {
    height: 100%;
}

.photo img {
    height: 100%;
    width: 100%;
}

.staff__card {
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
    flex-basis: 500px;
    flex-grow: 1;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
}

.staff__card h5 {
    color: var(--color-primary);
}

.uil-mars {
    color: blue;
}

.uil-venus {
    color: pink;
}

.staff__card span {
    font-size: 14px;
    color: var(--color-bg2);
}

span.label {
    color: var(--color-bg1);
    font-size: 14px;
}

@media screen and (max-width:1075px) {
    .feedback__form {
        width: 60%;
    }
}

@media screen and (max-width:1024px) {
    .feedback__form {
        position: relative;
        /*top: 10.5rem !important;*/
        width: 70%;
    }
}

@media screen and (max-width:850px) {
    .feedback__form {
        width: 80%;
        /*top:0rem !important;*/
    }
}

@media screen and (max-width:750px) {
    .feedback__form {
        width: 90%;
    }
}
</style>