<template>
    <div class="reviews__content">
        <div class="reviews__pagination">
            <PaginationComponent :options="options" @next="2" @prev="6" />
        </div>
        <CommentComponent />
        <div role="status"
            class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5">
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
        <div class="no-comment">
            No reviews meet to the current filters
        </div>
        <div class="reviews__pagination">
            <PaginationComponent :options="options" @next="2" @prev="6" />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import PaginationComponent from '@Components/utils/PaginationComponentV2.vue';


const options = ref({
    rowLimit: 10,
    max: 100,
    current: 1,
    page: 1,
})
</script>

<style scoped>
.review-card {
    width: 450px;
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.avatar {
    margin-right: 10px;
}

.username {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
}

.details {
    font-size: 12px;
    color: #828282;
    margin-top: 5px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.review-content p {
    font-size: 14px;
    line-height: 1.6;
    color: #4f4f4f;
}
</style>
