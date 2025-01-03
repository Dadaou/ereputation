<template>
        <div id="nav-logo">

            <a :href="baseurl" class="flex items-center">
                <div v-if="appStore.account && appStore.account.logo" class="nav-logo">
                    <img :src="linkystar" alt="logo" />
                </div>
            </a>

        </div>
        
        <div v-if="showError" id="box-error">
            <h3 style="text-align: center;">Error</h3>
            <p> {{ errorMesssage }}</p>
        </div>
</template>


<script setup>

    import { ElLoading } from 'element-plus';
    import { ref, onBeforeMount } from 'vue';
    import { Stripe } from 'stripe';
    import { useUserStore } from "@Stores/user.js"
    import { useCompanyStore } from "@Stores/company.js";
    import { useRoute, useRouter} from 'vue-router';
    import { onBeforeUnmount } from 'vue';
    import linkystar from '@/assets/images/logo/LinkyStar.png'
    import { useAppStore } from "@Stores/app.js";
    import services from '@Services/services.js';

    const userStore = useUserStore()
    const companiesStore = useCompanyStore()
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    const baseurl = window.location.origin
    const loading = ref(null)
    const showError = ref(false)
    const errorMesssage = ref("")


    const checkPaymentStatus = async (sessionId) => {

        const stripeServer = Stripe(import.meta.env.VITE_SECRET_STRIPE_KEY);
        const session = await stripeServer.checkout.sessions.retrieve(sessionId)

        return session
    }

    const authUser = async () => {

        const email = localStorage.getItem('uemail')
        const password = localStorage.getItem('upassword')

        await userStore.signIn(email, password, async (response) => {

            if (response.authenticated) {
                const res = await activateAccount()
                if(res.status === 200) navigateUser(userStore.user) 
                else showErrorMessage("Unable to activate your account")
            }

            else {
                showErrorMessage("Unable to log into your account")
            }

        })

    }

    const navigateUser = (user) => {

        const establishments = ref([]);
        let defaultRoute = "";
        companiesStore.getEstablishments(user.customer.tag).then((data) => {
                establishments.value = data
                if (establishments.value.length === 0) {
                    defaultRoute = { name: "Step" }
                }else {
                    defaultRoute = { name: "Home" }
                }
                router.replace(defaultRoute).catch((e) => e)
            })
    }

    const activateAccount = async() => {

        const userId = localStorage.getItem('uId')

        const response = await new Promise((resolve) => {
            services.createRecord('user/enable', {id : userId}, (response) => {
                resolve(response);
            })
        })

        return response
        
    }

    const updateInvoice = async(invoiceID) => {
        
        const subscriptionID = localStorage.getItem('subscriptionId')

        const response = await new Promise((resolve) => {
            services.patchRecord('subscriptions', subscriptionID, {invoice: invoiceID}, (response) => {
                resolve(response)
            })
        })

        return response
    }

    
    const checkAllInformations = async () => {

        loading.value = ElLoading.service({
            lock: true,
            text: 'Your payment has been made successfully. You will be redirected in a few moments...',
            background: 'rgba(0, 0, 0, 0.7)',
            body : true
        })

        if(route?.query?.session_id) {

            const session = await checkPaymentStatus(route.query.session_id)

            if(session.payment_status === 'paid') {

                await authUser()
                await updateInvoice(session.invoice)
            }

            else  showErrorMessage("An error occurred during payment")

        }

    }

    const showErrorMessage = (msg) => {
        loading.value.close()
        showError.value = true
        errorMesssage.value = msg
    }

    onBeforeMount(() => {
        appStore.isLoading = false
        checkAllInformations()
    })

    onBeforeUnmount(() => {
        loading.value.close()
        localStorage.removeItem('uemail')
        localStorage.removeItem('upassword')
        localStorage.removeItem('uId')
    })

</script>

<style>
    #box-error {
        border-radius: 0.4rem;
        background-color: #FFFACD;
        word-wrap: break-word;
        width: 300px;
        height: auto;
        margin:  auto;
        padding: 8px;
        opacity: 0.8;
    }

    #nav-logo {
        margin-left: 50px;
        margin-top: 10px;
    }

    h3, p {
        font-family: Consolas;
    }

</style>