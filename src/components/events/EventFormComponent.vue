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
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category <span>*</span></label>
                            <input type="text" id="last_name" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                            <el-select v-model="establishments" placeholder="Choose establishment" size="large" multiple collapse-tags collapse-tags-tooltip>
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
                            <!-- <VueDatePicker v-model="dateFrom" :enable-time-picker="false" :format="format"/> -->
                             <el-date-picker
                                v-model="dateFrom"
                                :size="'large'"
                              />
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End to <span>*</span></label>
                            <!-- <VueDatePicker v-model="dateTo" :enable-time-picker="false" :format="format"/> -->
                            <el-date-picker
                                v-model="dateTo"
                                :size="'large'"
                              />
                        </div>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                       <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                               <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} event</span>
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
import { useEventStore } from "@Stores/event.js";
import { useCompanyStore } from "@Stores/company.js";
import { useAppStore } from "@Stores/app.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const companiesStore = useCompanyStore();
const eventStore = useEventStore();
const userStore = useUserStore();
const appStore = useAppStore();
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}
const showSpinner = ref(false);
/**
 * Event
 */
 const dateFrom = ref(null);
 const dateTo = ref(null);
 const category = ref('');
 const eventName = ref('');
 const establishments = ref([]);
 const type = ref('add');
 const event_to_update = inject('event_to_update');

watch(event_to_update, ()=>{
    if(event_to_update.value != null){   
        dateFrom.value = new Date(event_to_update.value["datefrom"]);
        dateTo.value = new Date(event_to_update.value["dateto"]);
        category.value = event_to_update.value["category"];
        eventName.value = event_to_update.value["name"];
        establishments.value = event_to_update.value['event_establishment']
        type.value = 'edit';
    }
})
const getEstablishment = (data)=>{
  let result = [];
  console.log(data);
   data.forEach(item=>{
     companiesStore.establishments.forEach((element, index) => {
         if(`/api/establishments/${element.id}` == item){
                     result.push(element);
         }         
    })
   })
 return result;
}
     const loadData = (data)=>{
        companiesStore.establishments.forEach((element, index) => {
                data.establishment.forEach(item=>{
                    if(`/api/establishments/${element.id}` == item){
                      data['establishment'] = getEstablishment(data.establishment)
                      companiesStore.establishments[index].events.push(data);
                    }
                })
        });
    }

const updateData = (event)=>{
   event['establishment'] = getEstablishment(event.establishment);
   companiesStore.establishments.forEach((element, index) => {
           event.establishment.forEach(item =>{
               if(element.id == item.id){
                companiesStore.establishments[index].events = companiesStore.establishments[index].events.filter(item=>item.id !== event.id);
                 companiesStore.establishments[index].events.push(event);
                }
          })

    });
  }

const refreshTable = ()=>{
  let data = [];
    let promises = [];
    appStore.isLoading = true;
    if(userStore.user.customer !== null){
        userStore.user.customer.establishments.forEach((establishment, index)=> {
        let promise = services.get_Record(`/establishment/${establishment.id}/detail`, (response) => {
                data.push(response.data);
            });
            promises.push(promise); 
        })
        Promise.all(promises).then(() => {
            companiesStore.establishments = data;
            appStore.isLoading = false;
            console.log(data);
        });
    }
}

 const submit = async ()=>{
    showSpinner.value = true;
    let event = {
        "name": eventName.value,
        "category": category.value,
        "datefrom": moment(dateFrom.value).format('YYYY-MM-DD'),
        "dateto":  moment(dateTo.value).format('YYYY-MM-DD'),
        "establishment": establishments.value
    }

    try {

        if(dateFrom.value != null && dateTo.value != null && category.value != '' && establishments.value.length >0 && eventName.value != ''){
            if(type.value == 'add'){
                const response = await new Promise((resolve, reject) => {
                  services.createRecord('events', event, (response) => {
                    resolve(response);
                  });
                });

                console.log(response);
                if (response.status === 201) {
                  loadData(response.data);
                  ElMessage({
                    message: `Event added successfully.`,
                    type: 'success',
                  });
                  dateFrom.value = '';
                  dateTo.value = '';
                  category.value = '';
                  establishments.value = [];
                  eventName.value = '';
                  showSpinner.value = false;
                }
            }else{
                const response = await new Promise((resolve, reject) => {
                  services.putRecord('events', event_to_update.value['id'], event, (response) => {
                    resolve(response);
                  });
                });

                if (response.status == 200) {
                  updateData(response.data);
                  // refreshTable();
                  console.log(response.data)
                  ElMessage({
                    message: `Event updated successfully.`,
                    type: 'success',
                  });
                  dateFrom.value = '';
                  dateTo.value = '';
                  category.value = '';
                  establishments.value = [];
                  eventName.value = '';
                  showSpinner.value = false;
                  type.value= 'add'
                }
            }
        }else{
            ElMessage.error(`Please, provide all needed information to ${type} an event`);
            showSpinner.value = false;
        }  
    } catch (error) {
        console.log(error);
    }
};
</script>
<style scoped>
form{
    height: 800px !important;
}

form button{
    width: 8rem !important;
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