<template>
    <div class="reviews__content" v-if="reviews.length > 0">

        <article v-for="review in reviews" class="review-card">
            <!-- Section gauche: Image + Infos établissement -->
            <div class="establishment-section" @click.stop="goToCompany(review.establishment.competitor_tag)">
                <img :src="review.establishment.url_source" alt="" style="width: 100%; height: 80px;"
                    class="hotel-image">

                <div class="hotel-info">
                    <div class="hotel-name-container">
                        <i
                            :class="['uil', review.establishment.category == 'Restaurant' ? 'uil-restaurant' : '', review.establishment.category == 'Hotel' ? 'uil-bed-double' : '', review.establishment.category == 'Residence' ? 'uil-home' : '', review.establishment.category == 'Other' ? 'uil-home ' : '', review.establishment.category == 'Event' ? 'uil-schedule' : '']">
                        </i>
                        <span class="hotel-name">{{ review.establishment.name }}</span>
                        <span class="hotel-type">{{ review.establishment.category }}</span>
                    </div>

                    <div class="location-info">
                        <i class="fas fa-map-marker-alt location-icon"></i>
                        <span>{{ review.source }}</span>
                        <span v-if="review.source === 'App (Private)'">
                            <span v-if="review.review_establishment_name"
                                style="display: flex;justify-content: space-between;align-items: center;">
                                &nbsp;&nbsp;<em v-if="review.unit_name">{{ review.unit_name }}</em>
                                <em v-else>{{ review.staff_firstname }} {{ review.staff_lastname }}</em>
                                <a class="establishment__link" @click="goToCompany(review.review_establishment_tag)">
                                    <label style="cursor: pointer;margin-left: 8px;font-size: 14px !important"
                                        class="society__name">{{ review.review_establishment_name }}</label>
                                </a>
                            </span>
                            <em v-else>
                                &nbsp;&nbsp;<em v-if="review.unit_name">{{ review.unit_name }}</em>
                                <em v-else>{{ review.staff_firstname }} {{ review.staff_lastname }}</em>
                            </em>
                        </span>
                        <span v-else>
                            <a v-if="review.review_establishment_name" class="establishment__link"
                                @click="goToCompany(review.review_establishment_tag)">
                                <label style="cursor: pointer;margin-left: 8px;font-size: 14px !important"
                                    class="society__name">{{ review.review_establishment_name }}</label>
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Section droite: Auteur + Contenu -->
            <div class="content-section">
                <!-- Auteur, date et rating -->
                <div class="author-section">
                    <img v-if="review.profile_photo != null" class="w-10 h-10 rounded-full" :src="review.profile_photo"
                        alt="">
                    <div v-else class="user-avatar">{{ userStore.getInitialsV2(review.author) }}</div>
                    <div class="user-info">
                        <div class="inline-flex gap-2 items-center">
                        <h3 class="!mb-0">
                            {{ review.author }} 
                        </h3>
                        <el-tooltip v-if="review_url" placement="top">
                                    <template #content> Reply </template>
                                    <a :href="review.review_url ? review.review_url : '#'" target="_blank">
                                        <Icon icon="basil:reply-outline" width="24px"
                                            :style="{ 'color': 'var(--color-danger)' }">
                                        </Icon>
                                    </a>
                                </el-tooltip>
                        </div>
                        <div v-if="review.date_review != null" class="review-date flex items-center"><i
                                class="uil uil-calender"></i><span>
                                {{ moment(review.date_review).format('D MMMM YYYY') }}
                            </span></div>
                        <div v-else class="review-date flex items-center"><i class="uil uil-calender"></i><span>
                                {{ moment(review.created_at).format('D MMMM YYYY') }}
                            </span></div>
                    </div>
                    <div class="rating-badge" v-if="showEmoji">
                        <span v-if="review.feeling" class="emoji mx-1"
                            @click="handleModal('Review feeling', 'edit', 'uil-edit', 'feeling_review', review, null), feel_review = review.feeling, feeling_categorization = null">

                            <span class="emoji mx-1">
                                <span v-if="review.feeling == 'positive'">😀</span>
                                <span v-if="review.feeling == 'neutre' || review.feeling == 'neutral'">😐</span>
                                <span v-if="review.feeling == 'negative'">😕</span>
                            </span>

                        </span>
                        <span class="emoji mx-1" v-else>
                            <i class="uil-question-circle"
                                style="color: var(--color-warning); font-size: 18px; cursor: pointer" @mouseover="(e) => {
                                    buttonRef2 = e.currentTarget
                                    visible2 = true
                                }" @mouseleave="() => visible2 = false"
                                @click="handleModal('Review feeling', 'add', 'uil-add', 'feeling_review', review, null), feeling_categorization = null">
                            </i>
                            <el-tooltip ref="tooltipRef2" :visible="visible2" :virtual-ref="buttonRef2"
                                virtual-triggering popper-class="singleton-tooltip" placement="top">
                                <template #content>
                                    <span>Click to add feeling</span>
                                </template>
                            </el-tooltip>
                        </span>

                        <p
                            class="bg-yellow-100 text-yellow-800 font-semibold text-sm inline-flex items-center px-3 py-1 rounded dark:bg-yellow-200 dark:text-yellow-800">
                            {{ review.star || review.rating }}</p>
                    </div>
                </div>

                <p v-html="highlightWord(review.comment, terms)" class="review-text"></p>

                <ExpansionPanel v-if="review.summary && review.summary.length > 0" title="AI Summarize">
                    {{ review.summary[0].overview }}
                </ExpansionPanel>


                <div v-if="showCategory">
                    <div v-if="review.category && review.category.split(';').length > 0" class="flex flex-row flex-wrap">
                        <!-- category -->
                        <div v-for="(categ, index) in review.category.split(';')" :key="categ" class="inline-flex">
                            <div v-if="categ != ' '" class="review__category-container ml-1">
                                <span
                                    @click.stop="handleModal('Edit review category', 'edit', 'uil-edit', 'category', review, categ), category = categ, old_item_category = categ, addExisteCategorie = null"
                                    class="review__category">{{
                                        categ }}
                                    <span
                                        v-if="review.classification_feeling[categ] && (review.classification_feeling[categ] == 'positive' || review.classification_feeling[categ] == 'negative' || review.classification_feeling[categ] == 'neutral' || review.classification_feeling[categ] == 'neutre')"
                                        class="emoji "
                                        @click.stop="handleModal('Category feeling', 'edit', 'uil-edit', 'feeling', review, categ, review?.classification_section?.[categ]), feel = review.classification_feeling[categ], old_item_category = categ, feeling_categorization = 'yes'">
                                        <span v-if="review.classification_feeling[categ] == 'positive'">😀</span>
                                        <span
                                            v-if="review.classification_feeling[categ] == 'neutre' || review.classification_feeling[categ] == 'neutral'">😐</span>
                                        <span v-if="review.classification_feeling[categ] == 'negative'">😕</span>
                                    </span>

                                    <span v-else class="emoji">
                                        <i class="uil uil-plus-circle tooltip"
                                            data-tooltip="Click to add category feeling"
                                            style="color: var(--color-warning); cursor: pointer"
                                            @click.stop="handleModal('Category feeling', 'add', 'uil-add', 'feeling', review, categ, review?.classification_section?.[categ]), feeling_new_category = 'yes', feel = review.classification_feeling[categ], old_item_category = categ, feeling_categorization = 'yes'">
                                        </i>
                                    </span>

                                </span>
                            </div>
                        </div>

                        <!-- <i class="uil uil-plus-circle"
                            style="color: var(--color-warning); font-size: 18px; cursor: pointer; margin: 1px;"
                            @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null), feeling_new_category = null, addExisteCategorie = 'yes'">
                        </i> -->
                        <!-- <button type="button" 
                                class="btn-add-category"
                                @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null), feeling_new_category = null, addExisteCategorie = 'yes'">
                            <i class="uil uil-plus-circle"></i> Add a category
                        </button> -->
                        <i class="uil uil-plus-circle" style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                            @mouseover="(e) => {
                                buttonRef = e.currentTarget
                                visible = true
                            }" @mouseleave="() => visible = false"
                            @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null), feeling_new_category = null, addExisteCategorie = 'yes'">
                            </i>
                        <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
                            popper-class="singleton-tooltip" placement="top">
                            <template #content>
                                <span>Click to add category</span>
                            </template>
                        </el-tooltip>
                    </div>

                    <div class="review__category-container" v-else>
                        <!-- <i class="uil uil-plus-circle tooltip" data-tooltip="Click to add category"
                            style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                            @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null)">
                        </i> -->
                        <!-- <button type="button" 
                                class="btn-add-category"
                                @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null)">
                            <i class="uil uil-plus-circle"></i> Add an category
                        </button> -->
                        <i class="uil uil-plus-circle" style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                            @mouseover="(e) => {
                                buttonRef3 = e.currentTarget
                                visible3 = true
                            }" @mouseleave="() => visible3 = false"
                            @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null)">
                            </i>
                        <el-tooltip ref="tooltipRef3" :visible="visible3" :virtual-ref="buttonRef3" virtual-triggering
                            popper-class="singleton-tooltip" placement="top">
                            <template #content>
                                <span>Click to add category</span>
                            </template>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </article>

        <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
            <template #content>
                <div class="modal__header">
                    <div class="modal__title">
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                            <i class="uil uil-edit"></i> {{ modal.text }}
                        </h3>
                    </div>
                    <div class="modal__close">
                        <i class="uil uil-times-circle" @click="showModal = false"></i>
                    </div>
                </div>
                <div class="mb-6 feedback__rating">
                    <FeelingFeedbackComponent v-if="modal.type == 'feeling'"
                        @updateValue="(feeling) => { updateFeelingFeedback(feeling, 'feeling') }" />

                    <FeelingFeedbackComponent v-if="modal.type == 'feeling_review'"
                        @updateValue="(feeling) => { updateFeelingFeedback(feeling, 'feeling_review') }" />

                    <h5 v-if="modal.section !== null">
                        <p>{{ modal.section }}</p>
                    </h5>

                    <el-select v-if="modal.type == 'category' || modal.type == 'delete'" v-model="category"
                        placeholder="select categories" size="large">
                        <el-option key="0" label="" value="" />
                        <el-option v-for="(item, index) in categories" :key="index + 1" :label="item.category"
                            :value="item.category" />
                    </el-select>

                </div>
                <div class="mt-5 download__qr_btn ">

                    <button v-if="(modal.type == 'category' || modal.type == 'delete') && (modal.action != 'add')"
                        style="background-color: indianred !important;color: white;margin-inline: 5px;"
                        class="btn__light_secondary" @click="modal.type = 'delete', updateReview()">
                        <span><i class="uil uil-trash"></i> Delete</span>

                    </button>

                    <button v-if="modal.type == 'category'" class="btn__light_secondary" @click="updateReview">
                        <span><i class="uil uil-save"></i> {{ modal.action == "edit" ? 'Save' : 'Add' }}</span>
                    </button>


                </div>
            </template>
        </ModalComponent>
    </div>

