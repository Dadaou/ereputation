<template>
	<div role="status" class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" v-for="index in 3">
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
</template>
<script setup>
	
</script>
<style scoped>
	
</style>
