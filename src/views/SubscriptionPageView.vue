<template>
  <div class="subscription__container">
    <div class="subscription-page-header">
      <div class="next-container" style="padding-inline: 16px;">
        <a :href="baseurl" class="flex items-center">
          <div v-if="appStore.account && appStore.account.logo" class="nav-logo">
            <img :src="linkystar" alt="logo" />
          </div>
          <span class="subscription-menu">My account</span>
        </a>
        <div class="subscription__right-nav">
          <RouterLink :to="`/`" class="relative p-2 login-link mr-6">
            <span class="font-bolder"> Login</span>
          </RouterLink>
          <div class="feedback__option">
            <a href="https://wa.me/message/IZFK26272CXFB1" target="_blank">
              <i class="fa fa-whatsapp"></i>
            </a>
            <LanguageMenuDropdown :current="currentLanguage" @select="(language) => selectCurrentLanguage(language)" />
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="demo-tabs subscription-tabs next-container">

      <el-tab-pane name="user-info">
        <div class="tab-pane-header">
          <!-- <h6>STEP 2 OF 3</h6> -->
          <div class="section__title">
            <p class="mt-4">Please fill out the form to create your account</p>
          </div>
        </div>
        <div class="tab__pane-body w-full">

          <div class="form-group features-list w-50">
            <div v-if="planInfo && planInfo.planName" class="d-inline-flex align-center justify-start mb-5">
              <span class="plan-name mr-2">{{ planInfo.planName }}</span>
              <a :href="`${referrerUrl}pricing`" title="change plan"><i class="uil uil-edit change-plan-icon"></i></a>
            </div>
            <ul v-if="planInfo && planInfo.planName == 'Lead-Gen'">
              <AdvantageList text="Unified QR Codes Hub" />
              <ul class="sub-list-price no-icon mb-4">
                <li>High Definition</li>
                <li>Customizable</li>
              </ul>

              <AdvantageList text="Branded Mobile Website, 5 sections" />
              <ul class="sub-list-price no-icon mb-4">
                <li>MENUS</li>
                <li>INFOS</li>
                <li>REVIEWS</li>
                <li>OFFERS</li>
                <li>FOLLOW US</li>
              </ul>

              <AdvantageList text="Offers Program Platform" />
              <ul class="sub-list-price no-icon mb-4">
                <li>Partners Management</li>
                <li>Digital Ticketing</li>
                <li>Automated Emailing</li>
                <li>Analytics</li>
                <li>Lead Generation</li>
              </ul>
            </ul>
            <ul v-else>
              <AdvantageList text="Unified QR Codes Hub" />
              <ul className="sub-list-price no-icon mb-4">
                <li>High Definition</li>
                <li>Customizable</li>
              </ul>
              <AdvantageList text="Branded Mobile Website, 5 sections" />
              <ul className="sub-list-price no-icon mb-4">
                <li>MENUS</li>
                <li>INFOS</li>
                <li>REVIEWS</li>
                <li>OFFERS</li>
                <li>FOLLOW US</li>
              </ul>
              <AdvantageList text="Offers Program Platform" />
              <ul className="sub-list-price no-icon mb-4">
                <li>Partners Management</li>
                <li>Digital Ticketing</li>
                <li>Automated Emailing</li>
                <li>Analytics</li>
                <li>Lead Generation</li>
              </ul>
              <AdvantageList text="Review Analysis" />
              <ul className="sub-list-price no-icon mb-4">
                <li>Internal Survey per Category</li>
                <li>1 source </li>
                <li>Filters (weather, event)</li>
                <li>1 hashtag</li>
              </ul>
              <AdvantageList text="Competitor Monitoring" />
              <ul className="sub-list-price no-icon mb-4">
                <li>1 competitor</li>
              </ul>
            </ul>

          </div>
          <form class="form-group" @submit.prevent="submitForm">
            <p class="my-5">Already have an account? Click the link below to access your dashboard:<a href="/sign-in"
                class="register-link mx-3">Login</a></p>
            <p class="mb-5">User informations</p>
            <div class="w-full">
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                name <span>*</span></label>
              <input v-model="planInfo.uFName" type="text" id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="ulast_name" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Last
                name <span>*</span></label>
              <input v-model="planInfo.uLName" type="text" id="ulast_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="email" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Email
                <span>*</span></label>
              <input v-model="planInfo.uEmail" type="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="password" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Password
                <span>*</span></label>
              <input v-model="planInfo.uPassword" type="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="cpassword" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Confirm
                password
                <span>*</span></label>
              <input v-model="planInfo.uCPassword" type="password" id="cpassword"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <p class="mb-5 mt-8">Company informations</p>
            <div class="w-full">
              <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company
                name <span>*</span></label>
              <input v-model="planInfo.cName" type="text" id="company_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="address" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Address
                <span>*</span></label>
              <input v-model="planInfo.cAdress" type="text" id="address"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
            </div>
            <div class="w-full">
              <label for="saddress" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Secondary
                address</label>
              <input v-model="planInfo.cSAdress" type="text" id="saddress"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
            </div>
            <div class="w-full">
              <div class="grid gap-6 md:grid-cols-4">
                <div>
                  <label for="zip" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">ZIP Code
                    <span>*</span></label>
                  <input v-model="planInfo.cZip" type="text" id="zip"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                </div>
                <div>
                  <label for="city" class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">City
                    <span>*</span></label>
                  <input v-model="planInfo.cCity" type="text" id="city"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                </div>
                <div class="md:col-span-2 mb-0">
                  <label for="country"
                    class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                  <select v-model="planInfo.cCountry" id="country"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                    <option v-for="(country, index) in countries" :key="index">{{ country.name }}</option>
                  </select>
                </div>
              </div>
              <div class="w-full inline-flex items-center gap-2 mt-5">
                <input v-model="planInfo.acceptConditions" type="checkbox" id="coding" name="interest" value="coding"
                  required />
                <label for="coding">I read and accept <a href="" class="terms-conditions-link">Terms and
                    Conditions</a>
                  of
                  service.</label>
              </div>
            </div>

            <div class="d-inline-flex justify-content-between align-items-center mt-5 mb-5">
              <!-- <button type="button" class="btn subscription-button btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'plan'">Previous</button> -->
              <button type="submit" class="btn subscription-button" :class="showSpinner == true ? 'isLoaded' : ''"
                style="margin-top: 12px; border-radius: 2px;">
                <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Create my account</span>
              </button>
            </div>
          </form>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane name="company-info">
        <div class="tab-pane-header">
          <div class="section__title">
            <p class="mt-4">Please fill out the form to create your account</p>
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
            </div>
            <div class="w-full">
              <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address
                <span>*</span></label>
              <input v-model="planInfo.cAdress" type="text" id="address"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
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
                </div>
                <div>
                  <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                    <span>*</span></label>
                  <input v-model="planInfo.cCity" type="text" id="city"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                </div>
                <div class="md:col-span-2 mb-4">
                  <label for="country"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                  <select v-model="planInfo.cCountry" id="country"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                    <option v-for="(country, index) in countries" :key="index">{{ country.name }}</option>
                  </select>
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
            <button type="button" class="btn subscription-button btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'user-info'">Previous</button>
            <button type="submit" v-if="planInfo.acceptConditions" class="btn subscription-button btn-navigation"
              :class="showSpinner == true ? 'isLoaded' : ''" style="margin-top: 12px; border-radius: 2px;">
              <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Sign In</span>
            </button>
            <button v-if="userCreated && planInfo.acceptConditions" type="button"
              class="btn subscription-button btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'checkout'">
              Back
            </button>
          </div>
        </form>
      </el-tab-pane> -->

      <el-tab-pane name="checkout">
        <div class="tab-pane-header">
          <h6>STEP 3 OF 3</h6>
          <div class="section__title">
            <p class="mt-4">Checkout</p>
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
                  <div class="section__title">
                    <p class="mt-4">Order Summary</p>
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
                  <div class="section__title">
                    <p class="mt-4">Payment information</p>
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
                      class="btn subscription-button" :class="showSpinner == true ? 'isLoaded' : ''"
                      style="margin-top: 12px; border-radius: 2px; width: 208px;" @click="() => subscribe()">
                      <SpinnerComponent v-if="showSpinner == true" :color="'red'" /> <span v-else>Process to
                        payment</span>
                    </button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn subscription-button btn-navigation" style="margin-top: 12px; border-radius: 2px;"
          @click="activeName = 'user-info'">Previous</button>
      </el-tab-pane>
    </el-tabs>
    <call-us-selector phonesystem-url="https://m-unit.on3cx.fr:5001" :party="chatID"></call-us-selector>
  </div>
