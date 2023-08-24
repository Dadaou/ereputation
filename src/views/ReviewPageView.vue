<template>
    <div>
        Reviews Page
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import CommentPagination from '@Components/utils/CommentPagination.vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import {ref, onBeforeMount, onMounted} from 'vue';
import { useCompetitorStore } from "@Stores/competitors.js";
import { useCompanyStore } from "@Stores/company.js";
import { useMediaStore } from "@Stores/media.js";
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';


const page=ref({
    title1: "",
    title2: "",
    icon: "uil-estate",
});

const route = useRoute();
const router = useRouter();
const breadcrumbData = [
    {
        title: "Back",
        path: `/companies/${route.params.companyId}`,
        isCurrent: false,
    },
    {
        title: "Reviews",
        path: `${route.path}`,
        isCurrent: true
    }
]

const competitorStore = useCompetitorStore();
const companiesStore = useCompanyStore();
const mediaStore = useMediaStore();

const date = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});

let establishment = ref({});
let reviews = ref([]);
let reviews_loader = ref(true);
let visibleData = ref([])
let paginationConfig = ref({
    current:0,
    size: 5,
    data: [],
    _data: []
})

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(reviews.value);
}


let updateVisibleData = function(_data){
    let data = paginationConfig.value;
    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = visibleData.value.length>0?false:true;
}


const format = (date) => {
  const startDate = new Date(date[0]).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  const endDate = new Date(date[1]).toLocaleString('en-US', { month: 'short', year: 'numeric' });
 

  return `${startDate} - ${endDate}`;
}

const formatRating = (rating) => {
    rating = parseFloat(rating);
    if(rating > 5){
        rating = rating / 2;
    }
    return rating.toFixed(1);
}

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
})

onBeforeMount(async()=>{
    const companyId = route.params.companyId;
    await companiesStore.fetchOne(companyId, async (company) => {
        establishment.value = company;
        reviews.value = company.reviews;
        page.value.title2 = company.name;
        updateVisibleData(reviews.value);
    });
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.app__container{
    margin-top: 3rem !important;
    min-height: 30rem;
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
}

.app__container .head{
    padding: 20px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.head .title{
    font-size: 22px;
    font-weight: 800;
    color: var(--color-danger);
    transition: var(--transition);
}

.reviews__statistics{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px !important;  
}

.reviews__statistics_item{
   flex-basis: 300px;
}

.statistics__content span.value{
   font-size: 20px;
   font-weight: bold;
}

.reviews__statistics_item h1{
    font-weight: 600;
    margin: 10px 0;
}

.reviews__statistics_item .description{
    font-weight: 600;
    margin: 10px 0;
    color: rgb(130, 138, 156);
}

.reviews__stars{
    align-self: flex-end;
}

.reviews__rating{
    align-self: center;
}

.all__reviews article{
   border: 1px solid var(--light-color-bg2);
   margin: 15px;
   border-radius: 10px;
   padding: 10px;
}

.review__item{
    justify-content: space-between !important;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}
</style>