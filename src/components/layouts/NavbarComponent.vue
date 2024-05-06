<template>
<nav ref="nav__ref">
  <div ref="nav__container__ref" class="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
   <button v-if="showMenu" @click="toggleMobileMenu" class="menu-barre">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
    </button>
	  <a :href="baseurl" class="flex items-center space-x-3 rtl:space-x-reverse">
	      <div v-if="appStore.account && appStore.account.logo" class="nav-logo">
	          <img :src="appStore.account.logo">
	      </div>
	      <span v-else-if="appStore.account && appStore.account.brand"
	          class="self-center text-xl font-bold whitespace-nowrap dark:text-white">{{
	            appStore.account.brand }}</span>
	  </a>
	  <div class="nav-dropdown">
	      <LanguageMenuDropdown
	        v-if="isFeedback"
	      	:current="currentLanguage"
	      	@select="(language)=>selectCurrentLanguage(language)"
	      />
	     <UserDropdownMenu 
	        v-if="userStore.authenticated && !isFeedback"
		  	:user="{
		  		name: `${userStore.user.firstname} ${userStore.user.lastname}`,
		  		initial: userStore.getInitials(userStore.user.firstname, userStore.user.lastname),
		  		email: userStore.user.email
		  	}"
		  	:customer="userStore.user.customer"
		  	@signOut="signOut"
		  />
	  </div>
	   <transition 
	        enter-active-class="animate__animated animate__zoomIn"
  			leave-active-class="animate__animated animate__zoomOut" 
	        >
		  <div 
		  v-if="show_menu && showMenu"
		  class="items-center w-full" id="navbar-language">
			    <ul class="menu font-medium">
    			    <li v-for="menu in mainMenu" @click="closeDropdownMenu">
                <RouterLink :to="{
                    name: menu.routeName,
                    params: {
                      tag: customerTag,
                      id: route.params.id,
                    }
                }">
                 <i :class="`uil ${menu.icon}`"></i>
                 <span>{{menu.name}}</span>
                </RouterLink>
              </li>
			    </ul>
		  </div>
	</transition>
  </div>
</nav>
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { ref, watch, computed, onMounted, inject, defineAsyncComponent, onBeforeMount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@Stores/user.js";
import { useI18n } from "vue-i18n";
import { i18n } from '@/i18n';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { languages, current } from '@Services/languages.js';
import { mainMenu, publicUrls, privateUrls } from '@Services/routes.js';


const UserDropdownMenu = defineAsyncComponent(
	()=>import("@Components/utils/UserMenuDropdownComponent.vue")
)

const LanguageMenuDropdown = defineAsyncComponent(
	()=>import("@Components/utils/LanguageMenuDropdownComponent.vue")
)
const appStore = useAppStore();
const baseurl = window.location.origin;
const customerTag = inject('tag');
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { locale } = useI18n();
const { y } = useWindowScroll();
const { width } = useWindowSize();
const nav__ref = ref(null);
const nav__container__ref = ref(null);
const isScrolling = ref(false);
const show_menu = ref(true);

const isFeedback = computed(() => {
  // let routeName = ['FeedBack', 'UnitFeedBack', 'StaffFeedBack', 'SuccessFeedback', 'EnableAdvContact', 'QRCodeAdvContact', undefined];
  return publicUrls.includes(route.name)
});

const showMenu = computed(() => {
  // let routeName = [
  //   'Establishment',
  //   'StaffRanking',
  //   'Review',
  //   'Event',
  //   'Social',
  //   'Weather',
  //   'Trends',
  //   'Sales',
  //   'Staff',
  //   'Services',
  //   'StaffReview',
  //   'Analysis',
  //   'UnitReview'
  // ];
  return privateUrls.includes(route.name)
})

const signOut = () => {
  userStore.signOut();
  userStore.authenticated = false;
  if (userStore.authenticated == false) router.push({ name: "Login" });
};

const closeDropdownMenu = () => {
  if (width.value < 765) {
    show_menu.value = false;
  }
};

const selectCurrentLanguage = (language) => {
  let svgString = language.svg;

  svgString = svgString.replace('class="h-3.5 w-3.5 rounded-full me-2"', 'class="w-5 h-5 rounded-full me-3"');
  currentLanguage.value = {
    name: language.name,
    code: language.code,
    svg: svgString
  }

  localStorage.setItem("langue", language.code)

  locale.value = language.bb;
};

const toggleMobileMenu = () => {
  if (width.value < 1000) {
    show_menu.value = !show_menu.value;
  }
}

const currentLanguage = ref(current);

watch(y, () => {
  if (y.value > 0) {
    nav__ref.value.classList.add('nav__onScroll');
    isScrolling.value = true;
  } else if (y.value <= 1) {
    nav__ref.value.classList.remove('nav__onScroll');
    isScrolling.value = false;
  }
});

watch(width, () => {
  if (width.value > 1000) show_menu.value = true;
  else show_menu.value = true;
});

onMounted(() => {
  /** Charger la langue par defaut */
  var lg = localStorage.getItem("langue")

  for (let item of languages) {
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
});

onBeforeMount(()=>{
  if (width.value > 1000) show_menu.value = true;
  else show_menu.value = false;
});

</script>
<style scoped>

.animate__animated.animate__zoomIn {
  --animate-duration: 0.5s;
}

.animate__animated.animate__zoomOut {
  --animate-duration: 1s;
}


.menu-barre{
    display: none;
}

.nav-dropdown button{
	display: none
}

ul a{
	display: flex;
	gap: 0.5rem;
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

nav > div{
	justify-content: space-between;
}

a {
  color: var(--color-white);
}

ul.menu{
	display: flex;
	justify-content: center;
	gap: 1.2rem;
	margin-top: -2rem; 
}

ul.menu li {
  cursor: pointer;
}

ul.menu li a:hover,
ul.menu .router-link-exact-active:hover {
  color: var(--light-color-danger);
}

ul.menu .router-link-exact-active {
  border-bottom: 2px solid var(--color-danger);
  color: var(--light-color-danger);
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

.nav__onScroll {
  background-color: var(--color-white) !important;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.nav__onScroll button {
	color: grey;
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

@media screen and (max-width:1000px) {

  .menu-barre{
    display: block;
  }

  .navbar-language{
  	z-index: 1;
  }

  .nav-dropdown{
	display: flex;
	flex-direction: row-reverse ;
  }

  .nav-dropdown button{
	display: inline;
  }

  ul.menu {
  	flex-direction: column;
  	margin-top: 1rem;
    color: var(--color-bgp) !important;
    background: white;
    padding: 1rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  ul.menu a {
    color: var(--color-bgp);
    padding: 5px 10px;
    border-radius: 5px;
  }

  ul.menu li a:hover,
  ul.menu .router-link-exact-active:hover {
	color: var(--light-color-danger);
  }

  ul.menu .router-link-exact-active {
  	background-color: var(--color-danger);
	border-bottom: 2px solid var(--color-danger);
	color: white;
  }

  .nav__onScroll a.router-link-exact-active,
  .nav__onScroll a.router-link-exact-active span {
	  color: white;
   }
}

@media screen and (max-width:765px) {

  .nav-logo{
    margin-right: 0px;
  }

  .nav-dropdown{
		display: flex;
		flex-direction: row ;
  }

  nav > div.nav__login{
  	justify-content: center;
  }
}
</style>