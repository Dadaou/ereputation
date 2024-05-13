<template>
        <div class="security__header border__bottom my-10">
           <!--  <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Advantage</h4>
                <p>Complete the following information to add an advantage.</p>
            </div> -->
        </div>
        <div class="advantage_container">
          <div class="form-container">
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
                            <!-- <input type="text" id="category" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"> -->
                            <el-select v-model="category" placeholder="Select category" size="large">
                                <el-option
                                v-for="category in categoriesOptions"
                                :key="category.value"
                                :label="category.label"
                                :value="category.value"
                                />
                            </el-select>
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
                       <div class="grid gap-6 mb-6 md:grid-cols-2">
                          <div>
                              <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount <span></span></label>
                              <input type="number" id="amount" v-model="amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                          </div>
                          <!--<div>
                              <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Code
                                <Tooltip text="Use your own discount code recognized by your system"/>
                               </label>
                              <input type="text" id="code" v-model="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                          </div>-->
                          <div>
                            <label for="metric" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Metric <span></span></label>
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
                        <!--<div>
                            <label for="metric" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Metric <span></span></label>
                            <el-select v-model="metric" placeholder="Select metric" size="large">
                                <el-option
                                v-for="metric in metrics"
                                :key="metric"
                                :label="metric"
                                :value="metric"
                                />
                            </el-select>
                        </div>-->
                        <div>
                            <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Code
                            <Tooltip text="Use your own discount code recognized by your system"/>
                            </label>
                            <input type="text" id="code" v-model="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>

                        
                    </div>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                          <div>
                            <label for="validity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity   
                            <Tooltip text="Validity period after coupon creation (in number of days)"/>
                            </label>
                            <input type="number" id="validity" v-model="validity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                          </div>
                           <div>
                            <label for="limit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Limit
                             <Tooltip text="Offer limited to x units"/>
                             </label>
                            <input type="number" id="limit" v-model="advantageLimit" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                        </div>
                        <div>
                            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expired at <span></span></label>
                            <el-date-picker
                                v-model="expiredAt"
                                :size="'large'"
                              />
                        </div>    
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Date from 
                              <Tooltip text="To use before the [date]"/>
                            </label>
                            <el-date-picker
                                v-model="dateFrom"
                                :size="'large'"
                              />
                        </div>      
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Date to
                              <Tooltip text="To use after the [date]"/> 
                            </label>
                            <el-date-picker
                                v-model="dateEnd"
                                :size="'large'"
                              />
                        </div> 
                    </div>
                    <div>
                       <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea 
                      v-model="description"
                      id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here...">
                      </textarea>
                    </div>
                  
                    <div class="flex items-center justify-between py-5 border-t border-b dark:border-gray-600">
                      <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                               <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} advantage</span>
                      </button>
                    </div>
                </form>
              </div>
              <div class="template-container">
                <AdvantageTemplate @select="(advantage)=>selectAdvantage(advantage)"/>
             </div>
        </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch, defineAsyncComponent } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect, ElDatePicker, ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const QrCodeModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/QrCodeModalComponent.vue')
)

const AdvantageTemplate = defineAsyncComponent(() =>
    import('@Components/advantage/AdvantageTemplateComponent.vue')
)

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
)

const scopeOptions = ref([
  { label: 'individual', value: 'individual' },
  { label: 'bill', value: 'bill' },
]);

const categoriesOptions = ref([
  { label: 'Discount', value: 'Discount' },
  { label: 'Gift', value: 'Gift' },
  { label: 'Free', value: 'Free' },
  { label: 'Lottery', value: 'Lottery' },
]);

const userStore = useUserStore();
const showSpinner = ref(false);
/**
 * Event
 */
 const dateFrom = ref(null);
 const dateEnd = ref(null);
 const expiredAt =  ref(null);
 const description = ref(null);
 const category = ref('');
 const advantageName = ref('');
 const establishment = ref("");
 const code = ref('');
 const amount = ref(null);
 const metric = ref('');
 const scope = ref(null);
 const validity = ref(null);
 const advantageLimit = ref(null);

