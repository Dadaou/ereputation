<template>
  <NavbarComponent></NavbarComponent>
    <div class="app__loader" :style="loaderStyle" v-show="appStore.isLoading">
      <SpinnerComponent :size="'large'"/>
    </div>
    <RouterView/>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import {onBeforeMount, ref, watch} from 'vue';
import { RouterView } from 'vue-router';
import { initFlowbite } from 'flowbite';
import NavbarComponent from '@Components/layouts/NavbarComponent.vue';
import FooterComponent from '@Components/layouts/FooterComponent.vue';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/index.js";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
if(userStore.roleSummary == ''){
  userStore.roleSummary = localStorage.getItem('user_role')
}

// initialize components based on data attribute selectors
onBeforeMount(() => {
    initFlowbite();
})

const{ width, height} = useWindowSize();
const loaderStyle = ref({
  'width': `${width.value}px`, 
});

watch(width, () => {
  loaderStyle.value = {
    'width': `${width.value}px`, 
  }
})

if(router.currentRoute.value.name != 'feedback' && localStorage.getItem('access') == import.meta.env.VITE_APP_TOKEN){
  if(userStore.authenticated == null) localStorage.removeItem('access');
}

</script>

<style scoped>
.app__loader{
  background: white;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  height: 100%;
}

*{
  caret-color: transparent !important;
}

</style>
