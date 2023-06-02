<template>
  <NavbarComponent></NavbarComponent>
    <RouterView/>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavbarComponent from '@Components/layouts/NavbarComponent.vue';
import FooterComponent from '@Components/layouts/FooterComponent.vue';
</script>

<style scoped>

</style>
