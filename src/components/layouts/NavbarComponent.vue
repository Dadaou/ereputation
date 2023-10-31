<template>
<nav
	ref="nav__ref" 
	class="bg-white border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4" ref="nav__container__ref">
  <button 
        v-if="showMenu"
        @click="toggleMobileMenu" 
        type="button" 
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" 
        aria-controls="navbar-user" 
        aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  <a :href="baseurl" class="flex items-center">
      <span class="self-center text-xl font-bold whitespace-nowrap dark:text-white">eReputation</span>
  </a>
  <div class="flex items-center md:order-2" v-if="userStore.authenticated">
      <button 
      	type="button" 
      	@click="show"
      	class="flex mr-3" id="user-menu-button" aria-expanded="false" data-dropdown-placement="bottom">
        <span class="sr-only">Open user menu</span>
        <div class="relative w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
            <span class="font-medium">{{ userStore.getInitials(userStore.user.firstname, userStore.user.lastname) }} </span>
        </div>
      </button>
      <!-- Dropdown menu -->
      <div
      	v-if="showDropdown == true" 
      	id="user-dropdown">
        <div class="px-4 py-3">
          <span class="block text-sm text-gray-900 dark:text-white">{{ userStore.user.firstname }} {{ userStore.user.lastname }}</span>
          <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ userStore.user.email }}</span>
        </div>
        <ul class="py-2" aria-labelledby="user-menu-button">
          <li @click="closeDropdown">
          	<RouterLink 
          		:to="`/customer/${userStore.user.customer.tag}/account` " 
          		class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          	>
                    <i class="uil uil-user-square"></i>
                	Profile
            </RouterLink>
          </li>
          <li @click="closeDropdown">
            <RouterLink 
            	:to="`/customer/${userStore.user.customer.tag}/account/security`"
            	class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                     <i class="uil uil-setting"></i>
                	 Settings
            </RouterLink>
          </li>
          <li @click="closeDropdown">
          	 <RouterLink 
          	 	to="/"
          	 	class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          	 	@click="signOut"
          	 >
                     <i class="uil uil-signout"></i>
            		 Sign out
            </RouterLink>  
          </li>
        </ul>
      </div>
  </div>
  <div id="navbar-user" class="items-center justify-between w-full md:flex md:w-auto md:order-1" v-if="show_menu && showMenu">
    <ul 
    	:class="['menu flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-2 md:mt-0 md:border-0']">
      			    <li>
                    <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}`">
                        <i class="uil uil-dashboard"></i> 
                        <span>Dashboard</span> 
                    </RouterLink>
                </li>
                <li>
                   <button @click="showDropdown2 = !showDropdown2" class="btn__dropdown flex items-center justify-between w-full py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 md:w-auto">
                      <i class="uil uil-chart-bar"></i>
                      <span class="mr-2 pl-2">Impacts</span>
                      <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                  </button>
                    <div v-if="showDropdown2" class="comparison z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-48">
                        <ul class="py-2 text-sm" aria-labelledby="dropdownLargeButton">
                            <li>
                               <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/staffs`">
                                    <i class="uil uil-users-alt"></i> 
                                    <span>Staff</span> 
                                </RouterLink>
                            </li>
                            <li>
                              <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/events`">
                                  <i class="uil uil-calendar-alt"></i> 
                                  <span>Event</span>
                              </RouterLink>
                            </li>
                        </ul>
                    </div>   
                </li>
                <li>
                    <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/socials`" @click="closeMobileMenu">
                        <i class="uil uil-users-alt"></i>
                        <span>Social</span> 
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/weathers`" @click="closeMobileMenu">
                        <i class="uil uil-cloud-sun"></i>
                        <span>Weather</span> 
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/customer/${userStore.user.customer.tag}/establishment/${$route.params.id}/reviews`" @click="closeMobileMenu">
                        <i class="uil uil-comment-alt-dots"></i>
                        <span>Reviews</span> 
                    </RouterLink>
                </li>
    </ul>
  </div>
  </div>
</nav>

</template>
<script setup>
import {ref, watch, defineAsyncComponent, computed, onMounted} from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";

const signOut = () => {
    userStore.signOut();
    userStore.authenticated = false;
    if(userStore.authenticated == false) router.push({name:"Login"});
}

