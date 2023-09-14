<template>
<div class="security__header border__bottom my-10">
            <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Event</h4>
                <p>Complete the following information to add an event to an establishment.</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event name <span>*</span></label>
                            <input type="text" id="first_name" v-model="eventName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <input type="text" id="last_name" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                            <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                                <el-option
                                v-for="item in companiesStore.establishments"
                                :key="item.id"
                                :label="item.name"
                                :value="`/api/${companiesStore.entity}/${item.id}`"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start at <span>*</span></label>
                            <VueDatePicker v-model="dateFrom" :enable-time-picker="false" :format="format"/>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to</label>
                            <VueDatePicker v-model="dateTo" :enable-time-picker="false" :format="format"/>
                        </div>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                            <button type="submit" class="inline-flex items-center py-2 px-10 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                Save
                            </button>
                        </div>
                </form>
        </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useCompanyStore } from "@Stores/company.js";
import { useEventStore } from "@Stores/event.js";
import moment from 'moment';

const companiesStore = useCompanyStore();
const eventStore = useEventStore();
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}

/**
 * Event
 */
 const dateFrom = ref(null);
 const dateTo = ref(null);
 const category = ref('');
 const eventName = ref('');
 const establishment = ref('');

 const submit = async ()=>{
    let event = {
        "name": eventName.value,
        "category": category.value,
        "datefrom": moment(dateFrom.value).format('YYYY-MM-DD'),
        "dateto":  moment(dateTo.value).format('YYYY-MM-DD')
    }

    if(dateFrom.value != null && dateTo.value != null && category.value != '' && establishment.value != '' && eventName.value != ''){
        try {
            await eventStore.addEvent(event, (response)=>{
                console.log(response);
                if(response.status == 200){
                    dateFrom.value = '';
                    dateTo.value = ''; 
                    category.value = '';
                    establishment.value = '';
                    eventName.value = '';
                }
            })   
        } catch (error) {
            console.log(error);
        }
    }else{
        console.log("fill all input")
    }
}
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

form{
    height: 600px !important;
}
.security__header {
    display: flex;
    justify-content: space-between;
}

.security__header h4 {
    color: var(--color-bg2);
    font-size: 19px;
    font-weight: bold;
}

.security__header p {
    font-size: 15px;
    margin: 8px 0;
}

input, select{
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span{
    color: red;
}

input{
    caret-color: var(--light-color-bg2);
}

.demo-tabs{
    /* min-height: inherit !important; */
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>