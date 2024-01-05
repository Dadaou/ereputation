<template>
  <div class="subscription__container">
    <div class="subscription-page-header">
      <div class="container" style="padding-inline: 16px;">
        <a :href="'/'" class="flex items-center">
          <span class="self-center text-xl font-bold whitespace-nowrap dark:text-white"
            style="color: var(--color-danger)">eReputation</span>
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
            <h1>Choose your plan.</h1>
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
            <h1>Fill your account informations.</h1>
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
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                name <span>*</span></label>
              <input v-model="planInfo.uLName" type="text" id="last_name"
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
              <label for="cpassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password
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
            <button type="button" class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'plan'">Previous</button>
            <!-- <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'company-info'">Next</button> -->
            <button type="submit" class="btn btn-primary btn-navigation"
              style="margin-top: 12px; border-radius: 2px;">Next</button>
          </div>
        </form>
      </el-tab-pane>
      <el-tab-pane name="company-info">
        <div class="tab-pane-header">
          <h6>STEP 2 OF 3</h6>
          <div class="app__title">
            <h1>Fill your account informations.</h1>
          </div>
        </div>
        <form @submit.prevent="submitCompanyForm">
          <div class="form-group">
            <p class="mb-5">Company informations</p>
            <div class="w-full">
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company
                name <span>*</span></label>
              <input v-model="planInfo.cName" type="text" id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$Company.cName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address
                <span>*</span></label>
              <input v-model="planInfo.cAdress" type="text" id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
              <!-- <span v-for="error in v$Company.cAdress.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span> -->
            </div>
            <div class="w-full">
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Secondary
                adress</label>
              <input v-model="planInfo.cSAdress" type="text" id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
            </div>
            <div class="w-full">
              <div class="grid gap-6 md:grid-cols-4">
                <div>
                  <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ZIP Code
                    <span>*</span></label>
                  <input v-model="planInfo.cZip" type="text" id="first_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                  <!-- <span v-for="error in v$Company.cZip.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span> -->
                </div>
                <div>
                  <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                    <span>*</span></label>
                  <input v-model="planInfo.cCity" type="text" id="first_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                  <!-- <span v-for="error in v$Company.cCity.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span> -->
                </div>
                <div class="md:col-span-2 mb-4">
                  <label for="last_name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                  <select v-model="planInfo.cCountry" id="last_name"
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
                <label for="coding">I read and accept <a href="" class="terms-conditions-link">Terms and Conditions</a> of
                  service.</label>
              </div>
            </div>
          </div>
          <div class="navigation-container">
            <button type="button" class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
              @click="activeName = 'user-info'">Previous</button>
            <button type="submit" v-if="planInfo.acceptConditions" class="btn btn-primary-2 btn-navigation"
              style="margin-top: 12px; border-radius: 2px;">Sign In</button>
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
                      <td style="text-align:right;"><strong>{{ planInfo.total }}{{ planInfo.plan.currency }}</strong></td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="summary-card shrink-0 lg:order-2 my-4">
                <div class="summary-card__content">
                  <div class="app__title">
                    <h1>Payment information</h1>
                  </div>
                  <div class="w-full my-8" id="card-element"></div>
                  <div id="card-errors" role="alert"></div>
                  <div id="card-success" role="alert"></div>
                  <div style="text-align: right"><button id="processPaymentBtn" class="btn btn-primary-2"
                      style="margin-top: 12px; border-radius: 2px;" @click="() => subscribe()">Process to
                      payment</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="navigation-container"> -->
        <!-- <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'company-info'">Previous</button> -->
        <!-- </div> -->
      </el-tab-pane>
    </el-tabs>
    <call-us-selector phonesystem-url="https://m-unit.on3cx.fr:5001" :party="chatID"></call-us-selector>
  </div>
</template>

<script setup>
import { ref, provide, onBeforeMount } from 'vue';
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
import { ElMessage } from 'element-plus'

const planInfo = ref({});

const submitUserForm = async () => {
  if (planInfo.value.uPassword && planInfo.value.uCPassword && planInfo.value.uPassword != planInfo.value.uCPassword) {
    postErrorMsg.value = "Passwords don't match!";
    showPostErrorMsg();
  } else {
    activeName.value = 'company-info';
  }

}

const submitCompanyForm = async () => {
  console.log("submit form");
  createAccount().then((response) => {
    console.log(response)
    if (response.status == 200) {
      planInfo.value.customer = response.data.customer.tag;
      activeName.value = 'checkout';
    } else {
      postErrorMsg.value = response.data;
      showPostErrorMsg();
    }
  }).catch((error) => { console.log(error); })
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
        displaySuccess.textContent = 'Payment accepted.';
        card.clear();
      }
    }

    processPaymentBtn.removeAttribute('disabled');
  }

  // const response = await new Promise((resolve) => {
  //   services.post_Record('/subscription/create', {
  //     customer: planInfo.value.customer,
  //     plan: planInfo.value.plan.tag,
  //     amount: planInfo.value.total,
  //     email: planInfo.value.uEmail,
  //     updated_at: moment().format('YYYY-MM-DD'),
  //     expired_at: moment().add(366, 'days').format('YYYY-MM-DD')
  //   }, (response) => {
  //     resolve(response)
  //   }, true);
  // });

  // if (response.status == 200 && response.data) {
  //   if (response.data != "ok") {
  //     alert("An error was occured!");
  //   } else {
  //     router.push(`/`);
  //   }
  // }
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
    plans.value = response.data;
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
    console.log(paymentIntent);
  } catch (e) {
    console.log(e);
  }
}

const loadPaymentForm = async () => {
  stripeClient = await loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_KEY);

  //   stripeElements = stripe.elements({
  //     mode: "payment",
  //     amount: 1999,
  //     currency: "usd"
  //   })
  stripeElements = stripeClient.elements();
  card = stripeElements.create('card');
  displayError = document.querySelector('#card-errors');
  displaySuccess = document.querySelector('#card-success');
  card.mount('#card-element');

  console.log(stripeClient);

  card.addEventListener('change', ({ error }) => {
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  })
}

const countries = ref([
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Åland Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D\'Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Lao People\'S Democratic Republic', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia and Montenegro', code: 'CS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
]);

</script>
<style>
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
  /* flex-direction: column;
  justify-content: flex-start;
  text-align: center; */
  box-shadow: rgba(149, 157, 165, 0.2) 2px 4px 16px;
  flex-basis: 150px;
  padding: 28px 38px;
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

@media (max-width: 768px) {
  .summary-card__content {
    width: 100%;
  }

  .summary-card {
    width: 100%;
  }
}
</style>