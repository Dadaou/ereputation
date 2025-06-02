<template>
    <div :class="{ hidden: isChildRoute }" class="main__container home-step__container">
        <div class="container mt-0 mx-auto mb-4 max-w-[720px]">
            <div class="welcome-title">
                <h1 class="welcome-text">Welcome</h1>
                <div class="welcome-bg">{{ userStore.user?.user?.firstname || userStore.user.customer.name}}</div>
            </div>
            <!-- <h1>Hi <span class="name">{{ userStore.user.customer.name }} </span> !</h1> -->
            <h1>We are happy to welcome you to the Linkystar platform 😊</h1>
            <h1>Let's start with a few settings to make your platform operational.</h1>
            <br>
            <h1>This initial setup will assist you in configuring your establishment, and upon completion, you will
                be able to fully leverage the potential of Linkystar.</h1>
            <br>

            <button @click="addEstablishment" class="redirect">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M10.354 3.646a.5.5 0 0 0 0 .708L13.207 7H1.5a.5.5 0 0 0 0 1h11.707l-2.853 2.646a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                    </svg>
                </span>
                Let's get Started!
            </button>
            <br>
            <button @click="navigateHome" class="redirect">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M10.354 3.646a.5.5 0 0 0 0 .708L13.207 7H1.5a.5.5 0 0 0 0 1h11.707l-2.853 2.646a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                    </svg>
                </span>
                No, thank you. I will set up my platform without the
                assistant
            </button>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@Stores/user.js';
import services from '@Services/services.js';
import { onBeforeUnmount } from 'vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const tag = userStore.user.customer.tag;
const isChildRoute = ref(false);


const checkIfChildRoute = () => {
    isChildRoute.value = route.path.includes('/step-view');
};


watch(() => route.path, () => {
    checkIfChildRoute();
});

checkIfChildRoute();


const addEstablishment = () => {
    router.push({ name: 'firstStep', params: { tag: tag } }).catch(err => console.error(err));
};


const navigateHome = () => {
    router.push({ name: 'EstablishmentList', params: { tag: tag } }).catch(err => console.error(err));
};

onMounted(() => {
    services.mountChatWidget()
})

onBeforeUnmount(() => {
    services.unmountChatWidget()
})

</script>

<style>
footer {
    margin-top: 0 !important;
}
</style>

<style scoped>
.hidden {
    display: none;
}

.home-step__container {
    background: url("@/assets/images/fond.svg");
    margin-block: 80px 0 !important;
    padding-inline: 4rem;
    background-position: top left;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100vw !important;
    min-height: 80vh !important;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}

.main__container {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    padding-bottom: 50px;
    margin-top: 5rem;
    min-height: calc(100dvh - 280px);
}

.icon {
    margin-top: .2rem;
    margin-right: 8px;
    vertical-align: middle;
}


.container {
    margin-top: 3rem;
}

.container h1 {
    margin-block: 0.8rem;
}

.name {
    font-weight: 600;
}

.redirect {
    font-weight: 300;
    display: flex;
    padding: 5px;
    border-radius: 5px;
    background-color: var(--light-color-bg2);
    color: white;
    cursor: pointer;
    border: solid 1px var(--light-color-bg2);
}

.redirect:hover {
    border: solid 1px var(--light-color-bg2);
    background-color: white;
    color: var(--light-color-bg2)
}

.welcome-title {
    position: relative;
    margin-bottom: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.welcome-text {
    font-size: 4.5rem;
    font-weight: 300;
    color: var(--color-dark);
    position: relative;
    z-index: 2;
    margin: 0;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2),
                 -2px 2px 4px rgba(0, 0, 0, 0.1),
                 2px -2px 4px rgba(0, 0, 0, 0.1),
                 -2px -2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-bg {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: -1rem;
}

@media (max-width: 768px) {
    .welcome-text {
        font-size: 3rem;
    }
    
    .welcome-bg {
        font-size: 0.8rem;
        margin-top: 0.8rem;
    }
}
</style>