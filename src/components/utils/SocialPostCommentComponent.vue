<template>
  <div :key="index" class="comment">
    <el-progress v-if="comment.confidence" :percentage="percentage(comment.confidence)" :color="customColorMethod" />
    <span class="comment-date post-date">{{ moment(comment.published_at).format("DD MMM, YYYY") }}</span>
    <div class="comment-text">
      <p>{{ comment.comment }}</p>
      <div>
        <span class="emoji mx-1" v-if="comment.feeling">
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
      <el-tooltip placement="top">
        <template #content> Reply </template>
        <a :href="comment.url ? comment.url : '#'" target="_blank">
          <!-- <Icon icon="basil:reply-outline" width="24px"
                                        :style="{ 'color': comment.url ? 'var(--color-danger)' : 'lightgrey' }">
                                    </Icon> -->
          <Icon icon="basil:reply-outline" width="20px" :style="{ 'color': '#111' }">
          </Icon>
        </a>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup>
import { Minus, Plus } from '@element-plus/icons-vue';
import { ElProgress, ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';
import 'element-plus/es/components/progress/style/css'
import moment from 'moment';

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

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
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
</style>