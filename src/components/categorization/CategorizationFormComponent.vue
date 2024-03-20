<template>
	<div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category <span>*</span></label>
                    <input type="text" id="category" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" placeholder="category">
                </div>
                 <div>
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                    <el-select v-model="establishment" placeholder="Choose establishment" size="large" filterable>
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name" :value="`/api/establishments/${item.id}`"/>
                    </el-select>
                </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                 <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                <SpinnerComponent :show-spinner="showSpinner" :color="'gray'"/> <span v-if="showSpinner">Loading ...</span>
                               <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} category</span>
                 </button>
            </div>
        </form>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch } from 'vue'
import services from '@Services/services.js'
import { useUserStore } from "@Stores/user.js"
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const userStore = useUserStore();
const type = ref('add');
const category = ref('');
const establishment = ref('');
const showSpinner = ref(false);

const submit = ()=>{
	let data = {
	  "category": category.value,
	  "establishment": establishment.value
	}

	try{
		if(data.category !== '' && data.establishment !== ''){
			console.log(data)
		}else{
			 ElMessage.error(`Please, fill the form correctly!`);
		}
	}catch(error){
		console.log(error);
	}
};

</script>
<style scoped>
	
</style>