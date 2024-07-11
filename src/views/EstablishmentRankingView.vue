<template>
	<div class="filters">
		<div class="row">
			<div class="select_info">
				<el-select v-model="type" size="large">
					<el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value" />
				</el-select>
				<Tooltip :text="info_bulle_text" />
			</div>
			<div class="catfiltre">
				<el-select v-model="categoryFilters" size="large">
					<el-option v-for="(item, index) in categories" :key="index" :label="item.label" :value="item.value" />
				</el-select>
			</div>
			<div class="date_picker">
				<el-date-picker v-model="start_date" type="date" :size="'large'" />
			</div>
			<div class="date_picker">
				<el-date-picker v-model="end_date" type="date" :size="'large'" />
			</div>
		</div>
	</div>
	<div class="society__list mt-5" v-if="establishments.length > 0">
		<suspense>
			<establishments-list-component :establishments="establishments" :tag='customerTag' />
			<template #fallback>
				<establishment-list-loaded-component :nb="3" />
			</template>
		</suspense>
	</div>
</template>
<script setup>
import { ref, onMounted, defineAsyncComponent, inject, watch } from 'vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import services from '@Services/services.js';
import moment from 'moment'
import { useUserStore } from '@Stores/user.js';

const EstablishmentsListComponent = defineAsyncComponent(() =>
	import('@Components/utils/EstablishmentsListComponent.vue')
)

const Tooltip = defineAsyncComponent(() =>
	import('@Components/utils/QuestionMarkTooltipComponent.vue')
)

const info_bulle_text = `"global" means the average of the final grades displayed on the platforms. This grade typically covers the entire platform history, and it's this grade that consumers typically look at first.
"score" means the average ratings of all comments within a defined date range.`
const establishments = ref([]);
const dataLoading = ref(true);
const customerTag = inject('tag');
const userStore = useUserStore();
const userId = userStore.user.id;

const categories = ref([
	{ label: 'All', value: 'all' },
	{ label: 'Hotel', value: 'Hotel' },
	{ label: 'Restaurant', value: 'Restaurant' },
	{ label: 'Residence', value: 'Residence' },
	{ label: 'Other', value: 'Other' },
]);

const types = ref([
	{ label: 'Global', value: 'global' },
	{ label: 'Score', value: 'score' },
]);

const type = ref('global')
const categoryFilters = ref('all')
const start_date = inject('start_date');
const end_date = inject('end_date');

watch([type, categoryFilters, start_date, end_date], async () => {
	if (start_date.value && end_date.value) {
		await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, type.value)
	}
})

const IsValueOkay = (value) => (value == '' || value == 0 || value == null || value == undefined) ? false : true;
const loadEstablishment = async (tag, category, dateStart, dateEnd, note) => {
	let uri = 'get/establishment/classement'
	let params = `tag=${tag}&category=${category}&note=${note}&user_id=${userId}`

	if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
		dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
		dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
		params += `&from=${dateStart}&to=${dateEnd}`;
	}

	uri = `${uri}?${params}`

	const response = await new Promise((resolve) => {
		services.get_Record(uri, (response) => {
			resolve(response);
		});
	});

	if (response.status == 200) {
		establishments.value = response.data.map(objet => {
			// si global on affiche la note
			if (note == 'global') {
				objet.rating = objet.note
			}
		/*	objet.reviews_count = {
				5: objet.stars ? objet.stars['5 stars'] || 0 : 0,
				4: objet.stars ? objet.stars['4 stars'] || 0 : 0,
				3: objet.stars ? objet.stars['3 stars'] || 0 : 0,
				2: objet.stars ? objet.stars['2 stars'] || 0 : 0,
				1: objet.stars ? objet.stars['1 stars'] || 0 : 0,
			};*/
		
		
			return { ...objet, isGlobal: (note == 'global') }
		});
	}
}

onMounted(async () => {
	if (start_date.value && end_date.value) {
		await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, type.value)
		dataLoading.value = false
	}
});
</script>

<style scoped>
.filters {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	background-color: #f5f5f5;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.row {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 10px;
}

.select_info, .catfiltre, .date_picker {
	display: flex;
	align-items: center;
	flex-grow: 1;
	max-width: 300px;
	margin-right: 10px;
}

@media (min-width: 1500px) {
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

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        max-width: 100%;
        gap: 0.1rem;
    }
}

@media (max-width: 768px) {
	.row {
        flex-direction: column;
    }
    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        max-width: 100%;
        gap: 0.1rem;
    }
}
</style>
