<template>
  <ModalComponent :showModal="showModal" @close="close" :width="modalWidth">
    <template #content>
      <div class="modal__header">
        <div class="modal__title">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            <i class="uil uil-qrcode-scan"></i> Advantage Screen
          </h3>
        </div>
        <div class="modal__close">
          <i class="uil uil-times-circle" @click="close"></i>
        </div>
      </div>

    
    <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">

      <div class="grid gap-6 mb-6 md:grid-cols-2">

        <div>
          <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Screen name
            <span>*</span></label>
          <input type="text" id="first_name"             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
        </div>

        <div>
            <label for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Screen Template
                <span>*</span></label>
            <el-select  placeholder="Choose screen template" size="large" filterable>
                <el-option v-for="item in screenTemplates" :key="item.id"
                    :label="item.name" :value="`/api/screentemplates/${item.id}`" />
            </el-select>
        </div>

      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2">

        <div>
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
            <span>*</span></label>
          <el-select  placeholder="Choose establishment" size="large" filterable>
            <el-option v-for="item in establishments" :key="item.id" :label="item.name"
              :value="`/api/establishments/${item.id}`" />
          </el-select>
        </div>
 
      </div>

      <div class="flex items-center justify-between py-2 border-t border-b dark:border-gray-600">
        <button type="submit"
          class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading ...</span>
          <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} screen</span>
        </button>
      </div>
    </form>

    </template>
  </ModalComponent>
</template>
<script setup>
import { computed, ref, inject } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElOption, ElSelect } from 'element-plus';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const props = defineProps({
  screen: {
    type: String,
    default: null
  },
  advantages: {
    default: []
  },
  screenName:{
    type: String,
    default: ''
  },
  showModal: {
    type: Boolean,
    default: false
  },
    screenTemplate:{
    type: String,
    default: ''
  },
    screenTemplates:{
    type: Array,
    default: []
  },
    establishment:{
    type: String,
    default: ''
  },
    establishments:{
    type: Array,
    default: []
  },
});

const emits = defineEmits(['close'])
const router = useRouter();

const route = useRoute();
const close = () => {
  emits('close')
}

const { width } = useWindowSize()
const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 19;
  return gap + 45;
});

const show = computed(() => props.showModal)


</script>
<style scoped>
#qrcode {
  margin: auto;
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

.download__qr_btn {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.download__qr_btn button {
  flex-basis: 50%;
}

.modal__close i:hover {
  transform: rotate(360deg);
}

.establishment__review__qrcode p {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-bg2);
}
</style>
