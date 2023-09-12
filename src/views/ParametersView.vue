<template>
   <div class="user__main__container">
        <div class="security__header border__bottom">
            <div class="security__edit">
                <h4><i class="uil uil-users-alt"></i> Staff</h4>
                <p>Please provide the necessary information to add a new staff member to one of your establishment.</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name <span>*</span></label>
                            <input type="text" id="first_name" v-model="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                            <input type="text" id="last_name" v-model="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department <span>*</span></label>
                            <input type="text" id="first_name" v-model="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                            <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-1.7" v-model="establishment">
                                <option selected>Choose a country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start working at <span>*</span></label>
                            <VueDatePicker v-model="startDate" :enable-time-picker="false" />
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to</label>
                            <VueDatePicker v-model="endDate" :enable-time-picker="false" />
                        </div>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                            <button type="submit" class="inline-flex items-center py-2 px-10 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                Save
                            </button>
                        </div>
                </form>
        </div>
        <div class="security__header border__bottom mt-10">
            <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Event</h4>
                <p>Complete the following information to add an event to an establishment.</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event name <span>*</span></label>
                            <input type="text" id="first_name" v-model="eventName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" required>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <input type="text" id="last_name" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-1.7" v-model="_establishment">
                                <option selected>Choose a country</option>
                                <option value="US" class="p-2">United States</option>
                                <option value="CA" class="p-2">Canada</option>
                                <option value="FR" class="p-2">France</option>
                                <option value="DE" class="p-2">Germany</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start at <span>*</span></label>
                            <VueDatePicker v-model="dateFrom" :enable-time-picker="false" />
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to</label>
                            <VueDatePicker v-model="dateTo" :enable-time-picker="false" />
                        </div>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                            <button type="submit" class="inline-flex items-center py-2 px-10 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                Save
                            </button>
                        </div>
                </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';


/**
 * Staff
 */
const firstname = ref('');
const lastname = ref('');
const startDate = ref('');
const endDate = ref('');
const establishment = ref('');

/**
 * Event
 */
 const dateFrom = ref('');
 const dateTo = ref('');
 const category = ref('');
 const eventName = ref('');
 const _establishment = ref('');

</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

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
</style>
