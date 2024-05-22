<template>
  <div class="subscription__container">
    <el-tabs v-model="activeName" type="card" class="demo-tabs subscription-tabs container">
      <el-tab-pane name="plan">
        <div class="tab-pane-header">
          <h6>STEP 1 OF 2</h6>
          <div class="app__title">
            <h1>Choose your plan.</h1>
          </div>
        </div>
        <div v-if="plans" class="plan-container" ref="planContainer">
          <plan-card v-for="item in plans" :key="item.tag" :data="item" @selected="setPlan"></plan-card>
        </div>
      </el-tab-pane>
      <el-tab-pane name="checkout">
        <div class="tab-pane-header">
          <h6>STEP 2 OF 2</h6>
          <div class="app__title">
            <h1>Checkout</h1>
          </div>
        </div>
        <div class="w-full">
          <div class="flex flex-col items-start lg:flex-row lg:space-x-8 p-4">
            <div class="flex-1 left-content">
              <SubscriptionSummary :data="planInfo"></SubscriptionSummary>
            </div>
            <div class="shrink-0 lg:order-2 right-content">
              <div v-if="planInfo && planInfo.plan" class="summary-card">
                <div class="summary-card__content">
                  <div class="app__title">
                    <h1>Order Summary</h1>
                  </div>
                  <table class="w-full">
                    <tr>
                      <td>Plan</td>
                      <td style="text-align:right;"><strong>{{ planInfo.plan.name }}</strong></td>
                    </tr>
                    <tr>
                      <td>Subtotal</td>
                      <td style="text-align:right;">{{ planInfo.total }}{{ planInfo.plan.currency }}</td>
                    </tr>
                    <tr>
                      <td>Order Total</td>
                      <td style="text-align:right;"><strong>{{ planInfo.total }}{{ planInfo.plan.currency }}</strong>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="summary-card shrink-0 lg:order-2">
                <div class="summary-card__content">
                  <div class="app__title">
                    <h1>Payment information</h1>
                  </div>
                  <label for="cardName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name on
                    card
                    <span>*</span></label>
                  <input v-model="planInfo.cardName" type="text" id="cardName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                  <div class="w-full my-8" id="card-element"></div>
                  <div id="card-errors" role="alert"></div>
                  <div id="card-success" role="alert"></div>
                  <div class="flex items-center justify-end" style="text-align: right;"><button id="processPaymentBtn"
                      class="btn btn-primary-2" :class="showSpinner == true ? 'isLoaded' : ''"
                      style="margin-top: 12px; border-radius: 2px; width: 208px;" @click="() => subscribe()">
                      <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Process to
                        payment</span>
                    </button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <call-us-selector phonesystem-url="https://m-unit.on3cx.fr:5001" :party="chatID"></call-us-selector>
  </div>
</template>

