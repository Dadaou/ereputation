<template>
  <nav ref="nav__ref" class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="h-full max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4" ref="nav__container__ref">
      <button v-if="showMenu" @click="toggleMobileMenu" type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-user" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <a :href="baseurl" class="flex items-center">
        <div v-if="appStore.account && appStore.account.logo" class="nav-logo">
          <img :src="appStore.account.logo">
        </div>
        <span v-else-if="appStore.account && appStore.account.brand"
          class="self-center text-xl font-bold whitespace-nowrap dark:text-white">{{
            appStore.account.brand }}</span>
      </a>

      <!-- Language dropdown  -->
      <div class="flex items-center md:order-2" v-if="isFeedback">
        <button ref="btn__ref" id="lang-btn" type="button"
          class="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="showLang = !showLang">
          <span v-html="currentLanguage.svg"></span> {{ currentLanguage.name }} <!-- ({{currentLanguage.code}}) -->
        </button>
        <!-- Dropdown -->
        <div class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700"
          id="language-dropdown" v-if="showLang">
          <ul class="py-2 font-medium" role="none">
            <li v-for="language in languages" @click="selectCurrentLanguage(language)" :key="language" class="langueselected">
              <a href="#"
                :class="[(currentLanguage.code == language.code) ? 'bg-gray-100' : '', 'block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white']"
                role="menuitem">
                <div class="inline-flex items-center language__item">
                  <span v-html="language.svg"></span> {{ language.name }} <!--({{language.code}})-->
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!-- Language dropdown end here  -->

        <button v-if="!isFeedback" data-collapse-toggle="navbar-language" type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-language" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
      <div class="flex items-center md:order-2" v-if="userStore.authenticated && !isFeedback">
        <button type="button" @click="show" class="flex mr-3" id="user-menu-button" aria-expanded="false"
          data-dropdown-placement="bottom">
          <span class="sr-only">Open user menu</span>
          <div class="relative w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
            <span class="font-medium">{{ userStore.getInitials(userStore.user.firstname, userStore.user.lastname) }}
            </span>
          </div>
        </button>
        <!-- Dropdown menu -->
        <div v-if="showDropdown == true" id="user-dropdown">
          <div class="px-4 py-3">
            <span class="block text-sm text-gray-900 dark:text-white">{{ userStore.user.firstname }} {{
              userStore.user.lastname }}</span>
            <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ userStore.user.email }}</span>
          </div>
          <ul class="py-2" aria-labelledby="user-menu-button">

            <li @click="closeDropdown" v-if="checkAccess(userStore.user.roles, 'ROLE_CUSTOMER')">
              <RouterLink :to="`/customer/${userStore.user.customer.tag}/account`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="uil uil-user-square"></i>
                Profile
              </RouterLink>
            </li>
            <li @click="closeDropdown" v-if="checkAccess(userStore.user.roles, 'ROLE_CUSTOMER')">
              <RouterLink :to="`/customer/${userStore.user.customer.tag}/account/contact`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="uil uil-envelope"></i>
                Contacts
              </RouterLink>
            </li>
            <li @click="closeDropdown" v-if="checkAccess(userStore.user.roles, 'ROLE_CUSTOMER')">
              <RouterLink :to="`/customer/${userStore.user.customer.tag}/account/parameters`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="uil uil-setting"></i>
                Parameters
              </RouterLink>
            </li>
            <!-- <li @click="closeDropdown" v-if="checkAccess(userStore.user.roles, 'ROLE_PARTNER')">
              <RouterLink to="/partner/theme" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="uil uil-swatchbook"></i>
                Custom theme
              </RouterLink>
            </li> -->
            <li @click="closeDropdown">
              <RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="signOut">
                <i class="uil uil-signout"></i>
                Sign out
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div id="navbar-user" class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        v-if="show_menu && showMenu && userStore.user">
        <ul
          :class="['menu flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-2 md:mt-0 md:border-0']">

          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/staffs`">
              <i class="uil uil-users-alt"></i>
              <span>Staff</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/events`">
              <i class="uil uil-calendar-alt"></i>
              <span>Events</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/social`">
              <i class="uil uil-users-alt"></i>
              <span>Social</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/weathers`">
              <i class="uil uil-cloud-sun"></i>
              <span>Weather</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/reviews`">
              <i class="uil uil-comment-alt-dots"></i>
              <span>Reviews</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/sales`">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24">
                <g transform="scale(0.8 1)">
                  <g transform="scale(0.4 0.35) translate(52 -9)">
                    <path fill="currentColor" fill-rule="evenodd"
                      d="M26 8a2 2 0 1 0-4 0v2a8 8 0 1 0 0 16v8a4.002 4.002 0 0 1-3.773-2.666a2 2 0 0 0-3.771 1.332A8.003 8.003 0 0 0 22 38v2a2 2 0 1 0 4 0v-2a8 8 0 1 0 0-16v-8a4.002 4.002 0 0 1 3.773 2.666a2 2 0 0 0 3.771-1.332A8.003 8.003 0 0 0 26 10zm-4 6a4 4 0 0 0 0 8zm4 12v8a4 4 0 0 0 0-8"
                      clip-rule="evenodd" />
                  </g>
                  <g transform="translate(0 0)">
                    <path fill="none" stroke="currentColor" stroke-width="2"
                      d="m1 16l7-7l5 5L23 4M0 22h23.999M16 4h7v7" />
                  </g>
                </g>
              </svg>
              <span>Sales</span>
            </RouterLink>
          </li>
          <li @click="closeDropdownMenu">
            <RouterLink :to="`/customer/${customerTag}/establishment/${$route.params.id}/analysis`">
              <i class="uil uil-analytics"></i>
              <span>Analysis</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
      <template #content>
        <div class="modal__header">
          <div class="modal__title">
            <h3 class="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24">
                <g transform="scale(0.8 1)">
                  <g transform="scale(0.4 0.35) translate(52 -9)">
                    <path fill="currentColor" fill-rule="evenodd"
                      d="M26 8a2 2 0 1 0-4 0v2a8 8 0 1 0 0 16v8a4.002 4.002 0 0 1-3.773-2.666a2 2 0 0 0-3.771 1.332A8.003 8.003 0 0 0 22 38v2a2 2 0 1 0 4 0v-2a8 8 0 1 0 0-16v-8a4.002 4.002 0 0 1 3.773 2.666a2 2 0 0 0 3.771-1.332A8.003 8.003 0 0 0 26 10zm-4 6a4 4 0 0 0 0 8zm4 12v8a4 4 0 0 0 0-8"
                      clip-rule="evenodd" />
                  </g>
                  <g transform="translate(0 0)">
                    <path fill="none" stroke="currentColor" stroke-width="2"
                      d="m1 16l7-7l5 5L23 4M0 22h23.999M16 4h7v7" />
                  </g>
                </g>
              </svg> Sales
            </h3>
          </div>
          <div class="modal__close">
            <i class="uil uil-times-circle" @click="showModal = false"></i>
          </div>
        </div>
        <div class="text__message">
          <i class="uil uil-padlock"></i>
          <span>This feature is only accessible with the premium version</span>
        </div>
      </template>
    </ModalComponent>
  </nav>
