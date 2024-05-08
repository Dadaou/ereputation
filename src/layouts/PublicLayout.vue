<template>
    <NavbarComponent></NavbarComponent>
    <div class="main__container">
        <HeadComponent class="head" :page="appStore.currentPage"></HeadComponent>
        <router-view></router-view>
    </div>
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { defineAsyncComponent } from 'vue'

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const HeadComponent = defineAsyncComponent(() =>
    import('@Components/layouts/HeadComponent.vue')
);

const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
);

const appStore = useAppStore();
</script>
<style>
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

.feedback__form {
    width: 50%;
    margin: 3rem auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border: 1px solid var(--light-color-bg2);
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