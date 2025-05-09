<template>
    <div class="closeView">
        <el-button :icon="Close" @click="closeView" circle />
    </div>
    <div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2" >
                <div>
                    <label for="unit_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                        <span>*</span></label>
                    <input type="text" id="unit_name" v-model="unit.name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm" placeholder="name" style="width: 100%;">
                </div>
                <div>
                    <label for="unit_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code
                        <!-- <span>*</span> --></label>
                    <input type="text" id="unit_code" v-model="unit.code"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" placeholder="code">
                </div>
                <div>
                    <label for="section" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Section
                        </label>
                    <el-select id="section" v-model="unit.section" placeholder="Choose section" size="large" >
                        <el-option v-for="item in sections" :key="item" :label="item" :value="item" />
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                        <span>*</span></label>
                    <el-select v-model="unit.category" placeholder="Choose category" size="large" >
                        <el-option v-for="item in categories" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div>
                    <label for="countries"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
                        <span>*</span></label>
                    <el-select v-model="unit.establishment" placeholder="Choose establishment" size="large" >
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                            :label="item.name" :value="`/api/establishments/${item.id}`" />
                    </el-select>
                </div>
            </div>
            <div class="flex items-center justify-between py-2 border-t border-b dark:border-gray-600" >
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" />
                    <span v-if="showSpinner">Loading ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} service</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch, onMounted, watchEffect } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useStaffStore } from "@Stores/staff.js";
import { useCompanyStore } from "@Stores/company.js";
import { useRoute, useRouter } from 'vue-router';
import services from '@Services/services.js'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect, ElButton } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import { Close } from '@element-plus/icons-vue'

const router = useRouter();
const route = useRoute();
const clearForm = inject('clearUnitForm')
const userStore = useUserStore();
const staffStore = useStaffStore();
const companyStore = useCompanyStore();
const type = ref('add');
const unit = ref({});
const categories = [{ label: 'Points of sale', value: 'Points of sale' }, { label: 'Transport', value: 'Transport' }]
const showSpinner = ref(false);
const unit_to_update = inject('unit_to_update');
const units = inject('units');
const sections = ref(['','MENUS', 'INFOS', 'FOLLOW US', 'REVIEWS', 'OFFERS'])
const emit = defineEmits('showServiceList');

const closeView = () => {
    emit('showServiceList', true);
}

watch(unit_to_update, () => {
    if (unit_to_update.value != null) {
        // unit.value = {
        //     "code": unit_to_update.value["code"],
        //     "name": unit_to_update.value["name"],
        //     "category": unit_to_update.value["category"],
        //     "establishment": `/api/establishments/${unit_to_update.value["establishment_id"]}`,
        //     "section": unit_to_update.value["section"],
        // }
        // type.value = 'edit';
        fillForm(unit_to_update.value)
    }
})

const fillForm = (data)=>{
        unit.value = {
            "code": data["code"],
            "name": data["name"],
            "category": data["category"],
            "establishment": `/api/establishments/${data["establishment_id"]}`,
            "section": data["section"],
        }
        type.value = 'edit';
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const submit = async () => {
    let data = {
        "code": unit.value?.code,
        "name": unit.value?.name,
        "category": unit.value?.category,
        "establishment": unit.value?.establishment,
        "section": unit.value?.section,
    }

    try {
        if (IsValueOkay(data.category) && IsValueOkay(data.establishment) && IsValueOkay(data.name)) {
            showSpinner.value = true;
            if (type.value == 'add') {
                const response = await new Promise((resolve) => {
                    services.createRecord('units', data, (response) => {
                        resolve(response);
                    });
                });

                if (response.status == 201) {
                    ElMessage({
                        message: 'unit added successfully',
                        type: 'success',
                    })
                    loadData(response.data, data)
                    unit.value = {}
                    showSpinner.value = false;
                }
            } else {
                const response = await new Promise((resolve) => {
                    services.patchRecord('units', unit_to_update.value['id'], data, (response) => {
                        resolve(response);
                    });
                });

                if (response.status == 200) {
                    ElMessage({
                        message: 'unit updated successfully',
                        type: 'success',
                    })
                    updateData(response.data, data)
                    unit.value = {}
                    showSpinner.value = false;
                }
            }
            closeView()
            //router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'services_list'} });
        } else {
            ElMessage.error(`Please, fill the form correctly!`);
        }
    } catch (error) {
        console.log(error);
    }
};

const loadData = (unit, _unit) => {
    let establishment = userStore.user.customer.establishments.find(i => unit.establishment == `/api/establishments/${i.id}`);
    let newUnit = {}
    if (establishment) {
        const { id, name, competitor_tag } = establishment;
        newUnit = {
            "id": unit.id,
            "name": unit.name,
            "code": unit.code,
            "category": unit.category,
            "tag": unit.tag,
            "section": _unit.section,
            "establishment_name": name,
            "establishment_competitor_tag": competitor_tag,
            "establishment_id": id
        }
        units.value.push(newUnit)
    }
};

const updateData = (unit, _unit) => {

    let establishment = userStore.user.customer.establishments.find(i => unit.establishment == `/api/establishments/${i.id}`);
    let currentUnit = {}

    if (establishment) {
        const { id, name, competitor_tag } = establishment;
        currentUnit = {
            "id": unit.id,
            "name": unit.name,
            "code": unit.code,
            "category": unit.category,
            "section": _unit.section,
            "tag": unit.tag,
            "establishment_name": name,
            "establishment_competitor_tag": competitor_tag,
            "establishment_id": id
        }
    }

    units.value.forEach((item, index) => {
        if (item.id == currentUnit.id) units.value[index] = currentUnit;
    })
};

onMounted(async () => {
    const data = staffStore.getUnit();

    if (data) {
        unit_to_update.value = data;
        fillForm(data);
        staffStore.resetUnit();
    } else {
        // Chargez les établissements s'ils ne sont pas déjà chargés
        if (!userStore.user?.customer?.establishments || userStore.user?.customer?.establishments?.length === 0) {
            await companyStore.fetchCustomerEstablishments(userStore.user.customer.tag);
        }

        // Définissez la valeur par défaut pour l'établissement
        const establishments = userStore.user?.customer?.establishments;
        if (establishments && establishments.length > 0) {
            unit.value.establishment = `/api/establishments/${establishments[0].id}`;
        }
    }
});

watchEffect(() => {
    const establishments = userStore.user?.customer?.establishments;
    if (establishments && establishments?.length > 0 && !unit.value.establishment) {
        unit.value.establishment = `/api/establishments/${establishments[0].id}`;
    }
});

watch(clearForm, ()=>{
  if(clearForm.value) unit.value = {}
});

</script>
<style scoped>
form {
    height: 750px !important;
}

form button {
    width: 8rem !important;
}

input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}

.closeView {
    display: flex; 
    justify-content: flex-end;
}

@media screen and (max-width: 800px) {
    .closeView {
        display: flex; 
        justify-content: flex-start;
        margin-left: 5px;
    }

    form {
        margin-left: 0;
        padding-right: 50px;
    }
}
</style>