</template>
<script setup>
import { ref, watch, computed, onMounted, inject } from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { i18n } from '@/i18n';

const signOut = () => {
  userStore.signOut();
  userStore.authenticated = false;
  if (userStore.authenticated == false) router.push({ name: "Login" });
}

const baseurl = window.location.origin;

const userStore = useUserStore();
const appStore = useAppStore();
const customerTag = inject('tag')

const router = useRouter();
const route = useRoute();
const showDropdown = ref(false)

const showMenu = computed(() => {
  let routeName = [
    'Establishment',
    'StaffRanking',
    'Review',
    'Event',
    'Social',
    'Weather',
    'Trends',
    'Sales',
    'Staff',
    'StaffComparison',
    'StaffReview',
    'Analysis'
  ];
  return routeName.includes(route.name)
})

const checkAccess = (roles, role)=>{
  return roles.includes(role)
}

const isFeedback = computed(() => {
  let routeName = ['FeedBack', 'StaffFeedBack', 'SuccessFeedback', 'EnableAdvContact', 'QRCodeAdvContact', undefined];
  return routeName.includes(route.name)
})

const { y } = useWindowScroll();
const { width } = useWindowSize();
const nav__ref = ref(null);
const nav__container__ref = ref(null);
const btn__ref = ref(null)
const isScrolling = ref(false);
const show_menu = ref(true);
const showBg = ref(false)
const showModal = ref(false);
const showLang = ref(false);
const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 21;
  return gap + 35;
})

