<template>
	<div class="head">
        <div class="app__title">
            <h2>{{selectedStaff.firstname}}'s intern feedback</h2>
        </div>
        <div class="reviews__content">
           <div class="reviews__pagination">
                <CommentPagination  v-if="_reviews.length > 0" :config="paginationConfig" @updatePage="updatePage" :color="'#6c63ff'" :nb="_reviews.length" :data="visibleData"></CommentPagination>
            </div>
            <CommentComponent 
                    v-if="reviews_loader == false" 
                    :reviews="visibleData" 
                    :showEmoji="false"
            />
            <div v-else role="status" class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" v-for="index in 5">
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
    </div>
</template>
<script setup>
import {ref, reactive, watch, onBeforeMount, computed, inject, 
	defineAsyncComponent} from 'vue';
import CommentComponent from '@Components/utils/CommentComponent.vue';
import CommentPagination from '@Components/utils/CommentPagination.vue';
import { useRoute } from "vue-router";

const route = useRoute();
let visibleData = ref([]);
let dataReviews = ref([]);
let staffs = inject('staffs');
let selectedStaff = inject('selectedStaff');
let _reviews = ref([]);
let paginationConfig = ref({
    current:0,
    size: 5,
    data: [],
    _data: []
});
let reviews_loader = ref(true);

let updatePage = function(pageNumber){
    paginationConfig.value.current = pageNumber;
    updateVisibleData(_reviews.value);
}

let updateVisibleData = function(_data, isStarFilter=false){
    let data = paginationConfig.value;
    _reviews.value = _data
    if (isStarFilter==false) dataReviews= _reviews.value ;
    paginationConfig.value.data = _data.slice(data.current*data.size, (data.current * data.size) + data.size)
    if (paginationConfig.value.data.length == 0 && paginationConfig.value.current > 0) {
        updatePage( paginationConfig.value.current -1);
    }
    visibleData.value = paginationConfig.value.data
    reviews_loader.value = false;
};

watch(staffs, ()=>{
	if(selectedStaff.value == null){
		staffs.value.forEach(staff=>{
			if(staff.tag == route.params.staff_tag){
				console.log(staff)
					_reviews.value = staff.reviews;
					selectedStaff.value = staff;
					updateVisibleData(staff.reviews);
					 reviews_loader.value = false;
				}
		})
	}
})

onBeforeMount(()=>{
	if(selectedStaff.value !== null) {
		_reviews.value = selectedStaff.value.reviews;
		updateVisibleData(selectedStaff.value.reviews);
	}
});
</script>
<style setup>
.app__title{
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1{
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2{
    font-size: 18px;
    transition: var(--transition);
}

.reviews__content p{
   font-size: 14px;
   font-weight: 500;
   color: var(--color-bg1);
}

.reviews__content a{
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}
.reviews__content a:hover{
   background-color: var(--color-danger);
   color: white;
}

.reviews__content{
    margin-top: 20px;
}

.reviews__pagination{
    display: flex;
    justify-content: flex-end;
}
</style>