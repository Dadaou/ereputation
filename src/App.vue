<template>
  <NavbarComponent></NavbarComponent>
    <RouterView/>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavbarComponent from '@Components/layouts/NavbarComponent.vue';
import FooterComponent from '@Components/layouts/FooterComponent.vue';
import { useUserStore } from "@Stores/user.js";
const userStore = useUserStore();
if(userStore.roleSummary == ''){
  userStore.roleSummary = localStorage.getItem('user_role')
}
</script>

<style scoped>

</style>
