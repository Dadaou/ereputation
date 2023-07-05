<template>
<div class="avatar__container" ref=target>
    <div class="avatar__info flex items-center space-x-4" @click="hideMenu = !hideMenu">
        <!-- <img id="avatarButton" type="button"  data-dropdown-placement="bottom-start" class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/src/assets/images/Portrait_Placeholder.png" alt="User dropdown"> -->
        <div class="relative inline-flex items-center justify-center w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
            <span class="font-medium dark:text-white">{{ userStore.getInitials(userStore.user.firstname, userStore.user.lastname) }} </span>
        </div>
        <div class="font-medium dark:text-white user__connected">
            <div>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</div>
            <!-- <div class="text-sm dark:text-white">{{ userStore.roleSummary }}</div> -->
        </div>
    </div>
   
    <div v-if="hideMenu" id="userDropdown" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-50 dark:bg-gray-700 dark:divide-gray-600">
        <!-- <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="$router.push('/users/1/profile')">
                <i class="uil uil-user-square"></i>
                Profile
            </a>
        </li>
        <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="$router.push('/users/1/profile/security')">
                <i class="uil uil-setting"></i>
                Settings
            </a>
        </li>
        </ul> -->
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
import { useRouter } from "vue-router";
import { useUserStore } from "@Stores/user.js";
import { onClickOutside } from '@vueuse/core';
const userStore = useUserStore();

const router = useRouter();
const hideMenu = ref(false);
const target = ref(null);

const signOut = () => {
    userStore.signOut();
    userStore.authenticated = false;
    if(userStore.authenticated == false) router.push({name:"Login"});
}

onClickOutside(target, (event) => hideMenu.value = false);

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

/* Media Queries (Phone) */
@media screen and (max-width:700px) {
    .user__connected{
        display: none;
    }

    #userDropdown{
       position: absolute;
       width: 9rem;
       left: -50px;
    }
}
</style>