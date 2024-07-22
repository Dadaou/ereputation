<template>
  <div class="alert__content">
    <div v-if="Object.keys(reviewsData).length === 0">
      No alerts for this period at the moment
    </div>
    <div v-else class="cards-container">
      <div class="alert__card" v-for="(review, key) in reviewsData" :key="key">
        <div class="alert__container__logo">
          <img :src="key === 'App (Private)' ? appStore.account.logo : getLogoUrl(key)" class="alert__logo">
        </div>
        <div class="card__details">
          <ul class="alert__review">
            <li v-for="(noteKey, index) in Object.keys(review).filter(key => key !== 'url_source').slice(4, 7).reverse()" :key="noteKey" @click="redirectToReviews(route.params.tag, route.params.id, props.from, props.to, noteKey.replace('note ', ''))">
                <div class="review-content">
                <span>{{ noteKey.replace('note ', '') }} <i class="fa fa-star " aria-hidden="true"></i></span>
                <div class="percentage-bar">
                  <div class="percentage-line" :style="{ width: calculatePercentage(review[noteKey], review.total) + '%' }"></div>
                </div>
                 <span>{{ calculatePercentage(review[noteKey], review.total) }}%</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import services from '@Services/services.js';
import moment from 'moment';
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@Stores/app.js"

const appStore = useAppStore();
const reviewsData = ref({});
const route = useRoute();
const router = useRouter();
const tag = route.params.id;
const start_date = inject('start_date');
const end_date = inject('end_date')

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
    Object.keys(reviewsData.value).forEach(key => {
      const totalReviews = Object.keys(reviewsData.value[key]).filter(noteKey => noteKey.startsWith('note ')).reduce((acc, noteKey) => acc + reviewsData.value[key][noteKey], 0);
      reviewsData.value[key].total = totalReviews;
    });
  } catch (error) {
    console.error('Error fetching reviews data:', error);
  }
};

const calculatePercentage = (count, total) => {
  return Math.round((count / total) * 100);
};

const redirectToReviews = (customer, tag, from, to, star) => {
  start_date.value = from;
  end_date.value = to;
  router.push(`/customer/${customer}/establishment/${tag}/reviews/alert?star=${star}`);
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
.alert__content {
  display: flex;
  /* flex-direction: column;
  align-items: center; */
  gap: 20px;
  margin-top: 10px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.alert__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 165px;
  border: 1px solid rgba(128, 128, 128, 0.241);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.144);
  color: grey;
  overflow: hidden;
}

.alert__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--light-color-bg2);
  opacity: 0.2;
  z-index: -1;
}

.alert__container__logo {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  border-radius: 10px 10px 0 0;
  width: 100%;
}

.alert__logo {
  width: 80px; 
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: white;
}

.alert__review {
  list-style: none;
  padding: 0;
  width: 100%;
  text-align: center;
}

.alert__review li {
  margin: 5px 0;
  font-size: 0.8rem;  
  border-radius: 5px;
  padding: 3px;
  color: rgba(0, 0, 0, 0.73);
}

.alert__review li:hover {
  font-size: 0.75rem;  
  cursor: pointer;
  color: var(--light-color-bg2);
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.47);
}

.review-content {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-content span {
  width: 30%;
}

.percentage-bar {
  width: 40%;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  height: 8px;
}

.percentage-line {
  height: 100%;
  background-color: var(--light-color-bg2);
}
</style>