<template>
    <div class="main__container">
        <div class="container client__container ">
            <div class="header">
                <div class="header_navigation">
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenAdvantage', params: { tag: tag } }">
                        <Icon :icon="'uil:bill'" width="26"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenPartnership', params: { tag: tag } }">
                        <Icon :icon="'lucide:handshake'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenDiscountCoupon', params: { tag: tag } }">
                        <Icon :icon="'ic:outline-discount'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenContact', params: { tag: tag } }">
                        <Icon :icon="'uil:envelope'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenMyQrcode', params: { tag: tag } }">
                        <Icon :icon="'uil:qrcode-scan'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'LeadgenMyScreen', params: { tag: tag } }">
                        <Icon :icon="'uil:presentation'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink class="search__icon" :to="{ name: 'Analytic', params: { tag: tag } }">
                        <Icon :icon="'uim:chart-pie'" width="25"></Icon>
                    </RouterLink>
                </div>
                <div class="toggle-switch" :class="{ 'active': isActiveLeadgen }">
                    <div class="toggle-option" @click="handleToggleErep">E-Rep</div>
                    <div class="toggle-line"></div>
                    <div class="toggle-option" :class="{ 'selected': isActiveLeadgen }" @click="handleToggleLeadgen">
                        Lead-Gen
                    </div>
                </div>

                <button
                    v-if="userStore.user.partner && userStore.user.roles.includes('ROLE_PARTNER') && route.name !== 'CustomersList'"
                    @click="backToCustomer">
                    <i class="uil uil-arrow-left"></i>Back</button>
            </div>
            <RouterView />
        </div>
    </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useRouter, useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import { useCompanyStore } from "@Stores/company.js";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const tag = inject("tag")
const companiesStore = useCompanyStore();
const establishments = ref([]);
const customerTag = inject('tag');
const dataLoading = ref(true);

const page = ref({
    title1: "",
    title2: "Home",
    icon: "uil-estate",
});

const backToCustomer = () => {
    router.push({ name: "CustomersList" })
};

const show = computed(() => {
    let routeName = ['LeadgenAdvantage', 'LeadgenPartnership', 'LeadgenDiscountCoupon', 'LeadgenContact', 'LeadgenMyQrcode', 'LeadgenMyScreen', 'Analytic', undefined];
    return routeName.includes(route.name)
});

onMounted(async () => {
    dataLoading.value = true;
    if (userStore.user) {
        companiesStore.getEstablishments(customerTag.value).then((data) => {
            establishments.value = data;
            dataLoading.value = false;
        })
    }
});


const isActiveLeadgen = ref(true);

const handleToggleErep = () => {
    router.push({ name: 'EstablishmentList', params: { tag: customerTag.value } })
        .catch(err => console.error(err));

}

const handleToggleLeadgen = () => {
    router.push({ name: 'LeadgenAdvantage', params: { tag: customerTag.value } })
        .catch(err => console.error(err));
}
</script>
<style scoped>
h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--color-primary);
    position: absolute;
    top: 50px;
}

.header {
    display: flex;
    justify-content: space-between;
}

.header button {
    font-weight: 500;
    font-size: 14px;
    padding: 0px 10px;
    border-radius: 2px;
    transition: var(--transition)
}

.header button:hover {
    color: var(--color-secondary);
}



.establishment__link label,
.establishment__link {
    cursor: pointer !important;
}

.first {
    border-right: 2px solid var(--light-color-bg1)
}

.client__container {
    position: relative;
    top: 5rem;
    /* height: inherit;*/
    display: flex;
    gap: 1rem;
    /* width: 50%; */
    width: var(--container-width-lg);
    flex-direction: column;
    margin-bottom: 20px;
}

.search__icon i {
    font-size: 30px;
    color: var(--color-danger);
}

.search__icon .line {
    font-size: 30px;
    background-color: var(--color-bg2);
    height: 2px;
    width: 40px;
}

.client__container__head {
    font-size: 19px;
    color: var(--color-bg2);
    transform: var(--transition);
}

.client__container__head div,
.client__container__head span {
    font-size: 15px;
    font-weight: bold;
}

.society__list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-self: center;
    transform: var(--transition)
}

.app__message p {
    margin: 15px auto;
}

.app__message button {
    border: 1px solid var(--color-danger);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 0px 6px;
    color: var(--color-danger);
}

.app__message button:hover {
    background-color: var(--color-danger);
    color: white;
}

.list__actions button:hover {
    background-color: var(--color-primary);
}

.header_navigation {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    gap: 15px;
}

.search__icon {
    text-decoration: none;
    color: #333;
    margin: 0 5px;
    transition: color 0.3s ease;
}

.search__icon:hover {
    color: var(--color-danger);
}

.search__icon.router-link-exact-active {
    color: var(--color-danger);
}

.main__container {
    margin-top: 20px;
}

@media screen and (max-width: 600px) {
    .header_navigation {
        padding: 5px 10px;
    }

    .search__icon {
        margin: 5px;
    }
}

@media screen and (max-width:1024px) {
    .client__container {
        width: var(--container-width-md);
    }
}

@media screen and (max-width:975px) {
    .client__container {
        width: 96% !important;
    }
}

@media screen and (max-width:884px) {
    .client__container__head {
        font-size: 18px;
    }
}

@media screen and (max-width:779px) {
    .client__container__head {
        font-size: 16px;
    }
}

@media screen and (max-width:600px) {
    .client__container__head {
        font-size: 15px;
    }
}


.toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-switch {
    display: flex;
    background-color: #f0f0f0;
    border-radius: 15px;
    overflow: hidden;
    width: 130px;
    height: 40px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.382);
    border: solid 1px var(--light-color-bg2);
}

.toggle-option {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    transition: color 0.3s;
}

.toggle-line {
    background-color: rgba(128, 128, 128, 0.049);
    width: 1px;
    height: 40px;
}

.toggle-option.selected {
    color: #fff;
}

.toggle-switch.active .toggle-option.selected {
    color: white;
    font-weight: bold;
    background-color: var(--light-color-bg2);
}

.toggle-switch .toggle-option {
    background-color: #fff;
}

@media screen and (max-width: 600px) {
    .header {
        display: flex;
        flex-direction: column;
    }

    .toggle-switch {
        order: 1;
        margin-left: 0;
        align-self: flex-end;
    }

    .header_navigation {
        order: 2;
        margin-top: 20px;
        gap: 10px !important;
    }

    .toggle-switch {
        width: 100px !important;
    }

    .toggle-option {
        font-size: 9px;
    }
}
</style>