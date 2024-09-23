<template>
    <div :class="{ hidden: isChildRoute }" class="main__container">
        <div class="container">
            <h1>Hi <span class="name">{{ userStore.user.customer.name }} </span> !</h1>
            <h1>We are happy to welcome you to the Linkystar platform 😊</h1>
            <h1>Let's start with a few settings to make your platform operational.</h1>
            <br>
            <h1>This initial setup will assist you in configuring your establishment, and upon completion, you will
                be able to fully leverage the potential of Linkystar.</h1>
            <br>
            <h1 @click="addEstablishment" class="redirect">Let’s get Started!</h1>
            <br>
            <h1 @click="navigateHome" class="redirect">No, thank you. I will set up my platform without the
                assistant</h1>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@Stores/user.js';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const tag = userStore.user.customer.tag;
const isChildRoute = ref(false);


const checkIfChildRoute = () => {
    isChildRoute.value = route.path.includes('/step/customer');
};


watch(() => route.path, () => {
    checkIfChildRoute();
});

checkIfChildRoute();


const addEstablishment = () => {
    router.push({ name: 'StepView', params: { tag: tag } }).catch(err => console.error(err));
};


const navigateHome = () => {
    router.push({ name: 'EstablishmentList', params: { tag: tag } }).catch(err => console.error(err));
};
</script>

<style scoped>
.hidden {
    display: none;
}

.main__container {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    padding-bottom: 50px;
    margin-top: 5rem;
    min-height: calc(100dvh - 280px);
}

.container {
    margin-top: 10rem;
}

.container h1 {
    margin: 0.8rem;
}

.name {
    font-weight: 600;
}

.redirect {
    cursor: pointer;
    font-weight: 600;
}

.redirect:hover {
    color: var(--light-color-bg2);
}
</style>