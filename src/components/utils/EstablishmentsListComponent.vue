<template>
    <div class="list__item" v-for="company in establishments" :key="company.id">
        <div class="society__info__container">
            <swiper v-if="company.url_source !== null" @click="goToCompany(company)" class="society__logo"
                :modules="[Virtual]" :slides-per-view="1" :space-between="10" :virtual="true">
                <swiper-slide v-show="mediaStore.isImageFile(image)" v-for="image in company.url_source" :key="image">
                    <img :src="company.url_source" :class="widthimage(company.url_source, company.competitor_tag)" :id="company.competitor_tag">
                </swiper-slide>
            </swiper>
            <swiper v-else @click="goToCompany(company)" class="society__logo" :modules="[Virtual]" :slides-per-view="1" :space-between="10" :virtual="true">
                <swiper-slide>
                    <div role="status" class="society__logo bg-gray-300 rounded-sm">
                        <svg class="text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
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
                                    <a class="establishment__link" @click="goToCompany(company)">
                                        <label class="society__name">{{ company.name }} {{ company.score ? `(${company.score})` : '' }}</label>
                                    </a>
                                    <div class="society__category">
                                        <i
                                            :class="['uil', company.category == 'Restaurant' ? 'uil-restaurant' : '', company.category == 'Hotel' ? 'uil-bed-double' : '', company.category == 'Residence' ? 'uil-home' : '', company.category == 'Other' ? 'uil-home ' : '', company.category == 'Event' ? 'uil-schedule' : '']">
                                        </i>
                                        <span>{{ company.category }}</span>
                                    </div>
                                    <div class="society__location" v-if="company.address1 != null && company.city != null">
                                        <i class="uil uil-location-point"></i>
                                        <span>{{ company.address1 }}, {{ company.city }}</span>
                                    </div>
                                    <div class="reviews-count">
                                        <h2 v-if="showReviewsHeader">Reviews:</h2>
                                        <div class="review-box" v-if="company.reviews_count" v-for="(count, stars) in sortedReviews(company.reviews_count)" :key="stars" @click="redirectToReviews(stars, company.competitor_tag)">
                                            <span class="score">{{ stars }}</span><i class="fa fa-star " aria-hidden="true"></i>: {{ count }} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RatingComponent class="rating__content" :reviews="company.totalReviews" :rating="Number(company.rating).toFixed(1)" :score="company.score" :feeling="company.feeling" :company="company" />
                </div>
                <div class="list__actions">
                    <button class="btn" @click="goToCompany(company)">More details</button>
                </div>
            </div>
        </div>
    </div>
    <QrCodeModalComponent v-if="establishment"
        :qrcodeValue="`${baseurl}/public/${tag}/establishment/${establishment.competitor_tag}/feedback`"
        :showModal="showModal" :filename="`${establishment.name}-feedback-link`" @close="showModal = false"
        :customer="tag" :establishment="establishment.competitor_tag" type="establishment" />
</template>

<script setup>
import { ref, defineAsyncComponent, defineEmits, inject, onMounted } from 'vue';
import RatingComponent from '@Components/utils/RatingComponent.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import { useMediaStore } from "@Stores/media.js";
import { useAppStore } from "@Stores/app.js";
import { useRouter,useRoute } from "vue-router";
import 'swiper/css';
import { useUserStore } from "@Stores/user.js";

const QrCodeModalComponent = defineAsyncComponent(() => import('@Components/utils/QrCodeModalComponent.vue'))

const router = useRouter();
const route = useRoute()
const mediaStore = useMediaStore();
const appStore = useAppStore();
const tag = inject('tag');

const props = defineProps({
    establishments: {
        type: Array,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    selectedDate: {
        type: String,
        required: false
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    showReviewsHeader: {
        type: Boolean,
        default: false
    }

});

const establishment = ref(null);
const showModal = ref(false);
const baseurl = window.location.origin;

const goToCompany = (establishment) => {
    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Establishment',
            params: {
                id: establishment.competitor_tag,
                tag: tag.value
            },
        });
    }, 100);
};

