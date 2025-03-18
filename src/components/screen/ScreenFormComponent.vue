<template>
  <div class="security__header border__bottom my-10">
    <!--  <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Event</h4>
                <p>Complete the following information to add an screen to an establishment.</p>
            </div> -->
  </div>
  <div>
    <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">

      <div class="grid gap-6 mb-6 md:grid-cols-2">

        <div>
          <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Screen name
            <span>*</span></label>
          <input type="text" id="first_name" v-model="screenName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
        </div>

        <div>
            <label for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Screen Template
                <span>*</span></label>
            <el-select v-model="screenTemplate" placeholder="Choose screen template" size="large" filterable>
                <el-option v-for="item in screenTemplates" :key="item.id"
                    :label="item.name" :value="`/api/screentemplates/${item.id}`" />
            </el-select>
        </div>

      </div>

      <div class="grid gap-6 mb-6 md:grid-cols-2">

        <div>
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
            <span>*</span></label>
          <el-select v-model="establishment" placeholder="Choose establishment" size="large" filterable>
            <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
              :value="`/api/establishments/${item.id}`" />
          </el-select>
        </div>
 
      </div>

      <div class="flex items-center justify-between py-2 border-t border-b dark:border-gray-600">
        <button type="submit"
          class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading ...</span>
          <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} screen</span>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>

import { ref, inject, watch, onBeforeMount, defineEmits } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import { useRouter, useRoute } from 'vue-router';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const showSpinner = ref(false);
const screenName = ref('');
const establishment = ref('');
const screenTemplate = ref('');
const screenTemplates = ref([]);
const type = ref('add');
const screen_to_update = inject('screen_to_update');
const screens = inject('screens');
const advantages = inject('advantages');
const cleanScreenForm = inject('cleanScreenForm');
const emit = defineEmits(['show-screen-list']);

watch([screen_to_update,cleanScreenForm], () => {
  if (screen_to_update.value != null) {
    screenName.value = screen_to_update.value["name"];
    establishment.value = screen_to_update.value['establishment'];
    screenTemplate.value = screen_to_update.value['screentemplate'];
    type.value = 'edit';
   
  }

  if (cleanScreenForm.value != 0) {
    resetForm();
   
  }
    
})



const loadData = (_screen) => {
  const new_screen = {
    id: _screen.id,
    name: _screen.name,
    establishment: _screen.establishment,
    screentemplate: _screen.screentemplate,
    advantage_names:_screen.advantage_names,
    advantages:_screen.advantages,
    establishment_name: _screen.establishment_name,
    screentemplate_name: _screen.screentemplate_name,
    screentemplate_id: _screen.screentemplate_id,
    establishment_id: _screen.establishment_id,
    establishment_tag: _screen.tag

  }

  screens.value.push(new_screen);
}

const updateData = (_screen) => {
  const new_screen = {
    id: _screen.id,
    name: _screen.name,
    establishment: _screen.establishment,
    screentemplate: _screen.screentemplate,
    advantage_names:_screen.advantage_names,
    advantages:_screen.advantages,
    establishment_name: _screen.establishment_name,
    screentemplate_name: _screen.screentemplate_name,
    screentemplate_id: _screen.screentemplate_id,
    establishment_id: _screen.establishment_id
  }

  screens.value.forEach((event, index) => {
    if (event.id == new_screen.id) screens.value[index] = new_screen;
  })
}

const resetForm = ()=>{
  establishment.value = '';
  screenName.value = '';
  screenTemplate.value = '';
}

const getAdvantageNames=(value)=>{
  if (screens.value.length > 0) {
        let name='';
        let sc_advantages=[];
     
      value.advantageScreens.forEach((adv)=>{
            let check_ids = [];
           screens.value.forEach(sc =>{

             sc.advantages.forEach(item=>{

               const match = adv.match(/\/(\d+)$/);

                if (match) {

                  const number = match[1];

                   if (item.id == number && !check_ids.includes(item.id)) {

                      if (name != '') {
                        name=name + ',' + item.name;
                      } else {
                        name=item.name
                      }

                      var oneAdvantage={};
                      oneAdvantage.adv_id = item.adv_id;
                      oneAdvantage.adv_name = item.adv_name;

                      sc_advantages.push(oneAdvantage);
                    
                   }
                   check_ids.push(item.id)
                }

             })
         
        });

      })
 
      return [name,sc_advantages];
  }
}