<script setup>
import { ref, provide, onBeforeMount, defineAsyncComponent, onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import PlanCard from '@Components/subscription/PlanCard.vue';
import SubscriptionSummary from '@Components/subscription/SubscriptionSummary.vue';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from 'stripe';
import { useRouter } from 'vue-router';
import { h } from 'vue'
import { ElMessage } from 'element-plus';
import { useUserStore } from "@Stores/user.js"

const userStore = useUserStore();

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

const planInfo = ref({});
const showSpinner = ref(false)

// const showPostErrorMsg = () => {
//   ElMessage({
//     message: h('p', null, [
//       h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Saving error(s):'),
//       h('span', { style: "font-size: 13px;" }, postErrorMsg.value),
//     ]),
//   })
// }

let stripeClient = null;
let stripeServer = null;
let stripeElements = null;
// let paymentElements = null;
let paymentIntent = null;
let card = null;
let displayError = null;
let displaySuccess = null;

const plans = ref([]);

const chatID = ref(import.meta.env.VITE_3CX_CHAT_ID);

const activeName = ref('plan');
const activeStaffTab = ref('plan_list')
const plan_to_update = ref(null);
provide('plan_to_update', plan_to_update);
provide('plan_activeTab', activeStaffTab);

// const postErrorMsg = ref(null);

const activeEventTab = ref('account_list')
// const selectedPlan = ref('');
const planContainer = ref(null);

provide('account_activeTab', activeEventTab);

const activeAdvantageTab = ref('checkout_list')
provide('checkout_activeTab', activeAdvantageTab);


const account_to_update = ref(null);
provide('account_to_update', account_to_update);

const checkout_to_update = ref(null);
provide('checkout_to_update', checkout_to_update);

const router = useRouter();

const setPlan = (data, eNumber, total) => {
  planInfo.value['planName'] = data.name;
  planInfo.value['plan'] = data;
  planInfo.value['total'] = total;
  planInfo.value['establishmentNumber'] = eNumber;
  activeName.value = 'checkout';
  generatePaymentIntention();
  loadPaymentForm();
  loadCustomerInfo();
}

const loadCustomerInfo = () => {

  planInfo.value['uFName'] = userStore.user.firstname;
  planInfo.value['uLName'] = userStore.user.lastname;
  planInfo.value['uEmail'] = userStore.user.email;
  planInfo.value['cName'] = userStore.user.customer.name;
  planInfo.value['cAdress'] = userStore.user.customer.address1;
  planInfo.value['cSAdress'] = userStore.user.customer.address2;
  planInfo.value['cZip'] = userStore.user.customer.zipcode;
  planInfo.value['cCity'] = userStore.user.customer.city;
  planInfo.value['cCountry'] = userStore.user.customer.country;
}

// const createAccount = async () => {
//   const response = await new Promise((resolve,) => {
//     services.post_Record('/account/create', {
//       name: planInfo.value.cName,
//       firstname: planInfo.value.uFName,
//       lastname: planInfo.value.uLName,
//       password: planInfo.value.uPassword,
//       email: planInfo.value.uEmail,
//       city: planInfo.value.cCity,
//       zipcode: planInfo.value.cZip,
//       country: planInfo.value.cCountry,
//       address1: planInfo.value.cAdress,
//       address2: planInfo.value.cSAdress,
//       plan: planInfo.value.plan.tag
//     }, (response) => {
//       resolve(response)
//     }, true);
//   });

//   if (response) {
//     return response;
//   }
// }

const subscribe = async () => {
  showSpinner.value = true;

  const processPaymentBtn = document.querySelector("#processPaymentBtn");
  if (!processPaymentBtn.hasAttribute('disabled')) {
    processPaymentBtn.setAttribute('disabled', 'true');

    const result = await stripeClient.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: {
        card,
        billing_details: {
          email: planInfo.value.uEmail
        }
      }
    })

    if (result.error) {
      displayError.textContent = result.error.message;
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        displaySuccess.textContent = 'Payment send with success.';
        card.clear();
        activateAccount();

        displaySuccess.textContent = '';
      }
    }

    showSpinner.value = false;

    processPaymentBtn.removeAttribute('disabled');
  }
}

const activateAccount = async () => {
  const response = await new Promise((resolve) => {
    services.post_Record('/subscription/create', {
      customer: userStore.user.customer.tag,
      plan: planInfo.value.plan.tag,
      amount: planInfo.value.total,
      email: planInfo.value.uEmail,
      updated_at: moment().format('YYYY-MM-DD'),
      expired_at: moment().add(366, 'days').format('YYYY-MM-DD'),
      card_name: planInfo.value.cardName
    }, (response) => {
      resolve(response)
    }, true);
  });

  if (response.status == 200 && response.data) {
    if (response.data != "ok") {
      ElMessage({
        message: h('p', null, [
          h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Information:'),
          h('span', { style: "font-size: 13px;" }, "An error was occured!"),
        ]),
      })
    } else {
      ElMessage({
        message: h('p', null, [
          h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Information:'),
          h('span', { style: "font-size: 13px;" }, "Your subscription has been successfully updated!"),
        ]),
      })
      setTimeout(() => {
        router.push(`/customer/${userStore.user.customer.tag}/account/subscriptions/list`);
      }, 2000);
    }
  }
}

const appStore = useAppStore();

onBeforeMount(async () => {
  const response = await new Promise((resolve) => {
    services.get_Record('/plan/list', (response) => {
      resolve(response)
      if (response.status == 404) {
        appStore.isLoading = false;
      }
    }, true);
  });

  if (response.status == 200 && response.data) {
    const data = response.data
    plans.value = data.sort((a, b) => a.id - b.id);
  }
})

const generatePaymentIntention = async () => {
  try {
    stripeServer = Stripe(import.meta.env.VITE_SECRET_STRIPE_KEY);
    paymentIntent = await stripeServer.paymentIntents.create({
      amount: planInfo.value.total * 100,
      currency: 'usd',
      description: `Payment for ${planInfo.value.establishmentNumber && planInfo.value.establishmentNumber > 0 ? planInfo.value.establishmentNumber : 1} establishment(s) with the plan ${planInfo.value.plan.name}.`,
      statement_descriptor: 'Payment plan e-rep.',
      metadata: {
        product_uuid: "prod_PJ8c4FT7hctl4S"
      }
    })
  } catch (e) {
    console.log(e);
  }
}

