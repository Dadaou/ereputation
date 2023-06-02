<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="container admin__container">
            <div class="admin__menu">
                <ul>
                    <li :class="currentContent=='personal_details'?'active':''" @click="currentContent='personal_details'"> 
                        <i class="uil uil-user-circle"></i> Personal details
                    </li>
                    <li :class="currentContent=='security'?'active':''" @click="currentContent='security'">
                        <i class="uil uil-lock"></i> Security
                    </li>
                    <li :class="currentContent=='myCompanies'?'active':''" @click="currentContent='myCompanies'"> 
                        <i class="uil uil-building"></i> My Companies
                    </li>
                </ul>
            </div>
            <div class="all__content">
                <CompaniesComponent v-show="currentContent=='myCompanies'"/>
                <SecurityComponent v-show="currentContent=='security'"/>
                <UserDetailsComponent v-show="currentContent=='personal_details'"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import CompaniesComponent from '@Components/Admin/CompaniesComponent.vue';
import SecurityComponent from '@Components/User/SecurityComponent.vue';
import UserDetailsComponent from '@Components/User/UserDetailsComponent.vue';

const page=ref({
    title1: "My",
    title2: "Profile",
    icon: "uil-user-square"
})

const currentContent = ref('personal_details')
</script>

<style scoped>
</style>