<template>
  <div class="scroll-wrapper">
    <label for="email" v-if="discounts.length > 0"
      class="block mb-2 mt-6 text-sm font-medium text-gray-900 dark:text-white">
      {{ $t("feedback.choose_advantage") }}
    </label>
    <ul class="discount-list">
      <li v-for="(discount, index) in discounts" :key="index" @click="selectDiscount(index, discount)"
        :class="[isSelected(index) ? 'selected gradient-green' : 'gradient-violet', 'text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative discount-item']">
        <div class="w-full h-full flex flex-col items-center justify-start">
          <div class="w-full inline-flex items-start justify-center">
            <div class="discount-icon">
              <span :class="['icon', isSelected(index) ? 'icon-selected' : '',]">
                {{ isSelected(index) ? '✔' : '' }}
              </span>
            </div>
            <div id="discount_name">
              <span class="wrap-word">
                {{ discount.name }}
              </span>
            </div>

            <div class="discount-icon">
              <span :class="['icon', isSelected(index) ? 'icon-selected' : '']">
                {{ isSelected(index) ? '✔' : '' }}
              </span>
            </div>

          </div>
          <div id="discount_establishment">{{ discount.establishment_name }}</div>
          <div id="discount_category">{{ discount.category }} advantage <span v-if="discount.validity">to be used within
              {{ discount.validity }} {{ discount.validity > 1 ? 'days' : 'day' }}</span></div>
          <div class="w-full text-right read-more mt-auto" @click.stop="showMore(index)">
            {{ $t("feedback.read_more") }}
          </div>
        </div>
        <div class="w-4 h-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-3"></div>
        <div class="w-4 h-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-3"></div>
      </li>
    </ul>
  </div>
  <transition name="modal-flip">
    <div v-if="showModal" class="modal">
      <div class="modal-content" style="width: 350px; padding: 0;">
        <div class="modal-header">
          <div v-if="currentDiscount.logo" class="modal-header__img">
            <img :src="currentDiscount.logo">
          </div>
          <div class="modal__close">
            <i class="uil uil-times-circle mb-8" @click="showModal = false"></i>
          </div>
        </div>
        <div class="modal-body">
          <div class="inline-flex items-baseline gap-2" style="max-width: calc(100% - 20px)">
            <h4 class="modal-discount-name"><strong>{{ currentDiscount.name }}</strong></h4>
            <span class="modal-discount-category">{{ currentDiscount.category }}</span>
          </div>
          <h6 class="modal-discount-establishment">
            {{ currentDiscount.establishment_name }}
          </h6>
          <div class="inline-flex items-center gap-2 w-full mt-4">
            <div class="flex flex-col items-center w-full">
              <div v-if="info.value" class="modal-discount-offer">
                <div>{{ info.value }}<span style="font-size: 1.75rem">{{ info.metric }}</span></div>
              </div>
              <ul class="modal-discount-other">
                <li v-if="info.date_from && info.date_from !== 'Invalid date'">From {{ info.date_from }}</li>
                <li v-if="info.date_to && info.date_to !== 'Invalid date'">To {{ info.date_to }}</li>
                <li v-if="info.expired_at && info.expired_at !== 'Invalid date'">Expired at {{ info.expired_at }}</li>
                <li v-if="info.validity && info.validity !== 'Invalid date'">Valid within {{ info.validity }} days</li>
              </ul>
            </div>
          </div>
          <div v-if="currentDiscount.description && currentDiscount.description !== 'null'"
            class="modal-discount-description">
            {{ currentDiscount.description }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import chroma from 'chroma-js';
import { useAdvantageStore } from '@Stores/advantage.js';
import moment from 'moment';

const selectedDiscount = ref(null);
const discountColors = ref([]);
const advantageStore = useAdvantageStore();
const discounts = ref([])

const props = defineProps({
  establishment: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: false
  }
});

const emits = defineEmits(['select'])

const currentDiscount = ref(null);

const showModal = ref(false);

const showMore = (index) => {
  currentDiscount.value = discounts.value[index];
  showModal.value = true;
}

