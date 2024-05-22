<template>
  <div class="subscription__container">
    <div class="subscription-page-header">
      <div class="container" style="padding-inline: 16px;">
        <!-- <a :href="'/'" class="flex items-center">
          <span class="self-center text-xl font-bold whitespace-nowrap dark:text-white"
            style="color: var(--color-danger)">eReputation</span>
        </a> -->
        <a :href="baseurl" class="flex items-center">
          <div v-if="appStore.account && appStore.account.logo" class="nav-logo">
            <img :src="appStore.account.logo">
          </div>
          <span v-else-if="appStore.account && appStore.account.brand"
            class="self-center text-xl font-bold whitespace-nowrap dark:text-white">{{
              appStore.account.brand }}</span>
        </a>
        <RouterLink :to="`/`" class="relative p-2 login-link">
          <span class="font-bolder"> Sign In</span>
        </RouterLink>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="demo-tabs subscription-tabs container">
      <el-tab-pane name="plan">
        <div class="tab-pane-header">
          <h6>STEP 1 OF 3</h6>
          <div class="app__title">
            <h1>Choose your plan</h1>
          </div>
        </div>
        <div v-if="plans" class="plan-container" ref="planContainer">
          <plan-card v-for="item in plans" :key="item.tag" :data="item" @selected="setPlan"></plan-card>
          <!-- <plan-card name="Basic 1-Year" :price="9.99" devise="$" :active="selectedPlan == 'basic-1'" :items="[
            '1 establishement (1 QR CODE by establishment)',
            'Illimited intern reviews',
            'Illimited leads',
            'Illimited events',
            '3 monitored points of sale (1 QR Code by point of sale)']" @click="selectedPlan = 'basic-1'"
            @selected="setPlan"></plan-card>
          <plan-card name="Custom Basic 1-Year" :active="selectedPlan == 'c-basic-1'" :hasinput="true" :price="9.99"
            :addprice="4.99" devise="$" :items="[
              'Illimited intern reviews',
              'Illimited leads',
              'Illimited events',
              '3 monitored points of sale (1 QR Code by point of sale)']" @click="selectedPlan = 'c-basic-1'"
            @selected="setPlan"></plan-card>
          <plan-card name="Premium 1-Year" :active="selectedPlan == 'premium'" :premium="true" :items="[
            'Illimited intern reviews',
            'Illimited leads',
            'Illimited events',
            'Illimited monitored points of sale (QR Codes illimited)',
            'Leads integration in your CRM',
            'Sales integration (API)']" @click="selectedPlan = 'premium'" @selected="setPlan"></plan-card> -->
        </div>
        <!-- <div class="navigation-container">
          <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'user-info'">Next</button>
        </div> -->
      </el-tab-pane>
      <el-tab-pane name="user-info">
        <div class="tab-pane-header">
          <h6>STEP 2 OF 3</h6>
          <div class="app__title">
            <h1>Fill your account informations</h1>
          </div>
        </div>
        <form @submit.prevent="submitUserForm">
          <div class="form-group">
            <p class="mb-5">User informations</p>
            <div class="w-full">
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                name <span>*</span></label>
              <input v-model="planInfo.uFName" type="text" id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$User.uFName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="ulast_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                name <span>*</span></label>
              <input v-model="planInfo.uLName" type="text" id="ulast_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$User.uLName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                <span>*</span></label>
              <input v-model="planInfo.uEmail" type="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$User.uEmail.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password
                <span>*</span></label>
              <input v-model="planInfo.uPassword" type="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$User.uPassword.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="cpassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                password
                <span>*</span></label>
              <input v-model="planInfo.uCPassword" type="password" id="cpassword"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$User.uCPassword.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <!-- <span v-for="error in v$User.$errors" :key="error.uid">{{ error.$property }} - {{ error.$message }}</span> -->
          </div>
          <div class="navigation-container">
            <button type="button" class="btn btn-primary-3 btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'plan'">Previous</button>
            <!-- <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'company-info'">Next</button> -->
            <button type="submit" class="btn btn-primary-3 btn-navigation"
              :class="showSpinner == true ? 'isLoaded' : ''" style="margin-top: 12px; border-radius: 2px;">
              <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Next</span>
            </button>
          </div>
        </form>
      </el-tab-pane>
      <el-tab-pane name="company-info">
        <div class="tab-pane-header">
          <h6>STEP 2 OF 3</h6>
          <div class="app__title">
            <h1>Fill your account informations</h1>
          </div>
        </div>
        <form @submit.prevent="submitCompanyForm">
          <div class="form-group">
            <p class="mb-5">Company informations</p>
            <div class="w-full">
              <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company
                name <span>*</span></label>
              <input v-model="planInfo.cName" type="text" id="company_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$Company.cName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address
                <span>*</span></label>
              <input v-model="planInfo.cAdress" type="text" id="address"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$Company.cAdress.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="saddress" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Secondary
                address</label>
              <input v-model="planInfo.cSAdress" type="text" id="saddress"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
            </div>
            <div class="w-full">
              <div class="grid gap-6 md:grid-cols-4">
                <div>
                  <label for="zip" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ZIP Code
                    <span>*</span></label>
                  <input v-model="planInfo.cZip" type="text" id="zip"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                  <!-- <span v-for="error in v$Company.cZip.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span> -->
                </div>
                <div>
                  <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                    <span>*</span></label>
                  <input v-model="planInfo.cCity" type="text" id="city"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                  <!-- <span v-for="error in v$Company.cCity.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span> -->
                </div>
                <div class="md:col-span-2 mb-4">
                  <label for="country"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                  <select v-model="planInfo.cCountry" id="country"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                    <option v-for="(country, index) in countries" :key="index">{{ country.name }}</option>
                  </select>
                  <!-- <span v-for="error in v$Company.cCountry.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span> -->
                </div>
              </div>
              <div class="w-full inline-flex items-center gap-2 mt-5">
                <input v-model="planInfo.acceptConditions" type="checkbox" id="coding" name="interest" value="coding"
                  required />
                <label for="coding">I read and accept <a href="" class="terms-conditions-link">Terms and Conditions</a>
                  of
                  service.</label>
              </div>
            </div>
          </div>
          <div class="navigation-container">
            <button type="button" class="btn btn-primary-3 btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'user-info'">Previous</button>
            <button type="submit" v-if="planInfo.acceptConditions" class="btn btn-primary-3 btn-navigation"
              :class="showSpinner == true ? 'isLoaded' : ''" style="margin-top: 12px; border-radius: 2px;">
              <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Sign In</span>
            </button>
            <button v-if="userCreated && planInfo.acceptConditions" type="button"
              class="btn btn-primary-3 btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'checkout'">
              Back
            </button>
          </div>
        </form>
      </el-tab-pane>

      <el-tab-pane name="checkout">
        <div class="tab-pane-header">
          <h6>STEP 3 OF 3</h6>
          <div class="app__title">
            <h1>Checkout</h1>
          </div>
        </div>
        <div class="w-full">
          <div class="flex flex-col items-start lg:flex-row lg:space-x-8 p-4">
            <div class="flex-1">
              <SubscriptionSummary :data="planInfo"></SubscriptionSummary>
            </div>
            <div class="shrink-0 lg:order-2">
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
              <div class="summary-card shrink-0 lg:order-2 my-4">
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
                      class="btn btn-primary-3" :class="showSpinner == true ? 'isLoaded' : ''"
                      style="margin-top: 12px; border-radius: 2px; width: 208px;" @click="() => subscribe()">
                      <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Process to
                        payment</span>
                    </button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="navigation-container"> -->
        <button class="btn btn-primary-3 btn-navigation" style="margin-top: 12px; border-radius: 2px;"
          @click="activeName = 'company-info'">Previous</button>
        <!-- </div> -->
      </el-tab-pane>
    </el-tabs>
    <call-us-selector phonesystem-url="https://m-unit.on3cx.fr:5001" :party="chatID"></call-us-selector>
  </div>
