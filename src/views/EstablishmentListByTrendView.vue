<template>
    <div class="filters">
        <div class="select_info">
             <el-select v-model="type" size="large">
                <el-option v-for="(item, index) in types" :key="index" :label="item.label"
                            :value="item.value"/>
            </el-select>
            <Tooltip :text="info_bulle_text"/>
        </div>
        <el-select v-model="categoryFilters" size="large">
            <el-option v-for="(item, index) in categories" :key="index" :label="item.label"
                        :value="item.value"/>
        </el-select>
        <div>
           <!--  <el-date-picker v-model="start_date" type="date" :size="'large'" /> -->
           <el-input-number v-model="days" :min="1" size="large"/>         
        </div>
        <!-- <div>
            <el-date-picker v-model="end_date" type="date" :size="'large'" />
        </div> -->
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
import { ElOption, ElSelect,  ElDatePicker, ElInputNumber } from 'element-plus';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import 'element-plus/es/components/input-number/style/css'
import services from '@Services/services.js';
import moment from 'moment'

const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
)

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
)

const info_bulle_text = `"global" means the average of the final grades displayed on the platforms.This grade typically covers the entire platform history, and it's this grade that consumers typically look at first.
"score" means the average ratings of all comments within a defined date range.`
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
const days = ref(60)

// const filteredEstablishments = computed(()=>{
//  const sortBy = type.value;
//  const categorie = categoryFilters.value;

//  let result = establishments.value.sort(function(a, b) {
//         return b[sortBy] - a[sortBy];
//     });

//     if(categorie !== 'All'){
//      result = establishments.value.filter(function(etablissement) {
//          return etablissement.category === categorie;
//      });
//     }

//     return result;
// })

watch([type, categoryFilters, days],async()=>{
     await loadEstablishment(customerTag.value, categoryFilters.value, days.value, type.value)
})

const IsValueOkay = (value) => (value == '' || value == 0 || value == null || value == undefined) ? false : true;
const loadEstablishment = async(tag, category, days, note)=>{
    let uri = 'get/establishment/trend'
    let params = `tag=${tag}&category=${category}&note=${note}&days=${days}`

    // if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
    //     dateStart = moment(dateStart).format('YYYY-MM-DD');
    //     dateEnd = moment(dateEnd).format('YYYY-MM-DD');
    //     params += `&from=${dateStart}&to=${dateEnd}`;
    // }

    uri = `${uri}?${params}`

    const response = await new Promise((resolve) => {
            services.get_Record(uri, (response) => {
                resolve(response);
            });
    });

    if(response.status == 200) {
       establishments.value = response.data.map(objet => {
        return {...objet, ratio: objet.ratio_value, ratio_text: objet.ratio, isTrends:true}
      });
    }
}

onMounted(async()=>{
    // if (userStore.user) {
    //     companiesStore.getEstablishments(customerTag.value).then((data) => {
    //         establishments.value = data;
    //         if(userStore.user.customer){
    //             userStore.user.customer['establishments'] = establishments.value;
    //             userStore.customer = userStore.user.customer
    //         }
    //         dataLoading.value = false
    //     })
    // } else appStore.isLoading = false;

    await loadEstablishment(customerTag.value,categoryFilters.value, days.value, type.value)
        dataLoading.value = false
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
 max-width: 310px; /* Adjust based on your design needs */
}

.select_info{
    display: flex;
    align-items: center;
    align-content: center;
}

@media (max-width: 768px) {
 .filters > * {
    flex-basis: 100%;
    margin-bottom: 10px;
 }
}

</style>