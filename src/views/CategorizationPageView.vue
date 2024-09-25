<template>
    <div class="filters">
        <div class="row">
            <div class="select_info">
                <div class="select_info">
                    <el-select v-model="review_category" placeholder="Select categories" size="large">
                        <el-option v-for="(item, index) in categoriesall" :key="index" :label="item" :value="item" />
                    </el-select>
                </div>

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
            <div class="establishment-rank-view">
                <establishments-list-component :establishments="establishments" :tag="customerTag" :start_date="start_date" :end_date="end_date"/>
            </div>
            <template #fallback>
                <establishment-list-loaded-component :nb="3" />
            </template>
        </suspense>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, inject, watch, provide } from 'vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { ElOption, ElSelect, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import services from '@Services/services.js';
import moment from 'moment';
import { useUserStore } from '@Stores/user.js';

const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
);


const establishments = ref([]);
const dataLoading = ref(true);
const customerTag = inject('tag');
const userStore = useUserStore();
const userId = userStore.user.id;

const review_category = ref('');

const categories = ref([
    { label: 'All', value: 'all' },
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Residence', value: 'Residence' },
    { label: 'Other', value: 'Other' },
]);


const categoriesall = ref([])
provide('categoriesall', categoriesall)

const categoryFilters = ref('all');
const start_date = inject('start_date');
const end_date = inject('end_date');

watch([review_category, categoryFilters, start_date, end_date,categoriesall], async () => {
    if (start_date.value && end_date.value) {
        await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, review_category.value, categoriesall.value);
    }
});

const IsValueOkay = (value) => (value !== '' && value !== 0 && value !== null && value !== undefined);

const loadEstablishment = async (tag, category, dateStart, dateEnd, review_category,categoriesall) => {
    let uri = 'get/establishment/categorization/classement';
    let params = `tag=${tag}&category=${category}&user_id=${userId}`;

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
        dateStart = moment(new Date(dateStart)).format('YYYY-MM-DD');
        dateEnd = moment(new Date(dateEnd)).format('YYYY-MM-DD');
        params += `&from=${dateStart}&to=${dateEnd}`;
    }

    if(IsValueOkay(categoriesall)){
        params += `&categories=${categoriesall}`
    }

    if(IsValueOkay(review_category)){
        params += `&review_category=${review_category}`
    }

    uri = `${uri}?${params}`;

    const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    });

    if (response.status === 200) {
        establishments.value = response.data.map(objet => {
            objet.categories
            return { ...objet };
        });
    }
};

const loadCategories = async (tag) => {
    const api = `customer/establishments/categorizations?tag=${tag}`;
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response);
        });
    });

    if (response.status == 200) {
        if (response.data) {
            categoriesall.value = response.data;
        }
    }
}

// const capitalize = (str) => {
//     if (!str) return '';
//     return str.charAt(0).toUpperCase() + str.slice(1);
// };

watch(review_category, () => {
  if (review_category.value) {
    reorderCategories();
    loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, review_category.value);
  }
});

const reorderCategories = () => {
    const selectedCategory = categoriesall.value.find(c => c === review_category.value);
    if (selectedCategory) {
        categoriesall.value = [selectedCategory].concat(categoriesall.value.filter(c => c !== selectedCategory));
    }
};

onMounted(async () => {
    if (start_date.value && end_date.value) {
        await loadEstablishment(customerTag.value, categoryFilters.value, start_date.value, end_date.value, review_category.value);
        await loadCategories(customerTag.value);
        dataLoading.value = false;
    }
});

</script>

<style scoped>
.establishment-rank-view :deep(.reviews-count) {
  display: flex;
  padding: 5px;
  border-radius: 5px;
  margin-top: 40px;
  margin-right: -130px;
  margin-left: -235px;
}

.establishment-rank-view :deep(.review-box) {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 2px;
  margin-top: -2.1px;
  border-radius: 5px;
  margin-left: 12px;
  cursor: pointer;
}

