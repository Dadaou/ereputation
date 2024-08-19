<template>
    <div class="filters">
        <div class="top-row">
            <div class="select_info">
                <el-select v-model="type" size="large">
                    <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value" />
                </el-select>
                <Tooltip :text="info_bulle_text" />
            </div>
            <div class="catfiltre">
                <el-select v-model="categoryFilters" size="large" class="custom-width">
                    <el-option v-for="(item, index) in categories" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </div>
        </div>
        <div class="bottom-row">
            <div class="date_pick">
                <el-date-picker 
                    v-model="selectedDate" 
                    type="date" 
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="Select Date" 
                    size="large"
                    @change="handleDateChange"
                    class="custom-width"
                />
                <Tooltip :text="info_bulle_text1" /> 
            </div>
            <div class="or-text">
                OR
            </div>
            <div class="number_days">
                <el-input-number 
                    v-model="days" 
                    :min="1" 
                    size="large" 
                    class="custom-width"
                />
                <Tooltip :text="info_bulle_text2" />
            </div>
        </div>
    </div>
    <div class="society__list mt-5" v-if="establishments.length > 0">
        <suspense>
            <div class="establishment-rank-view">
            <establishments-list-component :establishments="establishments" :tag='customerTag' :selectedDate="selectedDate" />
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
import { ElOption, ElSelect, ElDatePicker, ElInputNumber } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/input-number/style/css';
import services from '@Services/services.js';
import { useUserStore } from '@Stores/user.js';
import moment from 'moment';

const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
);

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
);

const info_bulle_text = `"global" means the average of the final grades displayed on the platforms.This grade typically covers the entire platform history, and it's this grade that consumers typically look at first.
"score" means the average ratings of all comments within a defined date range.`;

const info_bulle_text1 = `Compare the current situation to this date.`;
const info_bulle_text2 = `the last x days compared to the previous x days.`;
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

const type = ref('global');
const categoryFilters = ref('all');
const days = ref(60);
const selectedDate = ref(null);
provide('selectedDate', selectedDate);

const handleDateChange = (value) => {
  if (value) {
    days.value = null;
    selectedDate.value = moment(value).format('YYYY-MM-DD'); 
  } else {
    selectedDate.value = null;
  }
};

watch(days, (newDays) => {
  if (newDays !== null) {
    selectedDate.value = null;
  }
});

watch([type, categoryFilters, days, selectedDate], async () => {
    await loadEstablishment(customerTag.value, categoryFilters.value, days.value, type.value, selectedDate.value);
});

const loadEstablishment = async (tag, category, days, note, date) => {
    let uri = 'get/establishment/trend';
    let params = `tag=${tag}&category=${category}&note=${note}&user_id=${userId}`;

    if (date) {
        params += `&date=${date}`;
    } else {
        params += `&days=${days}`;
    }

    uri = `${uri}?${params}`;

    const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    });

    if (response.status == 200) {
        establishments.value = response.data.map((objet) => {
            objet.reviews_count = {
                '5 ': objet.stars ? objet.stars['5 stars'] : 0,
                '4 ': objet.stars ? objet.stars['4 stars'] : 0,
                '3 ': objet.stars ? objet.stars['3 stars'] : 0,
                '2 ': objet.stars ? objet.stars['2 stars'] : 0,
                '1 ': objet.stars ? objet.stars['1 star'] : 0,
            };
            return { ...objet, ratio: objet.ratio_value, ratio_text: objet.ratio, isTrends: true };
        });
    } else {
        console.error('Error loading establishments:', response);
    }
};

onMounted(async () => {
    await loadEstablishment(customerTag.value, categoryFilters.value, days.value, type.value, selectedDate.value);
    dataLoading.value = false;
});
</script>
<style scoped>
.establishment-rank-view ::v-deep .reviews-count {
  display: flex;
  padding: 5px;
  border-radius: 5px;
  margin-top: 40px;
  margin-right: -130px;
  margin-left: -235px;
}

.establishment-rank-view ::v-deep .review-box {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 2px;
  margin-top: -2.1px;
  border-radius: 5px;
  margin-left: 12px;
  cursor: pointer;
}
@media (min-width: 100px) and (max-width: 600px){
    .establishment-rank-view ::v-deep .review-box {
    justify-content: center;
    margin-left: 0%;
    }
    .establishment-rank-view ::v-deep .reviews-count {
    justify-content: center;
    margin-left: 0%;

    }
}

@media (min-width: 336px) and (max-width: 389px){
    .establishment-rank-view ::v-deep .review-box {
    justify-content: center;
    margin-left: 0%;
    margin-top: 50px;
    }
    .establishment-rank-view ::v-deep .reviews-count {
    justify-content: center;
    margin-left: 0%;
    margin-top: 50px;
    }
}

@media (min-width: 100px) and (max-width: 335px){
    .establishment-rank-view ::v-deep .review-box {
        justify-content: center;
    margin-right: 1%;
    margin-top: 80px;
    z-index: 999;
    }
    .establishment-rank-view ::v-deep .reviews-count {
        justify-content: center;
        margin-left: -80px;
    margin-top: 80px;
    z-index: 999;
    
    }
}







.filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 44%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 300px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
@media (min-width: 1920px) {
    .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 46%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 600px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
}

@media (min-width: 501) and (max-width: 768px) {
    .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 41%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 300px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
}

@media (max-width: 500px) {
    .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 39.5%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 300px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
}
@media (min-width: 400px) and (max-width: 415px) {
    .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 38.5%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 300px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
}
@media (max-width: 390px) {
    .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
}
.bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0rem;
}

.select_info,
.date_pick,
.number_days {
    display: flex;
    align-items: center;
    flex: 1;
}

.catfiltre {
    display: flex;
    align-items: center;
    flex: 0 1 43%; /* Ajustez ce pourcentage pour changer la largeur de catfiltre */
    max-width: 300px; /* Vous pouvez ajuster cette valeur selon vos besoins */
    padding-right: 17px;
}

.or-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 10px;
}

.custom-width {
    width: 100%;
}
}
</style>