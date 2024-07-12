<template>
  <div class="alert__content">
    <div v-if="Object.keys(reviewsData).length === 0">
      No alerts for this period at the moment
    </div>
    <div v-else>
      <div class="alert__card" v-for="(review, key) in reviewsData" :key="key">
        <img :src="getLogoUrl(key)" class="alert__logo">
        <div>
          <ul class="alert__review">
            <li v-for="(noteKey, index) in Object.keys(review).filter(key => key !== 'url_source').slice(0, 3)" :key="noteKey">
              {{ review[noteKey] }} review{{ review[noteKey] !== 1 ? 's' : '' }} note {{ noteKey.replace('note ', '') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import services from '@Services/services.js';
import moment from 'moment';
import { useRoute } from 'vue-router';

const reviewsData = ref({});
const route = useRoute();
const tag = route.params.id;

const props = defineProps({
  from: String,
  to: String
});

const logoMap = {
  'Booking': new URL('@/assets/images/logo/Booking.svg', import.meta.url).href,
  'Camping': new URL('@/assets/images/logo/Camping.png', import.meta.url).href,
  'Expedia': new URL('@/assets/images/logo/Expedia.svg', import.meta.url).href,
  'Google': new URL('@/assets/images/logo/Google.svg', import.meta.url).href,
  'Hotel': new URL('@/assets/images/logo/Hotel.svg', import.meta.url).href,
  'Maeva': new URL('@/assets/images/logo/Maeva.svg', import.meta.url).href,
  'Opentable': new URL('@/assets/images/logo/Opentable.svg', import.meta.url).href,
  'Thefork': new URL('@/assets/images/logo/Thefork.svg', import.meta.url).href,
  'Tripadvisor': new URL('@/assets/images/logo/Tripadvisor.svg', import.meta.url).href,
  'Trustpilot': new URL('@/assets/images/logo/Trustpilot.svg', import.meta.url).href,
  'Yelp': new URL('@/assets/images/logo/Yelp.svg', import.meta.url).href
};

const getLogoUrl = (key) => {
  return logoMap[key];
};

const fetchReviewsData = async (tag, from, to) => {
  try {
    const response = await new Promise((resolve, reject) => {
      services.get_Record(`get/reviews/alert?tag=${tag}&from=${from}&to=${to}`, (response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(new Error('Failed to fetch reviews'));
        }
      });
    });
    reviewsData.value = response.data; 
  } catch (error) {
    console.error('Error fetching reviews data:', error);
  }
};

watch(() => [props.from, props.to], ([newFrom, newTo]) => {
  if (newFrom && newTo) {
    fetchReviewsData(tag, newFrom, newTo);
  }
});

onMounted(() => {
  if (props.from && props.to) {
    fetchReviewsData(tag, props.from, props.to);
  }
});
</script>


<style scoped>
.alert__content{
  margin-top: 6px;
}
.alert__card{
    gap: 10px;
    display: flex;
    border: solid 1px var(--light-color-bg2);
    border-radius: .5rem;
    margin-bottom: 20px;
}

.alert__review li {
    margin: 10px;
}
.alert__review li:hover {
    cursor: pointer;
    color: var(--light-color-bg2);
    font-weight: bold;
}
.alert__logo {
    margin-top: 25px;
    margin-left: 10px;
    width: 60px;
    height: 60px;
}
</style>