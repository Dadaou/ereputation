<template>
  <NavbarComponent></NavbarComponent>
    <RouterView/>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import {onMounted} from 'vue';
import { RouterView } from 'vue-router';
import { initFlowbite } from 'flowbite';
import NavbarComponent from '@Components/layouts/NavbarComponent.vue';
import FooterComponent from '@Components/layouts/FooterComponent.vue';
import { useUserStore } from "@Stores/user.js";

const userStore = useUserStore();
if(userStore.roleSummary == ''){
  userStore.roleSummary = localStorage.getItem('user_role')
}

// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})
</script>

<style scoped>

</style>
