<template>
  <ModalComponent :showModal="showModal" @close="close">
    <template #content>
      <div class="modal__header">
        <div class="modal__title">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            <i class="uil uil-presentation"></i> Advantage Screen
          </h3>
        </div>
        <div class="modal__close">
          <i class="uil uil-times-circle" @click="close"></i>
        </div>
      </div>

    
    <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">

      <div class="grid gap-6 mb-6 md:grid-cols-3 lg:grid-cols-3">

 
        <div>
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Advantages
            <span>*</span></label>
          <el-select v-model="advantage" placeholder="Choose advantage" size="large" multiple collapse-tags
            collapse-tags-tooltip>
            <el-option v-for="item in props.advantages" :key="item.id" :label="item.name"
              :value="`/api/advantages/${item.id}`" />
          </el-select>
        </div>

        

<!--         <div>
          <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
            <span>*</span></label>
          <input type="text" id="first_name" v-model="category"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
        </div> -->


      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-4 lg:grid-cols-4">


          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Date from
                <!-- <span>*</span> -->
                <!-- <Tooltip text="To use before the [date]" /> -->
            </label>
            <el-date-picker v-model="date_from" :size="'large'" />
          </div>

          <div>
              <label for="hour_from"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour From
                  <span></span></label>
              <input type="number" id="hour_from" v-model="hour_from"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
          </div>

           
            <div>
                  <label for="minute_from"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Minute From
                      <span></span></label>
                  <input type="number" id="minute_from" v-model="minute_from"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
            </div>

            <div>
                  <label for="seconde_from"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seconde From
                      <span></span></label>
                  <input type="number" id="seconde_from" v-model="seconde_from"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
            </div>
            

 
      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-4 lg:grid-cols-4">


         

           <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date To
                    <!-- <span>*</span> -->
                    <!-- <Tooltip text="To use before the [date]" /> -->
                </label>
                <el-date-picker v-model="date_to" :size="'large'" />
            </div>

              <div>
                  <label for="hour_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hour To
                      <span></span></label>
                  <input type="number" id="hour_to" v-model="hour_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>

              <div>
                  <label for="minute_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Minute To
                      <span></span></label>
                  <input type="number" id="minute_to" v-model="minute_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>

              <div>
                  <label for="seconde_to"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seconde To
                      <span></span></label>
                  <input type="number" id="seconde_to" v-model="seconde_to"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
              </div>


 
      </div>



          <div class="grid gap-6 mb-6 md:grid-cols-7 sm:grid-cols-3 justify-center">


              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d1}" 
                  size="small" 
                  @click="advantage_screen.d1 ? handleDisable('d1', advantage_screen) : handleEnable('d1', advantage_screen)">
                   <i 
                    :class="advantage_screen.d1 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Monday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d2}" 
                  size="small" 
                  @click="advantage_screen.d2 ? handleDisable('d2', advantage_screen) : handleEnable('d2', advantage_screen)">
                   <i 
                    :class="advantage_screen.d2 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Tuesday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d3}" 
                  size="small" 
                  @click="advantage_screen.d3 ? handleDisable('d3', advantage_screen) : handleEnable('d3', advantage_screen)">
                   <i 
                    :class="advantage_screen.d3 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Wednesday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d4}" 
                  size="small" 
                  @click="advantage_screen.d4 ? handleDisable('d4', advantage_screen) : handleEnable('d4', advantage_screen)">
                   <i 
                    :class="advantage_screen.d4 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Thursday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d5}" 
                  size="small" 
                  @click="advantage_screen.d5 ? handleDisable('d5', advantage_screen) : handleEnable('d5', advantage_screen)">
                   <i 
                    :class="advantage_screen.d5 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Friday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d6}" 
                  size="small" 
                  @click="advantage_screen.d6 ? handleDisable('d6', advantage_screen) : handleEnable('d6', advantage_screen)">
                   <i 
                    :class="advantage_screen.d6 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Saturday
                </el-button>
              </div>

              <div>
               <el-button 
                  :class="{'enabled-button': advantage_screen.d0}" 
                  size="small" 
                  @click="advantage_screen.d0 ? handleDisable('d0', advantage_screen) : handleEnable('d0', advantage_screen)">
                   <i 
                    :class="advantage_screen.d0 ? 'uil uil-check-square' : 'uil uil-square'" 
                    >
                   </i> Sunday
                </el-button>
              </div>
 
          </div>

      <div class="flex items-center justify-start py-2 gap-4 border-t border-b dark:border-gray-600">

         <el-popconfirm v-if="type == 'edit' || type == 'delete'" title="Are you sure to delete this?" @confirm="handleDelete(advantage_screen_selected)">
          <template #reference>
              <button v-if="type == 'edit' || type == 'delete'" @click.prevent="type = 'delete'"
              class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800">
              <SpinnerComponent :show-spinner="showSpinner_delete" :color="'gray'" /> <span v-if="showSpinner_delete">Loading ...</span>
              <span v-show="!showSpinner_delete"><i class="uil uil-save"></i> delete advantage</span>
            </button>
          </template>
        </el-popconfirm>
       
        <button type="submit"
          class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading ...</span>
          <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} advantage</span>
        </button>
      </div>
    </form>

    </template>
  </ModalComponent>