</template>
<script setup>
import { ref, provide, computed, inject, onMounted } from 'vue';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import ModalComponent from '@Components/utils/ModalComponent.vue';
import FeelingFeedbackComponent from '@Components/utils/FeelingFeedbackComponent.vue';
import ExpansionPanel from '@Components/utils/ExpansionPanel.vue'
import { useFeedbackStore } from '@Stores/feedback.js';
import { useCompanyStore } from "@Stores/company.js";
import { useWindowSize } from '@vueuse/core';
import { ElDatePicker, ElOption, ElSelect, ElTooltip, ElPopconfirm } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import { Icon } from '@iconify/vue';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useRoute, useRouter } from "vue-router";
import { pays } from '@Services/countries.js';
import { watch } from 'vue';


const props = defineProps({
    reviews: {
        type: Array,
        required: true,
        default: []
    },
    allReviews: {
        type: Array,
        required: false
    },
    showEmoji: {
        type: Boolean,
        default: false
    },
    showCategory: {
        type: Boolean,
        default: true
    },
    via: {
        type: String,
        default: "review"
    },
    terms: {
        type: String,
        default: ""
    }
});

const emits = defineEmits(['reloadData', 'update-feeling']);

const { width, height } = useWindowSize();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const feedbackStore = useFeedbackStore();
const companiesStore = useCompanyStore();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 35;
})
const buttonRef = ref()
const buttonRefCateg = ref()
const tooltipRef = ref()
const tooltipRefCateg = ref()
const buttonRef2 = ref()
const tooltipRef2 = ref()
const buttonRef3 = ref()
const tooltipRef3 = ref()
const visible = ref(false)
const visibleCateg = ref(false)
const visible2 = ref(false);
const visible3 = ref(false);
const feeling_new_category = ref(null);
const baseURL = ref(import.meta.env.VITE_APP_API_URL);

