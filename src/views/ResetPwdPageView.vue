<template>
    <div class="main__container">
        <AlertComponent :alertType="notification.type" :message="notification.message" v-if="isError"
            v-on:close="isError = false" />
        <div class="login__container" ref="form__ref">
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="login__form">
                <span>Set your password</span>
                <div class="mb-3">
                    <input type="password" id="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="New password" v-model="form.password" required>
                </div>
                <div class="mb-3">
                    <input type="password" id="confirm_password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Confim password" v-model="form.confirmation" required>
                </div>
                <button type="submit" :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                    <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                    <span v-else>Submit</span>
                </button>
                <p class="back_to_login"> <i class="uil uil-angle-left"></i> <a href="/forgot-pwd">Go back</a></p>
            </form>

        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, defineAsyncComponent, inject } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useRouter, useRoute } from "vue-router"
import { useWindowSize } from '@vueuse/core'
import services from '@Services/services.js'
import 'element-plus/es/components/message/style/css'


const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const AlertComponent = defineAsyncComponent(() =>
    import('@Components/utils/AlertComponent.vue')
)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const app_url = inject('app_url')

const page = ref({
    title1: "",
    title2: "Reset Password",
    icon: "uil-key-skeleton",
});

const form = ref({
    password: '',
    confirmation: ''
});

const isError = ref(false);

const notification = ref({
    message: "",
    type: "",
});

const showSpinner = ref(false)

const submit = async () => {
    showSpinner.value = true;
    await userStore.resetPassword(
        form.value.password,
        form.value.confirmation,
        route.params.token,
        app_url.value,
        (response) => {
            isError.value = true;
            notification.value.message = response.data
            notification.value.type = (response.data == "the password and confirmation password does not have same value") ? "warning" : "success"

            showSpinner.value = false
            if (response.data !== "the password and confirmation password does not have same value") {
                router.push("/");
            }
        }
    )
}

/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const { width } = useWindowSize();
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

.back_to_login {
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