<template>
	<div class="establishment bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a  v-if="!dataLoading">
            <img 
            	v-if="establishment.url_source !== null" 
            	:src="establishment.url_source" 
            	alt="" 
            />
            <div 
            	v-else 
            	role="status" 
            	class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </a>
        <a href="#" v-else>
            <div 
            	role="status" 
            	class="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                	<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                	<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </a>
        <div class="establishment__info">
            <label 
            	v-if="!dataLoading"
            	class="society__name">
            	{{ establishment.name }}
            </label>
            <label v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></label>
            <div class="society__location">
              	<i :class="['uil', establishment.category=='Restaurant'?'uil-restaurant':'', establishment.category=='Hotel'?'uil-bed-double':'', establishment.category=='Residence'?'uil-home':'']"></i>
                <span 
                	v-if="!dataLoading" 
                	class="society__location">
                	{{ establishment.category }}
            	</span>
                <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
            </div>
            <div class="society__location">
                <i class="uil uil-location-point"></i>
                    <span v-if="!dataLoading" class="society__location">{{ establishment.address1 }}, {{ establishment.city }}</span>
                    <span v-else class="h-3 mt-1 bg-gray-200 dark:bg-gray-700 w-full mb-4"></span>
            </div> 
        </div>
        <DropdownComponent 
        	class="dropdown" 
        	title="Compare to" 
        	placeholder="Select a competitor" 
        	:data="computedCompetitors" 
        	@submit="(competitor)=>{selectedCompetitors = competitor.name}" 
        	:defaultObj="computedCompetitors[0]" 
        	:isDataObject="true"/>
        <DropdownComponent 
        	class="dropdown" 
        	title="Filter by website" 
        	placeholder="Select a website" 
        	:data="websites" 
        	@submit="(website)=>{selectedWebsites = website}" 
        	:default="websites[0]"/>
        <div class="date__filter">
            <div class="text-sm title">Select a range of date</div>
                <el-date-picker
                    v-model="date2"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="'large'"
                />
                <DropdownComponent 
                	:showTitle="false" 
                	placeholder="" 
                	:data="timePeriods" 
                	@submit="(timePeriod)=>{selectedTimePeriod = timePeriod}" 
                	:default="timePeriods[0]"/>
        </div>
    </div>
</template>
<script setup>
	
</script>
<style scoped>
	
</style>