.establishment-rank-view :deep(.list__actions)  {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
	margin-top: -8px;
}
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
	.select_info {
	display: flex;
	align-items: center;
	flex-grow: 1;
	max-width: 318px;
	margin-right: 10px;
}
    .row {
        flex-direction: column;
    }
    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        width: 500px;
        gap: 0.5rem;
		margin-left: 200px;
    }
	.establishment-rank-view :deep(.reviews-count) {
  display: flex;
  padding: 8px;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 90px;
  margin-left: -16px;
  
}

.establishment-rank-view :deep(.review-box) {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 2px;
  border-radius: 5px;
  margin-left: 8px;

}

.establishment-rank-view :deep(.score) {
    font-weight: bold;
    margin-right: 1px;
	margin-top: 0px;
}

.establishment-rank-view :deep(.fa-star) {
	margin-top: 0px;
}

.establishment-rank-view :deep(.list__actions) {
    display: flex;
    justify-content: flex-end;
    margin-right: 0px;
	margin-top: 18px;
}
}

@media (min-width: 376px) and (max-width: 500px) {
	.select_info {
	display: flex;
	align-items: center;
	flex-grow: 1;
	max-width: 318px;
	margin-right: 10px;
}
    .row {
        flex-direction: column;
    }
    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        width: 500px;
        gap: 0.5rem;
		margin-left: 200px;
    }
	.establishment-rank-view :deep(.reviews-count) {
  display: flex;
  padding: 8px;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 90px;
  margin-left: -10px;
  
}

.establishment-rank-view :deep(.review-box) {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 0px;
  border-radius: 5px;
  margin-left: 3px;
  width: 45px;

}

.establishment-rank-view :deep(.score) {
    font-weight: bold;
    margin-right: 0px;
	margin-top: 0px;
}

.establishment-rank-view :deep(.fa-star) {
	margin-top: 1px;
}

.establishment-rank-view :deep(.list__actions) {
    display: flex;
    justify-content: flex-end;
    margin-right: 0px;
	margin-top: 18px;
}
}

@media (max-width: 375px) {
	.select_info {
	display: flex;
	align-items: center;
	flex-grow: 1;
	max-width: 318px;
	margin-right: 10px;
}
    .row {
        flex-direction: column;
    }
    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        width: 500px;
        gap: 0.5rem;
		margin-left: 200px;
    }
	.establishment-rank-view :deep(.reviews-count) {
  display: flex;
  padding: 8px;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 90px;
  margin-left: -16px;
  
}

.establishment-rank-view :deep(.review-box) {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 0px;
  border-radius: 5px;
  margin-left: 3px;
  width: 39px;

}

.establishment-rank-view :deep(.score) {
    font-weight: bold;
    margin-right: 0px;
	margin-top: 0px;
}

.establishment-rank-view :deep(.fa-star) {
	margin-top: 1px;
}

.establishment-rank-view :deep(.list__actions) {
    display: flex;
    justify-content: flex-end;
    margin-right: 0px;
	margin-top: 18px;
}
}



@media (max-width: 420px) {
.establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -90px;
        padding-right: 50px;
    }
.establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: -20px;
        
    }
  }
 
  @media (min-width: 383px) and (max-width: 390px) {
.establishment-rank-view :deep(.society__rating){
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }
.establishment-rank-view :deep(.reviews){
        font-size: 11px;
        margin-left: 0px;
        
    }
  }

  @media (max-width: 375px) {
.establishment-rank-view :deep(.society__rating){
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }
.establishment-rank-view :deep(.reviews){
        font-size: 11px;
        margin-left: 5px;
        
    }
    .establishment-rank-view :deep(.reviews-count) {
  display: flex;
  padding: 8px;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 90px;
  margin-left: -10px;
  
}
.establishment-rank-view :deep(.review-box) {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 0px;
  border-radius: 5px;
  margin-left: 4px;
  width: 42px;

}
  }

</style>
