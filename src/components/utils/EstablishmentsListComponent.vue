<template>
    <div class="list__item" v-for="(company, i) in establishments" :key="company.id">
        <div class="society__info__container">
            <swiper v-if="company.url_source !== null" @click="goToCompany(company)" class="society__logo"
                :modules="[Virtual]" :slides-per-view="1" :space-between="10" :virtual="true">
                <swiper-slide v-show="mediaStore.isImageFile(image)" v-for="image in company.url_source" :key="image">
                    <img :src="company.url_source" :class="widthimage(company.url_source, company.competitor_tag)"
                        :id="company.competitor_tag">
                </swiper-slide>
            </swiper>
            <swiper v-else @click="goToCompany(company)" class="society__logo" :modules="[Virtual]" :slides-per-view="1"
                :space-between="10" :virtual="true">
                <swiper-slide>
                    <div role="status" class="bg-gray-300 rounded-sm society__logo">
                        <svg class="text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                    </div>
                </swiper-slide>
            </swiper>
            <div class="list__main__content">
                <div class="society__info">
                    <a class="establishment__link" @click="goToCompany(company)">
                        <label class="society__name">{{ company.name }} {{ company.score ?
                            `(${company.score})` : '' }}</label>
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
                </div>
                <div class="stat__content">
                    <RatingComponent class="rating__content" :reviews="company.totalReviews"
                        :rating="Number(company.rating).toFixed(1)" :score="company.score" :feeling="company.feeling"
                        :company="company" :filter_type="filter_type" />
                    <div class="list__actions">
                        <button class="btn" @click="goToCompany(company)">More details</button>

                    </div>
                </div>

            </div>
        </div>
        <div class="category_container_mobile">
            <div class="inline-flex category_mobile" v-if="showMoreInformation">

                <span class="reviews-loader" v-if="dataCategoriesLoading[i]"></span>

                <div v-else v-for="(cat, category, index) in sortedCategory(company.categories)" :key="category"
                    class="reviews_category">

                    <div v-if="cat" class="ml-1 review__category-container cat_desc">

                        <span :style="{
                            backgroundColor: colorBetweenRedYellowGreen(cat),
                            padding: '5px',
                            borderRadius: '5px',
                            marginRight: '10px'
                        }" class="review__category emoji"
                            @click="redirectToReviewsCategory(route.params.tag, company.competitor_tag, category)">
                            {{ capitalize(category) }} : {{ cat }}
                        </span>
                    </div>
                </div>

                <div class="reviews-count" v-if="company.reviews_count">
                    <div class="review-box" v-for="(count, stars) in sortedReviews(company.reviews_count)" :key="stars"
                        @click="redirectToReviews(stars, company.competitor_tag)">
                        <span class="score">{{ stars }}</span><i class="fa fa-star " aria-hidden="true"></i>: {{
                            count }}
                    </div>
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
import { ref, defineAsyncComponent, defineEmits, inject, onMounted, watch } from 'vue';
import RatingComponent from '@Components/utils/RatingComponent.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import { useMediaStore } from "@Stores/media.js";
import { useAppStore } from "@Stores/app.js";
import { useRouter, useRoute } from "vue-router";
import 'swiper/css';
import { useUserStore } from "@Stores/user.js";
import { ElProgress, ElTooltip } from 'element-plus';

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
    loading: {
        type: Boolean,
        required: false,
    },
    dataCategoriesLoading: {
        type: Array,
        default: []
    },
    showMoreInformation: {
        type: Boolean,
        default: true
    },
    filter_type: {
        type: String,
        default: "global"
    },

});

const establishment = ref(null);
const showModal = ref(false);
const baseurl = window.location.origin;
//const colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890', '#ff42e5', '#58f742', '#8eaca8', '#fda458', '#90fdac', '#444278', '#f7a142', '#de90fd', '#42d3ff', '#e558f7', '#a8ac42', '#90fdd4', '#784444', '#58f7bf', '#fdaa58', '#90fdff']

const colors = ['#008000', '#009900', '#66A300 ', '#AABB00', '#CCFF00', '#FFCC00', '#FF6600', '#FF0000']

const colorBetweenRedYellowGreen = (t) => {
    // Normaliser t dans l'intervalle [0, 1] à partir de [-1, 1]
    t = (t + 1) / 2; // Transformation de [-1, 1] à [0, 1]

    let r, g, b;

    if (t <= 0.5) {
        // Interpolation entre le rouge et le jaune
        t = t * 2; // Normaliser t dans cette moitié [0, 0.5] -> [0, 1]
        r = 255;
        g = Math.round(255 * t);
        b = 0;
    } else {
        // Interpolation entre le jaune et le vert
        t = (t - 0.5) * 2; // Normaliser t dans cette moitié [0.5, 1] -> [0, 1]
        r = Math.round(255 * (1 - t));
        g = 255;
        b = 0;
    }

    return `rgba(${r}, ${g}, ${b}, .5)`;
}

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

const sortedCategory = (categories) => {
    if (!categories || typeof categories !== 'object') {
        return {};
    }
    return Object.entries(categories).sort((a, b) => b[0] - a[0]).reduce((obj, [k, v]) => {
        obj[k] = v;
        return obj;
    }, {});
};

const emit = defineEmits(['redirect-to-reviews']);

