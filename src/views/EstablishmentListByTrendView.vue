<template>
    <div class="filters">
        <div class="row">
            <div class="select_info">
                <el-select v-model="type" size="large" >
                    <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value" />
                </el-select>
                <Tooltip :text="info_bulle_text" />
            </div>
            <div class="catfiltre">
                <el-select v-model="categoryFilters" size="large" >
                    <el-option v-for="(item, index) in categories" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="date_picker">
                <el-date-picker v-model="selectedDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                    placeholder="Select Date" size="large" @change="handleDateChange" />
                <Tooltip :text="info_bulle_text1" />
            </div>
            <div class="or-text">
                <p>OR</p>
            </div>
            <div class="section_number">
                <el-input-number v-model="days" :min="1" size="large" class="number_days"/>
                <Tooltip :text="info_bulle_text2" />
            </div>
        </div>
    </div>
    <div class="society__list mt-5" v-if="establishments.length > 0">
        <suspense>
            <div class="establishment-rank-view">
                <establishments-list-component :establishments="establishments" :tag='customerTag'
                    :selectedDate="selectedDate" />
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
const start_date = inject('start_date');
const end_date = inject('end_date');

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

watch([type, categoryFilters, days, selectedDate, start_date, end_date], async () => {
    await loadEstablishment(customerTag.value, categoryFilters.value, days.value, type.value, selectedDate.value, start_date.value, end_date.value);
});

const loadEstablishment = async (tag, category, days, note, date, dateStart, dateEnd) => {
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
            // Extraction des dates start_date et end_date
            const start_date_extracted = objet.curent?.from;
            const end_date_extracted = objet.curent?.to;

            // Stockage des valeurs dans l'état
            start_date.value = start_date_extracted;
            end_date.value = end_date_extracted;
            // vérifier  le format des  dates
            if (start_date_extracted) {
                start_date.value = moment(start_date_extracted).format('YYYY-MM-DD');
                console.log(start_date.value);
            }
            if (end_date_extracted) {
                end_date.value = moment(end_date_extracted).format('YYYY-MM-DD');
            }

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
    await loadEstablishment(customerTag.value, categoryFilters.value, days.value, type.value, selectedDate.value, start_date.value, end_date.value);
    dataLoading.value = false;
});
</script>

<style scoped>
.establishment-rank-view :deep(.reviews-count) {
    display: flex;
    /* padding: 5px; */
    border-radius: 5px;
}

.establishment-rank-view :deep(.review-box) {
    display: flex;
    align-items: center;
    background: #F5F5F5;
    padding: 2px;
    margin-top: -2.1px;
    border-radius: 5px;
    margin-right: 12px;
    cursor: pointer;
}

.establishment-rank-view :deep(.list__actions) {
    display: flex;
    justify-content: flex-end;
    /* margin-right: 10px; */
    /* margin-top: -8px; */
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
}

.select_info,
.catfiltre,
.date_picker {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 300px;
    margin-right: 10px;
}

.or-text{
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.number_days {
    width: 90%;
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

    .select_info,
    .catfiltre,
    .date_picker {
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: calc(100% - 8px);
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        /* width: 500px; */
        gap: 0.5rem;
        /* margin-left: 200px; */
        margin-inline: 8px;
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 2px;
        border-radius: 5px;
        margin-right: 8px;

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
        /* margin-top: 18px; */
    }

    .section_number {
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .number_days {
        width: 100%;
    }

}

@media (min-width: 376px) and (max-width: 500px) {
    .select_info {
        display: flex;
        align-items: center;
        flex-grow: 1;
        /* max-width: 318px; */
        /* margin-right: 10px; */
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        /* width: 500px; */
        gap: 0.5rem;
        /* margin-left: 200px; */
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 3px;
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
        /* margin-top: 18px; */
    }
}

@media (max-width: 375px) {
    .select_info {
        display: flex;
        align-items: center;
        flex-grow: 1;
        /* max-width: 318px; */
        /* margin-right: 10px; */
    }

    .row {
        flex-direction: column;
    }

    .filters>* {
        flex-basis: 100%;
        margin-bottom: 10px;
        width: 500px;
        gap: 0.5rem;
        /* margin-left: 200px; */
    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 3px;
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
        /* margin-top: 18px; */
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
    .establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }

    .establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: 0px;

    }
}

@media (max-width: 375px) {
    .establishment-rank-view :deep(.society__rating) {
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-left: -10px;
        padding-right: 60px;
    }

    .establishment-rank-view :deep(.reviews) {
        font-size: 11px;
        margin-left: 5px;

    }

    .establishment-rank-view :deep(.reviews-count) {
        display: flex;
        /* padding: 8px; */
        border-radius: 5px;

    }

    .establishment-rank-view :deep(.review-box) {
        display: flex;
        align-items: center;
        background: #F5F5F5;
        padding: 0px;
        border-radius: 5px;
        margin-right: 4px;
        width: 42px;

    }
}
</style>
