<template>
	<div class="filters">
		<el-select v-model="type" size="large">
            <el-option v-for="(item, index) in types" :key="index" :label="item.label"
                        :value="item.value"/>
        </el-select>
		<el-select v-model="categoryFilters" size="large">
            <el-option v-for="(item, index) in categories" :key="index" :label="item.label"
                        :value="item.label"/>
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
	            <establishments-list-component :establishments="filteredEstablishments" :tag='customerTag'/>
	            <template #fallback>
	                <establishment-list-loaded-component :nb="3" />
	            </template>
	        </suspense>
	</div>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, defineAsyncComponent, inject, computed } from 'vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { ElOption, ElSelect,  ElDatePicker } from 'element-plus';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

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
	{label: 'All'},
	{label: 'Hotel'},
	{label: 'Restaurant'},
	{label: 'Residence'},
	{label: 'Other'},
]);

const types = ref([
	{label: 'Global', value: 'rating'},
	{label: 'Score', value: 'score'},
]);

const type = ref('rating')
const categoryFilters = ref('All')
const start_date = ref(null);
const end_date = ref(null);

const filteredEstablishments = computed(()=>{
	const sortBy = type.value;
	const categorie = categoryFilters.value;

	let result = establishments.value.sort(function(a, b) {
        return b[sortBy] - a[sortBy];
    });

    if(categorie !== 'All'){
    	result = establishments.value.filter(function(etablissement) {
	    	return etablissement.category === categorie;
	    });
    }

    return result;
})

onMounted(async()=>{
	if (userStore.user) {
        companiesStore.getEstablishments(customerTag.value).then((data) => {
            establishments.value = data;
            if(userStore.user.customer){
                userStore.user.customer['establishments'] = establishments.value;
                userStore.customer = userStore.user.customer
            }
            dataLoading.value = false
        })
    } else appStore.isLoading = false;
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