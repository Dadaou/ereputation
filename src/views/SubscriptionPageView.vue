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
            '3 monitored points of sale (1 QR Code by point of sale)']" @click="selectedPlan = 'basic-1'"></plan-card>
          <plan-card name="Custom Basic 1-Year" :active="selectedPlan == 'c-basic-1'" :hasinput="true" :price="9.99"
            :addprice="4.99" devise="$" :items="[
              'Illimited intern reviews',
              'Illimited leads',
              'Illimited events',
              '3 monitored points of sale (1 QR Code by point of sale)']"
            @click="selectedPlan = 'c-basic-1'"></plan-card>
          <plan-card name="Premium 1-Year" :active="selectedPlan == 'premium'" :premium="true" :items="[
            'Illimited intern reviews',
            'Illimited leads',
            'Illimited events',
            'Illimited monitored points of sale (QR Codes illimited)',
            'Leads integration in your CRM',
            'Sales integration (API)']" @click="selectedPlan = 'premium'"></plan-card>
        </div>
        <div class="navigation-container">
          <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'account'">Next</button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="account">
        <div class="tab-pane-header">
          <h6>STEP 2 OF 3</h6>
          <div class="app__title">
            <h1>Fill your account informations.</h1>
          </div>
        </div>
        <div class="navigation-container">
          <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'plan'">Previous</button>
          <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'checkout'">Next</button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="checkout">
        <div class="tab-pane-header">
          <h6>STEP 3 OF 3</h6>
          <div class="app__title">
            <h1>Checkout</h1>
          </div>
        </div>
        <div class="navigation-container">
          <button class="btn btn-primary btn-navigation" style="margin-top: 12px; border-radius: 2px;"
            @click="activeName = 'account'">Previous</button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import PlanCard from '@Components/subscription/PlanCard.vue';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

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

</script>
<style>
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
  gap: 4px 36px;
  margin-top: 12px;
}
</style>