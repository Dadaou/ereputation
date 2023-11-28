<template>
	<ModalComponent 
	:showModal="show" 
	@close="show=false" 
	:height="40" 
	:width="40">
        <template #content>
            <div class="modal__close">
                            <i class="uil uil-times-circle mb-8"  @click="close"></i>
            </div>
            <div class="modal__header">
                <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Export data</h3>
            </div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="login__form">
                <input 
                	name="filename" 
                	placeholder="filename" 
                	v-model="form.filename"
                	required
                >
				<select 
				class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				v-model="form.type"
				required 
				>
					  <option selected>Export data into</option>
					  <option value="csv">csv file</option>
					  <option value="xlsx">xlsx file</option>
				</select>
				<div v-if="is_downloaded" class="downloaded">{{text}} downloaded</div>
				<button sybmit class="btn" v-if="is_downloaded == false">
			        <i class="uil uil-file-download"></i>
			        Export
			    </button>
			    <button v-else class="btn" @click="close">
			        Close
			    </button>
            </form>            
        </template>
    </ModalComponent>
</template>
<script setup>
import {ref, computed} from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';

const props = defineProps({
	showModal:{
		type: Boolean,
		required: true
	},
	downloaded:{
		type: Boolean,
		required: true
	}
})
const emits = defineEmits(['submit', 'open', 'close']);
const show = computed(()=> props.showModal);
const is_downloaded = computed(()=>props.downloaded)
const form = ref({
	filename: '',
	type: 'csv'
})
const text = ref('')
const submit = ()=>{
	emits('submit', form.value)
	text.value = `${form.value.filename}.${form.value.type}`
	form.value = {
		filename: '',
		type: 'csv'
	}
};

const options = [
	{
		label: 'Export as csv file',
		value: 'csv'
	},
	{
		label: 'Export as xlsx file',
		value: 'xlsx'
	},
];

const close = ()=>{
	emits('close');
	text.value = '';
};

</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

input {
    caret-color: var(--light-color-bg2);
}

.modal__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal__close i{
   position: relative;
   top: -20px; 
   right: -5px;
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.modal__close i:hover{
    transform: rotate(360deg);
}

.modal__container{
    margin: 30px auto;
}

.login__form input{
    width: 100%;
    height: 30px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
}

.login__form button{
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--color-primary);
    color: white;
    padding: 3px 10px;
    width: 100%;
    border-radius: 5px;
    margin: 10px auto;
    font-size: 14px;
    font-weight: 500;
}

.login__form button:hover{
    transform: scale(0.95);
}

.downloaded{
	border: 1px solid grey;
	border-radius: 5px;
	margin: 5px auto;
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	padding: 5px 0;
	color: var(--color-success);
}

</style>