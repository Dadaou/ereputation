PrivacyPageView.vue

<template>
    <NavbarComponent :isPublic="true"></NavbarComponent>
        <div class="privacy-container">
            <div v-html="privacy">

            </div>
        </div>
    <FooterComponent></FooterComponent>
</template>

<script setup>

import { ref, onBeforeMount, onMounted, defineAsyncComponent} from 'vue'
import services from '@Services/services.js'


const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarComponent.vue')
)

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)

const privacy = ref('')

onMounted(async () => {
  
  const partnerCode = import.meta.env.VITE_PARTNER_CODE

  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`partner/info?code=${partnerCode}`, (response) => {
        resolve(response)
      }, false, true)
    })

    if (response.status === 200) {
      privacy.value = response.data.privacy
    }
  } catch (error) {
    console.error(error)
  }
})

</script>


<style>

.privacy-container {
    border-radius: 5px;
    width: 600px;
    height: 670px;
    margin: auto;
    overflow-y: scroll;
    padding: 20px;
    background-color: white;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    margin-top: 100px;
    /*display: flex;
    justify-content: center;*/
}
h4 {
    padding-left: 50px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
}

h3 {
    text-align: center;
}

p {
    font-size: 14px;
}

@media (max-width: 768px) {
    .privacy-container {
        width: 90%;
        height: auto;
    }
}
</style>