const redirectToReviews = (star, id) => {
    const { tag } = route.params
    router.push({
        name: 'Review',
        params: { tag, id },
        query: {
            star_filter: star,
            competitors: id
        },
    });
}

const redirectToReviewsCategory = (tag, id, category) => {
    router.push({
        name: 'CategorizationReview',
        params: {
            tag: tag,
            id: id
        },
        query: {
            category: category,
        }
    });
    console.log("category", category)
}

const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

</script>
<style scoped>
.cat_desc {
    font-weight: 450;
}

.cat_desc span {
    font-size: 12px;
}

.cat_desc span:nth-child(2) {
    margin-left: 1rem;
}

.cat_desc p span {
    font-size: 18px;
}


.category_container_mobile {
    /* overflow-x: auto; */
    white-space: nowrap;
    /* width: 70%; */
    width: 100%;
    /* position: relative; */
    /* bottom: 0;
    left: 0; */
    scrollbar-width: thin;
    /* scrollbar-color: #008c #f1f1f1; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    /* border: 2px solid green; */
}

.category_container_mobile::-webkit-scrollbar {

    height: 8px;
    width: 8px;
    border-radius: 10px;

}

.category_mobile {
    /* width:100%; */
    align-items: center;
    overflow-x: auto;
    min-width: 30px;
    min-height: 25px;
    margin-right: 12px;
}

.review__category-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: right; */
    gap: 2px;
    cursor: pointer;
}

.review__category {
    /* background: var(--color-danger); */
    /* color: white; */
    padding: 3px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    margin-right: 5px;
}


.reviews-count h2 {
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
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    justify-content: space-between;
    flex-direction: row;
    transition: var(--transition);
    /* border: 2px solid red; */
}

.society__logo {
    width: 200px;
    height: 95px;
    z-index: 0;
    transform: var(--transition);
    display: flex;
    justify-content: center;
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

.society__location {

    width: 250px;
}

.society__location span {
    /* height: 35px; */
    width: 150px;
}


.list__main__content {
    /* width: 100%; */
    transition: var(--transition);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    /* border: 1px yellow solid; */
    width: 100%;
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

.society__info div,
.review-box span,
div.review-box {
    font-size: 13px;
    font-weight: 500;
}

.review-box i {
    color: var(--color-danger);
    margin-right: 5px;
}

.item__head {
    display: flex;
    justify-content: space-between;
}

.society__info label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.stat__content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
}

.rating__content {
    padding-top: 15px;
}

.list__actions {
    display: flex;
    justify-content: flex-end;
    /* margin-right: 10px; */
}

.list__actions button {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    /* margin-top: -5px; */
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

@media screen and (max-width:1440px) {
    .society__location {
        display: flex;
        width: 180px;
    }
}

@media screen and (max-width:1260px) {
    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 400px !important;
    }
}

@media screen and (max-width:779px) {
    .society__info label {
        font-size: 13px;
    }

    .society__location {
        display: flex;
        width: 200px;
    }

    .society__info div {
        font-size: 12px;
    }

    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 400px !important;
    }

}

@media screen and (max-width:768px) {
    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 400px !important;
        margin-bottom: -42px !important;
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
        /* margin: 19px 0px 0px 0px; */
        padding: 5px;
        background-color: var(--color-primary);
        color: white;
    }

    .society__location {
        display: flex;
        width: 200px;
    }

    .society__location span {
        display: block;
        flex-basis: 225px;
        line-height: 1.2;
    }

    .society__info label {
        font-size: 14px;
    }

    .society__name {
        width: 200px;
    }

    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 430px !important;
        margin-left: 0 !important;
        margin-bottom: -30px !important;
    }
}

@media (max-width: 500px) {
    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 350px !important;
        margin-left: 0 !important;
    }

    .category_mobile {
        width: 100%;
        padding: 0 8px;
    }

    .review-box {
        width: 50% !important;
    }
}

@media (max-width: 400px) {
    .establishment-rank-view .reviews-category .reviews-boxs {
        max-width: 300px !important;
        margin-left: 0 !important;
    }
}

@media (max-width: 380px) {
    .society__location {
        width: 200px;
    }

    .society__name {
        width: 200px;
    }
}

.smallClass {
    width: auto ! important;
    height: 100% ! important;
    margin: auto;
    vertical-align: middle;

}

.largeClass {
    width: 100% ! important;
    height: auto ! important;
    margin: auto;
    vertical-align: middle;
    margin-top: 10px;
}

.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}

.fade-in.show {
    opacity: 1;
}

.establishment-rank-view .reviews-boxs {
    max-width: 500px;
    overflow-x: scroll;
    display: flex;
    border-radius: 5px;
    margin-bottom: -21px;
    margin-top: 15px;
    margin-right: -130px;
    margin-left: -214px;
}

.establishment-rank-view .reviews-boxs::-webkit-scrollbar {
    height: 4px;
}

.reviews-box .reviews-title {
    padding: 3px;
    margin: 5px 4px;
    display: flex;
    border-radius: 5px;
    color: white;
}

.reviews-box:hover {
    cursor: pointer
}

.reviews-loader {
    overflow: hidden !important;
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-left: 5px;
    /* margin-top: 5px; */
    border: 4px solid rgba(0, 0, 0, .1);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>