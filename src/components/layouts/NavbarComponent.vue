<template>
    <nav ref="nav__ref">
        <div class="container nav__container">
            <h4>eReputation</h4>
            <div class="nav__menu" v-if="userStore.authenticated">
                <NavbarAvatarComponent class="nav__avatar"/>
            </div>
        </div>
    </nav>
</template>
<script setup>
import {ref, watch} from 'vue';
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import NavbarAvatarComponent from '@Components/utils/NavbarAvatarComponent.vue';


const userStore = useUserStore();
/**
 * Navbar Handler
 * useWindowScroll allows us to detect the scroll event on 
 * the browser
 */
const{x,y} = useWindowScroll()
const nav__ref = ref(null)
const isScrolling = ref(false)

watch(y, ()=>{
    if(y.value > 0){
        nav__ref.value.classList.add('nav__onScroll')
        isScrolling.value = true
    }else if(y.value <= 1){
        nav__ref.value.classList.remove('nav__onScroll')
        isScrolling.value = false
    }  
})
</script>

<style scoped>
@import "@Assets/css/base.css";

/*Navbar*/
nav{
    width:100vw;
    height: 5rem;
    position: fixed;
    top:0;
    z-index: 11;
    background-color: var(--color-white);
    color: var(--color-bg2);
}

/*Router-link*/
a{
    color: var(--color-bg2);
}

.nav__container{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/*nav__menu */
.nav__menu{
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    gap: 2rem;
}

.nav__notification{
    align-self: center;
}

.nav__menu a{
    font-size: 0.9rem;
    transition:  var(--transition);
}
.nav__menu a.link:hover{
    color: var(--color-primary);
}
.nav__menu a i{
   margin: 6px;
}

/*Change the navbar style on scroll using useWindowSroll */
.nav__onScroll{
    background-color: var(--color-bg2) !important;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.2);
}

.nav__onScroll h4, .nav__onScroll .nav__avatar{
    color: var(--color-white);
}

.nav__onScroll a.btn{
    color: var(--color-white);
    /* border-color: var(--color-white); */
}

.nav__onScroll a.btn:hover{
    color: var(--color-white);
    border-color: var(--color-danger);
}

/* Media Query for tablets*/
@media screen and (max-width=1024px){
    
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .nav__container{
        flex-direction: column;
        justify-content: center;
    }

    .nav__container ul{
        display: none;
    }
}

</style>