<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <AlertComponent 
            :alertType="notification.type"
            :message="notification.message"
            v-if="form.error" 
            v-on:close="form.error=false"/>
        <div class="login__container">
            <form @submit.prevent="submit" class="login__form">
                <span>Connect to your account</span>
                <input type="email" name="Email Address" placeholder="Email address" v-model="form.email" required>
                <input type="password" name="Password" placeholder="Password" v-model="form.password" required>
                <a class="forgot__password" href="http://"><b>Forgot Password?</b></a>
                <button type="submit" class="btn btn__light2">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import AlertComponent from '@Components/utils/AlertComponent.vue';
import { useUserStore } from "../store/user";
import { useRouter, useRoute } from "vue-router";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();

const page=ref({
    title1: "Sign in to",
    title2: "your Account",
    icon: "uil-signin"
})

const form = ref({
    email: '',
    password: '',
    error: false
})

const notification = ref({
    message: "",
    type: "",
})

const submit = async ()=>{
    await userStore.signIn(form.value.email, form.value.password, (response)=>{
        if(response.authenticated){
            if(userStore.user.roles[0] == "ROLE_ADMIN"){
                router.push({name:"Admin_dashboard"})
            }

            if(userStore.user.roles[0] == "ROLE_USER"){
                router.push({name:"Companies"})
            }
            console.log(userStore.user)
        }else{
            form.value.error = true
            console.log(response)
            if(response.status==401){
                notification.value.message = "Please verify your password or email!"
                notification.value.type = "warning"
            }

            if(response.status==500){
                notification.value.message = "No network!"
                notification.value.type = "error"
            }
        }
    })
}
</script>

<style scoped>
.login__container{
    /* position: relative;
    top:8rem; */
    height: inherit;
    display: flex;
    justify-content: center;
}

.login__form{
    /* background-color: var(--color-bg2); */
    height: 50%;
    width: 25%;
    margin-top: 60px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    gap: 1rem;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.2);
}

.login__form input{
    width: 100%;
    height: 40px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
}

.login__form span{
    text-align: center;
    font-weight: 600;
}

.login__form a{
    color: var(--color-black2);
    font-size: 12px;
}

.forgot__password{
    display: flex;
    justify-content: flex-end;
}

.login__form button{
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
}

.login__form button:hover{
    transform: scale(0.95);
}

footer{
    margin-top:0px !important;
}

/* For tablets */
@media screen and (max-width:1225px) {
    .login__container{
        width: 100%;
    }

    .login__form{
        width: 30%;
    }
}
@media screen and (max-width:1200px) {
    .login__form{
        width: 35%;
    }
}

@media screen and (max-width:1024px) {
    .login__container{
        position: relative;
        top:13rem;
    }
}

@media screen and (max-width:1024px) {
    .login__container{
        position: relative;
        top:13rem;
    }
}

@media screen and (max-width:900px) {
    .login__form{
        width: 40%;
    }

    .login__form span, .forgot__password{
       font-size: 15px;
    }
}

@media screen and (max-width:800px) {
    .login__form{
        width: 45%;
    }
}

@media screen and (max-width:700px) {
    .login__form{
        width: 50%;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .login__form{
        width: 60%;
    }
    .login__form span{
       font-size: 14px;
    }
}

@media screen and (max-width:500px) {
    .login__form{
        width: 70%;
    }
    .login__form span{
       font-size: 13px;
    }
}

@media screen and (max-width:450px) {
    .login__form{
        width: 75%;
    }
}

@media screen and (max-width:400px) {
    .login__form{
        width: 80%;
    }
}

@media screen and (max-width:350px) {
    .login__form{
        width: 90%;
    }
}

</style>