<template>
  <div class="subscription__container">
    <div class="subscription-page-header">
      <div class="container" style="padding-inline: 16px;">
        <a :href="baseurl" class="flex items-center">
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
        <div class="plan-container" ref="planContainer">
          <plan-card name="Basic 1-Year" :price="9.99" devise="$" :active="selectedPlan == 'basic-1'" :items="[
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
            'Sales integration (API)']" @click="selectedPlan = 'premium'" @selected="setPlan"></plan-card>
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$User.uFName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <div class="w-full">
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                name <span>*</span></label>
              <input v-model="planInfo.uLName" type="text" id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$User.uLName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <div class="w-full">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                <span>*</span></label>
              <input v-model="planInfo.uEmail" type="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$User.uEmail.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <div class="w-full">
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password
                <span>*</span></label>
              <input v-model="planInfo.uPassword" type="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$User.uPassword.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <div class="w-full">
              <label for="cpassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password
                <span>*</span></label>
              <input v-model="planInfo.uCPassword" type="password" id="cpassword"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$User.uCPassword.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <!-- <span v-for="error in v$User.$errors" :key="error.uid">{{ error.$property }} - {{ error.$message }}</span> -->
          </div>
          <div class="navigation-container">
            <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$Company.cName.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
            </div>
            <div class="w-full">
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adress
                <span>*</span></label>
              <input v-model="planInfo.cAdress" type="text" id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
              <span v-for="error in v$Company.cAdress.$errors" :key="error.$uid" class="field-msg">
                {{ error.$message }}
              </span>
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
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                  <span v-for="error in v$Company.cZip.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span>
                </div>
                <div>
                  <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                    <span>*</span></label>
                  <input v-model="planInfo.cCity" type="text" id="first_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                  <span v-for="error in v$Company.cCity.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span>
                </div>
                <div class="md:col-span-2 mb-4">
                  <label for="last_name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                  <select v-model="planInfo.cCountry" id="last_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    <option v-for="(country, index) in countries" :key="index">{{ country.name }}</option>
                  </select>
                  <span v-for="error in v$Company.cCountry.$errors" :key="error.$uid" class="field-msg">
                    {{ error.$message }}
                  </span>
                </div>
              </div>
              <div class="w-full inline-flex items-center gap-2 mt-5">
                <input v-model="planInfo.acceptConditions" type="checkbox" id="coding" name="interest" value="coding" />
                <label for="coding">I read and accept <a href="" class="terms-conditions-link">Terms and Conditions</a> of
                  service.</label>
              </div>

            </div>
          </div>
          <div class="navigation-container">
            <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
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
        <div class="navigation-container">
          <div class="w-full">
            <div class="grid gap-6 md:grid-cols-2">
            </div>
          </div>
          <!-- <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'company-info'">Previous</button> -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import PlanCard from '@Components/subscription/PlanCard.vue';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import useVuelidate from '@vuelidate/core'
import { required, minLength, email, sameAs, helpers } from '@vuelidate/validators'

const planInfo = ref({});

const userRules = computed(() => {
  return {
    uFName: { required },
    uLName: { required },
    uEmail: { required, email },
    uPassword: { required, minLength: minLength(8) },
    uCPassword: { required, sameAs: helpers.withMessage("The value must be equal to the password value.", sameAs(planInfo.value.uPassword)) }
  }
});

const companyRules = computed(() => {
  return {
    cName: { required },
    cAdress: { required },
    cCity: { required },
    cCountry: { required },
    cZip: { required },
  }
});

const v$User = useVuelidate(userRules, planInfo);
const v$Company = useVuelidate(companyRules, planInfo);

const submitUserForm = async () => {
  const result = await v$User.value.$validate();
  if (result) {
    activeName.value = 'company-info';
  } else {
    console.log("error");
  }
}

const submitCompanyForm = async () => {
  const result = await v$Company.value.$validate();
  if (result) {
    activeName.value = 'checkout';
  } else {
    console.log("error");
  }
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
])

const activeName = ref('plan');
const activeStaffTab = ref('plan_list')
const plan_to_update = ref(null);
provide('plan_to_update', plan_to_update);
provide('plan_activeTab', activeStaffTab);

const activeEventTab = ref('account_list')
const selectedPlan = ref('');
const planContainer = ref(null);

provide('account_activeTab', activeEventTab);

const activeAdvantageTab = ref('checkout_list')
provide('checkout_activeTab', activeAdvantageTab);


const account_to_update = ref(null);
provide('account_to_update', account_to_update);

const checkout_to_update = ref(null);
provide('checkout_to_update', checkout_to_update);

const setPlan = (name, eNumber) => {
  planInfo.value['planName'] = name;
  planInfo.value['establishmentNumber'] = eNumber;
  activeName.value = 'user-info'
}

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
  position: sticky;
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

/* .subscription-tabs {
  padding: 32px 0;
} */

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

.subscription__container .field-msg {
  font-size: 14px;
  color: var(--color-danger);
}
</style>