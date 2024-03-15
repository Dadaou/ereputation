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
                        </div>
                        <ul class="space-y-1 text-gray-500 dark:text-gray-400">
                            <li v-if="review.date_review != null" class="flex items-center"><i
                                    class="uil uil-calender"></i><span>
                                    {{ moment(review.date_review).format('D MMMM YYYY') }}
                                </span></li>
                            <li v-else class="flex items-center"><i class="uil uil-calender"></i><span>
                                    {{ moment(review.created_at).format('D MMMM YYYY') }}
                                </span></li>
                            <li class="flex items-center"><i class="uil uil-map-pin-alt"></i><span>
                                    {{ review.source }}
                                </span></li>
                        </ul>
                    </div>
                </div>
                <div class="review__right mt-2">
                    <div style="height: 20px;">
                        <div v-if="review.category" class="review__category-container" @click="handleModal('Edit review category', 'edit', 'uil-edit', 'category', review)">
                            <span v-for="item in review.category.split(';')" :key="item" class="review__category">{{ item
                            }}</span>
                        </div>
                        <div class="review__category-container" v-else>
                            <i class="uil uil-question-circle"
                                  style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                                  @mouseover="(e) => {
                                  buttonRef = e.currentTarget
                                  visible = true
                                  }"
                                  @mouseleave="()=>visible = false"
                                  @click="handleModal('Add review feeling', 'add', 'uil-add', 'category', review)"
                            >
                            </i>
                             <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
                                popper-class="singleton-tooltip" placement="top">
                                <template #content>
                                    <span>Click to add category</span>
                                </template>
                            </el-tooltip>
                        </div>
                    </div>
                    <div>
                        <span class="emoji mx-1" v-if="showEmoji" @click="handleModal('Edit review feeling', 'edit', 'uil-edit', 'feeling', review)">
                            <span v-if="review.feeling == 'positive'">😀</span>
                            <span v-if="review.feeling == 'neutre' || review.feeling == 'neutral'">😐</span>
                            <span v-if="review.feeling == 'negative'">😕</span>
                        </span>
                        <p
                            class="bg-yellow-100 text-yellow-800 font-semibold text-sm inline-flex items-center px-3 py-1 rounded dark:bg-yellow-200 dark:text-yellow-800">
                            {{ review.star | review.rating }}</p>
                    </div>
                </div>
            </div>
            <div class="col-span-2">
                <p class="mb-2 text-gray-500 text-sm dark:text-gray-400 comment">{{ review.comment }}</p>
            </div>
        </article>
        <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
            <template #content>
                <div class="modal__header">
                    <div class="modal__title">
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                            <i class="uil uil-edit"></i> {{modal.text}}
                        </h3>
                    </div>
                    <div class="modal__close">
                        <i class="uil uil-times-circle" @click="showModal = false"></i>
                    </div>
                </div>
                <div class="mb-6 feedback__rating">
                    <FeelingFeedbackComponent v-if="modal.type == 'feeling'" @updateValue="(feeling) => {
                        feel = feeling
                    }" />

                    <el-select v-else
                    v-model="category" 
                    filterable
                    placeholder="select categories" 
                    size="large">
                        <el-option v-for="(item, index) in categories" :key="index" :label="item.category"
                            :value="item.category"/>
                    </el-select>

                </div>
                <div class="mt-5 download__qr_btn">
                    <button class="btn__light_secondary" @click="updateReview">
                        <i class="uil uil-save"></i> {{modal.action=="edit"?'Save':'Add'}}
                    </button>
                </div>
            </template>
        </ModalComponent>
    </div>
</template>
<script setup>
import { ref, provide, computed } from 'vue';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import ModalComponent from '@Components/utils/ModalComponent.vue';
import FeelingFeedbackComponent from '@Components/utils/FeelingFeedbackComponent.vue';
import { useFeedbackStore } from '@Stores/feedback.js';
import { useCompanyStore } from "@Stores/company.js";
import { useWindowSize } from '@vueuse/core';
import { ElDatePicker, ElOption, ElSelect, ElTooltip } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

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
    categories: {
        type: Array,
        default: []
    }
});

const emits = defineEmits(['reloadData']);

const { width, height } = useWindowSize();
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const companiesStore = useCompanyStore();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 35;
})
const buttonRef = ref()
const tooltipRef = ref()
const visible = ref(false)
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
})
const feel = ref('okay');
const id = ref('');
const selectedReview = ref(null);
provide('feeling', feel);
const category = ref('')

const editReview = (review) => {
    feel.value = review.feeling;
    review.feeling = feel.value;
    id.value = review.id;
    selectedReview.value = review;

    if (feel.value == 'neutre') feel.value = 'neutral';
    showModal.value = true;
}

const reloadData = (reviewUpdated, feeling) => {
    emits('reloadData', reviewUpdated);
}

const updateReview = async () => {

    let updatedValue = {
        feeling: feel.value,
        confidence: 1,
        categoryCheck: category.value
    }
    selectedReview.value.feeling = feel.value;
    selectedReview.value.category = category.value

    try {
        // reloadData(selectedReview.value, feel.value)
        showModal.value = false;
        await feedbackStore.updateReview(id.value, updatedValue, response => {
            console.log(response);
            if (response.status == 200) {
                //
            }
        })
    } catch (error) {
        console.log(error);
    }
};

const handleModal = (text, action, icon, type, review)=>{
    showModal.value = true
    modal.value = {
        text: text,
        action: action,
        icon: icon,
        type: type
    }

    editReview(review)

};

</script>
<style scoped>
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