<template>
     <div id="alert-1" class="flex p-4 mb-4"
     :class="[props.alertType=='error'?'text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400':'', props.alertType=='info'?'text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400':'', props.alertType=='success'?'text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400':'', props.alertType=='warning'?'text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400':'' ]"
     role="alert">
        <svg aria-hidden="true" class="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Info</span>
        <div class="ml-3 text-sm font-medium">
           {{ props.message }}
        </div>
            <button type="button" class="ml-auto -mx-1.5 -my-1.5" 
            :class="[props.alertType=='error'?'bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700':'', props.alertType=='info'?'bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700':'', props.alertType=='success'?'bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700':'',  props.alertType=='warning'?'bg-green-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700':'']"
            data-dismiss-target="#alert-1" aria-label="Close" @click="$emit('close')">
            <span class="sr-only">Close</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
        </div>
</template>
<script setup>
const props = defineProps({
    message:{
        type: String,
        default: "this is an alert",
    },
    alertType:{
        type: String,
        default: "error",
    }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

#alert-1{
    width: 25% !important;
    margin: 0 auto;
    margin-top: 10px;
}

@media screen and (max-width:1225px) {
   #alert-1{
        width: 30% !important;
   }
}

@media screen and (max-width:1200px) {
    #alert-1{
        width: 35% !important;
    }
}

@media screen and (max-width:1024px) {
    #alert-1{
        margin-top: 13em !important;
    }
}

@media screen and (max-width:900px) {
    #alert-1{
        width: 40% !important;
    }
}

@media screen and (max-width:800px) {
    #alert-1{
        width: 45% !important;
    }
}

@media screen and (max-width:700px) {
    #alert-1{
        width: 50% !important;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    #alert-1{
        width: 60% !important;
    }
}

@media screen and (max-width:500px) {
    #alert-1{
        width: 70% !important;
    }
}

@media screen and (max-width:450px) {
    #alert-1{
        width: 75% !important;
    }
}

@media screen and (max-width:400px) {
    #alert-1{
        width: 80% !important;
    }
}

@media screen and (max-width:350px) {
    #alert-1{
        width: 90% !important;
    }
}
</style>