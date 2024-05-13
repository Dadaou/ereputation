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