</template>

<script setup>
import { ref, provide, onBeforeMount, defineAsyncComponent, inject } from 'vue';
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
import { countries } from '@Services/input-list.js';

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

const baseurl = window.location.origin;

const planInfo = ref({});
const showSpinner = ref(false)
const userCreated = ref(false)
const app_url = inject('app_url');

const submitUserForm = async () => {
  showSpinner.value = true;
  if (planInfo.value.uPassword && planInfo.value.uCPassword && planInfo.value.uPassword != planInfo.value.uCPassword) {
    postErrorMsg.value = "Passwords don't match!";
    showPostErrorMsg();
  } else {
    activeName.value = 'company-info';
  }
  showSpinner.value = false;

}

const submitCompanyForm = async () => {
  showSpinner.value = true;
  createAccount().then((response) => {
    if (response.status == 200) {
      planInfo.value.customer = response.data.customer.tag;
      showSpinner.value = false;
      activeName.value = 'checkout';
      userCreated.value = true
    } else {
      showSpinner.value = false;
      postErrorMsg.value = response.data;
      showPostErrorMsg();
    }
  }).catch((error) => { console.log(error); showSpinner.value = false; })
}

const showPostErrorMsg = () => {
  ElMessage({
    message: h('p', null, [
      h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Saving error(s):'),
      h('span', { style: "font-size: 13px;" }, postErrorMsg.value),
    ]),
  })
}