const info = computed(() => {
  const tmp = {};

  switch (currentDiscount.value.category) {
    case 'Gift':
      return {
        from: null,
        to: null,
        category: currentDiscount.value.category,
        expired_at: moment(currentDiscount.value.expired_at).format('DD-MM-YYYY'),
        value: null,
        metric: null
      }
    case 'Lottery':
      return {
        from: moment(currentDiscount.value.date_from).format('DD-MM-YYYY'),
        to: moment(currentDiscount.value.date_to).format('DD-MM-YYYY'),
        category: currentDiscount.value.category,
        expired_at: moment(currentDiscount.value.expired_at).format('DD-MM-YYYY'),
        value: currentDiscount.value.advantage_limit,
        metric: null
      }
    case 'Discount':
      return {
        from: null,
        to: null,
        category: currentDiscount.value.category,
        expired_at: moment(currentDiscount.value.expired_at).format('DD-MM-YYYY'),
        value: currentDiscount.value.amount,
        metric: currentDiscount.value.metric == 'percent' ? '%' : '$',
        validity: currentDiscount.value.validity
      }
    case 'Free':
      return {
        from: null,
        to: null,
        category: currentDiscount.value.category,
        expired_at: moment(currentDiscount.value.expired_at).format('DD-MM-YYYY'),
        value: 'F',
        metric: 'ree'
      }
  }

  return tmp;
})

onMounted(async () => {

  let data = await advantageStore.getAdvantageAvailable(props.establishment, true)

  if (props.discount) {

    let d = data.find((d) => d.id == props.discount)
    if (d) {
      discounts.value = [{ ...d, icon: "🎉" }]
      selectDiscount(0, discounts.value[0])
    }

  } else {

    discounts.value = data.map(discount => {
      return { ...discount, icon: '' };
    });


    if (discounts.value.length == 1) {
      selectDiscount(0, discounts.value[0])
    }
  }

  generateColors();
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
.modal__close i {
  position: absolute;
  top: 0;
  right: 8px;
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.modal__close i:hover {
  transform: rotate(360deg);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.modal-content {
  background-color: #fff;
  margin: 6rem auto;
  padding: 25px;
  border-radius: 16px 16px 5px 5px;
  /*overflow: auto; */
  max-width: 90%;
  min-width: 300px;
  position: relative;
}

.modal-body {
  padding: 1rem;
}

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

.modal-header__img {
  width: 100%;
}

.modal-header__img img {
  border-radius: 16px 16px 0 0;
  max-height: 240px;
}

.modal-discount-name {
  text-transform: uppercase;
  font-size: .9rem;
}

.modal-discount-category {
  text-transform: uppercase;
  font-size: .65rem;
  padding: 4px 8px;
  border-radius: 16px;
  background: var(--color-primary);
  height: 22px;
  color: white;
  font-weight: 600;
}

.modal-discount-establishment {
  font-size: .7rem;
  color: #707067;
  font-weight: 500;
}

.modal-discount-offer {
  text-transform: uppercase;
  color: white;
  font-size: 2.8rem;
  padding: 16px;
  border-radius: 100%;
  max-width: 150px;
  aspect-ratio: 1/1;
  background: #D3B302;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: 'Courier New', Courier, monospace;
}

.modal-discount-description {
  font-size: .7rem;
  color: var(--color-secondary);
  font-weight: 500;
  max-height: 200px;
  min-height: 100px;
  overflow-y: auto;
  border: 0 1px solid var(--color-primary);
  padding: 8px;
  border-radius: 2px 12px 2px 12px;
  box-shadow: 1px -1px 4px color-mix(in srgb, var(--color-primary) 50%, white 50%) inset;
  background: color-mix(in srgb, var(--color-primary) 8%, white)
}

ul.modal-discount-other {
  margin: 10px 0px;
  padding: 0;
  display: block;
  white-space: nowrap;
}

.modal-discount-other li {
  font-size: .7rem;
  font-weight: 600;
}

.modal-discount-other li:before {
  content: "\1F449";
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
  /* width: 60%; */
}

.discount-icon {
  width: 10% !important;
}

.wrap-word {
  word-wrap: normal;
  white-space: pre-wrap;
  text-align: center;
}

#discount_establishment {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
}

#discount_category {
  text-align: left;
  font-size: 9px;
  font-weight: 500;
}

.discount-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.discount-list li {
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  /* height: 4rem; */
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

.discount-item {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.read-more {
  font-size: 9px;
  font-weight: 400;
}

.read-more:hover {
  text-decoration: underline;
}

ul::-webkit-scrollbar {
  display: none;
}

/* Media query for larger screens */
@media (min-width: 768px) {
  .discount-list {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    /* Ajuster l'espace entre les éléments */
  }

  .discount-item {
    flex: 1 1 calc(50% - 12px);
    /* Flex basis pour 50% avec ajustement pour l'espace */
    max-width: calc(50% - 11px);
    /* Max-width ajustée pour deux colonnes */
  }
}
</style>
