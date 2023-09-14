<template>
     <div class="main__container">
        <head-component :isSearch="false" :page="page">
            <template #content>
                <Particles
                    id="tsparticles"
                    :particlesInit="particlesInit"
                    :particlesLoaded="particlesLoaded"
                    :options="{
                    fullScreen: { enable: false },    
                    background: {
                        color: {
                            value: '#f75842'
                        }
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: 'push'
                            },
                            onHover: {
                                enable: true,
                                mode: 'repulse'
                            },
                            resize: true
                        },
                        modes: {
                            bubble: {
                                distance: 400,
                                duration: 2,
                                opacity: 0.8,
                                size: 40
                            },
                            push: {
                                quantity: 4
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4
                            }
                        }
                    },
                    particles: {
                        color: {
                            value: '#ffffff'
                        },
                        links: {
                            color: '#ffffff',
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1
                        },
                        collisions: {
                            enable: true
                        },
                        move: {
                            direction: 'none',
                            enable: true,
                            outMode: 'bounce',
                            random: false,
                            speed: 1,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800
                            },
                            value: 80
                        },
                        opacity: {
                            value: 0.3
                        },
                        shape: {
                            type: 'circle'
                        },
                        size: {
                            random: true,
                            value: 5
                        }
                    },
                    detectRetina: true
                }"
                />
                <div class="main__search">
                    <form>
                        <div class="search__inputs">
                            <div class="search__input">
                                <i class="uil uil-briefcase-alt"></i>
                                <input type="text" class="first" placeholder="I search ..."/>
                            </div>
                            <div class="search__input">
                                <i class="uil uil-location-point"></i>
                                <input type="text" placeholder="City, Country"/>
                            </div>
                        </div>
                    </form>
                </div> 
            </template>
        </head-component>
        <div class="container client__container" v-if="userStore.user.customer !== null">
            <div class="search__icon">
                <i class="uil uil-building"></i>
                <div class="line"></div>
            </div>
            <div class="client__container__head" v-if="userStore.user.customer.establishments.length > 0">
                Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, your establishments are listed bellow.  <span>({{userStore.user.customer.establishments.length }} found)</span>
            </div>
            <div class="client__container__head" v-else>
                Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, no companies found yet.
            </div>
            <div class="society__list" v-if="companiesStore.establishments.length>0">
                <div class="list__item" v-for="company in companiesStore.establishments">
                    <div class="society__info__container">
                        <swiper @click="goToCompany(company)" class="society__logo" :modules="[Virtual]" v-if="company.media.length > 0" :slides-per-view="1" :space-between="10" :virtual="true">
                            <swiper-slide v-show="mediaStore.isImageFile(image.url_source)" v-for="image in company.media">
                                <img :src="image.url_source">
                            </swiper-slide>
                        </swiper>
                        <swiper @click="goToCompany(company)" class="society__logo" :modules="[Virtual]"  v-else :slides-per-view="1" :space-between="10" :virtual="true">
                            <swiper-slide>
                                <div role="status" class="society__logo bg-gray-300 rounded-sm">
                                    <svg class="text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                                    </svg>
                                </div>
                            </swiper-slide>
                        </swiper>
                        <div class="list__main__content">
                            <div class="list__main__info">
                                <div class="society__item">
                                    <div class="society__main__info">
                                            <div class="item__head">
                                                <div class="society__info">
                                                    <!-- <a class="establishment__link" :href="[company.websites[0].url!=null?company.websites[0].url:'#']" v-if="company.websites.length > 0"><label class="society__name">{{ company.name }}</label></a> -->

                                                    <a class="establishment__link" @click="goToCompany(company)"><label class="society__name">{{ company.name }}</label></a>

                                                    <div class="society__category">
                                                        <i :class="['uil', company.category=='Restaurant'?'uil-restaurant':'', company.category=='Hotel'?'uil-bed-double':'', company.category=='Residence'?'uil-home':'']"></i>
                                                        <span>{{ company.category }}</span>
                                                    </div>
                                                    <div class="society__location" v-if="company.address1 != null && company.city !=null">
                                                        <i class="uil uil-location-point"></i>
                                                        <span>{{ company.address1 }}, {{ company.city }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <RatingComponent class="rating__content" :reviews="company.reviews.length" :rating="companiesStore.calculateRatingV2(company.reviews)"/>
                            </div>
                            <div class="list__actions">
                                    <button class="btn" @click="goToCompany(company)">More details</button>
                            </div>
                        </div>
                    </div>
                </div>
               </div>
                <div v-else class="society__list">
                <div class="list__item" v-for="index in userStore.user.customer.establishments.length">
                    <div class="society__info__container  animate-pulse">
                        <div role="status" class="society__logo flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="list__main__content">
                            <div class="list__main__info">
                                <div class="society__item">
                                    <div class="society__item">
                                        <div class="society__main__info">
                                        <div class="item__head">
                                                <div class="society__info">
                                                    <label class="society__name">
                                                        <div class="h-2 bg-gray-300 rounded-full dark:bg-gray-600 w-64 mb-2.5"></div>
                                                    </label>
                                                    <div class="society__category">
                                                        <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                                    </div>
                                                    <div class="society__location">
                                                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                            </div>
                            <div class="list__actions">
                                <div class="h-7 bg-gray-300 dark:bg-gray-700 w-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
               </div>
        </div>
        <div class="container client__container" v-else>
            <div class="search__icon">
                <i class="uil uil-envelope-alt"></i>
                <div class="line"></div>
            </div>
            <div class="app__message">
                <p>Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, It seems you are not yet an active customer. To proceed further and access our services, kindly get in touch with our admin team. They will assist you in finalizing your registration and become a valued customer.</p>
                <button class="btn" @click="signOut">Disconnect</button>        
            </div>
        </div>
     </div>   
</template>

<script setup>
import {ref} from 'vue'
import { loadFull } from "tsparticles";
import { useRouter } from "vue-router";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import { useMediaStore } from "@Stores/media.js";
import { useAppStore } from "@Stores/index.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import RatingComponent from '@Components/utils/RatingComponent.vue'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

const router = useRouter();
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const mediaStore = useMediaStore();
console.log(companiesStore.establishments)

const particlesInit = async engine => {
    await loadFull(engine);
};

const particlesLoaded = async container => {
    console.log("Particles container loaded", container);
};

const page=ref({
    title1: "",
    title2: "Home",
    icon: "uil-estate",
});

const signOut = () => {
    userStore.signOut();
    userStore.authenticated = false;
    if(userStore.authenticated == false) router.push({name:"Login"});
}

const goToCompany = (establishment) => {
    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Company', 
            params: {
                id: establishment.id
            },
        });
    }, 100); 
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.establishment__link label, .establishment__link{
    cursor: pointer !important;
}
.breadcrumb {
    position: relative;
    top:-110px;
}