const getEstablishmentName=(value)=>{
  if (userStore.user.customer.establishments.length > 0) {
        let name='';
        let etab_id=null;
      userStore.user.customer.establishments.forEach(item =>{

        const match = value.establishment.match(/\/(\d+)$/);

        if (match) {
          const number = match[1];
           if (item.id == number ) {
            name=item.name;
            etab_id=number;
           }
        }
       
      });

      return [name,etab_id];
  }
}

const getScreenTemplateName = (value)=>{
  if (screenTemplates.value.length > 0) {
        let name='';
        let temp_id = null;
      screenTemplates.value.forEach(item =>{

        const match = value.screentemplate.match(/\/(\d+)$/);

        if (match) {
          const number = match[1];
           if (item.id == number ) {
            name=item.name;
            temp_id=number;
           }
        }
       
      });

      return [name,temp_id];
  }
}

const submit = async () => {
  let screen = {
    "name": screenName.value,
    "establishment": establishment.value,
    "screentemplate": screenTemplate.value
  }

  try {

    if ( establishment.value != '' && screenName.value != '' && screenTemplate.value != '') {

      showSpinner.value = true;

      if (type.value == 'add') {

        const response = await new Promise((resolve) => {
          services.createRecord('screens', screen, (response) => {
            resolve(response);
            
          });
        });

        if (response.status === 201) {
          response.data.advantage_names=getAdvantageNames(response.data)[0];
          response.data.advantages=getAdvantageNames(response.data)[1];
          response.data.establishment_name=getEstablishmentName(response.data)[0];
          response.data.screentemplate_name=getScreenTemplateName(response.data)[0];
          response.data.establishment_id=getEstablishmentName(response.data)[1];
          response.data.screentemplate_id=getScreenTemplateName(response.data)[1];
          console.log(response.data)
          loadData(response.data);
          ElMessage({
            message: `Screen added successfully.`,
            type: 'success',
          });
        }

      } else {

        const response = await new Promise((resolve) => {
          services.patchRecord('screens', screen_to_update.value['id'], screen, (response) => {
            resolve(response);
          });
        });

        if (response.status == 200) {
     
        
          response.data.advantage_names=getAdvantageNames(response.data)[0];
          response.data.advantages=getAdvantageNames(response.data)[1];
          response.data.establishment_name=getEstablishmentName(response.data)[0];
          response.data.screentemplate_name=getScreenTemplateName(response.data)[0];
          response.data.establishment_id=getEstablishmentName(response.data)[1];
          response.data.screentemplate_id=getScreenTemplateName(response.data)[1];
          
          updateData(response.data);
          ElMessage({
            message: `Screen updated successfully.`,
            type: 'success',
          });
          type.value = 'add'
        }
      }
      resetForm()
      cleanScreenForm.value = true;
      router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'screens_list'} });
      showSpinner.value = false;
    } else {
      ElMessage.error(`Please, provide all needed information to ${type.value} an event`);
      showSpinner.value = false;
    }
  } catch (error) {
    console.log(error);
  }

  finally {
    emit('show-screen-list', {
        elTabPaneName: 'screens_list'
    });
  }
};

const loadScreenTemplates = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/screentemplates`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            screenTemplates.value = response.data['hydra:member'];
           
        } else {
            console.error('Error fetching data:', response);
        }
    } catch (error) {
        console.error(error);
    }
}


onBeforeMount(() => {
  if (userStore.user?.customer?.establishments?.length > 0) {
    establishment.value = [`/api/establishments/${userStore.user.customer.establishments[0].id}`];
  }
  loadScreenTemplates();
  
  
});

</script>
<style scoped>
form {
  height: 800px !important;
}

form button {
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



.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}


@media screen and (max-width: 800px) {

    form {
        margin-left: 0;
        padding-right: 35px;
    }
}
</style>