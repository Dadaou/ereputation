<template>
    <div class="main__container">
        <!--  <HeadComponent :page="page"></HeadComponent> -->
        <AlertComponent :alertType="notification.type" :message="notification.message" v-if="isError"
            v-on:close="isError = false" />
        <div class="login__container" ref="form__ref">

            <div class="login__form">

                <span v-if="advantages">{{ advantages.adv_name }} <br> {{advantages.establishment_name }}</span>
                <div class="advantage_attibut" style="border-bottom: 2px solid var(--light-color-bg1);">
                   <p class="title"> {{ $t("coupon.advantage_attribute") }}</p>
                   <p class="title">{{ $t("coupon.value") }} </p>  
                </div>
                <div class="advantage_attibut">
                   <p>{{ $t("coupon.customer") }}</p>
                   <p>{{ capitalizeFirstLetter(advantages.contact_firstname, advantages.contact_lastname) }}</p>  
                </div>

                <div class="advantage_attibut">
                   <p>{{ $t("coupon.code") }}</p>
                   <p> {{ advantages.code }}</p>  
                </div>

                <div class="advantage_attibut">
                   <p> {{ $t("coupon.expire") }} </p>
                   <p>{{ moment(advantages.expired_at).format("DDMMM, YYYY") }}</p>  
                </div>

                <div class="advantage_attibut"  v-show="valid">
                   <p>{{ $t("coupon.validated_at") }}</p>
                   <p> {{ moment(advantages.validated_at).format("DDMMM, YYYY") }}</p>  
                </div>

                <div style="border-bottom: 2px solid var(--light-color-bg1);"></div>

                <div class = "coupon_form" v-show="!valid">

                    <span>{{ $t("coupon.validationcoupon") }}</span>

                    <form @submit.prevent="submit" @keydown.enter.prevent="submit" class = "coupon_form">

                            <input type="text" name="code" placeholder="code" v-model="code" required>
                            <button type="submit" :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                                <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                                <span v-else>{{ $t("login.validate") }}</span>
                            </button>

                    </form>

                </div>

            </div>


        </div>
    </div>
</template>



<script setup>
import { ref, defineAsyncComponent, onBeforeMount } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useAppStore } from "@Stores/app.js";
import { useRouter, useRoute } from "vue-router"
import { useWindowSize } from '@vueuse/core'
import { ElMessage, tagEmits } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import services from '@Services/services.js'
import moment from 'moment'

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const AlertComponent = defineAsyncComponent(() =>
    import('@Components/utils/AlertComponent.vue')
)
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const nameAdvantage = localStorage.getItem('nameAdvantage');
const pinCode = ref('')
const advantages = ref({})
const valid = ref(true)
const code = ref('')

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

const capitalizeFirstLetter = (firstname = "", lastname = "") => {

  const capitalizedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);

  let capitalizedLastname = lastname;
  if (lastname && lastname.trim() !== '') {
    capitalizedLastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
  } else {
    capitalizedLastname = ''
  }

  return `${capitalizedFirstname} ${capitalizedLastname}`;
}


const validateCoupon = async () => {

    const data = {

        "validatedAt": moment().format('YYYY-MM-DD'),
        "confirm": true
    }

    if (advantages.value) {

        const response = await new Promise((resolve) => {
            services.patchRecord('public/advantage_contacts', advantages.value.id, data , (response) => {
                resolve(response)
            }, true)
        })

        if (response.status == 200) {

            ElMessage({
                message: `Advantage ${advantages.value.adv_name} validates to ${advantages.value.contact_firstname} ${advantages.value.contact_lastname}`,
                type: 'success',
            });

            code.value = ''
            valid.value = true
            advantages.value.validated_at = moment().format('YYYY-MM-DD')
            show.value = false
        }

    }

    localStorage.setItem('isSellerAuthenticated', 'true');
}


const submit = async () => {

    showSpinner.value = true;
    await wait(1000);

    try {
        if (code.value === pinCode.value) {

            await validateCoupon()
            showSpinner.value = false;

        } else {
            ElMessage({
                message: `Please provide the right code`,
                type: 'warning',
            });
            showSpinner.value = false;
        }
    } catch (error) {
        console.log(error)
    }

    finally {
        showSpinner.value = false;
    }
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

onBeforeMount(async ()=>{
    appStore.header = false;

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`public/customer/establishments/advantagecontacts/list?tag=${route.params.discountTag}`, (response) => {
                resolve(response);
            }, true);
        });

        if (response.status === 200) {

            pinCode.value = response.data[0].establishment_pin
            advantages.value = response.data[0]
            valid.value = advantages.value.validated_at == null ? false : true

        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error(error);
    }

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

.coupon_form {
    display: flex; 
    justify-content: center; 
    flex-direction: column; 
    gap: 15px;
}

.custom__container {
    position: relative;
    top: 0rem !important;
}
.title {
    font-weight: bold;
    font-size: 0.9em;
}

.login__container {
    height: inherit;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.login__form {
    height: 50%;
    width: 25%;
    min-width: 280px;
    margin-top: 60px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    gap: 1rem;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.advantage_attibut {
    display: flex;
    justify-content: space-between;
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