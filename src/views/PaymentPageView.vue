<template>
  <NavbarComponent :isPublic="true"></NavbarComponent>
  <div id="checkout">
  </div>
  <FooterComponent></FooterComponent>
</template>
  
<script setup>
import { onMounted, defineAsyncComponent, inject } from 'vue';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Stripe } from 'stripe';
import { useRoute } from 'vue-router';

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
#checkout {
  margin-top: 120px;
}
</style>