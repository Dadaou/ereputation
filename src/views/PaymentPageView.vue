<template>
  <NavbarComponent :isPublic="true"></NavbarComponent>

  <div class="checkout-container">
    <div class="stepper">
      <div class="step completed">
        <div class="circle">1</div>
        <div class="label">{{ $t("subscription.stepper.my_account") }}</div>
      </div>
      <div class="line"></div>
      <div class="step active">
        <div class="circle">2</div>
        <div class="label">{{ $t("subscription.stepper.payment") }} <span class="stripe-note">{{ $t("subscription.stepper.payment_note") }}</span></div>
      </div>
      <div class="line"></div>
      <div class="step">
        <div class="circle">3</div>
        <div class="label">{{ $t("subscription.stepper.get_started") }}</div>
      </div>
    </div>
    <div id="checkout"></div>
  </div>
  <FooterComponent></FooterComponent>
</template>

<script setup>
import { onMounted, defineAsyncComponent, inject } from 'vue';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Stripe } from 'stripe';
import { useRoute } from 'vue-router';
import services from '@Services/services.js';

const NavbarComponent = defineAsyncComponent(() =>
  import('@Components/layouts/NavbarComponent.vue')
)

const FooterComponent = defineAsyncComponent(() =>
  import('@Components/layouts/FooterComponent.vue')
)

const route = useRoute()
const app_url = inject('app_url');

const createCheckout = async () => {

  const stripeServer = Stripe(import.meta.env.VITE_SECRET_STRIPE_KEY);

  try {

    const session = await stripeServer.checkout.sessions.create({

      ui_mode: 'embedded',

      automatic_tax: {
        enabled: true
      },

      customer_email: route?.query?.email,

      line_items: [
        {
          price: route?.query?.code,//plan[0].price_code, // ID du prix du produit (récupéré depuis le tableau de bord Stripe)
          quantity: 1,
          adjustable_quantity: {
            enabled: true
          }
        },
      ],

      mode: 'subscription',
      allow_promotion_codes: true,
      return_url: `${app_url.value}/payment/process?session_id={CHECKOUT_SESSION_ID}`,
      //cancel_url: `${app_url.value}/sign-in`, 
    })

    return session.client_secret

  } catch (error) {
    console.error(error)
  }
}

const mountStripePaymentForm = async () => {

  const stripe = await loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_KEY)

  createCheckout().then((clientSecret) => {
    stripe.initEmbeddedCheckout({ clientSecret: clientSecret }).then((checkout) => {
      checkout.mount('#checkout')
    })
  })
}


onMounted(async () => {
  services.mountChatWidget()
  await mountStripePaymentForm()
})


</script>
<style>
.checkout-container {
  margin-top: 120px;
}


.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0 40px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  position: relative;
  text-align: center;
}

.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.label {
  margin-top: 8px;
  font-size: 14px;
}

.stripe-note {
  display: block;
  font-size: 11px;
  color: #666;
}

.line {
  height: 2px;
  width: 40px;
  background-color: #ccc;
}

.step.completed .circle {
  background-color: #4caf50;
  /* green */
}

.step.active .circle {
  background-color: #2196f3;
  /* blue */
}

@media (max-width: 600px) {
  .stepper {
    flex-direction: column;
  }

  .line {
    width: 2px;
    height: 30px;
  }
}
</style>