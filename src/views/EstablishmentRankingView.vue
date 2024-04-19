<template>
	<div class="filters">
		<el-select v-model="type" size="large">
            <el-option v-for="(item, index) in types" :key="index" :label="item.label"
                        :value="item.value"/>
        </el-select>
		<el-select v-model="categoryFilters" size="large">
            <el-option v-for="(item, index) in categories" :key="index" :label="item.label"
                        :value="item.value"/>
        </el-select>
        <div>
			<el-date-picker v-model="start_date" type="date" :size="'large'" />        	
        </div>
        <div>
        	<el-date-picker v-model="end_date" type="date" :size="'large'" />
        </div>
	</div>
	<div class="society__list mt-5" v-if="establishments.length > 0">
	        <suspense>
	            <establishments-list-component :establishments="establishments" :tag='customerTag'/>
	            <template #fallback>
	                <establishment-list-loaded-component :nb="3" />
	            </template>
	        </suspense>
	</div>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, defineAsyncComponent, inject, computed, watch } from 'vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { ElOption, ElSelect,  ElDatePicker } from 'element-plus';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import services from '@Services/services.js';
import moment from 'moment'

const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
)

const userStore = useUserStore();
const appStore = useAppStore();
const companiesStore = useCompanyStore();
const establishments = ref([]);
const dataLoading = ref(true);
const customerTag = inject('tag');

const categories = ref([
	{label: 'All', value: 'all'},
	{label: 'Hotel', value: 'Hotel'},
	{label: 'Restaurant', value: 'Restaurant'},
	{label: 'Residence', value: 'Residence'},
	{label: 'Other', value: 'Other'},
]);

const types = ref([
	{label: 'Global', value: 'global'},
	{label: 'Score', value: 'score'},
]);

const type = ref('global')
const categoryFilters = ref('all')
const start_date = inject('start_date');
const end_date = inject('end_date');

watch([type, categoryFilters, start_date, end_date],async()=>{
    if(start_date.value && end_date.value){
    	await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, type.value)
    }
})

const IsValueOkay = (value) => (value == '' || value == 0 || value == null || value == undefined) ? false : true;
const loadEstablishment = async(tag, category, dateStart, dateEnd, note)=>{
	let uri = 'get/establishment/classement'
	let params = `tag=${tag}&category=${category}&note=${note}`

	if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
	    dateStart = moment(dateStart).format('YYYY-MM-DD');
	    dateEnd = moment(dateEnd).format('YYYY-MM-DD');
	    params += `&from=${dateStart}&to=${dateEnd}`;
	}

	uri = `${uri}?${params}`

	const response = await new Promise((resolve) => {
            services.get_Record(uri, (response) => {
                resolve(response);
            });
    });

    if(response.status == 200) {
      console.log(response.data)
      establishments.value = response.data.map(objet => {

      	//si global on affiche la note
      	if(note == 'global'){
      		objet.rating = objet.note
      	}
      	return {...objet, isGlobal:(note == 'global')}
	  });
    }
}

onMounted(async()=>{
    if(start_date.value && end_date.value){
    	await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, type.value)
    	dataLoading.value = false
    }
});
	
</script>
<style scoped>
.filters {
 display: flex;
 flex-wrap: wrap;
 justify-content: space-between;
 align-items: center;
 padding: 10px;
 background-color: #f5f5f5;
 border-radius: 5px;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filters > * {
 margin: 2px;
 flex-grow: 1;
 max-width: 200px; /* Adjust based on your design needs */
}

@media (max-width: 768px) {
 .filters > * {
    flex-basis: 100%;
    margin-bottom: 10px;
 }
}

</style>