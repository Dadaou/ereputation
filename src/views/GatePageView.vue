<template>
    <div v-if="exist" class="feedback__form">
        <div class="tablet_mobile__head">
            <div class="establishment__info">
                <h1 class="society__name">{{ establishment.name }}</h1>
                <div class="society__category">
                    <i
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                    <span class="ml-2">{{ establishment.category }}</span>
                </div>
                <div class="society__country" v-if="establishment.country != null">
                    <i class="uil uil-map"></i>
                    <span class="ml-2">{{ establishment.country }}</span>
                </div>
                <div class="society__location">
                    <i class="uil uil-location-point"></i>
                    <span class="ml-2">{{ establishment.city }}</span>
                </div>
            </div>
            <div class="photo">
                <div v-if="establishment.url_source !== null" class="establishment__img">
                    <img :src="establishment.url_source" alt="" />
                </div>
                <div v-else role="status"
                    class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div class="feedback">
            <div class="grid gap-0 mt-6 grid-cols-4">
                <GateMenuComponent v-for="item in categories" :item="item" :key="item.title" @select="openMenu(item)" />
            </div>
            <div class="gate__body">
                <div v-if="category == 'reviews'">
                    <div class="review-content" @click="toggleList" :title="appStore.account.brand || ''">
                        <div v-if="appStore.account && appStore.account.logo" class="logo">
                            <img :src="appStore.account.logo">
                        </div>
                        <h4 class="mr-5">{{ appStore.account.name }}</h4>
                    </div>
                    <div v-if="showList" class="card-container">
                        <div class="card-item">
                            <h4><i class="uil uil-link mr-1"></i>Establishment review</h4>
                            <div class="card-item-list">
                                <div v-for="(link, index) in filteredLinks" :key="index">
                                    <div v-if="link.source === 'establishment'">
                                        <a :href="link.value" target="_blank">
                                            <div class="item-name">
                                                {{ link.name }}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-item">
                            <h4><i class="uil uil-chat-bubble-user mr-1"></i>Staff review</h4>
                            <div class="card-item-list">
                                <div v-for="(link, index) in filteredLinks" :key="index">
                                    <div v-if="link.source === 'staff'">
                                        <a :href="link.value" target="_blank">
                                            <div class="item-name">
                                                {{ link.name }}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-item">
                            <h4><i class="uil uil-clipboard-notes mr-1"></i>Service review</h4>
                            <div class="card-item-list">
                                <div v-for="(link, index) in filteredLinks" :key="index">
                                    <div v-if="link.source === 'unit'">
                                        <a :href="link.value" target="_blank">
                                            <div class="item-name">
                                                {{ link.name }}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div v-if="type !== 'reviews'" class="links">
                <div v-for="(link, index) in filteredLinks" :key="index">
                    <a :href="link.value" target="_blank">
                        <div class="item-name">
                            {{ link.name }}
                        </div>
                    </a>
                </div>
            </div> -->
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>
<script setup>
import { ref, computed, onBeforeMount, defineAsyncComponent } from 'vue';
import { ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import { useAppStore } from "@Stores/app.js"
import GateMenuComponent from '@Components/utils/GateMenuComponent.vue';

const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

let exist = ref(true);
const route = useRoute();
const establishmentTag = route.params.id;
const establishment = ref({});
const appStore = useAppStore();
const showList = ref(false);
const category = ref('menus');
let media = [];

const toggleList = () => {
    showList.value = !showList.value;
};

const links = ref([
    { name: "Lien 1", category: "menus", value: "https://example.com/link1" },
    { name: "Lien 2", category: "Follow us", value: "https://example.com/link2" },
    { name: "Lien 3", category: "reviews", value: "https://example.com/link3" },
    { name: "Lien 4", category: "offers", value: "https://example.com/link4" }
]);

const categories = ref([
    { value: "menus", label: "Menus", active: true, icon: "uim:th-large" },
    { value: "follow", label: "Follow us", active: false, icon: "uil:info-circle" },
    { value: "reviews", label: "Reviews", active: false, icon: "uil:star" },
    { value: "offers", label: "Offers", active: false, icon: "bi:tags" }
]);

const openMenu = (item) => {
    categories.value = categories.value.map(v => {
        if (v.value == item.value) {
            v.active = true
            return v
        } else {
            v.active = false
            return v
        }
    })

    category.value = item.value
}

const filteredLinks = computed(() => {
    let data = links.value;

    return data;
});

const loadLinks = async (tag) => {
    const uri = `/get/settings/category?tag=${tag}`
    const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    });

    console.log(response)
    if (response.status == 200) {
        links.value = response.data.links;
    }
};

onBeforeMount(async () => {

    appStore.setCurrentPage({
        title1: "Laissez",
        title2: "vos commentaires",
        icon: "uil-comment-alt"
    });
    // await loadLinks(establishmentTag);
    services.setToken(import.meta.env.VITE_APP_TOKEN);
    await services.get_Record(`establishment/${route.params.id}/media`, (response) => {
        if (response.status == 200) {
            establishment.value = response['data'];
            media.value = response['data'].url_source == null ? [] : response['data'].url_source;
            appStore.setCurrentCustomer({
                name: establishment.value['name'],
                logo: "https://api-dev.nexties.fr/uploads/mv-663b378e246a1.png",
                description: establishment.value['city']
            });
        }
    });
});

const updateType = (value) => {
    type.value = value;
};
</script>
<style scoped>
.feedback__form {
    width: 50%;
    margin: 3rem auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 15px;
    padding-top: 2rem;
}

.gate__body {
    border-radius: 0 0 5px 5px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 8px;
}

.email {
    display: flex;
    flex-direction: column;
}

.author__email span {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
    color: var(--color-primary)
}

.author__email p {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
}

.author__email p b {
    color: var(--color-danger)
}

.author__email i {
    font-size: 15px;
}

.checkbox-container {
    margin: 15px;
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
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
}

.tablet_mobile__head img {
    height: 125px !important;
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
    /* Add a green border when focused */
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

img {
    height: 100%;
}

.checkbox-container div {
    height: 500px;
    overflow-y: auto;
}

.checkbox-container span {
    color: var(--color-danger);
    font-weight: 500;
    cursor: pointer;
}

@media screen and (max-width:1075px) {
    .feedback__form {
        width: 60%;
    }
}

@media screen and (max-width:1024px) {
    .feedback__form {
        position: relative;
        top: 1rem !important;
        width: 70%;
    }
}

@media screen and (max-width:850px) {
    .feedback__form {
        width: 80%;
    }
}

@media screen and (max-width:750px) {
    .feedback__form {
        width: 90%;
    }
}
</style>