</template>

<script setup>
import { ref, provide, onBeforeMount, defineAsyncComponent, inject, onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import PlanCard from '@Components/subscription/PlanCard.vue';
import SubscriptionSummary from '@Components/subscription/SubscriptionSummary.vue';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
// import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from 'stripe';
import { useRouter, useRoute } from 'vue-router';
import { h } from 'vue'
import { ElMessage } from 'element-plus';
import { countries } from '@Services/input-list.js';
import linkystar from '@/assets/images/logo/LinkyStar.png'
import { current } from '@Services/languages.js';
import { useI18n } from "vue-i18n";
// import { i18n } from '@/i18n';

const SpinnerComponent = defineAsyncComponent(() =>
  import('@Components/utils/SpinnerComponent.vue')
)

const LanguageMenuDropdown = defineAsyncComponent(
  () => import("@Components/utils/LanguageMenuDropdownComponent.vue")
)

const AdvantageList = defineAsyncComponent(() => import("@Components/subscription/AdvantageList.vue"))

const baseurl = window.location.origin;

const planInfo = ref({});
const showSpinner = ref(false)
const userCreated = ref(false)
const app_url = inject('app_url');
const { locale } = useI18n();


const submitForm = async () => {
  await submitUserForm()
  await submitCompanyForm()
}

const submitUserForm = async () => {
  showSpinner.value = true;
  if (planInfo.value.uPassword && planInfo.value.uCPassword && planInfo.value.uPassword != planInfo.value.uCPassword) {
    postErrorMsg.value = "Passwords don't match!";
    showPostErrorMsg();
  }
  showSpinner.value = false;

}

const currentLanguage = ref(current);

const selectCurrentLanguage = (language) => {
  let svgString = language.svg;

  svgString = svgString.replace('class="h-3.5 w-3.5 rounded-full me-2"', 'class="w-5 h-5 rounded-full me-3"');
  currentLanguage.value = {
    name: language.name,
    code: language.code,
    svg: svgString
  }

  localStorage.setItem("langue", language.code)

  locale.value = language.bb;
};

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

const activeName = ref('user-info');
const activeStaffTab = ref('plan_list')
const plan_to_update = ref(null);
provide('plan_to_update', plan_to_update);
provide('plan_activeTab', activeStaffTab);

const referrerUrl = ref(null);

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

const setPlan = (code, quantity, unity) => {
  // planInfo.value['planName'] = data.name;
  // planInfo.value['plan'] = data;
  // planInfo.value['total'] = total;
  // planInfo.value['establishmentNumber'] = eNumber;
  // activeName.value = 'user-info';
  // generatePaymentIntention();
  // loadPaymentForm();
  if (code == '657b0feaa0258') {
    planInfo.value['planName'] = 'All Inclusive'
    planInfo.value['plan'] = { tag: '66e2cc89a2fa1' }
  } else {
    planInfo.value['planName'] = 'Lead-Gen'
    planInfo.value['plan'] = { tag: '66e2cc52f03f4' }
  }

}

const createAccount = async () => {
  const response = await new Promise((resolve,) => {
    services.post_Record('account/create', {
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
      plan: planInfo.value.plan.tag,
      partner: import.meta.env.VITE_PARTNER_CODE
    }, (response) => {
      resolve(response)
    }, true, true);
  });

  if (response && response.data) {
    console.log(response)
    await createSubscription(app_url.value, response.data.customer);
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
        createSubscription(app_url.value);

        displaySuccess.textContent = '';
      }
    }

    showSpinner.value = false;

    processPaymentBtn.removeAttribute('disabled');
  }
}

