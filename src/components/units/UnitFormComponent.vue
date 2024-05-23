<template>
    <div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="unit_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                        <span>*</span></label>
                    <input type="text" id="unit_name" v-model="unit.name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" placeholder="name">
                </div>
                <div>
                    <label for="unit_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code
                        <!-- <span>*</span> --></label>
                    <input type="text" id="unit_code" v-model="unit.code"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" placeholder="code">
                </div>
                <div>
                    <label for="section" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Section
                        <span>*</span></label>
                    <el-select id="section" v-model="unit.section" placeholder="Choose section" size="large" clearable>
                        <el-option v-for="item in sections" :key="item" :label="item" :value="item" />
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                        <span>*</span></label>
                    <el-select v-model="unit.category" placeholder="Choose category" size="large" filterable>
                        <el-option v-for="item in categories" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div>
                    <label for="countries"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
                        <span>*</span></label>
                    <el-select v-model="unit.establishment" placeholder="Choose establishment" size="large" filterable>
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                            :label="item.name" :value="`/api/establishments/${item.id}`" />
                    </el-select>
                </div>
            </div>
            <<<<<<< HEAD <div
                class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} service</span>
                </button>
                =======
                <div class="flex items-center justify-between py-2 border-t border-b dark:border-gray-600">
                    <button type="submit"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" />
                        <span v-if="showSpinner">Loading ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} service</span>
                    </button>
                    >>>>>>> f0a040aca1a98ed79504856acb965b71caa4fa50
                </div>
        </form>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch } from 'vue'
import services from '@Services/services.js'
import { useUserStore } from "@Stores/user.js"
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const userStore = useUserStore();
const type = ref('add');
const unit = ref({});
const categories = [{ label: 'Bus', value: 'Bus' }, { label: 'Points of sale', value: 'Points of sale' }]
const showSpinner = ref(false);
const activeUnitTab = inject('unit_activeTab');
const unit_to_update = inject('unit_to_update');
const units = inject('units');
const sections = ref(['MENUS', 'INFOS', 'FOLLOW US', 'REVIEWS', 'OFFERS'])

watch(unit_to_update, () => {
    if (unit_to_update.value != null) {
        unit.value = {
            "code": unit_to_update.value["code"],
            "name": unit_to_update.value["name"],
            "category": unit_to_update.value["category"],
            "establishment": `/api/establishments/${unit_to_update.value["establishment_id"]}`,
            "section": unit_to_update.value["section"],
        }
        type.value = 'edit';
    }
})

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
                    services.putRecord('units', unit_to_update.value['id'], data, (response) => {
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

            activeUnitTab.value = 'unit_list'
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
</style>