const closeDropdown = () => {
  showDropdown.value = false;
}
// Condition si la taille de l'ecran est petite
const closeDropdownMenu = () => {
  if (width.value < 765) {
    show_menu.value = false;
  }
}
const toggleMobileMenu = () => {
  if (width.value < 765) {
    show_menu.value = !show_menu.value;
  }
}
const show = () => {
  showDropdown.value = !showDropdown.value
  console.log(showDropdown.value)
}

const { locale } = useI18n();
//const selectedLanguage = ref(locale.value);


watch(y, () => {
  if (y.value > 0) {
    nav__ref.value.classList.add('nav__onScroll');
    if (isFeedback.value) btn__ref.value.classList.add('btn__lang');
    isScrolling.value = true;
  } else if (y.value <= 1) {
    nav__ref.value.classList.remove('nav__onScroll');
    if (isFeedback.value) btn__ref.value.classList.remove('btn__lang');
    isScrolling.value = false;
  }
});

onMounted(() => {
  if (width.value >= 765) show_menu.value = true;
  else show_menu.value = false;
  showBg.value = width.value >= 765 ? false : true;

  /** Charger la langue par defaut */
  var lg = localStorage.getItem("langue")

  for (let item of languages.value) {
    if (item.code == lg) {
      currentLanguage.value = {
        name: item.name,
        code: item.code,
        svg: item.svg
      }
      i18n.locale = item.bb
      locale.value = item.bb
    }
  }
})

watch(width, () => {
  if (width.value >= 765) show_menu.value = true;
  else show_menu.value = false;
  showBg.value = width.value >= 765 ? false : true;

  if (width.value <= 700 && route.path == '/') {
    nav__container__ref.value.classList.add('nav__login');
  } else {
    nav__container__ref.value.classList.remove('nav__login');
  }
});


/** Langue dropdown **/
const languages = ref([
  {
    name: "English",
    code: "EN",
    bb: "en",
    svg: '<svg aria-hidden="true" class="h-3.5 w-3.5 rounded-full me-2" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-us" viewBox="0 0 512 512"><g fill-rule="evenodd"><g stroke-width="1pt"><path fill="#bd3d44" d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/><path fill="#fff" d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/></g><path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)"/><path fill="#fff" d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z" transform="scale(3.9385)"/></g></svg>'
  },
  {
    name: "French",
    code: "FR",
    bb: "fr",
    svg: '<svg aria-hidden="true" class="h-3.5 w-3.5 rounded-full me-2" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-fr" viewBox="0 0 512 512"><path fill="#0055A4" d="M0 0h170.7v512H0z"/><path fill="#FFF" d="M170.7 0H341.3v512H170.7z"/><path fill="#EF4135" d="M341.3 0H512v512H341.3z"/></svg>'
  },
  {
    name: "Spain",
    code: "SP",
    bb: "sp",
    svg: '<svg aria-hidden="true" class="h-3.5 w-3.5 rounded-full me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#c60b1e" d="M0 0h512v153.6H0z"/><path fill="#c60b1e" d="M0 358.4h512V512H0z"/><path fill="#ffc400" d="M0 153.6h512v204.8H0z"/><circle cx="256" cy="256" r="50" fill="#0065A4"/><circle cx="256" cy="256" r="35" fill="#FFD700"/><path fill="#C60B1E" d="M246 241h20v30h-20z"/></svg>'
  }
]);
const currentLanguage = ref({
  name: "English",
  code: "EN",
  bb: "en",
  svg: '<svg aria-hidden="true" class="w-5 h-5 rounded-full me-3" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-us" viewBox="0 0 512 512"><g fill-rule="evenodd"><g stroke-width="1pt"><path fill="#bd3d44" d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/><path fill="#fff" d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z" transform="scale(3.9385)"/></g><path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)"/><path fill="#fff" d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z" transform="scale(3.9385)"/></g></svg>'
});