const createSubscription = async (app_url, customer) => {
  const response = await new Promise((resolve) => {
    services.post_Record('subscription/create', {
      customer: customer.tag,
      plan: planInfo.value.plan.tag,
      amount: planInfo.value.total,
      email: planInfo.value.uEmail,
      updated_at: moment().format('YYYY-MM-DD'),
      expired_at: moment().add(366, 'days').format('YYYY-MM-DD'),
      // card_name: planInfo.value.cardName,
      app_url: app_url
    }, (response) => {
      resolve(response)
    }, true, true);
  });

  if (response.status == 201 && response.data) {
    ElMessage({
      message: h('p', null, [
        h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Information:'),
        h('span', { style: "font-size: 13px;" }, "Your account has been successfully created!"),
      ]),
    })
  }
  else {
    ElMessage({
      message: h('p', null, [
        h('h4', { style: "color: #f75842; font-weight: bold;" }, 'Information:'),
        h('span', { style: "font-size: 13px;" }, "An error was occured!"),
      ]),
    })
  }
}

const appStore = useAppStore();
const route = useRoute();

onBeforeMount(async () => {

  const { c, q, u } = route.query

  if (c && q && u) {
    setPlan(c, q, u)
  }

  const response = await new Promise((resolve) => {
    services.get_Record('plan/list', (response) => {
      resolve(response)
      if (response.status == 404) {
        appStore.isLoading = false;
      }
    }, true, true);
  });

  if (response.status == 200 && response.data) {
    const data = response.data
    plans.value = data.sort((a, b) => a.id - b.id);
  }
})

