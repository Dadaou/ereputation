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
                    <el-select v-model="department" placeholder="Choose department" size="large">
                        <el-option v-for="item in departments" :key="item" :label="item" :value="item"/>
                    </el-select>
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
                <button type="submit"  :class="['btn__light_secondary py-2 px-10',showSpinner==true?'isLoaded':'' ]">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} staff</span>
                </button>
            </div>
        </form>
    </div>                               
</template>
<script setup>
import { ref, inject, watch } from 'vue';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { useCompanyStore } from "@Stores/company.js";
import { useStaffStore } from "@Stores/staff.js";
import { useUserStore } from "@Stores/user.js";
import moment from 'moment';
import { ElMessage } from 'element-plus';

const companiesStore = useCompanyStore();
const userStore = useUserStore();
const staffStore = useStaffStore();
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}

const showSpinner = ref(false);

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
const departments = [
    'Front Office', 'Housekeeping', 'Kitchen', 'Bar', 'Room service'
]
const department = ref('');

const staff_to_update = inject('staff_to_update');
const type = ref('add');

watch(staff_to_update, ()=>{
    console.log(staff_to_update.value)
    if(staff_to_update.value != null){
        gender.value = staff_to_update.value["gender"];
        department.value = staff_to_update.value["department"]; 
        startDate.value = new Date(staff_to_update.value["datefrom"]);
        endDate.value = (staff_to_update.value["dateto"]==null)?null:new Date(staff_to_update.value["dateto"]);
        establishment.value = staff_to_update.value["establishment"];
        lastname.value = staff_to_update.value["lastname"];
        firstname.value = staff_to_update.value["firstname"];
        type.value = 'edit';
    }
})

const loadData = (data)=>{
    if(userStore.user.customer != null){
        userStore.user.customer.establishments.forEach((element, index) => {
            if(`/api/${companiesStore.entity}/${element.id}` == data.establishment){
                userStore.user.customer.establishments[index].staff.push(data);
            }
        });
    }
}

const updateData = (staff)=>{
    console.log(staff)
    if(userStore.user.customer != null){
        userStore.user.customer.establishments.forEach((element, index) => {
            console.log(`/api/${companiesStore.entity}/${element.id}`)
            if(`/api/${companiesStore.entity}/${element.id}` == staff.establishment){
                userStore.user.customer.establishments[index].staff.forEach((item, index2)=>{
                    userStore.user.customer.establishments[index].staff[index2] = staff;
                })
            }
        });
    }
  }

const submit = async ()=>{
    showSpinner.value = true;
    let staff = {
        "gender": gender.value,
        "firstname": firstname.value,
        "lastname": lastname.value,
        "department": department.value,
        "datefrom": moment(startDate.value).format('YYYY-MM-DD'),
        "dateto": endDate.value==null?null:moment(endDate.value).format('YYYY-MM-DD'),
        "establishment": establishment.value,
    }

    try {
        if(gender.value != '' && department.value != '' && startDate.value != null && establishment.value != '' && firstname.value != ''){
            if(type.value == 'add'){
                await staffStore.addStaff(staff, (response)=>{
                    console.log(response)
                    if(response.status == 201){
                        staff['id']= response.data['id'],
                        loadData(staff);
                        ElMessage({
                            message: `${firstname.value} added successfully to staff member.`,
                            type: 'success',
                        })
                        gender.value = '';
                        department.value = ''; 
                        startDate.value = '';
                        endDate.value = '';
                        establishment.value = '';
                        lastname.value = '';
                        firstname.value = '';
                        showSpinner.value = false;
                    }
                }) 
            }else{
                await staffStore.updateStaff(staff, staff_to_update.value['id'], (response)=>{

                    if(response.status == 200){
                        let data = response.data;
                        data.establishment = response.data.establishment['@id'];
                        updateData(data);
                        ElMessage({
                            message: `Staff updated successfully`,
                            type: 'success',
                        })
                        gender.value = '';
                        department.value = ''; 
                        startDate.value = '';
                        endDate.value = '';
                        establishment.value = '';
                        lastname.value = '';
                        firstname.value = '';
                        showSpinner.value = false;
                        type.value = 'add';
                        staff_to_update.value = null;
                    }
                }) 
            }
        }else{
            ElMessage.error(`Please, provide all needed information to ${type} a staff`);
        }  
    } catch (error) {
        console.log(error);
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

form button{
    width: 8rem !important;
}

button.isLoaded{
    display: flex;
    justify-content: center;
    align-items: center;
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