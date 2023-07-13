<template>

<div class="flex flex-col items-center">
  <!-- Help text -->
  <span class="text-sm text-gray-700 dark:text-gray-400">
      Showing <span class="font-semibold text-gray-900 dark:text-white">{{  (config.size * (config.current + 1)) - config.size + 1}}</span> to <span class="font-semibold text-gray-900 dark:text-white">{{ config.size * (config.current + 1) }}</span> of <span class="font-semibold text-gray-900 dark:text-white"> {{ nb }}</span> Entries
  </span>
  <div class="inline-flex mt-2 xs:mt-0">
    <!-- Buttons -->
    <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white rounded-l"  @click=" showPreviousLink() ? updatePage(config.current - 1) : null" :style="{}">
        <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
        </svg>
        Prev
    </button>
    <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white" @click="updatePage(config.current+ 1)">
        Next
        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </button>
  </div>
</div>
</template>
<script>
import { computed } from 'vue';
import { useCheckColor } from '@Composables/useful';
    export default{
        name:"Pagination",
        props:{
            config:Object,
            color: String,
            nb: Number,
        },
        emits:['updatePage'],
        setup(props, ctx){
            let updatePage = function(pageNumber){
                ctx.emit('updatePage', pageNumber)
            }

            let totalPages = function(){
                console.log(Math.ceil(props.config._data.length / props.config.size));
                 return Math.ceil(props.config._data.length / props.config.size);
            }

            let showPreviousLink = function(){
                 return props.config.current == 0 ? false : true;
            }

            let showNextLink = function(){
                 return  props.config.current == (totalPages()-1) ? false : true;
            }

            /** this function is not really necessary but it just to make the pagination working */
            let textColor = computed(()=>{
                let color = "black";
            
                if(useCheckColor(props.color) == "light") color = "black";
                else color= "rgb(238, 246, 254)";
                return color = 'white';
            })

            return{
                updatePage, totalPages, showPreviousLink,
                showNextLink, textColor,
            }
        }
}
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

button{
    background-color: var(--color-danger);
}
</style>