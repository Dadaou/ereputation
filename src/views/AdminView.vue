<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="container admin__container">
            <div class="admin__menu">
                <ul>
                    <li>
                        <router-link :to="{ name: 'Admin_dashboard'}">
                            <i class="uil uil-dashboard"></i><span>Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Admin_users'}">
                            <i class="uil uil-users-alt"></i><span>Users</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Admin_companies'}">
                            <i class="uil uil-user-md"></i><span>Companies</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Admin_partners'}">
                            <i class="uil uil-building"></i><span>Partners</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Admin_settings'}">
                            <i class="uil uil-setting"></i><span>Settings</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="all__content">
                <RouterView/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import { RouterView } from 'vue-router';
import HeadComponent from '@Components/layouts/HeadComponent.vue';

const page=ref({
    title1: "Espace",
    title2: "Administrateur",
    icon: "uil-clipboard-notes",
});
</script>

<style>
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
</style>