let stripeClient = null;
let stripeServer = null;
let stripeElements = null;
let paymentElements = null;
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

const postErrorMsg = ref(null);

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
  activeName.value = 'user-info';
  generatePaymentIntention();
  loadPaymentForm();
}

const createAccount = async () => {
  const response = await new Promise((resolve,) => {
    services.post_Record('/account/create', {
      name: planInfo.value.cName,
      firstname: planInfo.value.uFName,
      lastname: planInfo.value.uLName,
      password: planInfo.value.uPassword,
      email: planInfo.value.uEmail,
      city: planInfo.value.cCity,
      zipcode: planInfo.value.cZip,
      country: planInfo.value.cCountry,
      address1: planInfo.value.cAdress,
      address2: planInfo.value.cSAdress,
      plan: planInfo.value.plan.tag
    }, (response) => {
      resolve(response)
    }, true);
  });

  if (response) {
    return response;
  }
}

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
        activateAccount(app_url.value);

        displaySuccess.textContent = '';
      }
    }

    showSpinner.value = false;

    processPaymentBtn.removeAttribute('disabled');
  }
}

const activateAccount = async (app_url) => {
  const response = await new Promise((resolve) => {
    services.post_Record('/subscription/create', {
      customer: planInfo.value.customer,
      plan: planInfo.value.plan.tag,
      amount: planInfo.value.total,
      email: planInfo.value.uEmail,
      updated_at: moment().format('YYYY-MM-DD'),
      expired_at: moment().add(366, 'days').format('YYYY-MM-DD'),
      card_name: planInfo.value.cardName,
      app_url: app_url
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
          h('span', { style: "font-size: 13px;" }, "Your account has been successfully created! You will be redirected to the login page in 3s..."),
        ]),
      })
      setTimeout(() => {
        router.push(`/`);
      }, 5000);
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



</script>
<style>
.nav-logo {
  /* height: 28px; */
  height: 48px;
  margin-right: 24px;
  padding: 8px 16px;
  background-color: var(--color-white);
  border-radius: 24px;
}

.nav-logo img {
  width: auto;
  height: 100%;
}

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

.subscription-tabs .tab-pane-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding-block: 32px;
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

.subscription-tabs {
  margin-top: 80px;
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

@media (min-width: 768px) and (max-width: 1024px) {
  form {
    margin: 0 50px;
  }
}

/* Ajustements pour les mobiles */
@media (max-width: 768px) {
  form {
    margin: 0 25px;
  }
}

@media (max-width: 500px) {
  form {
    margin: 0 10px;
  }
}
</style>