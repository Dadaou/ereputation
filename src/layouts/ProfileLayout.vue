<template>
    <NavbarComponent></NavbarComponent>
    <router-view></router-view>
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarTempComponent.vue')
);
</script>