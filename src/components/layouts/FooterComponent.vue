<template>
    <footer>
        <div class="container footer__container">
            <div class="footer__info">
                <ul>
                    <li>
                        <div v-if="appStore.account && appStore.account.logo" class="footer-logo" :title="appStore.account.brand || ''">
                            <img :src="appStore.account.logo">
                        </div>
                    </li>
                    <li class="flex items-start justify-center flex-col gap-2">
                    <ul>
                      <li>Legal Notice</li>
                      <li>
                        <RouterLink to="/contact" :class="{ 'active-link': isContactActive }">
                          Contact
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink to="/sign-up" :class="{ 'active-link': isSignUpActive }">
                          Pricing
                        </RouterLink>
                      </li>
                    </ul>
                    <span><i class="uil uil-copyright"></i>2024, all rights reserved</span>
                  </li>
                </ul>
            </div>
            <div class="footer__links">
                <ul>
                    <li v-if="appStore.account && appStore.account.facebook">
                      <a :href="appStore.account.facebook" target="_blank">
                        <Icon :icon="'uiw:facebook'" width="25"></Icon>
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
    </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js";
import { Icon } from '@iconify/vue';


const appStore = useAppStore();
const route = useRoute();
const isContactActive = ref(route.path === '/contact');
const isSignUpActive = ref(route.path === '/sign-up');

</script>

<style scoped>

.active-link {
  font-weight:  600;
  color: #007bff;
}

footer {
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-bgp);
  color: #fff;
  padding: 3rem;
  margin-top: 60px;
}

.footer-logo {
    height: 80px;
    width: auto;
    padding: 12px;
    background-color: var(--color-white);
    border-radius: 16px;
    cursor: pointer;
}

.footer-logo img {
    height: 100%;
    width: auto;
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

/*.footer__links li {
    padding: 0.6rem 0.9rem;
    border: 1px solid var(--color-white);
    border-radius: 50%;
    cursor: pointer;
}*/

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
</style>