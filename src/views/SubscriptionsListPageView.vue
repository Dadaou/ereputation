<template>
    <div class="user__main__container">
        <div class="profile__header">
            <div class="profile__edit">
                <h1>Subscription</h1>
            </div>
        </div>
        <div class="subscription-container pb-5">
            <div v-for="(subscription, index) in subscriptions" :key="index" class="subscription-item">
                <div class="w-full subscription-header flex flex-row justify-between">
                    <h2>{{ subscription.plan_name }}</h2>
                    <div class="subscription-status" :class="isExpired(subscription.expired_at) ? 'expired' : 'active'"
                        :title="isExpired(subscription.expired_at) ? 'Expired subscription' : 'Active subscription'">
                    </div>
                </div>
                <div class="subscription-content">
                    <div class="content">
                        <p><strong>Payment Date:</strong> {{ moment(subscription.payement_date).format('YYYY-MM-DD') }}
                        </p>
                        <p><strong>Expires On:</strong> {{ moment(subscription.expired_at).format('YYYY-MM-DD') }}</p>
                        <p v-if="subscription.discount > 0"><strong>Discount:</strong> {{ subscription.discount }}%</p>
                        <p><strong>Periodicity:</strong> {{ subscription.periodicity }} </p>
                        <p v-if="subscription.crm"><strong>CRM:</strong> Included</p>
                        <p v-if="subscription.api"><strong>API Access:</strong> Included</p>
                        <div>
                            <p v-if="!loading" @click="downloadInvoice(subscription.invoice)" style="color: var(--color-bgp); cursor: pointer;">Download invoice</p>

                            <svg v-else aria-hidden="true" viewBox="0 0 100 101" fill="none" class="mr-2 text-gray-200 animate-spin dark:text-gray-600 w-6 h-6 fill-blue-400">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>

                        </div>
                    </div>
                    <div class="text-center">
                        <button v-if="isExpired(subscription.expired_at)" class="btn btn-primary-2 btn-navigation">Renew
                            Subscription</button>
                    </div>

                </div>
            </div>
            <button @click="$emit('viewNewSubscription')" class="subscription-item new">
                <div class="text-center">
                    <i class="uil uil-plus-circle" style="font-size: 64px;"></i>
                    <p style="font-size: 14px;">New subscription</p>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>

import { ref, onBeforeMount } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { Stripe } from 'stripe'
import services from '@Services/services.js'
import { useRoute } from "vue-router"
import moment from 'moment'
import { ElMessage } from 'element-plus'

const route = useRoute();
const userStore = useUserStore();
const subscriptions = ref([])
const loading = ref(false)

const downloadInvoice = async (invoiceID = null) => {

    loading.value = true

    if(invoiceID) {

        const stripeServer = Stripe(import.meta.env.VITE_SECRET_STRIPE_KEY)
        const invoice = await stripeServer.invoices.retrieve(invoiceID)
        window.open(invoice.invoice_pdf, '_blank')

    }

    else {
        ElMessage({
            message: `No invoice id found.`,
            type: 'warning',
        });
    }

    loading.value = false

}

const isExpired = (expiredDate) => {
    const now = new Date();
    const expiryDate = new Date(expiredDate);
    return now > expiryDate;
}

onBeforeMount(async () => {

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/${route.params.tag}/subscriptions`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            subscriptions.value = response.data;
        } else {
            console.error('Error fetching subscriptions:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});

</script>

<style scoped>
.subscription-header {
    background-color: color-mix(in srgb, var(--color-primary) 25%, white);
    color: var(--color-danger);
    padding: 16px 12px;
    gap: 8px;
}

.profile__header h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--color-primary);
}

.btn.renew {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
}

.btn-navigation {
    margin: 20px 8px 0 8px;
}

.subscription-item {
    background-color: #fff;
    padding: 0 !important;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    border-radius: 8px;
}

.subscription-content {
    padding: 20px;
}

.subscription-content * {
    font-size: 14px;
}

.subscription-item.new {
    cursor: pointer;
    padding: 24px !important;
    height: 160px;
    width: 200px;

}

.subscription-item.new:hover {
    background-color: rgb(252, 253, 255);
    transition: ease .5s background-color;
}

.subscription-item h2 {
    color: #333;
    margin-top: 0;
}

.subscription-item p {
    color: #666;
    line-height: 1.6;
}

.subscription-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    gap: 20px;
}

.subscription-item {
    background-color: #fff;
    padding: 20px;
    max-width: 400px;
    position: relative;
}

.subscription-status {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    cursor: pointer;
}

.subscription-status.active {
    background-color: #52c41a;
}

.subscription-status.expired {
    background-color: #ff4d4f;
}

.btn {
    padding: 5px 15px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 16px;
}

.btn.expired {
    background-color: #ff4d4f;
    color: white;
    width: 100%;
}

.btn.active {
    background-color: #52c41a;
    color: white;
    width: 100%;
}

@media screen and (max-width: 500px) {
    .subscription-container {
        display: block !important;
    }

    .subscription-item.new {
        margin-top: 10px;
        width: 51.2%;
    }

    .subscription-item {
        width: 51.2%;
    }

    .subscription__container {
        width: 73% !important;
    }
}
</style>
