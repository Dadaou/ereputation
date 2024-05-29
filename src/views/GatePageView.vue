<template>
    <div v-if="exist" class="feedback__form">
        <div class="feedback">
            <div class="grid gap-0 grid-cols-5">
                <GateMenuComponent v-for="item in categories" :item="item" :key="item.title" @select="openMenu(item)" />
            </div>
            <div class="gate__body">
                <div v-if="category == 'reviews'" class="list__container">
                    <GateLinkComponent v-for="(item, index) in establishmentLink" :item="item" type="Establishment"
                        :key="index" />
                    <GateLinkComponent v-for="(item, index) in staffLinks" :item="item" type="Staff" :key="index" />
                    <GateLinkComponent v-for="(item, index) in unitLinks" :item="item" type="Unit" :key="index" />
                    <GateLinkComponent v-for="(item, index) in platformLinks" :item="item" type="Platform"
                        :key="index" />
                </div>
                <div v-if="category == 'follow'" class="list__container">
                    <GateLinkComponent v-for="(item, index) in followLinks" :item="item" type="Social" :key="index" />
                </div>
                <div v-if="category == 'offers'" class="list__container">
                    <GateLinkComponent v-for="(item, index) in offerLinks" :item="item" type="Offer" :key="index" />
                </div>
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />
</template>
<script setup>
import { ref, computed, onBeforeMount, defineAsyncComponent } from 'vue';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { useAppStore } from "@Stores/app.js"
import GateMenuComponent from '@Components/gate/GateMenuComponent.vue';
import GateLinkComponent from '@Components/gate/GateLinkComponent.vue';


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

const links = ref(null);

const categories = ref([
    { value: "menus", label: "Menus", active: false, icon: "uim:th-large" },
    { value: "reviews", label: "Reviews", active: true, icon: "uil:star" },
    { value: "offers", label: "Offers", active: false, icon: "bi:tags" },
    { value: "info", label: "Infos", active: false, icon: "uil:info-circle" },
    { value: "follow", label: "Follow us", active: false, icon: "uil:heart-alt" }
    
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
        }
    }, true);

    await loadLinks(establishmentTag);

});

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

.list__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 24px;
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