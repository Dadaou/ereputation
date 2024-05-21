<template>
  <div class="app__loader" :style="loaderStyle" v-if="appStore.isLoading">
    <SpinnerComponent :size="'large'" />
  </div>
  <div class="erep__app">
    <RouterView />
  </div>
</template>

<script setup>
import { onBeforeMount, watch, ref, defineAsyncComponent, provide, computed, onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useWindowSize } from '@vueuse/core'
import { useAppStore } from "@Stores/app.js"
import { useUserStore } from "@Stores/user.js"
import { RouterView, useRoute } from 'vue-router';
import services from '@Services/services.js';
import { useHead } from '@unhead/vue'
import { refreshTheme } from '@Services/theme.js';

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()

const tag = computed(() => {
  if (userStore.user && userStore.user.customer) {
    return userStore.user.customer.tag
  }

  if (userStore.user && userStore.user.partner && route.params.tag) {
    return route.params.tag
  }

  return '';
})
provide('tag', tag);
const start_date = ref(appStore.start_date);
const end_date = ref(appStore.end_date);

provide('start_date', start_date);
provide('end_date', end_date);

const setdate = () => {
  appStore.setDatesValue(start_date.value, end_date.value)
  start_date.value = appStore.start_date;
  end_date.value = appStore.end_date;
}

watch([start_date, end_date], () => {
  setdate()
})

const isNotNull = (value) => {
  return value !== '' && value !== null && value !== undefined;
}
const language = computed(() => {
  if (userStore.user && userStore.user.customer) {
    return isNotNull(userStore.user.customer.language) ? userStore.user.customer.language : 'fr'
  }

  if (userStore.user && userStore.user.partner) {
    return isNotNull(userStore.user.partner.language) ? userStore.user.partner.language : 'fr'
  }

  return 'fr'
})
provide('language', language);

const appConfig = ref({
  title: '',
  logo: ''
})

const config = computed(() => {
  return appConfig.value
})

useHead({
  title: () => config.value.title,
  link: () => [
    { rel: 'icon', type: 'image/png', href: config.value.logo, class: 'link-rel' },
  ],
})

onBeforeMount(async () => {
  appStore.isLoading = true;

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
    appConfig.value.title = data.brand
    appConfig.value.logo = data.logo

    appStore.setAccount(data);
    setTimeout(() => {
      refreshTheme(
        appStore.account.back_color,
        appStore.account.font_color,
        appStore.account.title_color
      );
    }, 500);

    appStore.isLoading = false;

  }
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
  opacity: 1;
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
