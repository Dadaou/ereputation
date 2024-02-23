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
                    <span><i class="uil uil-copyright"></i>2024, allright reserved</span>
                  </li>
                </ul>
            </div>
            <div class="footer__links">
                <ul>
                    <li><i class="uil uil-facebook-f"></i></li>
                    <li><i class="uil uil-linkedin-alt"></i></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js"
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
    padding: 3rem;
    background-color: var(--color-bgp);
    color: var(--color-white);
    width: 100%;
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
    gap: 2rem;
}

.footer__links li {
    padding: 0.6rem 0.9rem;
    border: 1px solid var(--color-white);
    border-radius: 50%;
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
</style>