const showCountry = ref(false);
const showCountryId = ref(null);
const isMobile = ref(false);

const categories = ref([]);

const isLastReviewsVue = computed(() => {
    return route.name === 'LastReviews'
})


onMounted(() => {
    if (window.innerWidth <= 975) {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
})

window.addEventListener("resize", () => {

    if (window.innerWidth <= 975) {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
});

const toggleCountry = (_id) => {
    showCountry.value = !showCountry.value;
    showCountryId.value = _id;
    setTimeout(() => {
        showCountry.value = false;
    }, 2000);
};

const highlightWord = (_text, _word) => {

    if (!_word) return _text;

    const regex = new RegExp(`\\b${_word}\\b`, 'gi');

    return _text.replace(regex, `<span style="color : white;background:var(--color-danger)">${_word}</span>`);
}

const goToCompany = (establishment_tag) => {

    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Establishment',
            params: {
                id: establishment_tag,
                tag: userStore.user?.customer?.tag
            },

        });
    }, 100);
};


const getFeeling = (categ, feel) => {

    var result = [];

    result['negative'] = 0;
    result['neutre'] = 0;
    result['positive'] = 0;
    var maxKey = '';
    for (var i = 0; i < categ.length; i++) {

        if (feel[categ[i]] == "negative") {
            result['negative']++;

        } else if (feel[categ[i]] == "neutre" || feel[categ[i]] == "neutral") {
            result['neutre']++;
        } else {
            result['positive']++;
        }

    }


    const feels = [result['negative'], result['neutre'], result['positive']];
    const maxValue = Math.max(...feels);

    if (result['positive'] == maxValue) {

        maxKey = 'positive';

    } else {
        if (result['neutre'] == maxValue && result['negative'] == result['neutre']) {
            maxKey = 'neutre';
        } else {

            if (result['neutre'] == maxValue) {
                maxKey = 'neutre';
            } else {
                maxKey = 'negative';
            }

        }
    }


    return maxKey;
}
const formatRating = (rating, source) => {
    if (source == 'tripadvisor' && rating * 5 <= 5) {
        rating = rating * 5
    }
    rating = parseFloat(rating);
    if (rating > 5) {
        rating = rating / 2;
    }
    return rating.toFixed(0);
}

