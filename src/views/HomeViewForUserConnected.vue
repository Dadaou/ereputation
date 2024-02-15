<template>
    <div class="app__message">
        <p>Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, It seems you are not yet an active customer. To proceed further and access our services, kindly get in touch with our admin team.
        They will assist you in finalizing your registration and become a valued customer.</p>
        <button class="btn" @click="signOut">Disconnect</button>
    </div>
</template>
<script setup>
import { useUserStore } from "@Stores/user.js";
const userStore = useUserStore();

const signOut = () => {
    userStore.signOut();
    userStore.authenticated = false;
    if (userStore.authenticated == false) router.push({ name: "Login" });
};

</script>
<style scoped>
.search__icon i {
    font-size: 30px;
    color: var(--color-danger);
}

.app__message p {
    margin: 15px auto;
}

.app__message button {
    border: 1px solid var(--color-danger);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    color: var(--color-danger);
}

.app__message button:hover {
    background-color: var(--color-danger);
    color: white;
}
</style>
