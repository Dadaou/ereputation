<template>
   <div class="dashboard__main__container">
    <div class="dashboard__title"><b>Dashboard</b></div>
    <div class="dashboard__content">
        <CounterComponent v-for="item in all_items" :item="item"/>
    </div>
   </div>
</template>

<script setup>
import {ref, onBeforeMount} from 'vue'
import CounterComponent from '@Components/utils/CounterComponent.vue';
import { useUserStore } from "../../store/user.js";

const all_items = ref([
    {title: "Partenaires", value: "0", icon: "uil-user-md"},
    {title: "Sociétés", value: "0", icon: "uil-building"},
])
const userStore = useUserStore();

onBeforeMount(async ()=>{
    await userStore.fetchAll((response)=>{
        all_items.value.push(
            {
                title: "Utilisateurs", 
                value: userStore.nb, 
                icon: "uil-users-alt"
            },
        )
    })
})
</script>

<style>
.dashboard__main__container{
    margin-top: 50px;
}

.dashboard__title{
    border-top: 2px solid var(--light-color-bg2);
    border-bottom: 2px solid var(--light-color-bg2);
    width: inherit;
    padding: 10px;
    color: var(--color-bg2);
    font-size: 15px;
}

.dashboard__content{
    margin-top: 15px;
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
}
</style>