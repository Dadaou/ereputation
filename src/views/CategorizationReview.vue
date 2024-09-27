<template>
    <div>
        <div class="breadcrumb">
            <BreadcrumbComponent :data="appStore.breadcrumbs" :tag="customerTag" />
        </div>
        <div class="container__categorization">
            <div class="tablet_mobile__head">
                <div class="establishment__info_tablet">
                    <label v-if="!dataLoading">{{ establishment.name }}</label>
                    <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                    <div>
                        <i
                            :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
                        <span v-if="!dataLoading">{{ establishment.category }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-48 mb-4"></span>
                    </div>
                    <div class="society__location" v-if="establishment.country != null">
                        <i class="uil uil-map"></i>
                        <span v-if="!dataLoading">{{ establishment.country }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                    <div class="society__location">
                        <i class="uil uil-location-point"></i>
                        <span v-if="!dataLoading">{{ establishment.city }}</span>
                        <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                    </div>
                </div>
                <div class="photo" v-if="!dataLoading">
                    <div v-if="establishment.url_source !== null" class="establishment__img">
                        <img :src="establishment.url_source" alt="" :class="widthimage(establishment.url_source)"
                            id="logoimagemobile" />
                    </div>
                    <div v-else role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="photo" v-else>
                    <div role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div class="tablet_mobile__filter">
                <div class="date__picker px-2">
                    <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
                </div>
                <div class="date__picker px-2">

                    <el-date-picker v-model="end_date" placeholder="End date" :size="'large'" />
                </div>
                <div class="px-2 w-full my-2">
                    <el-select v-model="categoryFilters" multiple collapse-tags collapse-tags-tooltip filterable
                        :max-collapse-tags="3" placeholder="select categories" size="large">
                        <el-option :label="'All'" :value="'all'" @click="handleCategoryDropdown('all')"
                            :disabled="categoryFilters.length > 1 && !categoryFilters.includes('all')" />
                        <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                            :value="item.category" @click="handleCategoryDropdown('other')" />
                    </el-select>
                </div>
            </div>
            <div class="right__side">
                <div
                    class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#" v-if="!dataLoading">
                        <div v-if="establishment.url_source !== null" class="establishment__img">
                            <img :src="establishment.url_source" alt="" :class="widthimage(establishment.url_source)"
                                id="logoimage" />
                        </div>
                        <div v-else role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <a href="#" v-else>
                        <div role="status"
                            class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                <path
                                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </a>
                    <div class="establishment__info">
                        <label class="society__name" v-if="!dataLoading">{{ establishment.name }}</label>
                        <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
                        <div class="society__location">
                            <i
                                :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '', establishment.category == 'Other' ? 'uil-home' : '']"></i>
                            <span v-if="!dataLoading" class="society__location">{{ establishment.category }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                        <div class="society__location">
                            <i class="uil uil-location-point"></i>
                            <span v-if="!dataLoading" class="society__location">{{
                                establishment.city }}</span>
                            <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
                        </div>
                    </div>
                    <div class="date__filter">
                        <div class="text-sm title">Filter by category</div>
                        <el-select v-model="categoryFilters" multiple collapse-tags collapse-tags-tooltip filterable
                            :max-collapse-tags="3" placeholder="select categories" size="large">
                            <el-option :label="'All'" :value="'all'" @click="handleCategoryDropdown('all')"
                                :disabled="categoryFilters.length > 1 && !categoryFilters.includes('all')" />
                            <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                                :value="item.category" @click="handleCategoryDropdown('other')" />
                        </el-select>
                    </div>

                    <div class="date__filter">
                        <div class="text-sm title">Select a date range</div>
                        <el-date-picker v-model="start_date" placeholder="Start date" :size="'large'" />
                        <el-date-picker class="mt-2" v-model="end_date" placeholder="End date" :size="'large'" />
                    </div>
                </div>

                <el-tooltip ref="tooltipRef" :visible="desc.visible" :virtual-ref="buttonRef" virtual-triggering
                    popper-class="singleton-tooltip" placement="top">
                    <template #content>
                        <span> {{ desc.text }} </span>
                    </template>
                </el-tooltip>
            </div>
            <div class="left__side">
                <div id="ttv__container">
                    <div class="demo-tabs">
                        <div class="reviews__content">
                            <div class="reviews__pagination">
                                <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                    loadReviews(companyTag, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                                }" @prev="(option) => {
                                    loadReviews(companyTag, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                                }" />
                            </div>
                            <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="true"
                                @reloadData="(review) => reloadData(review)" :categories="categories"
                                @update-feeling="updateFeeling" />
                            <div v-else role="status"
                                class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
                                v-for="index in 5" :key="index">
                                <div>
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5">
                                            </div>
                                            <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                            <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                        </div>
                                        <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                                    </div>
                                    <div>
                                        <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                        <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                                        <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                                    </div>
                                </div>
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="no-comment" v-if="visibleData.length == 0">
                                No reviews meet to the current filters
                            </div>
                            <div class="reviews__pagination">
                                <PaginationComponent :options="optionsReview" v-if="visibleData.length > 0" @next="(option) => {
                                    loadReviews(companyTag, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                                }" @prev="(option) => {
                                    loadReviews(companyTag, option.page, option.limit, option.current, start_date, end_date, selectedWebsites, selectedStars, categoryFilters, language)
                                }" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import { ref, watch, onBeforeMount, inject, computed, provide } from 'vue';
import { ElDatePicker, ElOption, ElSelect, ElTooltip } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';


const companiesStore = useCompanyStore();
const appStore = useAppStore();

appStore.setIsExist(true)
const customerTag = inject('tag')
const companyTag = customerTag.value;
const route = useRoute();

const companyId = route.params.id;
const dataLoading = ref(false)
const isLoading = ref(false)
let establishment = ref({});
const categories = ref([])
provide('categories', categories)

let reviewFeedbackData = ref({
    width: 0,
    red: 0,
    green: 0,
    feeling: 0
});


const updateFeeling = (newFeedbackData) => {
    reviewFeedbackData.value = newFeedbackData;
}

provide('reviewFeedbackData', reviewFeedbackData);


//Fin
const _categories = computed(() => {
    let data = []
    categories.value.forEach(category => {
        data.push(category.category)
    })
    return data.join(',')
})
provide('_categories', _categories)
const categoryFilters = ref(['all'])
provide('categoryFilters', categoryFilters)

const desc = ref({
    text: '',
    visible: false
})
const buttonRef = ref()

const all_items = ref([
    { title: "Rating", value: 0, icon: "uil-star" },
    { title: "Reviews", value: 0, icon: "uil-comment" },
    { title: "Competitors", value: 0, icon: "uil-building" },
]);


const start_date = inject('start_date');
const end_date = inject('end_date');


const optionsReview = ref({
    rowLimit: 20,
    max: 100,
    current: 1,
    page: 1,
})


const handleCategoryDropdown = (type) => {
    const filters = type == 'other' ? categoryFilters.value.filter(category => category != 'all') : ['all']
    categoryFilters.value = categoryFilters.value.length > 0 ? filters : ['all']
}



const handleLabelChange = (selectedLabel) => {
    categoryFilters.value = [selectedLabel];
    // onChange()
}

const loadCategories = async (tag) => {
    const api = `establishment/${tag}/categories`
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        if (response.data && response.data.data) {
            categories.value = response.data.data
        }
    }
}

const IsValueOkay = (value) => (value == '' || value == null || value == undefined || value == []) ? false : true;


let _reviews = ref([]);
let dataReviews = ref([]);
let reviews_loader = ref(true);
let visibleData = ref([])
let paginationConfig = ref({
    current: 0,
    size: 20,
    data: [],
    _data: []
});

const language = inject('language')
let selectedWebsites = ref('Global');
let updatePage = function (pageNumber) {
    paginationConfig.value.current = pageNumber;
    updateVisibleData(_reviews.value);
}

let updateVisibleData = function (_data, isStarFilter = false) {
    let data = paginationConfig.value;
    _reviews.value = _data
    if (isStarFilter == false) dataReviews.value = _reviews.value;

    paginationConfig.value.data = _data.slice(data.current * data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage(paginationConfig.value.current - 1);
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = false;
}
let selectedStars = ref('0');
const starFilter = (star) => {
    selectedStars.value = star;
};


watch([start_date, end_date, selectedWebsites, categoryFilters], () => {
    categoryFilters.value = categoryFilters.value.length > 0 ? categoryFilters.value : ['all']
    loadReviews(companyTag, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value);
})

watch(() => route.query.category, (newCategoryFilter) => {
    if (newCategoryFilter) {
        categoryFilters.value = newCategoryFilter.split(',');
    } else {
        categoryFilters.value = ['all'];
    }
}, { immediate: true });

const loadReviews = async (tag, page, limit, current, dateStart, dateEnd, source, stars, category, language) => {
    optionsReview.value.current = current;
    optionsReview.value.page = page;
    reviews_loader.value = true;

    let apiBase = '/review/categorizations/all';
    let apiParams = `tag=${tag}&page=${page}&limit=${limit}&platform=${'all'}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }


    if (category != 'all') {
        apiParams += `&category=${category.join(',')}`
    }

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        reviews_loader.value = false;
        optionsReview.value.max = response.data['count'];
        visibleData.value = response.data['data'];
    }
}

const reloadData = (reviewUpdated) => {
    visibleData.value.forEach((review, index) => {
        if (review.id == reviewUpdated.id) {
            visibleData.value[index].feeling = reviewUpdated.feeling;
        }
    })
}


onBeforeMount(async () => {
    appStore.isLoading = true;
    isLoading.value = true
    companiesStore.getEstablishment(customerTag.value, companyId).then((data) => {

        if (data == false) {
            appStore.setIsExist(false);
            appStore.isLoading = false;
        }
        else {
            establishment.value = data;
            appStore.setCurrentPage({
                title1: "",
                title2: "Categorization",
                icon: "uil-analytics"
            });

            appStore.setBreadcrumbs([
                {
                    title: establishment.value.name,
                    path: `/customer/${route.params.tag}/establishment/`,
                    isCurrent: false,
                },
                {
                    title: "Categorization",
                    path: `${route.path}`,
                    isCurrent: true
                }
            ])

            all_items.value[0].value = establishment.value.rating;
            all_items.value[1].value = establishment.value.totalReviews;
            appStore.isLoading = false;
        }
    })
    
    await loadCategories(companyId)
    await loadReviews(companyTag, 1, optionsReview.value['rowLimit'], 1, start_date.value, end_date.value, selectedWebsites.value, selectedStars.value, categoryFilters.value, language.value)
    appStore.isLoading = false;


});

/**
 * obtenir width image from url
 */
const getMeta = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};

/** Fonction widthimage pour savoir le width 
 * @param event 
*/
const widthimage = (event) => {
    // Loadging establishment__img
    if (event != undefined) {
        var imgmobile = document.getElementById("logoimagemobile");
        if (imgmobile !== null) {
            imgmobile.classList.add("fade-in");
        }
        document.getElementsByClassName("establishment__img").innerText = "Loading image...";
        return getMeta(event, (err, img) => {
            //if(img!=null){
            const heightresize = 160; //hauteur div pour l'image
            var aspectRatio = img.naturalWidth / img.naturalHeight;
            var newWidth = 0;
            if (aspectRatio == 1) {
                // ici carre
                newWidth = heightresize;
            } else {
                newWidth = heightresize * aspectRatio;
            }
            // let classy = (newWidth > 200) ? "largeClass" : "smallClass";
            let classy;
            if (newWidth > 300) {
                classy = "largeClass"; // largeClass pour les images plus larges
            } else if (newWidth > 220 && newWidth <= 300) {
                classy = "mediumClass"; // Nouvelle classe pour les images entre 240 et 300 pixels
            } else {
                classy = "smallClass"; // smallClass pour les images plus petites
            }
            // pour le desktop
            var elem = document.getElementById("logoimage");
            elem.classList.add("fade-in");
            setTimeout(() => {
                elem.classList.add('show');
                elem.style.display = "block";
            }, 10);
            elem.classList.add(classy);
            elem.src = event;
            //new Promise(resolve=>{elem.onload = resolve})

            //pour le mobile
            var elemmob = document.getElementById("logoimagemobile");
            if (elemmob !== null) {
                elemmob.classList.add(classy);

                elemmob.src = event;

                setTimeout(() => {

                    elemmob.classList.add('show');
                    elemmob.style.display = "block";
                }, 10);
            }

            return "OK";
        });
    }
}
</script>
<style scoped>
.breadcrumb {
    margin-left: 10%;
    margin-top: 12rem;
}

.container__categorization {
    display: flex;
    gap: 1rem;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.containerBody,
.containerBody2 {
    min-width: 100% !important;
}

@media screen and (min-width: 540px) and (max-width: 975px) {

    .establishment__info_tablet {
        margin-top: 60px ! important;
    }

    .smallClass {
        width: auto !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 70px;
        margin-top: 0px;
        border-radius: 10px;
    }

    .mediumClass {
        margin-top: 10px ! important;
        margin-bottom: 10px;
    }

    .largeClass {
        margin-top: 10px ! important;
        margin-bottom: 10px;
    }
}

@media screen and (max-width: 520px) {

    .establishment__info_tablet {
        margin-top: 60px ! important;
    }

    .smallClass {
        width: auto !important;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 70px;
        margin-top: 0px;
        border-radius: 10px;
    }

    .mediumClass {
        margin-top: 0px ! important;
        margin-bottom: 10px;
    }

    .largeClass {
        margin-top: 60px ! important;
        margin-bottom: 10px;
    }
}

#rating .y-axis {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 2;
}

.loaded {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0.9;
    z-index: 1;
    position: relative;
    flex-direction: column;
}

.legend {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: auto;
    padding: 15px;
    margin: 15px auto;
    margin-top: 15px !important;
}

.legend,
p {
    color: black;
    font-weight: 500;
    margin-top: 2rem;
    font-size: 14px;
}

.loading {
    display: none;
}

.loader {
    position: absolute;
}


.analysis-date {
    color: black;
    font-weight: 700;
    font-size: 14px;
}

.analysis-value {
    color: black;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 6px;
    background-color: color-mix(in srgb, var(--color-warning) 30%, #FFF);
    border-radius: 4px;
}

.analysis-sales li {
    margin: 12px 0;
}

.analysis-sales li::before {
    content: "\1F449"
}

.sales-event-list li {
    margin: 6px 0;
}

.sales-event-list li::before {
    content: "\268A"
}

.analysis-sales-title {
    border-bottom: 1px solid color-mix(in srgb, var(--color-warning) 50%, #FFF);
    width: 100%;
    margin-bottom: .5rem;
    font-size: 1rem;
}

.smallClass {
    width: auto !important;
    height: 120% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
    border-radius: 10px;
}

.largeClass {
    width: 100% !important;
    height: auto !important;
    margin-top: 50px;
    border-radius: 10px;
}

.mediumClass {
    border-radius: 10px;
}

.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in;
}

.fade-in.show {
    opacity: 1;
}

.content_legend {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: auto;
    padding: 15px;
    margin: 15px auto;
    margin-top: 15px !important;
}

.container_legend {
    gap: 3px;
    align-items: center;
    display: flex;
}

.container_legend:hover {
    cursor: pointer;
}

.card_legend {
    width: 16px;
    height: 12px;
}

.right__side {
    margin-top: -23px !important;
}

.right__side .establishment .establishment__img {
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right__side .establishment__img img {
    width: 100%;
    height: auto !important;
}

@media screen and (min-width: 1439px) and (max-width: 2559px) {
    .left__side {
        width: 73.5%;
        padding: 0 !important;
    }
}

@media screen and (max-width:1440px) {
    .left__side {
        width: 70%;
        padding: 0 !important;
    }

    .right__side {
        width: 325px;
    }
}

@media screen and (max-width:1024px) {
    .right__side {
        width: 275px;
    }
}

@media screen and (max-width: 975px) {
    .container__categorization {
        display: inline-block;
        width: 95%;
    }

    .left__side {
        margin-left: 5%;
        width: inherit !important;
    }

    .right__side {
        display: none !important;
    }

    .tablet_mobile__head {
        margin-left: 5% !important;
        width: 95%;
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

    .tablet_mobile__head label {
        font-size: 17px !important;
    }

    .tablet_mobile__head span {
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter {
        margin-left: 5%;
        margin-top: 1rem;
        display: flex;
        width: inherit;
        align-items: center;
        gap: 1rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter * {
        flex-basis: 200px;
    }

    .photo {
        flex-basis: 250px;
    }

    .photo div {
        height: 100%;
    }

    .photo img {
        height: 75px;
        width: 100%;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head {
        font-size: 13px !important;
        margin-left: 5%;
    }

    .tablet_mobile__head label {
        font-size: 15px !important;
    }

    .tablet_mobile__filter {
        gap: 0.25rem;
    }

    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
        margin-left: 5%;
    }

    .tablet {
        display: none !important;
    }

    .mobile__filter__btn {
        display: flex !important;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 10px;
    }

    .photo {
        flex-basis: 210px !important;
    }

    .tablet_mobile__head label {
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter {
        flex-direction: column;
        padding: 5px 0px !important;
    }

    .tablet_mobile__filter * {
        flex-basis: inherit !important;
        width: inherit !important;
        justify-content: center !important;
    }

    .date__picker {
        margin: 5px 0 10px !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head {
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo {
        flex-basis: 150px !important;
        height: 100px !important;
    }
}

@media screen and (max-width:475px) {
    .app__container {
        overflow-x: hidden;
    }
}
</style>