const type = ref('add');
const advantage_to_update = inject('advantage_to_update');
const advantages = inject('advantages');
const activeAdvantageTab = inject('advantage_activeTab');
const metrics = ref(['Percent', 'Amount'])
watch(advantage_to_update, ()=>{
    if(advantage_to_update.value != null){  
        expiredAt.value = new Date(advantage_to_update.value["expired_at"]);
        category.value = advantage_to_update.value["category"];
        code.value = advantage_to_update.value["code"];
        metric.value = advantage_to_update.value["metric"];
        scope.value = advantage_to_update.value["scope"];
        validity.value = advantage_to_update.value["validity"];
        amount.value = advantage_to_update.value["amount"];
        advantageName.value = advantage_to_update.value["name"];
        establishment.value = `/api/establishments/${advantage_to_update.value['establishment_id']},${advantage_to_update.value['establishment_name']}`
        advantageLimit.value = advantage_to_update.value["advantageLimit"];
        type.value = 'edit';
    }
})

const loadData = (_advantage, advantage, establishment) => {
  const new_advantage = {
          id: _advantage.id,
          name: _advantage.name,
          category: _advantage.category,
          code: _advantage.code,     
          amount: _advantage.amount,
          validity: _advantage.validity,
          advantageLimit: _advantage.advantageLimit,
          metric: _advantage.metric,           
          scope: _advantage.scope,                           
          expired_at:_advantage.expiredAt?moment(_advantage.expiredAt).format('YYYY-MM-DD'):null,
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
          advantageLimit: _advantage.advantageLimit,
          metric: _advantage.metric,           
          scope: _advantage.scope,                           
          expired_at: _advantage.expiredAt?moment(_advantage.expiredAt).format('YYYY-MM-DD'):null,
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
      "enable": true,
      "establishment": establishment.value.split(",")[0],
      "scope": scope.value,
      "validity":validity.value,
      "description": description.value,
      "expiredAt": expiredAt.value,
      "advantageLimit": advantageLimit.value,
      "dateFrom": dateFrom.value,
      "dateTo":  dateEnd.value,
    }

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
                    const {id , ...data} = response.data;
                    advantageData.id = id;
                    loadData(advantageData, advantageData, establishment.value.split(","));
                    ElMessage({
                        message: `Advantage added successfully.`,
                        type: 'success',
                    });
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
                    const {id , ...data} = response.data;
                    advantageData.id = id;
                    updateData(advantageData, establishment.value.split(','));
                }
            }

            dateFrom.value = null;
            dateEnd.value = null;
            expiredAt.value =  null;
            description.value = null;
            category.value = '';
            code.value = '';
            advantageName.value = '';
            amount.value = '';
            metric.value = '';
            scope.value = '';
            validity.value = '';
            advantageLimit.value = ''
            establishment.value = "";
            showSpinner.value = false;
            activeAdvantageTab.value = 'advantage_list';
        } else {
            ElMessage.error(`Please, provide all needed information to add/update an advantage`);
            showSpinner.value = false;
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
};

const selectAdvantage = (advantage)=>{
  const capitalize = (str)=> {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  dateFrom.value = advantage.From?new Date(advantage.From):advantage.From;
  dateEnd.value = advantage.To?new Date(advantage.To):advantage.To;
  expiredAt.value =  advantage.Expired_at?new Date(advantage.Expired_at):advantage.Expired_at;
  description.value = advantage.description;
  category.value = capitalize(advantage.Category);
  code.value =  null;
  advantageName.value = advantage.Name;
  amount.value = advantage.Amount;
  metric.value = advantage.Metric;
  scope.value = advantage.Scope;
  validity.value = advantage.Validity;
  advantageLimit.value = advantage.Limit
  const companies = userStore.user.customer.establishments
  establishment.value = companies.length>0?`/api/establishments/${companies[0].id},${companies[0].name}`:"";
};
</script>
<style scoped>
.advantage_container {
 display: flex;
 flex-direction: row; 
 justify-content: space-between;
 width: 100%;
 gap:1rem;
}

.form-container {
 flex: 3; 
}

.template-container {
 flex: 1; 
}

@media (max-width: 850px) {
 .advantage_container {
    flex-direction: column-reverse;
    width: 85% 
  }
}

@media (max-width: 768px) {
 .advantage_container {
    flex-direction: column-reverse; 
  }

  .form-container{
    width: auto;
  }
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