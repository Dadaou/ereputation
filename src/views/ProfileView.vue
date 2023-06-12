<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="container admin__container">
            <div class="admin__menu">
                <ul>
                    <li>
                        <router-link :to="{ name: 'Personal_details'}">
                            <i class="uil uil-building"></i><span>Partners</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Account_security'}">
                            <i class="uil uil-lock"></i> <span>Security</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="all__content">
                <!-- <CompaniesComponent v-show="currentContent=='myCompanies'"/>
                <SecurityComponent v-show="currentContent=='security'"/>
                <UserDetailsComponent v-show="currentContent=='personal_details'"/> -->
                <RouterView/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import { RouterView } from 'vue-router';
import HeadComponent from '@Components/layouts/HeadComponent.vue';


const page=ref({
    title1: "My",
    title2: "Profile",
    icon: "uil-user-square",
});
</script>

<style scoped>
.admin__container{
    /* position: relative;
    top:8rem; */
    height: inherit;
    display: flex;
    gap:2rem;
}

.admin__menu ul{
 margin-top: 50px;
 box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
}
/* .admin__menu li.active{
    background-color: var(--color-danger);
    color: var(--color-white);
} */

.admin__menu li a:hover{
 background-color: var(--light-color-bg1);
 color: var(--color-white);
 cursor: pointer;
}
.admin__menu li a{
    padding: 10px 75px;
    transition: var(--transition);
    display: flex;
    gap: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}

.router-link-exact-active {
    background-color: var(--color-danger);
    color: var(--color-white) !important;
}

.admin__menu li .router-link-exact-active:hover{
    background-color: var(--color-danger);
    color: var(--color-white);
}

.all__content{
    flex: auto;
}

/* For tablets */
@media screen and (max-width:1225px) {
   .admin__menu li a{
    padding: 10px 50px;
   }
}

@media screen and (max-width:1024px) {
    .admin__container{
        position: relative;
        top:8rem;
    }

    .admin__menu li a span{
        display: none;
        /* padding: 10px 25px; */
    }

    .admin__menu li a{
       font-size: 15px;
       padding: 10px 25px;
    }
}
</style>