const showModal = ref(false);
const modal = ref({
    text: '',
    action: '',
    icon: '',
    type: ''
});
provide('modal', modal);
const feel = ref(null);
const feel_review = ref(null);
const id = ref('');
const old_item_category = ref('');
const old_item_feeling = ref(null);
const selectedReview = ref(null);
const feeling_categorization = ref(null);
const feelingCustomer = ref(null);
const addExisteCategorie = ref(null);
provide('feeling', feel);
provide('feeling_review', feel_review);
provide('feelingCustomer', feelingCustomer);
const category = ref('');
const reviewFeedbackData = inject('reviewFeedbackData');

const getCountry = (_country) => {
    const country_name = pays.find(_pays => _pays.nom.toLowerCase() === _country.toLowerCase())

    if (country_name) {
        return country_name.drapeau;
    } else {
        return '';
    }
}

const editReview = (review, _category = '') => {

    if (_category != '' && _category != 'null' && _category != null) {

        old_item_feeling.value = review.classification_feeling[_category];
        feel.value = review.classification_feeling[_category];
        feelingCustomer.value = feel.value;
        id.value = review.id;
        if (feel.value == 'neutre') feel.value = 'neutral';
        review.classification_feeling[_category] = feel.value;
        selectedReview.value = review;
        category.value = review.category
        console.log(selectedReview)
        console.log(feel.value)

        showModal.value = true;

    } else {

        feel_review.value = review.feeling;

        feelingCustomer.value = feel_review.value;
        id.value = review.id;
        selectedReview.value = review;
        showModal.value = true;

    }

}

