<template>
    <div class="container">
        <h1 class="title">Plateform is ready</h1>
        <div>
            <h1>Thank you, your account is set up.</h1>
            <h1>You can now configure additional settings to fully benefit from the potential of Linkystar</h1>
        </div>
        <button @click="navigateHome" class="redirect">
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M10.354 3.646a.5.5 0 0 0 0 .708L13.207 7H1.5a.5.5 0 0 0 0 1h11.707l-2.853 2.646a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                </svg>
            </span>
            Go to home
        </button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@Stores/user.js';

const router = useRouter();
const userStore = useUserStore();
const tag = userStore.user.customer.tag;

const navigateHome = () => {
    router.push({ name: 'EstablishmentList', params: { tag: tag } }).catch(err => console.error(err));
};


</script>
<style scoped>
.title {
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.container {
    margin-top: 10rem;
}

.container h1 {
    margin-top: 0.8rem;
}

.redirect{
    margin-top: 1.5rem;
    font-weight: 300;
    display: flex;
    padding: 5px;
    border-radius: 5px;
    background-color: var(--light-color-bg2);
    color:white;
    cursor: pointer;
    border: solid 1px var(--light-color-bg2);
}

.redirect:hover {
    border: solid 1px var(--light-color-bg2);
    background-color: white;
    color: var(--light-color-bg2)
}

.icon {
    margin-top: .2rem;
    margin-right: 8px;
    vertical-align: middle;
}

</style>