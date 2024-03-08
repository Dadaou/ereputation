<template>
<div class="security__header border__bottom my-10">
            <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Advantage</h4>
                <p>Complete the following information to add an advantage.</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">
                  
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span></span></label>
                            <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                                <el-option
                                v-for="item in userStore.user.customer.establishments"
                                :key="item.id"
                                :label="item.name"
                                :value="`/api/establishments/${item.id},${item.name}`"
                                />
                            </el-select>
                        </div>
                        <div>
                            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category <span></span></label>
                            <input type="text" id="category" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                    
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="scope" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scope <span></span></label>
                            <el-select v-model="scope" placeholder="Select scope" size="large">
                                <el-option
                                v-for="scope in scopeOptions"
                                :key="scope.value"
                                :label="scope.label"
                                :value="scope.value"
                                />
                            </el-select>
                        </div>
                        <div>
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name <span></span></label>
                            <input type="text" id="name" v-model="advantageName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                        
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount <span></span></label>
                            <input type="number" id="amount" v-model="amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                        <div>
                            <label for="metric" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Metric <span></span></label>
                            <!-- <input type="text" id="metric" v-model="metric" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"> -->
                            <el-select v-model="metric" placeholder="Select metric" size="large">
                                <el-option
                                v-for="metric in metrics"
                                :key="metric"
                                :label="metric"
                                :value="metric"
                                />
                            </el-select>
                        </div>
                        
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                       
                        <div>
                            <label for="validity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity 
                              <i class="uil uil-question-circle"
                                  style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                                  @mouseover="(e) => (buttonRef = e.currentTarget)" @click="visible = !visible">
                              </i>
                              <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
                                popper-class="singleton-tooltip" placement="top">
                                <template #content>
                                    <span>Validity period after coupon creation (in number of days) </span>
                                </template>
                            </el-tooltip></label>
                            <input type="number" id="validity" v-model="validity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expired at <span></span></label>
                            <el-date-picker
                                v-model="dateTo"
                                id="dateTo"
                                :size="'large'"
                              />
                        </div>      
                    </div>
                  
                    <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                       <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                               <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} advantage</span>
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
import { ElMessage, ElOption, ElSelect, ElDatePicker, ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const scopeOptions = ref([
  { label: 'individual', value: 'individual' },
  { label: 'bill', value: 'bill' },
]);

const userStore = useUserStore();
const showSpinner = ref(false);
/**
 * Event
 */
 const dateTo = ref(null);
 const category = ref('');
 const advantageName = ref('');
 const establishment = ref("");
 const code = ref('');
 const amount = ref(null);
 const metric = ref('');
 const scope = ref(null);
 const validity = ref(null);

const buttonRef = ref()
const tooltipRef = ref()
const visible = ref(false)

const type = ref('add');
const advantage_to_update = inject('advantage_to_update');
const advantages = inject('advantages');
const activeAdvantageTab = inject('advantage_activeTab');
const metrics = ref(['Percent', 'Amount'])
watch(advantage_to_update, ()=>{
    if(advantage_to_update.value != null){  
    console.log(advantage_to_update.value) 
        dateTo.value = new Date(advantage_to_update.value["expired_at"]);
        category.value = advantage_to_update.value["category"];
        code.value = advantage_to_update.value["code"];
        metric.value = advantage_to_update.value["metric"];
        scope.value = advantage_to_update.value["scope"];
        validity.value = advantage_to_update.value["validity"];
        amount.value = advantage_to_update.value["amount"];
        advantageName.value = advantage_to_update.value["name"];
        establishment.value = `/api/establishments/${advantage_to_update.value['establishment_id']},${advantage_to_update.value['establishment_name']}`
        type.value = 'edit';
    }
})

const loadData = (_advantage, advantage, establishment) => {
  console.log(_advantage)
  const new_advantage = {
          id: _advantage.id,
          name: _advantage.name,
          category: _advantage.category,
          code: _advantage.code,     
          amount: _advantage.amount,
          validity: _advantage.validity,
          metric: _advantage.metric,           
          scope: _advantage.scope,                           
          expired_at: moment(_advantage.expiredAt).format('YYYY-MM-DD'),
          establishment_name : establishment[1],
          establishment_id : establishment[0].split('/')[3],
          enable: true
  }
  advantages.value.push(new_advantage);
  activeAdvantageTab.value = 'advantage_list'
}

const updateData = (_advantage, establishment)=>{
     const new_advantage = {
          id: _advantage.id,
          name: _advantage.name,
          category: _advantage.category,
          code: _advantage.code,     
          amount: _advantage.amount,
          validity: _advantage.validity,
          metric: _advantage.metric,           
          scope: _advantage.scope,                           
          expired_at: moment(_advantage.expiredAt).format('YYYY-MM-DD'),
          establishment_name : establishment[1],
          establishment_id: establishment[0].split('/')[3],
          enable: true 
      }

      console.log(new_advantage);
      advantages.value.forEach((advantage, index)=>{
        if(advantage.id == new_advantage.id) advantages.value[index] = new_advantage;
     })
  }

  const submit = async () => {
    const advantageData = {
        "category": category.value,
        "code": code.value,
        "name": advantageName.value,
        "amount": parseFloat(amount.value),
        "metric": metric.value,
        "scope": scope.value,
        "validity": validity.value,
        "enable": true,
        "establishment": establishment.value.split(",")[0],
        "expiredAt": dateTo.value
    };

    try {
        if (category.value.length > 0) {
            showSpinner.value = true;

            if (type.value === 'add') {
                const response = await new Promise((resolve) => {
                    services.createRecord('advantages', advantageData, (response) => {
                        resolve(response);
                        console.log(response)
                    });
                });
                console.log(response)

                if (response.status === 201) {
                    loadData(response.data, advantageData, establishment.value.split(","));
                    ElMessage({
                        message: `Advantage added successfully.`,
                        type: 'success',
                    });
                    category.value = '';
                    code.value = '';
                    advantageName.value = '';
                    amount.value = '';
                    metric.value = '';
                    scope.value = '';
                    validity.value = '';
                    establishment.value = "";
                    dateTo.value = '';
                    showSpinner.value = false;

                }
            } else if (type.value === 'edit' && advantage_to_update.value !== null) {
                const advantageId = advantage_to_update.value.id;
                const response = await new Promise((resolve) => {
                    services.putRecord('advantages', advantageId, advantageData, (response) => {
                        resolve(response);
                    });
                });
                console.log(response)
                
                if (response.status === 200) {
                    ElMessage({
                        message: `Advantage updated successfully.`,
                        type: 'success',
                    });
                    updateData(response.data, establishment.value.split(','));
                    category.value = '';
                    code.value = '';
                    advantageName.value = '';
                    amount.value = '';
                    metric.value = '';
                    scope.value = '';
                    validity.value = '';
                    establishment.value = "";
                    dateTo.value = '';
                    activeAdvantageTab.value = 'advantage_list';
                    showSpinner.value = false;
                }
            }
        } else {
            ElMessage.error(`Please, provide all needed information to add/update an advantage`);
            showSpinner.value = false;
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
};

</script>
<style scoped>
form{
    height: 800px !important;
}

form button{
    width: 9rem !important;
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