.breadcrumb i{
    font-size: 40px;
    color: var(--color-white);
    position: relative;
}

.breadcrumb div{
    color: var(--color-bg1);
    font-size: 25px;
    position: relative;
    top: -10px;
}

.main__search{
    position: relative;
    top:-110px;
}

.main__search input{
    padding:20px 35px;
    width:100%;
    font-size:15px;
    font-weight:bold;
}

.main__search input::placeholder{
   font-size:15px;
   font-weight:bold;
   color: var(--color-bg2)
}

.first{
    border-right:2px solid var(--light-color-bg1)
}

.search__inputs{
    display:flex;
    justify-content: center;
    align-items:center;
}

.search__input i{
   position:relative;
   left:-125px;
   top:45px;
   font-size:20px;
   color: var(--color-danger)
}

.client__container{
    position: relative;
    top:1rem;
    height: inherit;
    display: flex;
    gap:1rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.search__icon i{
    font-size: 30px;
    color: var(--color-danger);
}

.search__icon .line{
    font-size: 30px;
    background-color: var(--color-bg2);
    height: 2px;
    width: 40px;
}

.client__container__head{
    font-size: 19px;
    color: var(--color-bg2);
    transform: var(--transition);
}

.client__container__head div, .client__container__head span{
    font-size: 15px;
    font-weight: bold;
}

.society__list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-self: center;
    transform: var(--transition)
}

.list__item{
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
    border: 2px solid var(--light-color-bg1);
    transition: var(--transition);
}

.society__info__container{
    display: flex;
    gap: 1rem;
    font-size: 15px;
    color: var(--color-bg2);
    justify-content: space-between;
    flex-direction: row;
    transition: var(--transition);
}

.society__logo{
   width: 200px;
   height: 95px;
   z-index: 0;
   transform: var(--transition);
}

.society__logo img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.society__logo svg{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.list__main__content{
    width: 600px;
    transition: var(--transition);
}

.list__main__info{
    display: flex;
    justify-content: space-between;
}

.society__item {
    display: flex;
    gap: 2rem;
}

.society__main__info{
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.society__item div{
    font-size: 13px;
    font-weight: 500;
}

.society__item i{
    color: var(--color-danger);
    margin-right: 5px;
}

.item__head{
    display: flex;
    justify-content: space-between;
}

.society__item label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.rating__content{
    align-self: center;
}

.list__actions{
    display: flex;
    justify-content: flex-end;
}

.list__actions button{
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    transition: var(--transition);
}

.app__message p{
    margin: 15px auto;
}
.app__message button{
    border: 1px solid var(--color-danger);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    color: var(--color-danger);
}

.app__message button:hover{
    background-color: var(--color-danger);
    color: white;
}

.list__actions button:hover{
    background-color: var(--color-primary);
}

@media screen and (max-width:1163px) {
    .client__container{
      width: 55% !important;
    }
}

@media screen and (max-width:1163px) {
    .client__container{
      width: 60% !important;
    }
}

@media screen and (max-width:1024px) {
    .client__container{
        position: relative;
        top: 9rem !important;
    }
}

@media screen and (max-width:964px) {
    .client__container{
      width: 65% !important;
    }
}

@media screen and (max-width:884px) {
    .client__container{
      width: 70% !important;
    }
    .client__container__head{
        font-size: 18px;
    }
}

@media screen and (max-width:779px) {
    .client__container{
      width: 80% !important;
    }

    .client__container__head{
        font-size: 16px;
    }

    .society__item label{
        font-size: 13px;
    }

    .society__item div{
        font-size: 12px;
    }
}

@media screen and (max-width:670px) {
    .client__container{
      width: var(--container-width-md) !important;
    }
}

@media screen and (max-width:600px) {
    .client__container__head{
        font-size: 15px;
    }

    .society__info__container{
        flex-direction: column;
    }

    .list__main__content{
        width: inherit;
    }

    .society__logo{
        width: 100%;
        height: 150px;
    }

    .list__actions button{
        flex-grow: 1;
        margin: 10px 0px 0px 0px;
        padding: 5px 0px;
        background-color: var(--color-primary);
        color: white;
    }

    .society__location{
        display: flex;
    }
    .society__location span{
        display: block;
        flex-basis: 225px;
        line-height: 1.2;
    }

    .society__item label{
        font-size: 14px;
    }
}
</style>