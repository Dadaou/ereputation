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
                    <!-- <div class="status-container">
                        <button v-if="isExpired(subscription.expired_at)" class="btn expired">Expired 🗓️</button>
                        <button v-else class="btn active">Active 🌟</button>
                    </div> -->
                </div>
                <div class="subscription-content">
                    <div class="content">
                        <p><strong>Payment Date:</strong> {{ moment(subscription.payement_date).format('YYYY-MM-DD') }}</p>
                        <p><strong>Expires On:</strong> {{ moment(subscription.expired_at).format('YYYY-MM-DD') }}</p>
                        <p v-if="subscription.discount > 0"><strong>Discount:</strong> {{ subscription.discount }}%</p>
                        <p><strong>Periodicity:</strong> {{ subscription.periodicity }} months</p>
                        <p><strong>Event Limit:</strong> {{ subscription.event_limit }}</p>
                        <p><strong>Establishment Limit:</strong> {{ subscription.establishment_limit }}</p>
                        <p><strong>Point of Sale Limit:</strong> {{ subscription.pointofsale_limit }}</p>
                        <p v-if="subscription.crm"><strong>CRM:</strong> Included</p>
                        <p v-if="subscription.api"><strong>API Access:</strong> Included</p>
                    </div>
                    <div class="text-center">
                        <button v-if="isExpired(subscription.expired_at)" class="btn btn-primary-2 btn-navigation">Renew
                            Subscription</button>
                    </div>

                </div>
            </div>
            <RouterLink :to="`/customer/${userStore.user.customer.tag}/account/new_subscription`"
                class="subscription-item new">
                <div class="text-center">
                    <i class="uil uil-plus-circle" style="font-size: 64px;"></i>
                    <p style="font-size: 14px;">New subscription</p>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { useUserStore } from "@Stores/user.js"
import services from '@Services/services.js'
import { useRoute } from "vue-router"
import moment from 'moment'

const route = useRoute();
const userStore = useUserStore();
// const subscriptions = ref([
//  {
//  	"expired_at": "2023-01-05T00:00:00+01:00",
//  	"payement_date": "2022-01-05T00:00:00+01:00",
//  	"amount": 9,
//  	"discount": 0,
//  	"plan_name": "Basic 1 Year",
//  	"periodicity": "12",
//  	"vat_rate": 0,
//  	"event_limit": "Illimited event",
//  	"contact_limit": null,
//  	"establishment_limit": "1 establishement (1 QR code by establishement)", 
//  	"pointofsale_limit": "3 monitored points of sale (1 QR code by point of sale)",
//  	"user_limit": null,
//  	"crm": false,
//  	"api": false,
//  	"currency": "$",
//  	"tag": "tag"
//  },
//  {
//  	"expired_at": "2025-01-05T00:00:00+01:00",
//  	"payement_date": "2024-01-05T00:00:00+01:00",
//  	"amount": 9,
//  	"discount": 0,
//  	"plan_name": "Basic 1 Year",
//  	"periodicity": "12",
//  	"vat_rate": 0,
//  	"event_limit": "Illimited event",
//  	"contact_limit": null,
//  	"establishment_limit": "1 establishement (1 QR code by establishement)", 
//  	"pointofsale_limit": "3 monitored points of sale (1 QR code by point of sale)",
//  	"user_limit": null,
//  	"crm": false,
//  	"api": false,
//  	"currency": "$",
//  	"tag": "tag"
//  },
// ])
const subscriptions = ref([])

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const isExpired = (expiredDate) => {
    const now = new Date();
    const expiryDate = new Date(expiredDate);
    return now > expiryDate;
    // return true;
}

onBeforeMount(async () => {
    let promises = [];
    try {
        const response = await new Promise((resolve, reject) => {
            services.get_Record(`customer/${route.params.tag}/subscriptions`, (response) => {
                resolve(response);
                console.log(response)
            });
        });

        if (response.status === 200) {
            subscriptions.value = response.data;
            console.log(response.data)
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
    height: 180px;
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
</style>
