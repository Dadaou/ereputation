<template>
  <ul class="discount-list">
    <li
      v-for="(discount, index) in discounts"
      :key="index"
      :style="{ backgroundColor: discountColors[index], color: '#fff' }"
      @click="selectDiscount(index, discount)"
      :class="{ 'selected': isSelected(index) }"
    >
      <label>{{ discount.name }}</label>
      <span :class="['icon', isSelected(index)?'icon-selected':'']">
      	{{ isSelected(index)?'✔':discount.icon }}
  	  </span>
    </li>
  </ul>
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
ul {
  margin: 10px 0px;
  max-height: 250px;
  overflow-y: scroll;
}

label {
  font-weight: 600;
  font-size: 13px;
}

.discount-list {
  list-style-type: none;
  padding: 0;
}

.discount-list li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
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
</style>
