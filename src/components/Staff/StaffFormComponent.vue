<template>
    <div class="security__header border__bottom mt-10">
        <div class="security__edit">
            <h4><i class="uil uil-users-alt"></i> Staff</h4>
            <p>Please provide the necessary information to add a new staff member to one of your establishment.</p>
        </div>
    </div>
    <div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name <span>*</span></label>
                    <input type="text" id="first_name" v-model="firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            <div>
                <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                <input type="text" id="last_name" v-model="lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender <span>*</span></label>
                    <el-select v-model="gender" placeholder="Choose gender" size="large">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department <span>*</span></label>
                    <input type="text" id="first_name" v-model="department" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
                <div>
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                    <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                        <el-option v-for="item in companiesStore.establishments" :key="item.id" :label="item.name" :value="`/api/${companiesStore.entity}/${item.id}`"/>
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start working at <span>*</span></label>
                    <VueDatePicker v-model="startDate" :enable-time-picker="false" :format="format"/>
                </div>
                <div>
                    <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to</label>
                    <VueDatePicker v-model="endDate" :enable-time-picker="false" :format="format"/>
                </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit" class="inline-flex items-center py-2 px-10 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"> Save </button>     
            </div>
        </form>
    </div>                               
</template>
<script setup>
import { ref, watch } from 'vue';
import { useCompanyStore } from "@Stores/company.js";
import { useStaffStore } from "@Stores/staff.js";
import moment from 'moment';

const companiesStore = useCompanyStore();
const staffStore = useStaffStore();
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}

/**
 * Staff
 */
const firstname = ref('');
const lastname = ref('');
const gender = ref('');
const genders = [
  {
    value: 'M',
    label: 'Male',
  },
  {
    value: 'F',
    label: 'Female',
  },
  {
    value: 'O',
    label: 'Other',
  }
]
const startDate = ref(null);
const endDate = ref(null);
const establishment = ref('');
const department = ref('');

const submit = async ()=>{
    let staff = {
    "gender": gender.value,
        "firstname": firstname.value,
        "lastname": lastname.value,
        "department": department.value,
        "datefrom": moment(startDate.value).format('YYYY-MM-DD'),
        "dateto": endDate.value==null?null:moment(endDate.value).format('YYYY-MM-DD'),
        "establishment": establishment.value,
    }

    console.log(staff)
    if(gender.value != '' && department.value != '' && startDate.value != null && establishment.value != '' && firstname.value != ''){
        try {
            await staffStore.addStaff(staff, (response)=>{
                console.log(response);
                if(response.status == 200){
                    gender.value = '';
                    department.value = ''; 
                    startDate.value = '';
                    establishment.value = '';
                    lastname.value = '';
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
    height: 750px !important;
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
</style>