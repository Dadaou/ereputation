<template>
<div class="scroll-wrapper">
  <ul class="discount-list">
    <li
      v-for="(discount, index) in discounts"
      :key="index"
      :style="{ backgroundColor: discountColors[index], color: '#fff' }"
      @click="selectDiscount(index, discount)"
      :class="[isSelected(index)?'selected':'', 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative']"
    >
      <label>{{ discount.name }}</label>
      <span :class="['icon', isSelected(index)?'icon-selected':'']">
        {{ isSelected(index)?'✔':discount.icon }}
      </span>
      <div class="w-4 h-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-3"></div>
      <div class="w-4 h-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-3"></div>
    </li>
  </ul>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chroma from 'chroma-js';
import { useAdvantageStore } from '@Stores/advantage.js';

const selectedDiscount = ref(null);
const discountColors = ref([]);
const advantageStore = useAdvantageStore();
const discounts = ref([])

const props = defineProps({
  customer:{
  	type: String,
  	required: true
  },
  establishment:{
  	type: String,
  	required: true
  }
});

const emits = defineEmits(['select'])

onMounted(async() => {
  let data = await advantageStore.getAdvantageAvailable(props.customer, props.establishment)
  discounts.value = data.map((discount, index) => {
    let icon = '';
    if (index % 2 === 0) {
      icon = "🎁"; 
    } else {
      icon = "🎉"; 
    }
    return { ...discount, icon };
  });
  generateColors();
  if(discounts.value.length>0){
  	selectDiscount(0, discounts.value[0]);
  	isSelected(0)
  }
});

const generateColors = () => {
  discountColors.value = discounts.value.map(generateColor);
};

const generateColor = () => {
  let color = chroma.random();
  const contrastThreshold = 4.5; 

  while (chroma.contrast(color, 'white') < contrastThreshold) {
    color = chroma.random();
  }

  return color.hex();
};



const selectDiscount = (index, discount) => {
  selectedDiscount.value = index;
  emits('select', discount);
};

const isSelected = (index) => {
  return selectedDiscount.value === index;
};
</script>

<style scoped>
.scroll-wrapper {
 width: 100%;
 max-width: 1000px; /* Example maximum width */
 overflow-x: hidden;
}

ul {
  margin: 10px 0px;
  overflow: hidden;
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
  overflow-x: scroll; 
  white-space: nowrap; 
  /*list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-x: scroll; 
  white-space: nowrap; */
}

label {
  font-weight: 600;
  font-size: 13px;
}

.discount-list li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  height: 5rem;
  width: 200px;
  /*display: inline-block; 
  padding: 10px;
  border: 1px solid #ddd; 
  margin-right: 5px; */
}

.discount-list .icon {
  margin-left: auto;
  font-size: 1em;
}

/* Style for the selected discount */
.discount-list li.selected {
  font-weight: bold;
  color: #fff;
  background-color: #007bff; /* Example color */
}

/* Style for the selected discount icon */
.discount-list .icon-selected {
  display: none;
  font-size: 1em;
  margin-right: 5px;
}

.discount-list li.selected .icon-selected {
  display: inline-block;
}

/*.bg-gradient-to-br {
  background: linear-gradient(45deg, #f75842, #f96a57); 
}*/

/* Style the scrollbar track */
ul::-webkit-scrollbar-track {
  background-color: transparent; /* Make scrollbar track transparent */
}

/* Style the scrollbar thumb */
ul::-webkit-scrollbar-thumb {
  background-color: white; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Rounded corners for the scrollbar thumb */
}

/* Show the scrollbar thumb on hover */
ul:hover::-webkit-scrollbar-thumb {
  background-color: white; /* Change thumb color on hover */
}
</style>
