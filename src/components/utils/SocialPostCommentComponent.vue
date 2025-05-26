<template>
  <div :key="index" class="comment">
    <el-progress v-if="comment.confidence" :percentage="percentage(comment.confidence)" :color="customColorMethod" />
    <span class="comment-date post-date">{{ moment(comment.published_at).format("DD MMM, YYYY") }}</span>
    <div class="comment-text">
      <p>{{ comment.comment }}</p>
      <div>
        <span class="emoji mx-1" v-if="comment.feeling" 
        @click="handleModal('Edit comment feeling', 'edit', 'uil-edit', 'feeling', comment)">
          <span v-if="comment.feeling == 'positive'">😀</span>
          <span v-if="comment.feeling == 'neutre' || comment.feeling == 'neutral'">😐</span>
          <span v-if="comment.feeling == 'negative'">😕</span>
        </span>
        <p class="bg-yellow-100 text-yellow-800 font-semibold text-sm inline-flex items-center px-3 py-1 rounded dark:bg-yellow-200 dark:text-yellow-800"
          v-if="comment.score">{{ comment.score }}</p>
        <div v-if="comment.category && comment.category.split(';').length > 0">
          <div v-for="categ in comment.category.split(';')" :key="categ" class="inline-flex">
            <div v-if="categ != ''" class="review__category-container ml-1"
              @click="handleModal('Edit review category', 'edit', 'uil-edit', 'category', comment)">
              <span class="review__category">{{
                categ }}</span>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-meta">
      <span class="comment-likes"><i class="uil uil-thumbs-up"></i> {{ comment.likes }}</span>
      <el-tooltip placement="top" v-if="comment.url">
        <template #content> Reply </template>
        <a :href="comment.url ? comment.url : '#'" target="_blank">
          <Icon icon="basil:reply-outline" width="20px" :style="{ 'color': '#111' }">
          </Icon>
        </a>
      </el-tooltip>
    </div>



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
          <FeelingFeedbackComponent v-if="modal.type == 'feeling'" @updateValue="(feeling) => {
            feel = feeling
          }" />

          <el-select v-else v-model="category" placeholder="select categories" size="large">
            <el-option key="0" label="" value="" />
            <el-option v-for="(item, index) in categories" :key="index + 1" :label="item.category"
              :value="item.category" />
          </el-select>

        </div>
        <div class="mt-5 download__qr_btn">
          <button class="btn__light_secondary" @click="updateReview">
            <i class="uil uil-save"></i> {{ modal.action == "modify" ? 'Save' : 'Add' }}
          </button>
        </div>
      </template>
    </ModalComponent>



  </div>
</template>
<script setup>
import { Minus, Plus } from '@element-plus/icons-vue';
import { ElProgress, ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';
import 'element-plus/es/components/progress/style/css'
import moment from 'moment';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import { provide,computed,ref } from 'vue';
import services from '@Services/services.js'
import { useWindowSize } from '@vueuse/core';
import FeelingFeedbackComponent from '@Components/utils/FeelingFeedbackComponent.vue';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})
const percentage = (confidence) => {
  const n = confidence > 0 ? 2 : 1;
  confidence = Math.abs(confidence) * 50 * n
  return Math.floor(confidence);
}
const { width, height } = useWindowSize();
const showModal = ref(false);
const feelingCustomer = ref(null);
provide('feelingCustomer', feelingCustomer);

const modal = ref({
  text: '',
  action: '',
  icon: '',
  type: ''
})

const feel = ref('neutral');
const id = ref('');
const selectedReview = ref(null);

const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 19;
  return gap + 35;
})

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
};

const editComment = (_comment) => {
  feel.value = _comment.feeling;
  id.value = _comment.id;
  selectedReview.value = _comment;
  feelingCustomer.value = feel.value;
  if (feel.value == 'neutre') feel.value = 'neutral';
  showModal.value = true;
}



const updateReview = async () => {

  let updatedValue = {
    feeling: feel.value,
    confidence: 1,
  }
  selectedReview.value.feeling = feel.value;

  try {
    showModal.value = false;
    if (modal.value.type == 'feeling') {
      
       await services.patchRecord('social_comments', id.value, updatedValue, (response) => {
        console.log(response)
        // next(response)
      })
    } else {
      // await feedbackStore.updateReviewCategory(id.value, modal.value.action, selectedReview.value.category, category.value, true, response => {
      //   // Do nothing
      // })
      // selectedReview.value.category = category.value
    }
  } catch (error) {
    console.log(error);
  }
};



const handleModal = (text, action, icon, type, _commentaire) => {
  showModal.value = true
  modal.value = {
    text: text,
    action: action,
    icon: icon,
    type: type
  }
  editComment(_commentaire)
};

</script>
<style scoped>
.post-date {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary)
}

.comment {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid #ccc;
}

.comment-text {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  text-align: justify;
  text-justify: inter-word;
}

.comment-meta {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 0.8rem;
  margin-top: 5px;
}

.reviews__content a {
  text-decoration: none;
  border-bottom: none;
  margin-bottom: 4px;
}

.reviews__content a:hover {
  color: var(--color-primary);
  background-color: transparent;
}

.comment-meta>span {
  margin-right: 10px;
  margin-bottom: 5px;
}

.comment-likes {
  display: flex;
  align-items: center;
}

.comment-likes i {
  margin-right: 5px;
}
.emoji {
  cursor: pointer;
}
</style>