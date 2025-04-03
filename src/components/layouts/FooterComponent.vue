<template>
  <footer>
    <div class="container footer__container">
      <div class="footer__info">
        <ul>
          <li>
            <div v-if="appStore.account && appStore.account.logo && !isFeedback && !isSignUp" class="footer-logo"
              :title="appStore.account.brand || ''">
              <img :src="appStore.account.logo">
            </div>
            <div v-if="logo && logo.logo && isFeedback" :class="footerLogoClassObject">
              <img :src="logo.logo">
            </div>
          </li>
          <li class="flex items-start justify-center flex-col">
            <ul v-if="!isFeedback">
              <li v-if="!isSignUp" class="text">Legal notice</li>
              <li v-else @click.stop="showPrivacyPolicy" class="text">Privacy Policy</li>
            </ul>
            <ul v-else>
              <li @click.stop="showPrivacyPolicy" class="text">Privacy Policy</li>
            </ul>
            <!-- <span v-if="!isFeedback"><i class="uil uil-copyright"></i>2024, all rights reserved</span> -->
            <!--   <span v-if="appStore.account && appStore.account.brand">
              Powered by 
              <a href="#" @click="handleBrandClick">Linkystar</a>
            </span> -->
            <span  class="text">Privacy notice</span>
            <span  class="text">Term of use</span>
            <!-- <span>Powered by<a href="#" @click="handleBrandClick">Linkystar</a></span> -->
          </li>
        </ul>
      </div>
      <div class="footer__links" v-if="!isFeedback">
        <ul>
          <li v-if="appStore.account && appStore.account.facebook">
            <a :href="appStore.account.facebook" target="_blank">
              <Icon :icon="'bi:facebook'" width="25"></Icon>
            </a>
          </li>
          <li v-if="appStore.account && appStore.account.linkedin">
            <a :href="appStore.account.linkedin" target="_blank">
              <Icon :icon="'uiw:linkedin'" width="25"></Icon>
            </a>
          </li>
          <li v-if="appStore.account && appStore.account.instagram">
            <a :href="appStore.account.instagram" target="_blank">
              <Icon :icon="'uim:instagram'" width="25"></Icon>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div style="border-bottom: 1px solid white; margin: 15px 90px 15px 90px;"></div>
    <!-- <hr style="margin: 10px 90px 10px 90px; "/> -->
    <div style="display: flex; justify-content: center; align-items: center;">
      <p class="copyright">&copy; 2025 LinkyStar | All Rights Reserved |  Powered by <a href="#" @click="handleBrandClick">Linkystar</a> </p>
    </div>
  </footer>
  <el-dialog v-model="dialogVisible" style="min-width: 400px; height: 670px; overflow-y: scroll;" center>
    <div ref="shadowHost"></div>
  </el-dialog>
</template>


<script setup>
import { ref, computed, onBeforeMount, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from "@Stores/app.js";
import { Icon } from '@iconify/vue';
import { publicUrls } from '@Services/routes.js';
import { ElDialog } from 'element-plus';
import services from '@Services/services.js'

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const isContactActive = ref(route.path === '/contact');
const isSignUpActive = ref(route.path === '/sign-up');
const logo = ref(null)
const dialogVisible = ref(false)
const privacy = ref('')

const shadowHost = ref(null);

const isFeedback = computed(() => {
  return publicUrls.includes(route.name)
});

const isSignUp = computed(() => {
  return route.name === 'Signup' || route.name === 'PaymentPage';
});

const showPrivacyPolicy = (e) => {
  e.preventDefault()
  dialogVisible.value = true
}

/*const redirectToPrivacyPolicy = (e) => {
  const link = router.resolve(`/privacy-policy`);
  window.open(link.href, '_bltrue
};*/


const footerLogoClassObject = computed(() => ({
  'footer-logo': !(logo.value && logo.value.logo && isFeedback.value),
  'footer-logo-public': logo.value && logo.value.logo && isFeedback.value
}))

watch(dialogVisible, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (shadowHost.value) {

      const shadowRoot = shadowHost.value.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = privacy.value;
    }
  }

});

onBeforeMount(async () => {
  if (route.params.tag) {
    logo.value = await appStore.getCustomerLogo(route.params.tag)
  }
});

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

const handleBrandClick = () => {
  window.open('https://linkystar.com', '_blank');
  // if (appStore.account && appStore.account.website) {

  //   // window.open(appStore.account.website, '_blank');

  // } else {
  //   alert('Website information is not available.');
  // }
};
</script>

<style scoped>

.active-link {
  font-weight: 600;
  color: #007bff;
}

.text {
  font-size: 13px;
  cursor: pointer;
}

footer {
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-bgp);
  color: #fff;
  padding: 2rem;
  margin-top: 105px;
  /*position:  relative;*/
}

.copyright {
  /*position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);*/
  font-size: 11px;
  white-space: nowrap;
}

.footer-logo {
  height: 59px;
  width: auto;
  padding: 12px;
  background-color: var(--color-white);
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.footer-logo img {
  height: 100%;
  width: auto;
}

.footer-logo-public {
  height: 75px;
  width: auto;
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.footer-logo-public img {
  height: 100%;
  width: auto;
  border-radius: 15px;
}

.footer__container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 0.9rem;
}

.footer__info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__info ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__links ul {
  display: flex;
  gap: 1rem;
}

.footer__links li:hover {}

.el-dialog__body {
  padding: 0 !important;
}

/* Media query for smaller screens */
@media screen and (min-width: 768px) {
  .footer__container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .footer__info ul {
    flex-direction: row;
    gap: 2rem;
  }
}

/*@media screen and (max-width : 500px) {

  .copyright {
    transform: translateX(-42%);
    width: 100%;
  }
  
}

@media screen and (max-width : 368px) {

  .copyright {
    transform: translateX(-46%);
  }

}*/
</style>