onMounted(() => {
  referrerUrl.value = document.referrer;
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
  const stripe = () => import("@stripe/stripe-js");
  stripeClient = await stripe.loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_KEY);

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
.subscription-button {
  /* height: 40px; */
  cursor: pointer;
  transition: var(--transition);
  background-color: #2da8e0 !important;
}

.features-list {
  margin-top: 30px;
}

/* .features-list ul {
  padding: 0;
  margin: 0;
} */

.features-list ul li {
  margin-top: 10px;
  position: relative;
  /* font-size: 18px; */
  padding-left: 25px;
  /* color: #02021e; */
  font-weight: 400;
}

.sub-list-price {
  margin-left: 30px !important;

}

.sub-list-price li {
  margin-top: 0 !important;
  font-size: 14px !important;
  line-height: 220%;
}

.no-icon li::before {
  content: none !important;
}

.nav-logo {
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

.register-link {
  /* font-size: .80rem !important; */
  color: #2da8e0 !important;
  font-weight: 700;
  text-decoration: underline !important;
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
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  background-color: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0);
  padding-block: 30px;
}

.subscription-page-header .next-container {
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

.subscription-menu {
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  outline: none !important;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.35s ease-in-out;
  font-weight: 500;
  color: #02021e !important;
  display: inline-block;
  text-transform: capitalize;
  line-height: 1;
}

.next-container {
  width: 100%;
  padding-right: var(--bs-gutter-x, .75rem);
  padding-left: var(--bs-gutter-x, .75rem);
  margin-right: auto;
  margin-left: auto;
}

.section__title {
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 28px !important;
  color: #617686 !important;
  text-align: center !important;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-family: "GeneralSans", sans-serif;
  margin-bottom: 30px;
}

.feedback__option {
  display: flex;
  align-items: center;
  gap: 20px;
}

.feedback__option i {
  font-size: 35px;
}

.subscription__right-nav {
  display: inline-flex;

}

.form-group {
  box-sizing: border-box;
  margin: 0;
  border: 0;
  outline: 0;
  background-color: #fff;
  padding: 40px 45px;
  box-shadow: 0px 4px 80px rgba(8, 15, 30, 0.06);
  border-radius: 10px;
  width: 48%;
}

.form-group.features-list {
  box-shadow: none;
}

.tab__pane-body {
  display: inline-flex;
  column-gap: 20px;
}

.plan-name {
  font-size: 20px !important;
  font-weight: 600 !important;
}

.change-plan-icon {
  color: #2da8e0;
}

/* Ajustements pour les mobiles */

@media (max-width: 500px) {
  form {
    margin: 0 10px;
  }
}

@media (max-width: 768px) {
  form {
    margin: 0 25px;
  }

  .tab__pane-body {
    display: flex;
    flex-direction: column;
    column-gap: 20px;
  }

  .form-group {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  form {
    margin: 0 50px;
  }
}

@media (min-width: 576px) {

  .next-container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {

  .next-container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {

  .next-container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {

  .next-container {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {

  .next-container {
    max-width: 1320px;
  }
}
</style>