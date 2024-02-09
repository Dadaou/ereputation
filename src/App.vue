<template>
  <!-- <NavbarComponent></NavbarComponent> -->
  <div class="app__loader" :style="loaderStyle" v-if="appStore.isLoading">
    <SpinnerComponent :size="'large'" />
  </div>
  <div class="erep__app">
    <RouterView />
  </div>
  <!-- <FooterComponent></FooterComponent> -->
</template>

<script setup>
import { onBeforeMount, watch, ref, defineAsyncComponent, provide, computed, onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useWindowSize } from '@vueuse/core'
import { useAppStore } from "@Stores/app.js"
import { useUserStore } from "@Stores/user.js"
import { RouterView, useRoute } from 'vue-router';
import services from '@Services/services.js';

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

// const NavbarComponent = defineAsyncComponent(() =>
//   import('@Components/layouts/NavbarComponent.vue')
// )

// const FooterComponent = defineAsyncComponent(() =>
//   import('@Components/layouts/FooterComponent.vue')
// )

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const tag = computed(() => {
  let customer_tag = (userStore.user) ? userStore.user.customer.tag : '';

  return customer_tag;
})
provide('tag', tag);

onBeforeMount(async () => {
  appStore.isLoading = true;

  // if (userStore.user) {

  const response = await new Promise((resolve) => {
    services.get_Record(`/partner/info?code=${import.meta.env.VITE_PARTNER_CODE}`, (response) => {
      resolve(response)
      if (response.status == 404) {
        appStore.isLoading = false;
      }
    }, true);
  });

  if (response.status == 200 && response.data) {
    const data = response.data

    appStore.setAccount(data);

    appStore.setCssVariable('--color-bg2', appStore.account.back_color);
    appStore.setCssVariable('--color-danger', appStore.account.font_color);

    appStore.isLoading = false;

  }
  // } else {
  //   appStore.isLoading = false;
  // }

  initFlowbite();

});

onMounted(() => {
  var w3cxDiv = document.createElement("div");
  w3cxDiv.id = "w3cx";
  document.getElementById("app").appendChild(w3cxDiv);
  let w3cx = document.createElement("script");
  w3cx.setAttribute("src", "https://downloads-global.3cx.com/downloads/livechatandtalk/v1/callus.js");
  w3cx.setAttribute("id", "tcx-callus-js");
  w3cx.setAttribute("charset", "utf-8");
  document.getElementById("w3cx").appendChild(w3cx);
})

const { width } = useWindowSize();
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
.app__loader {
  background: white;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  height: 100%;
}

* {
  caret-color: transparent !important;
}

.erep__app {
  min-height: 500px;
  width: 100vw;
}

.extern_erep_app {
  position: relative;
  top: -2em;
}

.other_erep_app {
  position: relative;
  top: -5em;
}
</style>
