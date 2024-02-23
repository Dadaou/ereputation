<template>
    <NavbarComponentTemp/>
    <!-- <NavbarComponent></NavbarComponent> -->
    <div class="main__container" v-if="appStore.isExist">
        <HeadComponent class="head" :page="appStore.currentPage"></HeadComponent>
        <router-view></router-view>
        <FooterComponent></FooterComponent>
    </div>
    <EstablishmentNotFound v-else />
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { defineAsyncComponent } from 'vue'

import HeadComponent from '@Components/layouts/HeadComponent.vue';

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
)
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)
const NavbarComponentTemp = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarTempComponent.vue')
)

const appStore = useAppStore();

</script>

<style>
.app__container {
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
}

.left__side {
    width: 80%;
    padding: 50px 5px;
}

.left__side .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.right__side {
    width: 400px;
    padding: 50px 0px;
}

.establishment__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}

.establishment__info_tablet {
    margin-top: 30px;
}

.establishment__info i,
.establishment__info_tablet i {
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label,
.establishment__info_tablet label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment__info_tablet div {
    display: flex;
}

.establishment__info_tablet {
    margin-top: 0px;
}

.society__name {
    margin: 5px 0;
    display: flex;
}

.society__location {
    display: flex;
}

.society__location span {
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

.tablet_mobile__head,
.tablet_mobile__filter {
    display: none;
}

.app__title {
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1 {
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2 {
    font-size: 18px;
    transition: var(--transition);
}

.right__side .establishment .establishment__img {
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right__side .establishment__img img {
    width: 100%;
    height: auto !important;
}

@media screen and (min-width: 1439px) and (max-width: 2559px) {
    .left__side {
        width: 73.5%;
    }
}

@media screen and (max-width:1440px) {
    .left__side {
        width: 70%;
    }

    .right__side {
        width: 325px;
    }
}

@media screen and (max-width:1024px) {
    .app__container {
        width: var(--container-width-md);
    }

    .right__side {
        width: 275px;
    }
}

@media screen and (max-width: 975px) {
    .app__container {
        flex-direction: column-reverse;
        width: 95% !important;
        justify-content: center;
        align-items: center;
    }

    .left__side {
        width: inherit !important;
    }

    .right__side {
        display: none !important;
    }

    .tablet_mobile__head {
        display: flex;
        justify-content: space-between;
        margin: auto;
        margin-top: 50px;
        width: inherit;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: 1px solid var(--light-color-bg2);
        border-radius: 5px;
        padding: 15px;
        font-size: 14px;
    }

    .tablet_mobile__head label {
        font-size: 17px !important;
    }

    .tablet_mobile__head span {
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter {
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter * {
        flex-basis: 200px;
    }

    .photo {
        flex-basis: 250px;
    }

    .photo div {
        height: 100%;
    }

    .photo img {
        height: 75px;
        width: 100%;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head {
        font-size: 13px !important;
    }

    .tablet_mobile__head label {
        font-size: 15px !important;
    }

    .tablet_mobile__filter {
        gap: 0.25rem;
    }

    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
    }

    .tablet {
        display: none !important;
    }

    .mobile__filter__btn {
        display: flex !important;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 10px;
    }

    .photo {
        flex-basis: 210px !important;
    }

    .tablet_mobile__head label {
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter {
        flex-direction: column;
        padding: 5px 0px !important;
    }

    .tablet_mobile__filter * {
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }

    .date__picker {
        margin: 5px 0 10px !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head {
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo {
        flex-basis: 150px !important;
        height: 100px !important;
    }
}

@media screen and (max-width:475px) {
    .app__container {
        overflow-x: hidden;
    }
}
</style>