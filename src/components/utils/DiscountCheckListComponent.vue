<template>
  <div class="scroll-wrapper">
    <ul class="discount-list">
      <li v-for="(discount, index) in discounts" :key="index" @click="selectDiscount(index, discount)"
        :class="[isSelected(index) ? 'selected gradient-green' : 'gradient-violet', 'text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative']">
        <div>
          <div id="discount_name" class="truncate-content">
            <span :class="['icon', isSelected(index) ? 'icon-selected' : '']">
              {{ isSelected(index) ? '✔' : discount.icon }}
            </span>
            <span class="truncate-content">
              {{ discount.name }}
            </span>
            <span :class="['icon', isSelected(index) ? 'icon-selected' : '']">
              {{ isSelected(index) ? '✔' : discount.icon }}
            </span>
          </div>
          <div id="discount_establishment">{{ discount.establishment_name }}</div>
          <div id="discount_category" v-if="discount.validity">{{ discount.category }} advantage to be used within
            {{ discount.validity }} {{ discount.validity > 1 ? 'days' : 'day' }} </div>
        </div>
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
  customer: {
    type: String,
    required: true
  },
  establishment: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['select'])

onMounted(async () => {
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
  if (discounts.value.length) {
    selectDiscount(0, discounts.value[0]);
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
  if (isSelected(index)) {
    selectedDiscount.value = null
    emits('select', null);
  } else {
    selectedDiscount.value = index;
    emits('select', discount);
  }
};

const isSelected = (index) => {
  return selectedDiscount.value === index;
};
</script>

<style scoped>
.truncate-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gradient-green {
  background: linear-gradient(to right, #48bb78 0%, #009688 100%);
}

.gradient-violet {
  background: linear-gradient(to right, #6b46c1, #5a67d8);
}

.scroll-wrapper {
  width: 100%;
  max-width: 1000px;
  /* Example maximum width */
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

#discount_name {
  font-weight: 600;
  font-size: 13px;
  text-align: left;
}

#discount_category,
#discount_establishment {
  text-align: left;
  font-size: 9px;
  font-weight: 500;
}

.discount-list li {
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  height: 4rem;
 /* width: 250px;*/
}

.discount-list .icon {
  margin-left: auto;
  font-size: 1em;
}

/* Style for the selected discount */
.discount-list li.selected {
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  /* Example color */
}

/* Style for the selected discount icon */
.discount-list .icon-selected {
  display: none;
  font-size: 1em;
  /* margin-right: 5px;*/
}

.discount-list li.selected .icon-selected {
  display: inline-block;
}

ul::-webkit-scrollbar {
  display: none;
}
</style>
