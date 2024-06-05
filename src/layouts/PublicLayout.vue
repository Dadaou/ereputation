<template>
    <NavbarComponent :isPublic="true"></NavbarComponent>
    <div class="main__container">
        <HeadComponent class="head" :page="appStore.currentPage" v-if="appStore.header && !shouldHideHeadComponent"></HeadComponent>
        <router-view></router-view>
    </div>
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js"
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { refreshTheme } from '@Services/theme.js'
import { useRoute } from 'vue-router';

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
const route = useRoute();
const shouldHideHeadComponent = computed(() => {
    return route.name === 'SuccessFeedback';
});

onMounted(() => {
    userStore.updateCustomerTheme(() => {
        setTimeout(() => {
            refreshTheme(
                userStore.customer.back_color,
                userStore.customer.font_color,
                userStore.customer.title_color
            );
        }, 1000);
    });
})
</script>