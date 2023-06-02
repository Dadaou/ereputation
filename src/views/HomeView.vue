<template>
    <HeadComponent :page="page"></HeadComponent>
    <div class="main__container"></div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import {ref} from 'vue'

const page=ref({
    title1: "l'",
    title2: "Acceuil",
    icon: "uil-estate"
})
</script>

<style scoped>
.main__container{}
</style>