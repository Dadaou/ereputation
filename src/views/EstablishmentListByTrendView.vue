<template>
    <div class="filters">
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
        <div class="date_pick">
            <el-date-picker 
                v-model="selectedDate" 
                type="date" 
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="Select Date" 
                size="large"
                @change="handleDateChange"
            />
        <Tooltip :text="info_bulle_text1" /> 
        </div>
        <div class="number_days">
            <el-input-number 
                v-model="days" 
                :min="1" 
                size="large" 
                class="custom-width"
                :disabled="isDateSelected" 
            />
        </div>
    </div>
    <div class="society__list mt-5" v-if="establishments.length > 0">
        <suspense>
            <establishments-list-component :establishments="establishments" :tag='customerTag' :selectedDate="selectedDate" />
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
import moment from 'moment'

const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
);

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
);

const info_bulle_text = `"global" means the average of the final grades displayed on the platforms.This grade typically covers the entire platform history, and it's this grade that consumers typically look at first.
"score" means the average ratings of all comments within a defined date range.`;

const info_bulle_text1 = `Compare the current situation to this date.`;

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

const isDateSelected = ref(false);

const handleDateChange = (value) => {
    isDateSelected.value = !!value;
    if (isDateSelected.value) {
        days.value = null;
        selectedDate.value = moment(value).format('YYYY-MM-DD'); 
    } else {
        selectedDate.value = null;
    }
};

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
    margin: 2px;
    flex-grow: 1;
    max-width: 300px;
    /* Adjust based on your design needs */
}

.select_info {
    display: flex;
    align-items: center;
    align-content: center;
}

.catfiltre {
    display: flex;
    align-items: center;
    align-content: center;
}

.date_pick {
    display: flex;
    align-items: center;
    align-content: center;
}

.number_days {
    display: flex;
    align-items: center;
    align-content: center;
}

.custom-width {
    width: 100%;
}

@media (max-width: 768px) {
    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        max-width: 100%;
    }
}
</style>