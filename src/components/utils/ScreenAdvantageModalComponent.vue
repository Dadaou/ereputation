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
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Advantages
            <span>*</span></label>
          <el-select v-model="advantage" placeholder="Choose establishment" size="large" filterable>
            <el-option v-for="item in props.advantages" :key="item.id" :label="item.name"
              :value="`/api/advantages/${item.id}`" />
          </el-select>
        </div>

        <div>
          <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
            <span>*</span></label>
          <input type="text" id="first_name" v-model="category"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
        </div>


      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2">

          <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date from
                    <!-- <span>*</span> -->
                    <!-- <Tooltip text="To use before the [date]" /> -->
                </label>
                <el-date-picker v-model="date_from" :size="'large'" />
          </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date To
                    <!-- <span>*</span> -->
                    <!-- <Tooltip text="To use before the [date]" /> -->
                </label>
                <el-date-picker v-model="date_to" :size="'large'" />
            </div>

 
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-3">

            <div>
              <label for="hour_from"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                  <span></span></label>
              <input type="number" id="hour_from" v-model="hour_from"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
            </div>

            <div>
                  <label for="minute_from"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                      <span></span></label>
                  <input type="number" id="minute_from" v-model="minute_from"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
            </div>

          <div>
                  <label for="seconde_from"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                      <span></span></label>
                  <input type="number" id="seconde_from" v-model="seconde_from"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
          </div>


 
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-3">

              <div>
                  <label for="hour_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                      <span></span></label>
                  <input type="number" id="hour_to" v-model="hour_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>

              <div>
                  <label for="minute_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                      <span></span></label>
                  <input type="number" id="minute_to" v-model="minute_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>

              <div>
                  <label for="seconde_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                      <span></span></label>
                  <input type="number" id="seconde_to" v-model="seconde_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>
 
      </div>

          <div class="grid gap-6 mb-6 md:grid-cols-7 justify-center">

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d0}" 
                  size="small" 
                  @click="advantage_screen.d0 ? handleDisable('d0', advantage_screen) : handleEnable('d0', advantage_screen)">
                   <i 
                    :class="advantage_screen.d0 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d0
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d1}" 
                  size="small" 
                  @click="advantage_screen.d1 ? handleDisable('d1', advantage_screen) : handleEnable('d1', advantage_screen)">
                   <i 
                    :class="advantage_screen.d1 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d1
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d2}" 
                  size="small" 
                  @click="advantage_screen.d2 ? handleDisable('d2', advantage_screen) : handleEnable('d2', advantage_screen)">
                   <i 
                    :class="advantage_screen.d2 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d2
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d3}" 
                  size="small" 
                  @click="advantage_screen.d3 ? handleDisable('d3', advantage_screen) : handleEnable('d3', advantage_screen)">
                   <i 
                    :class="advantage_screen.d3 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d3
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d4}" 
                  size="small" 
                  @click="advantage_screen.d4 ? handleDisable('d4', advantage_screen) : handleEnable('d4', advantage_screen)">
                   <i 
                    :class="advantage_screen.d4 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d4
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d5}" 
                  size="small" 
                  @click="advantage_screen.d5 ? handleDisable('d5', advantage_screen) : handleEnable('d5', advantage_screen)">
                   <i 
                    :class="advantage_screen.d5 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d5
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d6}" 
                  size="small" 
                  @click="advantage_screen.d6 ? handleDisable('d6', advantage_screen) : handleEnable('d6', advantage_screen)">
                   <i 
                    :class="advantage_screen.d6 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> d6
                </el-button>
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
import { computed, ref, inject,defineAsyncComponent } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElOption, ElSelect,ElDatePicker, ElTooltip,ElButton } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

// const Tooltip = defineAsyncComponent(() =>
//     import('@Components/utils/QuestionMarkTooltipComponent.vue')
// )


const date_from = ref('');
const date_to = ref('');
const category = ref('');
const enable = ref(false);
const advantage_screen = ref({
  d0:false,
  d1:false,
  d2:false,
  d3:false,
  d4:false,
  d5:false
});
// const d1 = ref(false);
// const d2 = ref(false);
// const d3 = ref(false);
// const d4 = ref(false);
// const d5 = ref(false);
// const d6 = ref(false);
const hour_from = ref();
const minute_from = ref();
const seconde_from = ref();
const hour_to = ref();
const minute_to = ref();
const seconde_to = ref();
const advantage = ref(null);


const props = defineProps({
  screen: {
    type: String,
    default: null
  },
  advantages: {
    default: []
  },
  showModal: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['close'])
const router = useRouter();

const route = useRoute();
const close = () => {
  emits('close')
}

const handleEnable = (days,adv_screen)=>{
 
  adv_screen[days]=true;
   console.log(adv_screen)
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
input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}
 .enabled-button {
    color: #74d474;
  
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

</style>
