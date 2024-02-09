<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <AlertComponent :alertType="notification.type" :message="notification.message" v-if="isError"
            v-on:close="isError = false" />
        <div class="login__container" ref="form__ref">
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="login__form">
                <span>Connect to your account</span>
                <input type="email" name="Email Address" placeholder="Email address" v-model="form.email" required>
                <input type="password" name="Password" placeholder="Password" v-model="form.password" required>
                <a class="register-link forgot__password" href="/forgot-pwd">Forgot Password?</a>
                <button type="submit" :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                    <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                    <span v-else>Submit</span>
                </button>
                <p><a href="/sign-up" class="register-link">Don't have an account?</a></p>

            </form>
        </div>
        <call-us-selector phonesystem-url="https://m-unit.on3cx.fr:5001" :party="chatID"></call-us-selector>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, defineAsyncComponent, onBeforeMount } from 'vue'
import HeadComponent from '@Components/layouts/HeadComponent.vue'
import { useUserStore } from "@Stores/user.js"
import { useRouter } from "vue-router"
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { useAppStore } from "@Stores/app.js"
import services from '@Services/services.js';


const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const AlertComponent = defineAsyncComponent(() =>
    import('@Components/utils/AlertComponent.vue')
)
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore()

const chatID = ref(import.meta.env.VITE_3CX_CHAT_ID);

const page = ref({
    title1: "Sign in to",
    title2: "your Account",
    icon: "uil-signin",
});

const form = ref({
    email: '',
    password: '',
});

const isError = ref(false);

const notification = ref({
    message: "",
    type: "",
});

const showSpinner = ref(false)

const submit = async () => {
    showSpinner.value = true;
    await userStore.signIn(form.value.email, form.value.password, async (response) => {
        if (response.authenticated) {

            router.push({ name: "Home" });
            showSpinner.value = false;

        } else {
            isError.value = true;
            if (response.status == 401) {
                notification.value.message = "Please verify your password or email!";
                notification.value.type = "warning";
            }

            if (response.status == 500) {
                notification.value.message = "Oops! Something unexpected happened. A server connection issue";
                notification.value.type = "error";
            }
            showSpinner.value = false;
        }
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

// onBeforeMount(async () => {
//     const response = await new Promise((resolve) => {
//         services.get_Record(
//             '/account/info',
//             (response) => {
//                 resolve(response)
//                 if (response.status == 404) {
//                     appStore.isLoading = false
//                 }
//             },
//             true
//         )
//     })

//     if (response.status == 200 && response.data) {
//         const data = response.data
//         if (data.length) appStore.setAccount(data[0])
//     }
// })

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
    padding: 10px;
    font-size: 14px !important;
    font-weight: 500;
}

.login__form span {
    text-align: center;
    font-weight: 600;
}

.login__form a {
    color: var(--color-black2);
    font-size: 12px;
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