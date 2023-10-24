<template>
  <NavbarComponentTemp></NavbarComponentTemp>
    <div class="app__loader" :style="loaderStyle" v-if="appStore.isLoading">
      <SpinnerComponent :size="'large'"/>
    </div>
    <div class="erep__app">
      <RouterView/>
    </div>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import { onBeforeMount, watch, ref, defineAsyncComponent, provide, computed } from 'vue'
import { initFlowbite } from 'flowbite'
import { useWindowSize } from '@vueuse/core'
import { useAppStore } from "@Stores/app.js"
import { useUserStore } from "@Stores/user.js"

const SpinnerComponent = defineAsyncComponent(()=>
  import('@Components/utils/SpinnerComponent.vue')
)

const NavbarComponentTemp = defineAsyncComponent(()=>
  import('@Components/layouts/NavBarComponentTemp.vue')
)

const FooterComponent = defineAsyncComponent(()=>
  import('@Components/layouts/FooterComponent.vue')
)

const appStore = useAppStore();
const userStore = useUserStore();
const tag = computed(()=>{
  let customer_tag = (userStore.user)?userStore.user.customer.tag:'';
 
  return customer_tag;
})

provide('tag',tag);

onBeforeMount(() => {
    initFlowbite();
});

const{ width } = useWindowSize();
const loaderStyle = ref({
  'width': `${width.value}px`, 
});

watch(width, () => {
  loaderStyle.value = {
    'width': `${width.value}px`, 
  }
});
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

.erep__app{
  min-height: 500px;
}
</style>
