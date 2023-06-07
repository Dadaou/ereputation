<template>
    <div class="company__main__container">
         <TableComponent
            :data="users"
            :isAdmin="isAdmin"
         >
            <template #content="slotProps">
                <div v-for="(user, index) in slotProps.data" :key="index">
                    <div class="data__main">
                        <div class="data__main__info">
                            
                            <div class="user__main__avatar">
                                <div class="circle" :class="user.active?'active':''"></div>
                                <img :src="user.avatar">
                            </div>
                            <div class="user__main__info__name">{{user.name}}</div>
                            <div class="user__main__info__email">{{user.email}}</div>
                            <div class="user__main__info__partner">{{user.partner}}</div>
                            <div class="user__main__info__login">{{user.login}}</div>
                        </div>
                        <div class="main__actions" v-if="isAdmin">
                            <span class="action__edit"><i class="uil uil-edit"></i></span>
                            <span class="action__delete"><i class="uil uil-trash-alt"></i></span>
                        </div>
                    </div>
                </div>
            </template>
         </TableComponent>
    </div>    
</template>

 <script setup>
 import {ref} from 'vue';
 import TableComponent from "@Components/utils/TableComponent.vue";

 const props = defineProps({
    isAdmin:{
        type: Boolean,
        default: false,
    }
 });
 const users = ref([
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'John Doe',
        email: 'upchh@example.com',
        login: "12/05/2023",
        partner: "John Doe",
        active: true,

    },
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'Jane Doe',
        email: 'upchh@example.com',
        active: false,
        login: "12/05/2023",
        partner: "John Doe",
    },
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'John Doe',
        email: 'upchh@example.com',
        login: "12/05/2023",
        partner: "John Doe",
        active: true,

    },
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'Jane Doe',
        email: 'upchh@example.com',
        active: false,
        login: "12/05/2023",
        partner: "John Doe",
    },
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'John Doe',
        email: 'upchh@example.com',
        login: "12/05/2023",
        partner: "John Doe",
        active: true,

    },
    {
        avatar:'/src/assets/images/Portrait_Placeholder.png',
        name: 'Jane Doe',
        email: 'upchh@example.com',
        active: false,
        login: "12/05/2023",
        partner: "John Doe",
    },
]);
 </script>
 
 <style scoped>
 .company__main__container{
     margin: 50px 100px 0px 0px;
 }
 </style>