const selectCurrentLanguage = (language) => {
  let svgString = language.svg;

  svgString = svgString.replace('class="h-3.5 w-3.5 rounded-full me-2"', 'class="w-5 h-5 rounded-full me-3"');
  currentLanguage.value = {
    name: language.name,
    code: language.code,
    svg: svgString
  }
  showLang.value = false
  // Modifier la langue en cours
  localStorage.setItem("langue", language.code)

  locale.value = language.bb;
  
  var event = event = new CustomEvent("langue", {
	  detail: {
	    langue: language.code
	  }
  });
  
  window.dispatchEvent(event);
};
</script>
<style scoped>
/* Langue dropdown css*/

.nav-logo {
  /* height: 28px; */
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

#lang-btn {
  color: white;
  display: flex;
  gap: 1rem;
}

#lang-btn.btn__lang {
  color: var(--color-bgp);
}

#lang-btn:hover {
  color: var(--color-bgp);
}

#language-dropdown .language__item {
  display: flex;
  gap: 1rem;
}

/********* End ********/

.modal__header {
  display: flex;
  justify-content: space-between;
}

.modal__header div {
  align-self: center;
}

.modal__close i {
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.modal__close i:hover {
  transform: rotate(360deg);
}

.modal__title {
  color: var(--color-danger);
  font-weight: bold;
}

nav {
  width: 100vw;
  height: 5rem;
  position: fixed;
  top: 0;
  z-index: 11;
  background-color: var(--color-bgp);
  color: var(--color-white);
}

#user-dropdown,
#language-dropdown {
  position: absolute;
  top: 3.5rem;
  right: 1rem;
  background: var(--color-white);
  z-index: 12;
  border-radius: 1rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

#language-dropdown div {
  color: black !important;
}

ul.menu {
  display: flex;
  gap: 1rem;
  font-size: 15px;
}

ul.menu li {
  cursor: pointer;
}

ul.menu li a {
  display: flex;
  gap: 5px;
  padding: 0 8px;
}

ul.menu li a:hover,
ul.menu .router-link-exact-active:hover {
  color: var(--light-color-danger);
}

ul.menu .router-link-exact-active {
  border-bottom: 2px solid var(--color-danger);
  color: var(--light-color-danger);
}

.nav__onScroll ul li a,
#user-dropdown ul a {
  color: var(--color-bgp)
}

a {
  color: var(--color-white);
}

h4 {
  font-size: 20px;
  font-weight: bold;
}

.nav__container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: var(--container-width-lg);
  margin: 0 auto;
  padding: 0;
}

/* Change the navbar style on scroll using useWindowSroll */
.nav__onScroll {
  background-color: var(--color-white) !important;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.nav__onScroll h4,
.nav__onScroll .nav__avatar,
.menu {
  color: var(--color-bgp);
}

.nav__onScroll a,
.nav__onScroll span {
  color: var(--color-bgp);
  border-color: var(--color-white);
}

.nav__onScroll .avatar__container {
  color: var(--color-bgp);
}

.nav__onScroll a.btn:hover {
  color: var(--color-white);
  border-color: var(--color-danger);
}

.text__message {
  color: black;
  display: flex;
  font-size: 15px;
  margin-top: 10px;
  font-weight: 500
}

.text__message i {
  font-size: 30px;
}

@media screen and (max-width:765px) {
  ul.menu {
    color: var(--color-bgp) !important;
    background: white;
  }

  ul.menu a {
    color: var(--color-bgp)
  }

  .nav-logo {
    margin-right: 0px;
   
  }

}
</style>
