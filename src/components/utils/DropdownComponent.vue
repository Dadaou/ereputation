<template>
<div class="min-h-screen p-10 mt-2 mb-2" ref=target>
  <div class="max-w-md mx-auto">
    <label for="select" class="font-semibold block">{{ title }}</label>
    <div class="relative" v-if="isDataObject">
      <div class="h-10 bg-white flex border border-gray-200 rounded items-center">
        <input v-model="selectedValueObject.name" name="select" id="select" class="px-4 appearance-none outline-none text-gray-800 w-full text-sm" checked @keyup.enter="setShowData(true, selectedValue, $event)" @click="setShowData(true, selectedValueObject, $event)" :placeholder="placeholder"/>

        <button v-if="selectedValueObject && props.default == ''" class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"  @click="setShowData(true, props.default, $event)">
          <svg class="w-4 h-4 mx-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div :class="['list absolute rounded shadow bg-white overflow-hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200', showData == false?'hidden':'']">
        <div :class="['cursor-pointer group', index > 0?'border-t':'', selectedValueObject.name==item.name?'selected':'']" v-for="(item, index) in props.data" @click="setShowData(false, item, $event)">
          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm">{{ item.name }}</a>
        </div>
      </div>
    </div>
    <div class="relative" v-else>
      <div class="h-10 bg-white flex border border-gray-200 rounded items-center">
        <input v-model="selectedValue" name="select" id="select" class="px-4 appearance-none outline-none text-gray-800 w-full text-sm" checked @keyup.enter="setShowData(true, selectedValue, $event)" @click="setShowData(true, selectedValue, $event)" :placeholder="placeholder"/>

        <button v-if="selectedValue && props.default == ''" class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"  @click="setShowData(true, props.default, $event)">
          <svg class="w-4 h-4 mx-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div :class="['list absolute rounded shadow bg-white overflow-hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200', showData == false?'hidden':'']">
        <div :class="['cursor-pointer group', index > 0?'border-t':'', selectedValue==item?'selected':'']" v-for="(item, index) in props.data" @click="setShowData(false, item, $event)">
          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 text-sm">{{ item }}</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {ref, watch, onBeforeMount} from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
    data : {
        type: Array,
        default: ['Node', 'PHP', 'Javascript', 'Python'], 
    },
    title:{
        type: String,
        default: 'Custom dropdown'
    }, 
    placeholder: {
        type: String, 
        default: 'Select a value'
    },
    default:{
        type: String,
    },
    defaultObj:{
       type: Object
    },
    isDataObject:{
      type: Boolean,
      default: false,
    }
});
const emit = defineEmits(['submit']);

let selectedValue = ref('');
let selectedValueObject = ref({});
let showData = ref(false);
let target = ref(null);

// const setShowData = (value, selected_value, event) =>{
//     showData.value = value;
//     selectedValue.value = selected_value;
// }

const setShowData = (value, selected_value, event) =>{
    showData.value = value;
    if(props.isDataObject == true){
      selectedValue.value = selected_value.name;
      selectedValueObject.value = selected_value;
    }else{
      selectedValue.value = selected_value;
    } 
}

onClickOutside(target, (event) =>{
  if(props.isDataObject == true){
    setShowData(false, selectedValueObject.value, event)
    }else{
      setShowData(false, selectedValue.value, event)
  } 
  
});
watch(selectedValue, () => {
  if(props.isDataObject == true){
    emit('submit', selectedValueObject.value);
  }else{
      emit('submit', selectedValue.value);
  }
   
});

onBeforeMount(()=>{
    if(props.isDataObject == true){
      selectedValueObject.value = props.defaultObj;
      emit('submit', selectedValueObject.value);
    }else{
      selectedValue.value = props.default;
      emit('submit', selectedValue.value);
    }
});

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.selected{
    background-color: var(--color-danger);
    color: var(--color-white)
}

#select {
    font-weight: 500;
}

.list{
    z-index:3;
}
</style>