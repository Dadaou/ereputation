<template>
     <div class="main__container">
        <head-component :isSearch="true" :page="page">
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
            <div class="client__container__head">
                Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, your companies are listed bellow.
                <div>({{ companies.length }} companies found)</div>
                <!-- <ul>
                    <li :class="isActive=='all'?'active':''" @click="isActive='all'">All companies</li>
                    <li :class="isActive=='my_societies'?'active':''" @click="isActive='my_societies'">My companies</li>
                    <li :class="isActive=='concurrent'?'active':''" @click="isActive='concurrent'">Competitors</li>
                </ul> -->
            </div>
            <div class="society__list">
               <div class="society__item" v-for="company,index in visibleData">
                    <!-- <div class="society__status" v-if="!company.isConcurrent">owned</div> -->
                    <img class="society__logo" :src="company.logo" alt="">  
                    <div class="society__main__info">
                       <div class="item__head">
                        <div class="society__info">
                            <label class="society__name">{{ company.name }}</label>
                            <div class="society__location">
                                <i class="uil uil-location-point"></i>
                                <span>{{ company.address }}</span>
                            </div>
                        </div>
                        <div class="society__rating">
                            <div class="review">
                                <div v-if="company.rate>8">
                                    Very Good
                                </div>
                                <div v-else-if="company.rate>5">
                                    Good
                                </div>
                                <div v-else>
                                    Not Good
                                </div>
                                <span>{{ company.nb_reviews }} reviews</span>
                            </div>
                            <div class="rating">{{ company.rate }}</div>
                        </div>
                       </div>
                        
                       <div class="society__description">
                        {{ company.description }}
                       </div>
                       <div class="society__actions">
                        <button class="btn compare" v-if="company.isConcurrent" @click="$router.push('/companies/1/2/comparison')">Compare <i class="uil uil-chart-line"></i></button>
                        <button class="btn see__reviews" @click="$router.push(`/companies/${index}`)">View<i class="uil uil-angle-right-b"></i></button>
                       </div>
                    </div>
               </div>
            </div>
        </div>
     </div>   
</template>

<script setup>
import {ref, watch} from 'vue'
import { loadFull } from "tsparticles";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import { useUserStore } from "@Stores/user.js";
const userStore = useUserStore();

const particlesInit = async engine => {
    await loadFull(engine);
};

const particlesLoaded = async container => {
    console.log("Particles container loaded", container);
};

const page=ref({
    title1: "The",
    title2: "home page",
    icon: "uil-estate",
});

const isActive = ref('all');
let visibleData = ref([]);
const companies = ref([
    {
        logo: "/src/assets/images/Portrait_Placeholder.png",
        name: "Booking.com",
        rate: 8.5,
        nb_reviews: 60,
        address: "New York, USA",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nihil quasi odit eaque doloremque, quos consequatur harum ipsam inventore",
        website: "https://booking.com",
        isConcurrent: false,
    },
    {
        logo: "/src/assets/images/Portrait_Placeholder.png",
        name: "Trip Advisor",
        rate: 4.3,
        nb_reviews: 60,
        address: "New York, USA",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nihil quasi odit eaque doloremque, quos consequatur harum ipsam inventore",
        website: "https://booking.com",
        isConcurrent: false,
    },
    {
        logo: "/src/assets/images/Portrait_Placeholder.png",
        name: "Booking.com",
        rate: 5.2,
        nb_reviews: 60,
        address: "New York, USA",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nihil quasi odit eaque doloremque, quos consequatur harum ipsam inventore",
        website: "https://booking.com",
        isConcurrent: false,
    },
]);

visibleData.value = companies.value;

watch(isActive, (value)=>{
    if(value == 'concurrent'){
        visibleData.value = []
        companies.value.forEach(elem=>{
            if(elem.isConcurrent==true){
                visibleData.value.push(elem);
            }
        });
    } 

    if(value == 'my_societies'){
        visibleData.value = []
        companies.value.forEach(elem=>{
            if(elem.isConcurrent==false){
                visibleData.value.push(elem)
            }
        });
    }

    if(value == 'all'){
        visibleData.value = []
        visibleData.value = companies.value
    }
});
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
    /* background-color: aqua; */
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
    font-size: 20px;
    color: var(--color-bg2)
}

.client__container__head div{
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
    /* flex-wrap: wrap; */
    gap: 1rem;
    flex-direction: column;
}
.society__status{
    position: absolute;
    left: -11px;
    background-color: var(--color-success);
    color: var(--color-white);
    font-weight: bold;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 3px;
    z-index: 1;
}

.society__status::before{
    content: "";
    /* background-color: var(--color-success); */
    display: block;
    position: absolute;
    top:25px;
    left:-1px;
    /* height: 15px;
    width: 15px; */
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 9.5px solid var(--color-success);
    border-radius: 10px;
    transform: rotate(50deg);
}

.society__item {
    display: flex;
    /* align-items: center; */
    gap: 2rem;
    font-size: 15px;
    padding: 10px;
    border-radius: 5px;
    /* box-shadow: 0rem 1rem 2rem rgba(0, 0, 0, 0.10); */
    width: 100%;
    margin-bottom: 10px;
    color: var(--color-bg2);
    cursor: pointer;
    border: 2px solid var(--light-color-bg1);
   
}

.society__item img{
   width: 23%;
   height: 100%;
}

.society__main__info{
   display: flex;
   flex-direction: column;
   gap: 1rem;
   /* align-items: center; */
}

.society__item label{
    font-size: 18px;
    font-weight: bold;
    color: var(--color-primary)
}

.society__item div{
    font-size: 14px;
}

.society__item i{
    color: var(--color-danger);
}

.item__head{
    display: flex;
    justify-content: space-between;
}

.society__rating{
    display:flex;
    align-items: flex-end;
    gap: 15px;
}

.rating{
    background-color: var(--color-danger);
    color: var(--color-white);
    padding: 10px 10px;
    font-weight: bold;
    border-radius: 6px 6px 6px 0px;
}

.review div{
    font-weight: bold;
    color: var(--color-bg2);
    font-size: 16px;
}

.review span{
    font-size: 13px;
}

.society__actions{
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}
.society__actions .see__reviews{
    color: var(--color-white);
    background-color: var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
    transition: var(--transition);
    cursor: pointer;
}

.society__actions .compare{
    color: var(--color-white);
    background-color: var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
    transition: var(--transition);
    cursor: pointer;
}

.society__actions .see__reviews:hover, .compare:hover{
    color: var(--color-white);
    background-color: var(--color-primary);
}

.society__actions i{
    color: var(--color-white);
}

/* @media screen and (max-width:1024px) {
    .breadcrumb{
        position: absolute;
        top:5rem;
    }

    .breadcrumb div{
        font-size: 20px;
    }
}

@media screen and (max-width:900px) {
    .breadcrumb div{
        font-size: 18px;
    }
}

/* Media Queries (Phone) */
/* @media screen and (max-width:650px) {
    .breadcrumb div{
        font-size: 15px;
    }
} */ 
</style>