</template>
<script setup>
import { computed, ref, inject,defineAsyncComponent,onMounted } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElOption, ElSelect,ElDatePicker, ElTooltip,ElButton,ElPopconfirm } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';

// const Tooltip = defineAsyncComponent(() =>
//     import('@Components/utils/QuestionMarkTooltipComponent.vue')
// )


const date_from = inject('date_from');
const date_to = inject('date_to');
const category = inject('category');
const advantage_screen = inject('advantage_screen');

const hour_from = inject('hour_from');
const minute_from = inject('minute_from');
const seconde_from = inject('seconde_from');
const hour_to = inject('hour_to');
const minute_to = inject('minute_to');
const seconde_to = inject('seconde_to');
const showSpinner = ref(false);
const showSpinner_delete = ref(false);

const props = defineProps({
  screen: {
    type: Object,
    default: null
  },
  advantages: {
    default: []
  },
  showModal: {
    type: Boolean,
    default: false
  }
});


const type = inject('type');

const advantage = inject('advantage');
const advantage_screen_selected = inject('advantage_screen_selected')

const advantage_screens = ref({
  name: '',
  advantages:[]
});

const screens = inject('screens');
const emits = defineEmits(['close'])
const router = useRouter();

const route = useRoute();
const close = () => {
  emits('close')
  
  resetForm(advantage_screen)
  
}

const handleEnable = (days,adv_screen)=>{
 
  adv_screen[days]=true;

}

const handleDisable = (days,adv_screen)=>{
 
  adv_screen[days]=false;

}


const { width } = useWindowSize()
const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 19;
  return gap + 45;
});

const show = computed(() => props.showModal);

const resetForm = (dvantage_screen)=>{
  date_from.value = '';
  date_to.value = '';
  category.value = '';
  advantage.value = [];
  dvantage_screen.value.d0 = false;
  dvantage_screen.value.d1 = false;
  dvantage_screen.value.d2 = false;
  dvantage_screen.value.d3 = false;
  dvantage_screen.value.d4 = false;
  dvantage_screen.value.d5 = false;
  dvantage_screen.value.d6 = false;
  hour_from.value = null;
  hour_to.value = null;
  minute_from.value = null;
  minute_to.value = null;
  seconde_from.value = null;
  seconde_to.value = null;
}

const updateData = () => {

  

  screens.value.forEach((event, index) => {
    if (event.id == props.screen.id){
      screens.value[index].advantage_names = advantage_screens.value.name;
      screens.value[index].advantages = advantage_screens.value.advantages;
     
    }
  })

}

const getAdvantageNames=(value,_adv_screen_value)=>{
  if (props.advantages.length > 0) {
    
      advantage_screens.value.name = props.screen.advantage_names;
       advantage_screens.value.advantages = props.screen.advantages;
    
      props.advantages.forEach((adv)=>{
       
               const match = value.advantage.match(/\/(\d+)$/);

                if (match) {

                  const number = match[1];

                     if (adv.id == number) {

                        if (advantage_screens.value.name != '') {
                          advantage_screens.value.name=advantage_screens.value.name + ',' + adv.name;
                        } else {
                          advantage_screens.value.name=adv.name
                        }

                        var oneAdvantage={
                          'adv_id': number,
                          'adv_name': adv.name,
                          'category': _adv_screen_value.category,
                          'd0': _adv_screen_value.d0,
                          'd1': _adv_screen_value.d1,
                          'd2': _adv_screen_value.d2,
                          'd3': _adv_screen_value.d3,
                          'd4': _adv_screen_value.d4,
                          'd5': _adv_screen_value.d5,
                          'd6': _adv_screen_value.d6,
                          'date_from': _adv_screen_value.dateFrom,
                          'date_to': _adv_screen_value.dateTo,
                          'hour_from': _adv_screen_value.hourFrom,
                          'hour_to': _adv_screen_value.hourTo,
                          'id': value.id,
                          'minute_from': _adv_screen_value.minuteFrom,
                          'minute_to': _adv_screen_value.minuteTo,
                          'seconde_from': _adv_screen_value.secondeFrom,
                          'seconde_to': _adv_screen_value.secondeTo,
                        };

                        if (type.value == 'add') {
                           advantage_screens.value.advantages.push(oneAdvantage);
                            console.log('add')
                        } else {

                            if (type.value == 'edit') {
                                let advs = advantage_screens.value.advantages.filter((data)=>data.adv_id != number);
                                advs.push(oneAdvantage);
                                advantage_screens.value.advantages = advs;
                                 console.log('edit')
                            } else {
                                console.log('sup')
                                let advs = advantage_screens.value.advantages.filter((data)=>data.adv_id != number);
                                console.log(advs)
                                advantage_screens.value.advantages = advs;
                            }

                        }
                      
                     }
                 }

      })
     
  }
}