const reloadData = (reviewUpdated, feeling) => {
    emits('reloadData', reviewUpdated);
}

const calculSentimentAnalysis = (_score) => {
    let rawWidth = _score * 100 / 2
    let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
    let feeling = rawWidth > 0 ? 1 : -1
    let red = 255
    let green = 255
    if (feeling == -1) {
        red = 255
        green = 255 - ((_score * 100 * 255) / 100)
    } else {
        green = 255
        red = 255 - ((_score * 100 * 255) / 100)
    }

    let _reviewFeedbackData = {
        width: width,
        red: red,
        green: green,
        feeling: feeling,
        score: _score
    }
    return _reviewFeedbackData;
}

// calcul score de feeling
const calculFeelingScore = (_reviews, _selectedReview, _feeling, type) => {

    let sommeFeeling = 0;
    let kFeeling = 0;



    _reviews.forEach(_review => {

        _review.classifications.forEach(_classification => {

            if (_classification.feeling != '' && _classification.feeling != null &&
                _classification.feeling != 'null' && _classification.classification_confidence_feeling) {

                if (_classification.id == _selectedReview.id && type == 'category' && old_item_category.value == _classification.category) {
                    _classification.feeling = _feeling;
                    _classification.classification_confidence_feeling = 1;
                    console.log(_classification)
                    console.log(_review.classification_feeling)


                }

                if (_classification.feeling == 'positive') {
                    sommeFeeling = sommeFeeling + (_classification.classification_confidence_feeling * 1);
                    kFeeling++;

                } else {

                    if (_classification.feeling == 'negative') {

                        sommeFeeling = sommeFeeling + (_classification.classification_confidence_feeling * -1);
                        kFeeling++;

                    } else {
                        sommeFeeling = sommeFeeling + (_classification.classification_confidence_feeling * 0);
                        kFeeling++;
                    }

                }
            }
        })
    });

    if (props.via != 'analysis') {
        console.log('compte review', props.via)
        _reviews.forEach(_review => {

            if (_review.feeling != '' && _review.feeling != null &&
                _review.feeling != 'null' && _review.confidence) {

                if (_review.id == _selectedReview.id && type == 'review') {
                    _review.feeling = _feeling;
                    _review.confidence = 1;
                }

                if (_review.feeling == 'positive') {
                    sommeFeeling = sommeFeeling + (_review.confidence * 1);
                    kFeeling++;

                } else {

                    if (_review.feeling == 'negative') {

                        sommeFeeling = sommeFeeling + (_review.confidence * -1);
                        kFeeling++;

                    } else {
                        sommeFeeling = sommeFeeling + (_review.confidence * 0);
                        kFeeling++;
                    }

                }
            }

        });
    }

    if (kFeeling > 0) {
        console.log(sommeFeeling / kFeeling);
        return sommeFeeling / kFeeling;
    } else {
        console.log("zero ", 0);
        return 0;
    }

}

