<template>
    <div class="main__container">
        <!--   <HeadComponent :page="page"></HeadComponent> -->
        <div class="container client__container">
            <div v-if="!dataLoading" class="header">
                <div class="header_navigation">
                    <RouterLink class="search__icon" :to="{ name: 'EstablishmentList', params: { tag: tag } }">
                        <Icon :icon="'ion:list'" width="26"></Icon>
                    </RouterLink>
                    <RouterLink v-if="show && establishments.length > 1" class="search__icon"
                        :to="{ name: 'EstablishmentRanking', params: { tag: tag } }">
                        <Icon :icon="'solar:cup-first-bold'" width="25"></Icon>
                    </RouterLink>
                    <RouterLink v-if="show && establishments.length > 1" class="search__icon"
                        :to="{ name: 'EstablishmentListByTrend', params: { tag: tag } }">
                        <Icon :icon="'gg:trending'" width="25"></Icon>
                    </RouterLink>
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
import { useAppStore } from "@Stores/app.js"
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
    let routeName = ['EstablishmentList', 'EstablishmentRanking', 'EstablishmentListByTrend', undefined];
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
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
}

.header button {
    /* background-color: var(--color-primary);
    color: white;*/
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
    width: 50%;
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

/*.header_navigation{
    display: flex;
    gap: 15px;
}*/

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
        flex-wrap: wrap;
        justify-content: center;
        padding: 5px 10px;
    }

    .search__icon {
        margin: 5px;
    }
}

@media screen and (max-width:1163px) {
    .client__container {
        width: 55% !important;
    }
}

@media screen and (max-width:1163px) {
    .client__container {
        width: 60% !important;
    }
}

@media screen and (max-width:964px) {
    .client__container {
        width: 65% !important;
    }
}

@media screen and (max-width:884px) {
    .client__container {
        width: 70% !important;
    }

    .client__container__head {
        font-size: 18px;
    }
}

@media screen and (max-width:779px) {
    .client__container {
        width: 80% !important;
    }

    .client__container__head {
        font-size: 16px;
    }
}

@media screen and (max-width:670px) {
    .client__container {
        width: var(--container-width-md) !important;
    }
}

@media screen and (max-width:600px) {
    .client__container__head {
        font-size: 15px;
    }
}
</style>