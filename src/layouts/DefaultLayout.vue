<template>
    <router-view></router-view>
     <FooterComponent></FooterComponent>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
);
</script>