const updateReview = async () => {

    let updatedValue = {
        feeling: modal.value.type == 'feeling' ? feel.value : feel_review.value,
        confidence: 1,
        review: id.value,
        feeling_categorization: feeling_categorization.value ? 'yes' : null,
        category: old_item_category.value
    }


    try {
        showModal.value = false;
        if (modal.value.type == 'feeling' || modal.value.type == 'feeling_review') {

            await services.post_Record(
                "/review/feeling/update",
                updatedValue,
                (response) => {
                    //
                });



            let feelingScore = 0;
            if (modal.value.type == 'feeling') {
                feelingScore = calculFeelingScore(props.reviews, selectedReview.value, feel.value, 'category');
            } else {
                feelingScore = calculFeelingScore(props.reviews, selectedReview.value, feel_review.value, 'review');
            }
            let newFeedbackData = calculSentimentAnalysis(feelingScore);
            emits('update-feeling', newFeedbackData);


            if (feeling_categorization.value) {
                selectedReview.value.classification_feeling[old_item_category.value] = feel.value;
            } else {
                selectedReview.value.feeling = feel_review.value;
            }



        } else {

            //console.log("1")
            var cur_cat = modal.value.type == 'delete' ? null : category.value;
            var old_cat = modal.value.type == 'delete' ? category.value : old_item_category.value;


            await feedbackStore.updateReviewCategory(id.value, modal.value.action, old_cat, cur_cat, false, response => {
                // Do nothing
            })


            if (modal.value.action == 'add' && !selectedReview.value.category) {
                //console.log("2")
                selectedReview.value.category = cur_cat;
                selectedReview.value.classification_feeling = [];
                selectedReview.value.classification_feeling[old_item_category.value] = null;
            }

            if (selectedReview.value.category.split(';').length > 0) {
                //console.log("3")   
                var new_cat = '';
                for (var i = 0; i < selectedReview.value.category.split(';').length; i++) {

                    if (modal.value.type == 'delete') {

                        if (selectedReview.value.category.split(';')[i] != category.value) {
                            if (new_cat != '') {

                                new_cat = new_cat + ';' + selectedReview.value.category.split(';')[i];

                            } else {
                                new_cat = selectedReview.value.category.split(';')[i];

                            }

                        }

                    } else {

                        //console.log("4")

                        if (addExisteCategorie.value) {

                            if (checkIfCategoryAlreadyExist(selectedReview.value.category, category.value)) return

                            new_cat = selectedReview.value.category + ';' + category.value;

                        } else {

                            //console.log("6")

                            if (new_cat != '') {

                                //console.log("7")

                                if (selectedReview.value.category.split(';')[i] == old_item_category.value) {
                                    //console.log("8")
                                    new_cat = new_cat + ';' + category.value;
                                } else {
                                    //console.log("9")
                                    new_cat = new_cat + ';' + selectedReview.value.category.split(';')[i];
                                }

                            } else {
                                //console.log("10")

                                if (checkIfCategoryAlreadyExist(selectedReview.value.category, category.value)) return


                                if (selectedReview.value.category.split(';')[i] == old_item_category.value) {

                                    //console.log("11")
                                    new_cat = category.value

                                } else {
                                    //console.log("12")

                                    const categoryArray = selectedReview.value.category.split(';')
                                    if (categoryArray.includes(category.value)) return

                                    new_cat = selectedReview.value.category.split(';')[i]
                                }

                            }
                        }


                    }
                }

                if (feeling_new_category.value) {
                    //console.log("13")
                    selectedReview.value.classification_feeling[category.value] = selectedReview.value.classification_feeling[old_item_category.value]
                }

                selectedReview.value.category = new_cat;
            } else {
                //console.log("14")
                selectedReview.value.category = null;
            }


        }
    } catch (error) {
        console.log(error);
    }
};

const updateFeelingFeedback = ((_feeling, _type) => {
    if (_type == 'feeling_review') {
        feel_review.value = _feeling;
    } else {
        feel.value = _feeling;
    }
    console.log(_feeling)
    showModal.value = false
    setTimeout(() => {
        updateReview();
    });
})

const transformCategory = (categoryList) => {

    categories.value = []

    if (categoryList.length > 0) {

        for (let i = 0; i < categoryList.length; i++) {

            categories.value = [...categories.value, {
                id: i,
                category: categoryList[i],
            }]

        }
    }
}


const handleModal = (text, action, icon, type, review, category = '', section = null) => {

    showModal.value = true
    //console.log("********", review)
    transformCategory(review.establishment.categories.ucfirst)

    modal.value = {
        text: text,
        action: action,
        icon: icon,
        type: type,
        section: section
    }

    editReview(review, category)

};

const checkIfCategoryAlreadyExist = (categories, categoryToCheck) => {
    const categoryArray = categories.split(';')
    return categoryArray.includes(categoryToCheck)
}

/*onMounted(() => {
    console.log("********", isLastFiftyReviews.value)
})*/