const baseurl = window.location.origin;

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const showDropdown = ref(false)
const showMenu = computed(()=>{
    let routeName = ['Login', 'FeedBack', 'StaffFeedBack', 'Home', 'Personal_details', 'Account_security', 'Parameters', 'ErepHome', 'NotFound', 'EstablishmentNotFound', 'SuccessFeedback', undefined];
    return !routeName.includes(route.name)
})

const{x,y} = useWindowScroll();
const{ width} = useWindowSize();
const nav__ref = ref(null);
const nav__container__ref = ref(null);
const isScrolling = ref(false);
const show_menu = ref(true);
const showDropdown2 = ref(false);
const showBg = ref(false)
const closeDropdown = () => {
  showDropdown.value = false;
}

const toggleMobileMenu = () => {
  show_menu.value = !show_menu.value;
}

// Ajoutez la logique pour fermer le menu mobile lors de la sélection d'un élément du menu
const closeMobileMenu = () => {
  if (window.innerWidth < 800) {
    show_menu.value = false;
  }
};

const show = ()=>{
	showDropdown.value = !showDropdown.value
}

watch(y, ()=>{
    if (y.value > 0){
        nav__ref.value.classList.add('nav__onScroll');
        isScrolling.value = true;
    }else if (y.value <= 1){
        nav__ref.value.classList.remove('nav__onScroll');
        isScrolling.value = false;
    }  
});

onMounted(()=>{
  if(width.value >= 765) show_menu.value = true;
  else show_menu.value = false;
  showBg.value = width.value>=765?false:true;
})

watch(width, () => {
   if(width.value >= 765) show_menu.value = true;
   else show_menu.value = false;
   showBg.value = width.value>=765?false:true;

   if (width.value <= 700 && route.path == '/'){
    nav__container__ref.value.classList.add('nav__login');
   }else {
    nav__container__ref.value.classList.remove('nav__login');
   }
});
</script>
<style scoped>

.comparison{
  position: absolute;
}

.comparison ul li a{
  color: var(--color-bg2) !important;
  padding: 5px 5px !important;
}

.comparison ul li a:hover{
 background:  var(--color-danger) !important;
 color: white !important;
}

ul li button.btn__dropdown{
  color: white !important; 
}

.nav__onScroll ul li button.btn__dropdown{
  color: var(--color-bg2) !important;
}

nav{
    width:100vw;
    height: 5rem;
    position: fixed;
    top:0;
    z-index: 11;
    background-color: var(--color-bg2);
    color: var(--color-white);
}

#user-dropdown{
	position: absolute;
	top: 3.5rem;
	right: 1rem;
	background: var(--color-white);
	z-index: 12;
	border-radius: 1rem;
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

ul.menu{
    display: flex;
    gap: 1rem;
    font-size: 15px;
}

ul.menu li{
   cursor: pointer;
}

ul.menu li a{
  display: flex;
   gap: 5px;
   padding: 0 8px;
}

ul.menu li a:hover, ul.menu .router-link-exact-active:hover{
   color: var(--color-danger);
}

ul.menu .router-link-exact-active {
   border-bottom: 2px solid var(--color-danger);
   color: var(--color-danger);
}

.nav__onScroll ul li a, #user-dropdown ul a{
    color: var(--color-bg2)
}

a{
    color: var(--color-white);
}

h4{
    font-size: 20px;
    font-weight: bold;
}

.nav__container{
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
.nav__onScroll{
    background-color: var(--color-white) !important;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.2);
}

.nav__onScroll h4, .nav__onScroll .nav__avatar, .menu{
    color: var(--color-bg2);
}

.nav__onScroll a, .nav__onScroll span{
    color: var(--color-bg2);
     border-color: var(--color-white); 
}

.nav__onScroll .avatar__container{
    color: var(--color-bg2);
}

.nav__onScroll a.btn:hover{
    color: var(--color-white);
    border-color: var(--color-danger);
}

@media screen and (max-width:765px) {
   ul.menu{
	    color: var(--color-bg2) !important;
	    background: white;
	}

  .comparison{
    position: relative;
    width: 100% !important;
  }

  ul li button.btn__dropdown{
    color: var(--color-bg2) !important; 
  }

   ul.menu a{
   	 color: var(--color-bg2)
   }

}
</style>