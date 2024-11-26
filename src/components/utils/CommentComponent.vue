<template>
    <div class="reviews__content" v-if="reviews.length > 0">
        <article v-for="review in reviews" :class="[review.source == 'App (Private)' ? 'intern__comment' : '']">
            <div class="flex items-start review__item">
                <div class="flex items-center mb-1 space-x-4">
                    <div class="review__info space-y-1 dark:text-white info__reviews">
                        <div class="flex items-center mb-2 space-x-4">
                            <img v-if="review.profile_photo != null" class="w-10 h-10 rounded-full"
                                :src="review.profile_photo" alt="">
                            <div v-else
                                class="relative inline-flex items-center justify-center w-8 h-8 p-1 rounded author__initial">
                                <span class="font-medium dark:text-white">{{ userStore.getInitialsV2(review.author) }}
                                </span>
                            </div>
                            <div class="font-medium dark:text-white">
                                <p id="author__name">{{ review.author }}</p>
                            </div>
                            <el-tooltip placement="top" v-if="review.review_url">
                                <template #content> Reply </template>
                                <a :href="review.review_url ? review.review_url : '#'" target="_blank">
                                    <Icon icon="basil:reply-outline" width="24px"
                                        :style="{ 'color': 'var(--color-danger)' }">
                                    </Icon>
                                </a>
                            </el-tooltip>

                        </div>
                        <ul class="space-y-1 text-gray-500 dark:text-gray-400">
                            <li v-if="review.date_review != null" class="flex items-center"><i
                                    class="uil uil-calender"></i><span>
                                    {{ moment(review.date_review).format('D MMMM YYYY') }}
                                </span></li>
                            <li v-else class="flex items-center"><i class="uil uil-calender"></i><span>
                                    {{ moment(review.created_at).format('D MMMM YYYY') }}
                                </span></li>
                            <li class="flex items-center">
                                <i class="uil uil-map-pin-alt"></i>
                                <span>{{ review.source }}</span>
                                <span v-if="review.source === 'App (Private)'">
                                    
                                    <span v-if="review.review_establishment_name" style="display: flex;justify-content: space-between;align-items: center;">

                                        &nbsp;&nbsp;<em v-if="review.unit_name">{{ review.unit_name }}</em>
                                        <em v-else>{{ review.staff_firstname }} {{ review.staff_lastname }}</em>

                                        <a class="establishment__link" @click="goToCompany(review.review_establishment_tag)">
                                                <label style="cursor: pointer;margin-left: 8px;font-size: 14px !important" class="society__name">{{ review.review_establishment_name }}</label>
                                        </a>
                                    </span>
                                    <em v-else>
                                        &nbsp;&nbsp;<em v-if="review.unit_name">{{ review.unit_name }}</em>
                                        <em v-else>{{ review.staff_firstname }} {{ review.staff_lastname }}</em>
                                    </em>
                                </span>
                                <span v-else>
                                  
                                    <a v-if="review.review_establishment_name" class="establishment__link" @click="goToCompany(review.review_establishment_tag)">
                                                <label style="cursor: pointer;margin-left: 8px;font-size: 14px !important" class="society__name">{{ review.review_establishment_name }}</label>
                                    </a>
                                    <!-- <em v-if="review.review_establishment_name" style="cursor: pointer;" @click="goToCompany(review.review_establishment_tag)">{{ review.review_establishment_name }}</em> -->
                                    
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="review__right mt-2">
                    <div style="height: 20px;" v-if="showCategory" class="category_desktop">
                        <div v-if="review.category && review.category.split(';').length > 0" class="inline-flex" style="max-width: 500px; white-space: nowrap; overflow-x: auto;">


                            <!-- category -->
                            <div v-for="(categ, index) in review.category.split(';')" :key="categ" class="inline-flex">

                                <div v-if="categ != ' ' " class="review__category-container ml-1"> 

                                    <span @click.stop="handleModal('Edit review category', 'edit', 'uil-edit', 'category', review,categ),category=categ,old_item_category=categ, addExisteCategorie = null" class="review__category">{{
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

                                    <span v-else class="emoji ">

                                        <i class="uil uil-plus-circle"
                                            style="color: var(--color-warning); cursor: pointer" @mouseover="(e) => {
                                                buttonRefCateg = e.currentTarget
                                                visibleCateg = true
                                            }" @mouseleave="() => visibleCateg = false"
                                            @click.stop="handleModal('Category feeling', 'add', 'uil-add', 'feeling', review, categ, review?.classification_section?.[categ]), feeling_new_category = 'yes', feel = review.classification_feeling[categ], old_item_category = categ, feeling_categorization = 'yes'">
                                        </i>
                                        <el-tooltip ref="tooltipRefCateg" :visible="visibleCateg"
                                            :virtual-ref="buttonRefCateg" virtual-triggering
                                            popper-class="singleton-tooltip" placement="top">
                                            <template #content>
                                                <span>Click to add category feeling</span>
                                            </template>
                                        </el-tooltip>

                                    </span>


                                </span>

                                </div>
                            </div>

                            <i class="uil uil-plus-circle"
                                style="color: var(--color-warning); font-size: 18px; cursor: pointer;margin: 1px;"
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
                            <i class="uil uil-plus-circle"
                                style="color: var(--color-warning); font-size: 18px; cursor: pointer" @mouseover="(e) => {
                                    buttonRef = e.currentTarget
                                    visible = true
                                }" @mouseleave="() => visible = false"
                                @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null)">
                            </i>
                            <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
                                popper-class="singleton-tooltip" placement="top">
                                <template #content>
                                    <span>Click to add category</span>
                                </template>
                            </el-tooltip>
                        </div>
                    </div>
                    <div v-if="showEmoji">
                        <span v-if="review.feeling" class="emoji mx-1"
                            @click="handleModal('Review feeling', 'edit', 'uil-edit', 'feeling_review', review, null), feel_review = review.feeling, feeling_categorization = null">
                            <!-- have classification -->
                            <!--    <span v-if="review.category && review.category.split(';').length > 0" class="emoji mx-1">
                                    <span v-if="getFeeling(review.category.split(';'),review.classification_feeling) == 'positive'">😀</span>
                                    <span v-if="getFeeling(review.category.split(';'),review.classification_feeling) == 'neutre'">😐</span>
                                    <span v-if="getFeeling(review.category.split(';'),review.classification_feeling) == 'negative'">😕</span>
                                </span> -->
                            <!-- not have classification -->
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
            </div>
            <!-- <button v-if="review.summary && review.summary.length > 0" class="btn__light_secondary"
                @click="showSummary()">
                <span>AI Summarize <i class="uil uil-angle-double-down"></i></span>
            </button> -->
            <ExpansionPanel v-if="review.summary && review.summary.length > 0" title="AI Summarize">
                {{ review.summary[0].overview }}
            </ExpansionPanel>
            <div class="col-span-2">
                 <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment" 
                    v-html="highlightWord(review.comment, terms)">
                        
                 </p>
             <!--    <p >
                  
                {{ review.comment }}
                </p> -->
            </div>





            <!-- category on small screen -->

            <div class="review__right_mobile mt-2">
                <div v-if="showCategory" class="category_container_mobile">
                    <div v-if="review.category && review.category.split(';').length > 0"
                        class="inline-flex category_mobile">


                        <!-- category -->
                        <div v-for="(categ, index)  in review.category.split(';')" :key="categ">

                            <div v-if="categ != ''" class="review__category-container ml-1">

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

                                    <span v-else class="emoji ">

                                        <i class="uil uil-plus-circle"
                                            style="color: var(--color-warning); cursor: pointer" @mouseover="(e) => {
                                                buttonRefCateg = e.currentTarget
                                                visibleCateg = true
                                            }" @mouseleave="() => visibleCateg = false"
                                            @click.stop="handleModal('Category feeling', 'add', 'uil-add', 'feeling', review, categ, review?.classification_section?.[categ]), feeling_new_category = 'yes', feel = review.classification_feeling[categ], old_item_category = categ, feeling_categorization = 'yes'">
                                        </i>
                                        <el-tooltip ref="tooltipRefCateg" :visible="visibleCateg"
                                            :virtual-ref="buttonRefCateg" virtual-triggering
                                            popper-class="singleton-tooltip" placement="top">
                                            <template #content>
                                                <span>Click to add review feeling</span>
                                            </template>
                                        </el-tooltip>

                                    </span>

                                </span>

                            </div>
                        </div>

                        <i class="uil uil-plus-circle"
                            style="color: var(--color-warning); font-size: 18px; cursor: pointer;margin: 1px;"
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

                    <!-- new category -->

                    <div class="review__category-container" v-else>
                        <i class="uil uil-plus-circle"
                            style="color: var(--color-warning); font-size: 18px; cursor: pointer" @mouseover="(e) => {
                                buttonRef = e.currentTarget
                                visible = true
                            }" @mouseleave="() => visible = false"
                            @click="handleModal('Add review category', 'add', 'uil-add', 'category', review, null)">
                        </i>
                        <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
                            popper-class="singleton-tooltip" placement="top">
                            <template #content>
                                <span>Click to add category</span>
                            </template>
                        </el-tooltip>
                    </div>

                    <!-- end new category -->


                </div>
            </div>
            <!-- Fin category on small screen -->



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

                    <el-select v-if="modal.type == 'category' || modal.type == 'delete'" v-model="category" filterable
                        placeholder="select categories" size="large">
                        <el-option key="0" label="" value="" />
                        <el-option v-for="(item, index) in categories" :key="index + 1" :label="item.category"
                            :value="item.category" />
                    </el-select>
                    <!-- <div v-else style="color: orangered;">Delete this category ?</div> -->


                </div>
                <div class="mt-5 download__qr_btn ">

                    <!--  <el-popconfirm v-if="(modal.type == 'category' || modal.type == 'delete') && (modal.action != 'add')" title="Are you sure to delete this?" @confirm="updateReview" placement="top">
                        <template #reference> -->
                    <button v-if="(modal.type == 'category' || modal.type == 'delete') && (modal.action != 'add')"
                        style="background-color: indianred !important;color: white;margin-inline: 5px;"
                        class="btn__light_secondary" @click="modal.type = 'delete', updateReview()">
                        <span><i class="uil uil-trash"></i> Delete</span>

                    </button>
                    <!--   </template>
    </el-popconfirm> -->

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
import { useRoute,useRouter } from "vue-router";


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
    categories: {
        type: Array,
        default: []
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
const visible = ref(false)
const visibleCateg = ref(false)
const visible2 = ref(false);
const feeling_new_category = ref(null);
const baseURL = ref(import.meta.env.VITE_APP_API_URL);

const highlightWord=(_text, _word)=>{
     
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
                tag: userStore.customer.tag
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
const calculSentimentAnalysis = inject('calculSentimentAnalysis');

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
                                    if(categoryArray.includes(category.value)) return

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

const handleModal = (text, action, icon, type, review, category = '', section = null) => {

    console.log("katal", category)
            showModal.value = true
            modal.value = {
                text: text,
                action: action,
                icon: icon,
                type: type,
                section: section
            }


            console.log("review", review)
            console.log("cat", review)


            editReview(review, category)

};

const checkIfCategoryAlreadyExist = (categories, categoryToCheck) => {
    const categoryArray = categories.split(';')
    return categoryArray.includes(categoryToCheck)
}

onMounted(() => {
    console.log("********", props.categories)
})

</script>
<style scoped>
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

.review__info {
    font-weight: 600;
}

#author__name {
    font-size: 16px;
    color: var(--color-primary);
}

.review__info ul {
    font-size: 13px !important;
    color: var(--color-bg1);
}

.review__item {
    justify-content: space-between !important;
}

.reviews__content article {
    margin: 10px auto;
    border-radius: 10px;
    padding: 20px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.info__reviews i {
    margin-right: 5px;
    color: var(--color-danger);
}

.review__category-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    gap: 2px;
    cursor: pointer;
}

.review__category {
    background: var(--color-danger);
    color: white;
    font-size: 13px;
    border-radius: 8px;
    padding: 0 8px;
    font-weight: 400;
}

.review__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    gap: 16px;
    height: 100%;
}
</style>