</script>
<style scoped>
.establishment_info_contaier {
    display: flex;
    /*justify-content: center; */
    flex-direction: column;
    gap: 6px;
    width: 10%;
    min-width: 150px;
    margin-top: 5px;
    /*border: 1px solid brown;*/
}

.establishment_info_contaier:hover {
    cursor: pointer;
}

.review_right_mobile {
    width: 97%;
    overflow-x: scroll;
    white-space: nowrap;
    justify-content: right;
}

.category_container_mobile {
    width: 98%;
    overflow: auto;
    white-space: nowrap;
    overflow-wrap: scroll;
    word-wrap: scroll;
    display: none;
}

.category_mobile {
    width: 100%;
    align-items: center
}

h5 {
    padding: 20px 0 0 0;
}

h5 p {
    word-wrap: break-word;
    text-align: center;
}

@media screen and (max-width: 975px) {
    .category_container_mobile {

        display: block;

    }

    .category_desktop {
        display: none;
    }

    .category_mobile {
        /*        justify-content: right;*/
        margin-bottom: 10px;
    }

}

.reviews__content a {
    text-decoration: none;
    border-bottom: none;
}

.reviews__content a:hover {
    color: var(--color-primary);
    background-color: transparent;
}

.reviews__content a[disabled] {
    pointer-events: none;
}

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

.modal__close i:hover {
    transform: rotate(360deg);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.emoji {
    cursor: pointer;
}

.author__initial {
    border: 2px solid rgb(211, 211, 211);
}

.intern__comment {
    background-color: rgb(249, 244, 255);
    border: 1px solid var(--color-primary);
}

.review__info,
.review__item {
    font-weight: 600;
}

#author__name {
    font-size: 16px;
    color: var(--color-primary);
}

.category_container ul {
    font-size: 13px !important;
    color: var(--color-bg1);
}

.review__item {
    display: flex;
    gap: 20px;
    margin-top: 5px;
}

.review-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    gap: 16px;
}

.review__category {
    background: var(--color-danger);
    color: white;
    font-size: 13px;
    border-radius: 8px;
    padding: 2px 8px;
    font-weight: 400;
}

@media screen and (max-width: 725px) {
    .review-card {
        flex-direction: column;
    }

    .establishment-section {
        position: relative;
    }

    .hotel-info {
        position: absolute;
        bottom: 0;
        left: 0;
        color: white !important;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0, .25);
    }

    .hotel-info * {
        color: white !important;
    }
}

/* Section gauche: Image + Infos établissement */
.establishment-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 200px;
}

.hotel-image {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
}

.hotel-info {
    text-align: center;
}

.hotel-name-container {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
    margin-bottom: 4px;
}

.hotel-icon {
    color: #6b7280;
    font-size: 14px;
}

.hotel-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
}

.hotel-type {
    background: var(--color-danger);
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    margin-left: 4px;
}

.location-info {
    display: flex;
    align-items: center;
    color: #6b7280;
    font-size: 13px;
    justify-content: flex-start;
}

.location-icon {
    color: #6b7280;
    font-size: 12px;
}

/* Section droite: Auteur + Contenu */
.content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Auteur et date */
.author-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    flex-shrink: 0;
}

.user-info h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
}

.review-date {
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
}

.rating-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
}

/* Texte de l'avis */
.review-text {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 12px;
    font-size: 14px;
}

/* Bouton d'action */
.action-button {
    color: #3b82f6;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    margin-bottom: 12px;
    align-self: flex-start;
}

.action-button:hover {
    text-decoration: underline;
}

/* Section des boutons et emojis */
.actions-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.add-button {
    background: none;
    border: none;
    color: #f59e0b;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.add-button:hover {
    background-color: #fef3c7;
}

.emoji {
  cursor: pointer;
}

.btn-add-category {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 13px;
    cursor: pointer;
    margin: 0;
    padding: 4px 0;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.btn-add-category:hover {
    background-color: rgba(var(--color-primary), 0.1);
    transform: scale(1.05);
}

.btn-add-category:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.btn-add-category:active {
    transform: scale(0.95);
}

.btn-add-category i {
    pointer-events: none;
}
</style>