const getMeta = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};

const widthimage = ((event, id) => {
    return getMeta(event, (err, img) => {
        const heightresize = 110;
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var newWidth = 0;
        if (aspectRatio == 1) {
            newWidth = heightresize;
        } else {
            newWidth = heightresize * aspectRatio;
        }
        let classy = (newWidth > 140) ? "largeClass" : "smallClass";

        var elem = document.getElementById(id);
        elem.classList.add("fade-in");
        setTimeout(() => {
            elem.classList.add('show');
        }, 10);
        elem.classList.add(classy);
        elem.src = event;
        return "OK";
    });
});

const sortedReviews = (reviews) => {
  return Object.entries(reviews).sort((a, b) => b[0] - a[0]).reduce((obj, [k, v]) => {
    obj[k] = v;
    return obj;
  }, {});
};

const emit = defineEmits(['redirect-to-reviews']);

const redirectToReviews = (star,id) =>{
    const {tag} = route.params
    router.push({
    name: 'Review',
    params:{tag,id},
    query: {
      stars: star,
    },
  });
}

</script>
<style scoped>
.reviews-count{
    margin: -19px;
}

.reviews-count h2{
    margin-left: 10px;
    font-weight: bold;
}

.list__item {
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 30px;
    border: 2px solid var(--light-color-bg1);
    transition: var(--transition);
}

.list__item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.score {
    font-weight: bold;
    margin-right: 1.5px;
}

.society__info__container {
    display: flex;
    gap: 1rem;
    font-size: 15px;
    color: var(--color-bg2);
    justify-content: flex-start;
    flex-direction: row;
    transition: var(--transition);
}

.society__logo {
    width: 200px;
    height: 95px;
    z-index: 0;
    transform: var(--transition);
    display:flex;
    justify-content:center;
    border-radius: 5px;

    /*margin-inline: 8px !important;*/
}

.society__logo img {
    border-radius: 5px;
}

.society__logo svg {
    height: 100%;
    width: 100%;
    object-fit: cover;
   
    
}

.society__location span {
    height: 35px;
    width: 150px;
}


.list__main__content {
    width: 100%;
    transition: var(--transition);
}

.list__main__info {
    display: flex;
    justify-content: space-between;
}

.society__item {
    display: flex;
    gap: 2rem;
}

.society__main__info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.society__item div {
    font-size: 13px;
    font-weight: 500;
}

.society__item i {
    color: var(--color-danger);
    margin-right: 5px;
}

.item__head {
    display: flex;
    justify-content: space-between;
}

.society__item label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.rating__content {
    padding-top: 15px;
    margin-right: 10px;
}

.list__actions {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
}

.list__actions button {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    margin-top: -5px;
}

.list__actions button:hover {
    background-color: var(--color-primary);
}

.list__actions button.qrcode {
    padding: 0 10px !important;
}

/*************
	Modal CSS
**************/
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

.establishment__review__qrcode p {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.qr__code {
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__close i:hover {
    transform: rotate(360deg);
}

@media screen and (max-width:779px) {
    .society__item label {
        font-size: 13px;
    }

    .society__item div {
        font-size: 12px;
    }
}

@media screen and (max-width:600px) {
    .society__info__container {
        flex-direction: column;
    }

    .list__main__content {
        width: inherit;
    }

    .society__logo {
        width: 100%;
        height: 150px;
    }

    .list__actions button {
        flex-grow: 1;
        margin: 10px 0px 0px 0px;
        padding: 5px 0px;
        background-color: var(--color-primary);
        color: white;
    }

    .society__location {
        display: flex;
    }

    .society__location span {
        display: block;
        flex-basis: 225px;
        line-height: 1.2;
    }

    .society__item label {
        font-size: 14px;
    }
}

.smallClass{
    width: auto! important;
    height: 100%! important;
    margin:auto;
    vertical-align: middle;
    
}
.largeClass{
    width: 100%! important;
    height: auto! important;
    margin:auto;
    vertical-align: middle;
    margin-top:10px;
}
.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}
.fade-in.show {
    opacity: 1;
}
</style>