<template>
    <nav ref="nav__ref">
        <div :class="['nav__container', $route.path == '/' && width <= 700?'nav__login':'']" ref="nav__container__ref">
            <h4>eReputation</h4>
            <ul v-if="showMenu == true">
                <li>
                    <RouterLink :to="`/establishment/${$route.params.id}/staffs`">
                        <i class="uil uil-users-alt"></i> Staff
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/establishment/${$route.params.id}/events`">
                        <i class="uil uil-calendar-alt"></i> Event
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/establishment/${$route.params.id}/socials`">
                        <i class="uil uil-users-alt"></i>Social
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/establishment/${$route.params.id}/weathers`">
                        <i class="uil uil-cloud-sun"></i> Weather
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="`/establishment/${$route.params.id}/reviews`">
                        <i class="uil uil-comment-alt-dots"></i> Reviews
                    </RouterLink>
                </li>
            </ul>
            <AvatarComponent v-if="userStore.authenticated"/>
        </div>
    </nav>
</template>
<script setup>
import {ref, watch, defineAsyncComponent, computed} from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";

const AvatarComponent = defineAsyncComponent(()=>
    import('@Components/utils/AvatarComponent.vue')
)

const userStore = useUserStore();
const route = useRoute();
const showMenu = computed(()=>{
    let routeName = ['Login', 'FeedBack', 'StaffFeedBack', 'Home', 'Personal_details', 'Account_security', 'Parameters', 'ErepHome', 'NotFound', 'SuccessFeedback', undefined]
    console.log(routeName.includes(route.name), route.name)
    return !routeName.includes(route.name)
})
/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const{x,y} = useWindowScroll();
const{ width} = useWindowSize();
const nav__ref = ref(null);
const nav__container__ref = ref(null);
const isScrolling = ref(false);

watch(y, ()=>{
    if (y.value > 0){
        nav__ref.value.classList.add('nav__onScroll');
        isScrolling.value = true;
    }else if (y.value <= 1){
        nav__ref.value.classList.remove('nav__onScroll');
        isScrolling.value = false;
    }  
});

watch(width, () => {
   if (width.value <= 700 && route.path == '/'){
    nav__container__ref.value.classList.add('nav__login');
   }else {
    nav__container__ref.value.classList.remove('nav__login');
   }
});
</script>

<style scoped>
nav{
    width:100vw;
    height: 5rem;
    position: fixed;
    top:0;
    z-index: 11;
    background-color: var(--color-bg2);
    color: var(--color-white);
}

ul{
    display: flex;
    gap: 1rem;
}

.nav__onScroll ul li a{
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

.nav__onScroll h4, .nav__onScroll .nav__avatar{
    color: var(--color-bg2);
}

.nav__onScroll a.btn{
    color: var(--color-bg2);
    /* border-color: var(--color-white); */
}

.nav__onScroll .avatar__container{
    color: var(--color-bg2);
}

.nav__onScroll a.btn:hover{
    color: var(--color-white);
    border-color: var(--color-danger);
}
</style>
