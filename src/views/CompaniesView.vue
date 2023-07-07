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
        <div class="container client__container">
            <div class="search__icon">
                <i class="uil uil-building"></i>
                <div class="line"></div>
            </div>
            <div class="client__container__head" v-if="companiesStore.establishments.length>0">
                Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, your companies are listed bellow.  <span>({{ companiesStore.nb }} companies found)</span>
            </div>
            <div class="client__container__head" v-else>
                Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, no companies found yet.
            </div>
            <div class="society__list">
                <div class="society__info__container" v-for="company,index in companiesStore.establishments" @click="$router.push(`/companies/${company.id}`)">
                    <div class="society__item">
                        <swiper class="society__logo" :modules="[Virtual]" v-if="company.media.length > 0" :slides-per-view="1" :space-between="10" :virtual="true">
                                <swiper-slide v-show="mediaStore.isImageFile(image.url_source)" v-for="image in company.media">
                                    <img :src="image.url_source">
                                </swiper-slide>
                        </swiper>
                        <img v-else class="society__logo" :src="'https://images.pexels.com/photos/7070/space-desk-workspace-coworking.jpg'" alt="">
                        <div class="society__main__info">
                        <div class="item__head">
                                <div class="society__info">
                                    <label class="society__name">{{ company.name }}</label>
                                    <div class="society__category">
                                        <i :class="['uil', company.category=='Restaurant'?'uil-restaurant':'', company.category=='Hotel'?'uil-bed-double':'', company.category=='Residence'?'uil-home':'']"></i>
                                        <span>{{ company.category }}</span>
                                    </div>
                                    <div class="society__location">
                                        <i class="uil uil-location-point"></i>
                                        <span>{{ company.address1 }}, {{ company.city }}</span>
                                    </div>

                                </div>
                                <div class="society__actions">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <RatingComponent class="rating__content" :reviews="company.reviews.length" :rating="companiesStore.calculateRatingV2(company.reviews)"/>
               </div>
            </div>
        </div>
     </div>   
</template>

<script setup>
import {ref, watch} from 'vue'
import { loadFull } from "tsparticles";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import { useMediaStore } from "@Stores/media.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import RatingComponent from '@Components/utils/RatingComponent.vue'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

const userStore = useUserStore();
const companiesStore = useCompanyStore();
const mediaStore = useMediaStore();

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

const isActive = ref('all');
</script>

<style scoped>
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
    /* border: 1px solid black; */
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
    top:4rem;
    height: inherit;
    display: flex;
    gap:2rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
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

.client__container__head ul{
    font-size: 16px;
    display: flex;
    align-items: center;
    gap:2rem;
    margin-top:20px;
    border-bottom: 2px solid var(--light-color-bg1);
    width: 100%;
}

.client__container__head li{
    cursor: pointer;
}

.client__container__head li.active{
    border-bottom: 3px solid var(--color-danger);
}

.society__list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    align-self: center;
    transform: var(--transition)
}

.society__item .society__logo{
   width: 100px;
   height: inherit;
   z-index: 0;
}

.society__info__container {
    display: flex;
    gap: 2rem;
    font-size: 15px;
    padding: 10px;
    border-radius: 5px;
    flex-basis: 50%;
    margin-bottom: 10px;
    color: var(--color-bg2);
    cursor: pointer;
    border: 2px solid var(--light-color-bg1);
    transition: var(--transition);
    height: 75px;
    justify-content: space-between;
}

.society__item {
    display: flex;
    gap: 2rem;
}

.society__info__container:hover {
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.09);
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

/* For tablets */
@media screen and (max-width:1140px) {
    .society__list{
        width: 90% !important;
    }

    .client__container__head{
        font-size: 18px;
    }
}

@media screen and (max-width:1024px) {
    .client__container{
        position: relative;
        top: 11rem !important;
    }
}

@media screen and (max-width:950px) {
    .society__list{
        width: 100% !important;
    }
}

@media screen and (max-width:800px) {
    .client__container{
      width: var(--container-width-lg) !important;
    }
}

@media screen and (max-width:700px) {
    .client__container{
      width: var(--container-width-md) !important;
    }
}

</style>