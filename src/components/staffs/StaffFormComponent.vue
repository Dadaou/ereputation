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
                    <el-select v-model="establishment" placeholder="Choose establishment" size="large" filterable>
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name" :value="`/api/establishments/${item.id}`"/>
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start working at <span>*</span></label>
                    <el-date-picker
                    v-model="startDate"
                    :size="'large'"
                    />
                </div>
                <div>
                    <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to</label>
                   <el-date-picker
                    v-model="endDate"
                    :size="'large'"
                    />
                </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                 <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                               <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} staff</span>
                 </button>
            </div>
        </form>
    </div>                               
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const userStore = useUserStore();
const staffs = inject('staffs');
const activeStaffTab = inject('staff_activeTab');

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

const loadData = (_staff, staff)=>{
    console.log(staff)
    let new_staff = {
        id: _staff.id,
        datefrom : _staff.datefrom,
        dateto: _staff.dateto,
        department: _staff.department,
        establishment_name: _staff.establishment.name,
        establishment: _staff.establishment['@id'],
        establishment_id: _staff.establishment.id,
        establishment_tag: _staff.establishment.competitor_tag,
        tag: _staff.tag,
        gender: _staff.gender,
        firstname: _staff.firstname,
        lastname: _staff.lastname,
    }
    staffs.value.push(new_staff);
}

const updateData = (_staff)=>{

    let new_staff = {
        id: _staff.id,
        datefrom : _staff.datefrom,
        dateto: _staff.dateto,
        department: _staff.department,
        establishment_name: _staff.establishment.name,
        establishment: _staff.establishment['@id'],
        establishment_id: _staff.establishment.id,
        establishment_tag: _staff.establishment.competitor_tag,
        tag: _staff.tag,
        gender: _staff.gender,
        firstname: _staff.firstname,
        lastname: _staff.lastname,
    }

     staffs.value.forEach((staff, index)=>{
        if(staff.id == new_staff.id) staffs.value[index] = new_staff;
     })
}

const submit = async ()=>{
    let staff = {
        "gender": gender.value,
        "firstname": firstname.value,
        "lastname": lastname.value,
        "department": department.value,
        "datefrom": moment(startDate.value).format('YYYY-MM-DD'),
        "dateto": (endDate.value==null ||endDate.value == "")?null:moment(endDate.value).format('YYYY-MM-DD'),
        "establishment": establishment.value,
    }

    console.log(staff);
    try {
        if(gender.value != '' && department.value != '' && startDate.value != null && establishment.value != '' && firstname.value != ''){
             showSpinner.value = true;
            if(type.value == 'add'){
                const response = await new Promise((resolve) => {
                  services.createRecord('staff', staff, (response) => {
                    resolve(response);
                  });
                });

                 if(response.status == 201){
                        loadData(response.data, staff);
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
            }else{
                 const response = await new Promise((resolve) => {
                  services.putRecord('staff', staff_to_update.value['id'], staff, (response) => {
                    resolve(response);
                  });
                });

                 console.log(response)
                if(response.status == 200){
                        let data = response.data;
                        console.log(data);
                        updateData(data);
                        ElMessage({
                            message: `Staff updated successfully`,
                            type: 'success',
                        })
                        activeStaffTab.value= 'staff_list';
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
            }
        }else{
            ElMessage.error(`Please, provide all needed information to ${type.value} a staff`);
        }  
    } catch (error) {
        console.log(error);
    }
};
</script>
<style scoped>
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