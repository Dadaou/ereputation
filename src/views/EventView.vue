<template>
    <div class="main__container">
        <HeadComponent class="head" :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData"/>
        </div>
        <div class="app__container">
            <div class="left__side">
                <div class="head">
                    <div class="app__title">
                       <h2>Event</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <EventItemComponent/>
                </div> 
            </div>
            <div class="tablet_mobile__filter">
                    <DropdownComponent :showTitle="false" class="dropdown" title="Filter by website" placeholder="Select a website" :data="websites" @submit="(website)=>{
                        selectedWebsites = website
                        if(website == websites[0]){
                           
                        }else{
                            
                        }
                    }" :default="websites[0]"/>
                    <VueDatePicker class="mb-2" v-model="dateStart"  placeholder="from date" :format="format2"/>
                    <VueDatePicker v-model="dateEnd"  placeholder="to date" :format="format2"/>
            </div>
            <div class="tablet_mobile__head">
                <div class="establishment__info">
                        <label class="society__name">{{ establishment.name }}</label>
                        <div class="society__category">
                            <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span>{{ establishment.category }}</span>
                        </div>
                        <div class="society__country" v-if="establishment.country != null">
                                <i class="uil uil-map"></i>
                                <span>{{ establishment.country }}</span>
                        </div> 
                        <div class="society__location">
                                <i class="uil uil-location-point"></i>
                                <span>{{ establishment.address1 }}, {{ establishment.city }}</span>
                         </div>
                         <div class="society__rating">
                                <i class="uil uil-favorite"></i>
                                <span>{{ all_items[0].value  }}</span>
                         </div>
                         <div class="society__reviews">
                            <i class="uil uil-comment-alt"></i>
                                <span>{{ all_items[1].value  }}</span>
                         </div>
                    </div>
                <div class="photo">
                    <img v-if="media.length > 0" :src="media[0]" alt="" />
                    <div v-else role="status" class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                </div>
            </div>
            <div class="right__side">
                <div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <img v-if="media.length > 0" :src="media[0]" alt="" />
                        <div v-else role="status" class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                        </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info mt-2">
                            <label class="society__name">{{ establishment.name }}</label>
                            <div class="society__category">
                                <i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                                <span>{{ establishment.category }}</span>
                            </div>
                            <div class="society__location">
                                    <i class="uil uil-location-point"></i>
                                    <span>{{ establishment.address1 }}, {{ establishment.city }}</span>
                            </div> 
                            <div class="society__rating">
                                    <i class="uil uil-favorite"></i>
                                    <span>{{ all_items[0].value  }}</span>
                            </div>
                            <div class="society__reviews">
                                <i class="uil uil-comment-alt"></i>
                                    <span>{{ all_items[1].value  }}</span>
                            </div>
                    </div>
                    <div class="date__filter">
                        <div class="text-sm title">Select a range of date</div>
                        <VueDatePicker class="mb-2 mt-2" v-model="dateStart"  placeholder="from date" @update:model-value="handleDate" :format="format2"/>
                        <VueDatePicker v-model="dateEnd"  placeholder="to date" :disabled="!enableDateEnd" :min-date="new Date(dateStart)" :format="format2"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import EventItemComponent from '@Components/Event/EventItemComponent.vue';
import {ref, watch, provide, onBeforeMount} from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/index.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';

const page=ref({
    title1: "",
    title2: "Events",
    icon: "uil-calender",
});

const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Back",
        path: `/companies/${route.params.id}`,
        isCurrent: false,
    },
    {
        title: "Events",
        path: `${route.path}`,
        isCurrent: true
    }
]
const userStore = useUserStore();
const companiesStore = useCompanyStore();
const appStore = useAppStore();
const baseurl = window.location.origin;

let establishment = ref({});
provide('establishment', establishment)
let events = ref([]);
provide('events', events);
let dataReviews = ref([]);
let selectedStars = ref([1,2,3,4,5]);
let visibleData = ref([])
let paginationConfig = ref({
    current:0,
    size: 5,
    data: [],
    _data: []
});

const showModal = ref(false);
let selectedWebsites = ref('Global');
let websites = ref(['Global']);
let media = [];
const all_items = ref([
    {title: "Rating", value: 0, icon: "uil-star"},
    {title: "Reviews", value: 0, icon: "uil-comment"},
    {title: "Competitors", value: 0, icon: "uil-building"},
]);

const dateStart = ref();
const dateEnd = ref();
const enableDateEnd = ref(false);

const format2 = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const handleDate = (modelData) => {
 enableDateEnd.value = (modelData != null)?true:false;
 dateEnd.value = null;
}

watch([ dateStart, dateEnd ], ()=>{
   
})

