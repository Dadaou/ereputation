<template>
    <div class="app__title">
        <h2 v-if="selectedStaff">{{ selectedStaff.firstname }}'s intern feedback</h2>
    </div>
    <div class="reviews__content" v-if="_reviews.length > 0">
        <div class="reviews__pagination">
            <CommentPagination v-if="_reviews.length > 0" :config="paginationConfig" @updatePage="updatePage"
                :color="'#6c63ff'" :nb="_reviews.length" :data="visibleData"></CommentPagination>
        </div>
        <CommentComponent v-if="reviews_loader == false" :reviews="visibleData" :showEmoji="false" />
        <div v-else role="status"
            class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
            v-for="index in 5">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                </div>
                <div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
                    <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700"></div>
                </div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <div v-else>No Reviews</div>
</template>
<script setup>
import {
    ref, reactive, watch, onMounted, computed, inject,
    defineAsyncComponent, onUnmounted
} from 'vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import CommentPagination from '@Components/utils/CommentPagination.vue';
import { useRoute } from "vue-router";
import services from '@Services/services.js';
import moment from 'moment';

const route = useRoute()
const visibleData = ref([])
const dataReviews = ref([])
const selectedStaff = inject('selectedStaff')
const date = inject('date')
const _reviews = ref([])
const paginationConfig = ref({
    current: 0,
    size: 5,
    data: [],
    _data: []
})
const reviews_loader = ref(false)
const exist = ref(true)

const updatePage = (pageNumber) => {
    paginationConfig.value.current = pageNumber;
    updateVisibleData(_reviews.value);
}

const updateVisibleData = (_data) => {
    let data = paginationConfig.value
    _reviews.value = _data
    paginationConfig.value.data = _data.slice(data.current * data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage(paginationConfig.value.current - 1)
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = false;
};

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const loadReviews = async (staffTag, dateStart, dateEnd) => {
    const apiBase = `staffs/${route.params.staff_tag}/reviews`
    let apiParams = ''

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(dateStart).format('YYYY-MM-DD');
        dateEnd = moment(dateEnd).format('YYYY-MM-DD');
        apiParams += `&from=${dateStart}&to=${dateEnd}`;
    }

    const api = (apiParams !== '') ? apiBase + '?' + apiParams : apiBase;
    const response = await new Promise((resolve, reject) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        reviews_loader.value = false;
        selectedStaff.value = response.data;
        updateVisibleData(selectedStaff.value.reviews);
    }

}

watch(date, async () => {
    console.log(date.value)
    if (date.value.length > 1) {
        await loadReviews(route.params.staff_tag, date.value[0], date.value[1])
    }
})

onMounted(async () => {
    reviews_loader.value = true
    console.log('Component onMounted')
    await loadReviews(route.params.staff_tag, '', '')
});

onUnmounted(() => {
    console.log("Component unmounted");
});
</script>