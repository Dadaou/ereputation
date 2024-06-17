<template>
    <NavbarComponent :isPublic="true"></NavbarComponent>
    <div class="main__container">
        <HeadComponent class="head" :page="appStore.currentPage" v-if="appStore.header"></HeadComponent>
        <router-view></router-view>
    </div>
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js"
import { defineAsyncComponent, onMounted } from 'vue'
import { refreshTheme } from '@Services/theme.js'

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const HeadComponent = defineAsyncComponent(() =>
    import('@Components/layouts/HeadComponent.vue')
);

const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
);

const appStore = useAppStore();
const userStore = useUserStore()

onMounted(() => {
    userStore.updateCustomerTheme(() => {
        setTimeout(() => {
            refreshTheme(
                userStore.customer.back_color || appStore.account.back_color,
                userStore.customer.font_color || appStore.account.font_color,
                userStore.customer.title_color || appStore.account.title_color,
            );
        }, 1000);
    });
})
</script>