const loadPaymentForm = async () => {
  stripeClient = await loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_KEY);

  stripeElements = stripeClient.elements();
  card = stripeElements.create('card');
  displayError = document.querySelector('#card-errors');
  displaySuccess = document.querySelector('#card-success');
  card.mount('#card-element');

  card.addEventListener('change', ({ error }) => {
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  })
};

onMounted(() => {
  var w3cxDiv = document.createElement("div");
  w3cxDiv.id = "w3cx";
  document.getElementById("app").appendChild(w3cxDiv);
  let w3cx = document.createElement("script");
  w3cx.setAttribute("src", "https://downloads-global.3cx.com/downloads/livechatandtalk/v1/callus.js");
  w3cx.setAttribute("id", "tcx-callus-js");
  w3cx.setAttribute("charset", "utf-8");
  document.getElementById("w3cx").appendChild(w3cx);
})

</script>
<style>
button.isLoaded {
  display: flex;
  justify-content: center;
  align-items: center;
}

.terms-conditions-link {
  color: var(--color-bg2);
  font-weight: 600;
  text-decoration: underline;
}

.subscription__container .el-tabs--card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.subscription__container {
  width: 100%;
}

.subscription-page-header {
  width: 100vw;
  height: 5rem;
  position: fixed;
  top: 0;
  z-index: 11;
  color: var(--color-white);
  background: rgb(66, 72, 144);
  background: linear-gradient(180deg, rgba(216, 217, 226, 1) 0%, white 100%);
  border-bottom: 1px solid rgba(66, 72, 144, .1);
}

.left-content {
  width: 65% !important;
}

.right-content {
  width: 35% !important;
}

.subscription-page-header .container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.subscription-page-header .login-link {
  color: #111;
  font-weight: 600;
}

.subscription-page-header .login-link:hover {
  text-decoration: underline;
}

.subscription-tabs {
  margin-top: 0 !important;
}

.subscription-tabs .tab-pane-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding-bottom: 32px;
  padding-top: 0 !important;
}

.subscription-tabs .tab-pane-header h6 {
  text-transform: uppercase;
  font-weight: 400;
  color: #112;
}

.subscription-tabs .tab-pane-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-block: 16px;
}

.subscription-tabs .el-tabs__header {
  display: none;
}

.subscription__container .plan-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding-block: 16px;
  width: 100%;
  gap: 32px;
}

.subscription__container .el-tabs__content,
.subscription__container .el-tab-pane {
  width: 100%;
  position: relative;
}

.subscription__container .el-tab-pane {
  padding-bottom: 100px;
}
</style>
<style scoped>
.app__title {
  font-weight: 800;
  color: var(--color-bg);
}

.btn-navigation {
  width: 140px;
  margin: 24px 8px;
}

.btn-navigation.absolute {
  position: absolute;
}

.navigation-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px 8px;
  margin-top: 12px;
}

.subscription__container .form-group {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-inline: auto;
  max-width: 600px;
  width: 100%;
}

.subscription__container .form-group label {
  margin-top: 16px;
}

.subscription__container button[type=submit] {
  background-color: var(--color-danger) !important;
  color: var(--color-white) !important;
}

button[type=button] {
  color: var(--color-danger) !important;
  border: solid 1px var(--color-danger) !important;
}

.subscription__container .field-msg {
  font-size: 14px;
  color: var(--color-danger);
}

.summary-card {
  display: flex;
  width: 100% !important;
  box-shadow: rgba(149, 157, 165, 0.2) 2px 4px 16px;
  flex-basis: 150px;
  padding: 28px 24px !important;
  border-radius: 10px;
  border-radius: 12px;
  border: 1px outset rgba(149, 157, 165, 0.1);
  cursor: pointer;
}

.summary-card__content {
  width: 360px;
}

.summary-card__content h1 {
  border-bottom: rgba(116, 116, 116, .4) 1px solid;
  width: 100%;
  margin-block: 12px 8px;
}

.summary-card__content table td {
  padding-block: 4px;
  font-size: .85rem;
}

#card-success {
  color: var(--color-success);
  font-size: .85rem;
  font-weight: bold;
}

#card-errors {
  color: var(--color-danger3);
  font-size: .85rem;
  font-weight: bold;
}

input {
  caret-color: var(--color-primary) !important;
}

.subscription__container button {
  min-height: 46px;
}

@media (max-width: 768px) {
  .summary-card__content {
    width: 100%;
  }

  .left-content {
    width: 100% !important;
  }

  .right-content {
    width: 100% !important;
  }

  .account-summary {
    padding: 0 !important;
  }
}
</style>