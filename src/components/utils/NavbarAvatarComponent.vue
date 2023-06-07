<template>
<div class="avatar__container">
    <div class="avatar__info flex items-center space-x-4" @click="hideMenu = !hideMenu">
        <img id="avatarButton" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/src/assets/images/Portrait_Placeholder.png" alt="User dropdown">
        <!-- <div class="relative inline-flex items-center justify-center w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
            <span class="font-medium text-gray-600 dark:text-gray-300">JL</span>
        </div> -->
        <div class="font-medium dark:text-white">
            <div>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ userStore.roleSummary }}</div>
        </div>
    </div>
   
    <div v-if="hideMenu" id="userDropdown" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-50 dark:bg-gray-700 dark:divide-gray-600">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <i class="uil uil-user-square"></i>
                Profile
            </a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <i class="uil uil-setting"></i>
                Settings
            </a>
        </li>
        </ul>
        <div class="py-1">
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" @click="signOut">
            <i class="uil uil-signout"></i>
            Sign out
        </a>
        </div>
    </div>
</div>
</template>

<script setup>
import {ref} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@Stores/user.js";
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const hideMenu = ref(false);

const signOut = () => {
    userStore.signOut();
    localStorage.removeItem("user_authenticated");
    localStorage.removeItem("user");
    userStore.authenticated = false;
    if(userStore.authenticated == false) router.push({name:"Login"});
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;


.avatar__container{
    position: relative;
    height: 50px;
}

.avatar__info{
    cursor: pointer;
}
</style>