const handleDelete = async (adv_screen) => {

    showSpinner_delete.value = true;

    const response = await new Promise((resolve) => {
          services.deleteRecord('advantage_screens',adv_screen.advantage_screen, (response) => {
            resolve(response);
            
          });
        });

      if (response.status == 204) {
      
        getAdvantageNames({'advantage':'/api/advantages/'+adv_screen.id},adv_screen);
        if (advantage_screens.value) {updateData()}
        resetForm(advantage_screen);
        ElMessage({
          message: `Advantage Screen removed successfully.`,
          type: 'success',
        });
        showSpinner_delete.value = false;
        close();
      }

}


const submit = async () => {
  
  


  try {

    // if ( date_from.value != '' && date_to.value != '' && props.screen.value != ''
    //   && advantage.value != '' && hour_from.value && hour_to.value) {
    if (props.screen.value != '' && advantage.value != '') {

      showSpinner.value = true;

      if (type.value == 'add') {

        for (var i = 0; i < advantage.value.length; i++) {

            let _advantage_screen = {
              "dateFrom": date_from.value,
              "dateTo": date_to.value,
              "category": category.value,
              "screen": `/api/screens/${props.screen.id}`,
              "advantage": advantage.value[i],
              "d0": advantage_screen.value.d0,
              "d1": advantage_screen.value.d1,
              "d2": advantage_screen.value.d2,
              "d3": advantage_screen.value.d3,
              "d4": advantage_screen.value.d4,
              "d5": advantage_screen.value.d5,
              "d6": advantage_screen.value.d6,
              "hourFrom": hour_from.value != '' ? parseInt(hour_from.value) : null,
              "hourTo": hour_to.value != '' ? parseInt(hour_to.value) : null,
              "minuteFrom": minute_from.value != '' ? parseInt(minute_from.value) : null,
              "minuteTo": minute_to.value != '' ? parseInt(minute_to.value) : null,
              "secondeFrom": seconde_from.value != '' ? parseInt(seconde_from.value) :null,
              "secondeTo": seconde_to.value != '' ? parseInt(seconde_to.value)  : null
              }
                

                const response = await new Promise((resolve) => {
                  services.createRecord('advantage_screens', _advantage_screen, (response) => {
                    resolve(response);
                    
                  });
                });

                   if (response.status === 201 ) {
                   
                     // console.log(response.data)
                     getAdvantageNames(response.data,_advantage_screen);
                   
                  
                    }

                    if (response.status === 201 && i == advantage.value.length - 1) {
                      if (advantage_screens.value) {updateData()}
                      resetForm(advantage_screen)
              
                      ElMessage({
                        message: `Advantages added successfully.`,
                        type: 'success',
                      });
                    }
          
        }
    


      } else {


        for (var i = 0; i < advantage.value.length; i++) {
             let _advantage_screen_value = {
              "dateFrom": date_from.value,
              "dateTo": date_to.value,
              "advantage": advantage.value[i],
              "d0": advantage_screen.value.d0,
              "d1": advantage_screen.value.d1,
              "d2": advantage_screen.value.d2,
              "d3": advantage_screen.value.d3,
              "d4": advantage_screen.value.d4,
              "d5": advantage_screen.value.d5,
              "d6": advantage_screen.value.d6,
              "hourFrom": hour_from.value != '' ? parseInt(hour_from.value) : null,
              "hourTo": hour_to.value != '' ? parseInt(hour_to.value) : null,
              "minuteFrom": minute_from.value != '' ? parseInt(minute_from.value) : null,
              "minuteTo": minute_to.value != '' ? parseInt(minute_to.value) : null,
              "secondeFrom": seconde_from.value != '' ? parseInt(seconde_from.value) :null,
              "secondeTo": seconde_to.value != '' ? parseInt(seconde_to.value)  : null
              }

        const response = await new Promise((resolve) => {
          services.patchRecord('advantage_screens', advantage_screen_selected.value.advantage_screen, _advantage_screen_value, (response) => {
            resolve(response);
          });
        });

          if (response.status === 200 ) {
                   
           getAdvantageNames(response.data,_advantage_screen_value);
         
        
          }

        if (response.status == 200 && i == advantage.value.length - 1) {
           if (advantage_screens.value) {updateData()}
          resetForm(advantage_screen)
          ElMessage({
            message: `Advantage Screen updated successfully.`,
            type: 'success',
          });
          type.value = 'add'
          close();
        }
      }


      }
     
      showSpinner.value = false;
    } else {
      ElMessage.error(`Please, provide all needed information to ${type.value} an advantage`);
      showSpinner.value = false;
    }


  } catch (error) {
    console.log(error);
  }


};



</script>
<style scoped>
input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}
 .enabled-button {
    color: #74d474;
  
  }

.modal__header {
  display: flex;
  justify-content: space-between;
}

.modal__header div {
  align-self: center;
}

.modal__close i {
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}



.modal__close i:hover {
  transform: rotate(360deg);
}

</style>
