<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <AlertComponent :alertType="notification.type" :message="notification.message" v-if="isError"
            v-on:close="isError = false" />
        <div class="login__container" ref="form__ref">
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="login__form">
                <span>Enter your email and we will send you a link to reset your password.</span>
                <div class="relative">
				  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
				    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
				        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
				        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
				    </svg>
				  </div>
				  <input type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@nexties.fr" v-model="form.email">
				</div>
                <button type="submit" :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                    <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                    <span v-else>Submit</span>
                </button>
                <p class="back_to_login"> <i class="uil uil-angle-left"></i> <a href="/">Back to login</a></p>
            </form>

        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import HeadComponent from '@Components/layouts/HeadComponent.vue'
import { useUserStore } from "@Stores/user.js"
import { useRouter } from "vue-router"
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import services from '@Services/services.js'
import 'element-plus/es/components/message/style/css'


const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const AlertComponent = defineAsyncComponent(() =>
    import('@Components/utils/AlertComponent.vue')
)
const router = useRouter();
const userStore = useUserStore();

const page = ref({
    title1: "",
    title2: "Forgot Password",
    icon: "uil-exclamation-circle",
});

const form = ref({
    email: '',
});

const isError = ref(false);

const notification = ref({
    message: "",
    type: "",
});

const showSpinner = ref(false)

const submit = async () =>{
	showSpinner.value = true;
	console.log(form.value.email)
	services.setURL(import.meta.env.VITE_APP_URL)
	await userStore.verifyPassword(form.value.email, (response)=>{
		isError.value = true;
		notification.value.message = response.data;
		notification.value.type = (response.status == 202)?"success":(response.status==404)?"warning":"error"
		showSpinner.value = false
		services.setURL(import.meta.env.VITE_APP_API_URL)
	})
}

/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const { width, height } = useWindowSize();
const form__ref = ref(null)

onMounted(() => {
    if (width.value <= 1024 && isError.value == true) form__ref.value.classList.add('custom__container');
});

watch([width, isError], () => {
    if (width.value <= 1024 && isError.value == true) form__ref.value.classList.add('custom__container');
    else if (isError.value == false) form__ref.value.classList.remove('custom__container');
});
</script>

<style scoped>
input {
    caret-color: var(--color-primary) !important;
}

button.isLoaded {
    display: flex;
    justify-content: center;
    align-items: center;
}

.custom__container {
    position: relative;
    top: 0rem !important;
}

.login__container {
    height: inherit;
    display: flex;
    justify-content: center;
}

.login__form {
    height: 50%;
    width: 25%;
    margin-top: 60px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    gap: 1rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.login__form input {
    width: 100%;
    height: 40px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    font-size: 14px !important;
    font-weight: 500;
}

.login__form span {
    text-align: center;
    font-weight: 600;
    padding-bottom: 20px;
}

.login__form a {
    color: var(--color-black2);
    font-size: 13px;
    color: grey;
}

.forgot__password {
    display: flex;
    justify-content: flex-end;
}

.login__form button {
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--color-danger) !important;
}

.register-link {
    font-size: .80rem !important;
    color: var(--color-primary) !important;
    font-weight: 700;
    text-decoration: underline !important;
}

.login__form button:hover {
    transform: scale(0.95);
}

.back_to_login{
	display: flex;
	align-content: center;
	align-items: center;
	font-size: 16px !important;
	font-weight: 500;
	justify-content: center;
}

/* For tablets */
@media screen and (max-width:1225px) {
    .login__container {
        width: 100%;
    }

    .login__form {
        width: 30%;
    }
}

@media screen and (max-width:1200px) {
    .login__form {
        width: 35%;
    }
}

@media screen and (max-width:900px) {
    .login__form {
        width: 40%;
    }

    .login__form span,
    .forgot__password {
        font-size: 15px;
    }
}

@media screen and (max-width:800px) {
    .login__form {
        width: 45%;
    }
}

@media screen and (max-width:700px) {
    .login__form {
        width: 50%;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .login__form {
        width: 60%;
    }

    .login__form span {
        font-size: 14px;
    }
}

@media screen and (max-width:500px) {
    .login__form {
        width: 70%;
    }

    .login__form span {
        font-size: 13px;
    }
}

@media screen and (max-width:450px) {
    .login__form {
        width: 75%;
    }
}

@media screen and (max-width:400px) {
    .login__form {
        width: 80%;
    }
}

@media screen and (max-width:350px) {
    .login__form {
        width: 90%;
    }
}
</style>