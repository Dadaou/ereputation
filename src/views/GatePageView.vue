<template>
    <div v-if="exist" class="feedback__form">
        <div class="feedback">
            <div v-for="(item, index) in useCategories" :key="index">
                <button class="accordion gate__menu" :class="[item.active ? 'clicked' : '']" @click="toggleMenu(item)">
                    <span class="icon-container">
                        <Icon :icon="item.icon" width="25px" />
                    </span>
                    <span>{{ item.label }}</span>
                </button>
                <div class="panel" v-if="item.active">
                    <div class="whatsapplink">
                        <a v-if="establishment.whatsapp" :href="`${establishment.whatsapp}`" target="_blank">
                        <i class="fa fa-whatsapp"></i>
                        </a>
                    </div>
                    <div v-if="category == 'reviews'"
                        class="list__container grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in establishmentLink"
                            :item="element" type="Establishment" :key="index" />
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in staffLinks"
                            :item="element" type="staff" :key="index" />
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in unitLinks"
                            :item="element" type="Unit" :key="index" />
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in platformLinks"
                            :item="element" type="Platform" :key="index" />
                    </div>
                    <div v-if="category == 'follow'"
                        class="list__container grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12">
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in followLinks"
                            :item="element" type="Social" :key="index" />
                    </div>
                    <div v-if="category == 'offers'"
                        class="list__container grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12">
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in offerLinks"
                            :item="element" type="Offer" :key="index" />
                    </div>
                    <div v-if="category == 'infos'"
                        class="list__container grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12">
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in infoLinks"
                            :item="element" type="Info" :key="index" />
                    </div>
                    <div v-if="category == 'menus'"
                        class="list__container grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12">
                        <GateLinkComponent @click="handleClick(element,category)" v-for="(element, index) in menuLinks"
                            :item="element" type="Menu" :key="index" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>
<script setup>
import { ref, computed, onBeforeMount, defineAsyncComponent, onMounted } from 'vue';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { useAppStore } from "@Stores/app.js"
import GateLinkComponent from '@Components/gate/GateLinkComponent.vue';
import { Icon } from '@iconify/vue';


const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

let exist = ref(true);
const route = useRoute();
const establishmentTag = route.params.id;
const establishment = ref({});
const appStore = useAppStore();
const category = ref('reviews');
let media = [];
const baseurl = window.location.origin;
const establishement = ref(null)
const links = ref(null);

const categories = ref([
    { value: "menus", label: "Menus", active: false, icon: "uim:th-large" },
    { value: "reviews", label: "Reviews & Feedbacks", active: false, icon: "uil:star" },
    { value: "offers", label: "Offers", active: false, icon: "bi:tags" },
    { value: "infos", label: "Infos", active: false, icon: "uil:info-circle" },
    { value: "follow", label: "Follow us", active: false, icon: "uil:heart-alt" }
]);

const useCategories = computed(() => {
    /*if (links.value && links.value['category'] && links.value['category'] != 'Restaurant') {
        return categories.value.filter(v => v.value != "menus")
    }*/
    return categories.value
})




const handleClick = async  (element,category) => {
    const visitorId = localStorage.getItem('visitId');
    const vistorData = {
        "visitor_id": visitorId,
        "click_label": category,
        "click_source": "gates",
        "click_label_option": element.label + " " + "logo",
    }
    const response = await new Promise((resolve) => {
        services.createActionVisitor(vistorData, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        console.log("ajout visitor fait");
        console.log(response.data)
    }
    if (element.document) {
        window.open(element.document, '_blank');
    } else if (element.href) {
        window.open(element.href, '_blank');
    } else {
        console.log('No valid URL found in element');
    }
};

const toggleMenu = (item) => {
    category.value = item.value
    categories.value = categories.value.map(v => {
        if (v.value == item.value) {
            v.active = !item.active
            return v
        } else {
            v.active = false
            return v
        }
    })
}

const loadLinks = async (tag) => {
    const uri = `public/get/settings/section?tag=${tag}`
    const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    }, true);

    if (response.status == 200) {
        links.value = response.data;
    }
};

const establishmentLink = computed(() => {
    if (links.value) {
        return links.value['Establishment'].map((v) => {
            return {
                label: v["label"],
                href: `${baseurl}${v['href']}`
            }
        })
    }
    return []
})

const staffLinks = computed(() => {
    if (links.value) {
        return links.value['Staff'].map((v) => {
            return {
                label: v["label"],
                href: `${baseurl}${v['href']}`
            }
        })
    }
    return []
})

const unitLinks = computed(() => {
    if (links.value) {
        return links.value['Unit'].map((v) => {
            return {
                label: v["label"],
                href: `${baseurl}${v['href']}`
            }
        })
    }
    return []
})

const platformLinks = computed(() => {
    if (links.value) {
        return links.value['Platform']
    }
    return []
})

const followLinks = computed(() => {
    if (links.value) {
        return links.value['Social']
    }
    return []
})

const offerLinks = computed(() => {
    if (links.value) {
        return links.value['Offers']
    }
    return []
})

const infoLinks = computed(() => {
    if (links.value) {
        return links.value['Infos']
    }
    return []
})

const menuLinks = computed(() => {
    if (links.value) {
        return links.value['Menus']
    }
    return []
})

onBeforeMount(async () => {
    await services.get_Record(`public/establishment/${route.params.id}/media`, (response) => {
        if (response.status == 200) {
            establishment.value = response['data'];
            media.value = response['data'].url_source == null ? [] : response['data'].url_source;

            appStore.setCurrentPage({
                title1: "",
                title2: establishment.value['name'],
                icon: "uil-estate"
            });
            appStore.setEstablishement(response["data"])
        }
    }, true);

    await loadLinks(establishmentTag);
});

onMounted(() => {
    try {
        if (window.FingerprintApp && window.FingerprintApp.default && typeof window.FingerprintApp.default.main === 'function') {
            window.FingerprintApp.default.main();
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'exécution de Fingerprint :", error);
    }
})

</script>
<style scoped>
.whatsapplink .fa-whatsapp  {
    font-size: 200%;
    padding-top: 20px;
    color: rgb(31, 218, 31);
}
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

.list__container {
    margin-block: 16px;
    display: grid;
    gap: 12px;
}

.feedback__form {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding: 0;
}

.gate__body {
    box-shadow: none;
    padding: 8px;
}

.accordion {
    cursor: pointer;
    padding: 18px;
    width: 100%;
    text-align: left;
    outline: none;
    transition: 0.4s;
}

.panel {
    padding: 0 18px;
    background-color: #f9f9f9;
    overflow: hidden;
}

.panel a {
    width: 10px;
    background-color: #f9f9f9;
    overflow: hidden;
}
.gate__menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    /* height: 60px; */
    border-radius: 5px 5px 0 0;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
    cursor: pointer;
    padding: 24px;
    gap: 24px;
}

.gate__menu span {
    font-size: 1rem;
    color: #333;
    font-weight: 600;
}

.gate__menu .clicked {
    border-left: 1px solid var(--color-primary);
}

.clicked span {
    color: var(--color-danger) !important;
}

.gate__menu .icon-container {
    padding: auto;
    border: var(--color-primary) solid 1px;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
}
</style>