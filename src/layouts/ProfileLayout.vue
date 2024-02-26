<template>
	<NavbarComponentTemp/>
    <!-- <NavbarComponent></NavbarComponent> -->
    <router-view></router-view>
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
)
const NavbarComponentTemp = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
)
</script>