<template>
	<div class="head">
                    <div class="app__title">
                       <h2>Staffs Histogram</h2>
                    </div>
                </div>
                <div class="reviews__content" ref="el">
                     <div 
                        v-if="chartLoading == true" 
                        :style="{
                            'width': `100%`,
                            'height': `200px`,
                            'display': 'flex',
                            'alignItems': 'center',
                            'background': 'rgba(0, 0, 0, 0.1)',
                            'opacity': 0.9,
                            'justifyContent': 'center',
                            'alignItems': 'center',
                            'zIndex': 1,
                            'marginTop': '10px',
                            'marginBottom': '10px'
                        }"><SpinnerComponent /></div>
                     <StaffChartComponent  v-else :width="barWidth"/>
                </div>
                <div class="head">
                    <div class="app__title">
                       <h2>Staffs</h2>
                    </div>
                </div>
                <div class="reviews__content">
                    <StaffItemComponent  v-if="staffLoading == false"/>
                    <div 
                    v-else 
                    role="status" 
                    class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" 
                    v-for="index in 2">
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
</template>
<script setup>
import {
    ref, 
    inject,
    defineAsyncComponent
} from 'vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
import { RouterView } from 'vue-router';
import { useAppStore } from "@Stores/app.js";


const appStore = useAppStore();
 appStore.isLoading = false;
const barWidth = inject('barWidth');
const chartLoading = inject('chartLoading');
const staffLoading = inject('staffLoading');

const SpinnerComponent = defineAsyncComponent(()=>
  import('@Components/utils/SpinnerComponent.vue')
);

const StaffChartComponent = defineAsyncComponent(()=>
    import('@Components/utils/StaffChartComponent.vue')
);

</script>
<style scoped>
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

.head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.reviews__content{
    margin-top: 20px;
}
</style>