onBeforeMount(async()=>{
const companyId = route.params.id;
companiesStore.establishments.forEach(async company => {
        if(company.id == companyId){
            establishment.value = company;
            events.value = company.events;
            establishment.value.media.forEach(item => {
                media.push(item.url_source);
            });
        
            all_items.value[1].value = establishment.value.reviews.length;
            all_items.value[0].value = companiesStore.calculateRatingV2(establishment.value.reviews);
            appStore.isLoading = false;
        }
    });
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

*{
    transition: var(--transition);
}
.app__container{
    margin-top: 5rem;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap:1rem;
}

.reviews__content1{
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    margin-top: 15px;
}

.reviews__content1 .review{
    flex-grow: 1;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}

.rating__customers{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
}

.establishment{
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info i{
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment div{
    font-size: 13px;
    font-weight: 500;
}

.date__filter .title{
    font-weight:600;
}

.filter__content .title{
    font-weight: 500;
}

.filter__content{
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    /* margin: 15px auto; */
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.rating__customers .title{
   font-size: 15px;
   font-weight:600;
   margin-left: 15px;
   margin-top:15px;
}

.reviews__content1 .review span{
   font-size: 12px;
   margin: auto;
}

.chart__rating{
    display: flex;
}

.community__feedback .title{
    font-size: 15px;
    font-weight: 600;
}

.community__feedback h2{
    font-size: 14px;
    font-weight: 500;
}

.legend{
 margin: 15px auto;
}

.comment{
    overflow: hidden;
    text-align: justify;
}

.app__title{
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1{
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2{
    font-size: 18px;
    transition: var(--transition);
}

.left__side{
    width: 1300px;
    padding: 50px 5px;
}

.left__side .head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

#competitors__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#website__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#dropdownDivider{
    position: absolute;
}

#dropdownDivider li{
    cursor: pointer;
    padding: 5px 10px;
    margin: auto;
    transform: var(--transition);
}

#dropdownDivider li:hover{
   background-color: var(--color-danger);
   color: var(--color-white);
}

.dashboard__content{
    display: flex;
    flex-wrap: wrap;
    gap:1rem;
    margin: 50px auto;
}

.counter{
    flex-grow: 1;
}

.dashboard__content, .chart__content, .reviews__content{
    margin-top: 20px;
}

.chart__content{
    display: flex;
    justify-content: center;
}

.head .competitors{
    display: flex;
    align-items: center;
    gap: 1rem;
}

.competitors .select__title{
    font-weight: 500;
}

.rating{
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
}

.right__side{
    width: 500px;
    padding: 50px 0px;
}

.rating__statistics{
    display:none;
    margin-bottom:15px;
    transition: var(--transition);
}

.filter__container{
    display: none;
    transition: var(--transition);
}

.see__more{
    cursor: pointer;
}

.society__name{
    margin: 5px 0;
}

.tablet_mobile__head, .tablet_mobile__filter{
    display: none;
}

.society__location{
    display: flex;
}
.society__location span{
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

.modal__header{
    display: flex;
    justify-content: space-between;
}

.modal__header div{
    align-self: center;
}

.modal__close i{
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.establishment__review__qrcode p{
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn{
    display: flex;
    justify-content: center;
}

.download__qr_btn button{
    flex-basis: 50%;
}

.qr__code{
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}
.modal__close i:hover{
    transform: rotate(360deg);
}

.include a{
    color: var(--color-primary);
}

.not__include a{
    color: var(--light-color-bg2);
}

.include .star__barre{
    background: var(--color-warning);
}

.not__include .star__barre{
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span{
    color: rgb(165, 165, 165);
}

.star__barre{
    cursor: pointer;
}

@media screen and (max-width:1400px) {
  .app__container{
    width: var(--container-width-md);
  }

  .breadcrumb__container{
        width: var(--container-width-md);
    }
}

@media screen and (max-width:1287px) {
  .counter{
    gap: 2rem !important;
  }
  .left__side{
    width: 1000px !important;
  }
}

@media screen and (max-width:1024px) {
    .app__container{
        position: relative;
        top: 7.5rem !important;
    }
}

@media screen and (max-width: 975px) {
   .app__container{
    flex-direction: column-reverse;
    width: 95% !important;
    justify-content: center;
    align-items: center;
   }
   .left__side{
    width: inherit !important;
   }

   .photo{
    flex-basis: 250px;
   }

   .photo div{
    height: 100%;
   }

   .photo img{
    height: 100%;
    width: 100%;
   }
   .dashboard__content, .dashboard, .right__side{
    display: none !important;
   }

   .tablet_mobile__head{
        display: flex;
        justify-content: space-between;
        margin: auto;
        margin-top: 50px;
        width: inherit;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: 1px solid var(--light-color-bg2);
        border-radius: 5px;
        padding: 15px;
        font-size: 14px;
    }

    .tablet_mobile__head label{
        font-size: 17px !important;
    }

    .tablet_mobile__head span{
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter{
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter *{
        flex-basis: 200px;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head{
        font-size: 13px !important;
    }

    .tablet_mobile__head label{
        font-size: 15px !important;
    }

    .tablet_mobile__filter{
       gap: 0.25rem;
    }
}

@media screen and (max-width:800px) {
    .photo{
       flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head{
        font-size: 12px !important;
        padding: 10px;
    }

    .photo{
       flex-basis: 210px !important;
    }

    .tablet_mobile__head label{
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter{
       flex-direction: column;
       padding: 5px 0px !important;
    }

    .tablet_mobile__filter *{
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head{
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo{
       flex-basis: 150px !important;
       height: 100px !important;
    }
}
</style>