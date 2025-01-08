<template>
    <div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="first_name"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                        <span>*</span></label>
                    <input type="text" id="category" v-model="category"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"
                        placeholder="category">
                </div>
                <div>
                    <label for="countries"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
                        <span>*</span></label>

                    <el-select v-if="type == 'edit'" v-model="establishment" placeholder="Choose establishment"
                        size="large" filterable>
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                            :label="item.name" :value="`/api/establishments/${item.id}`" />
                    </el-select>

                    <el-select v-else v-model="establishment" placeholder="Choose establishment" size="large" filterable
                        multiple>
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                            :label="item.name" :value="item.competitor_tag" />

                    </el-select>

                </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} category</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, onBeforeMount, watch } from 'vue'
import services from '@Services/services.js'
import { useUserStore } from "@Stores/user.js"
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const type = ref('add');
const category = ref('');
const establishment = ref([]);
const showSpinner = ref(false);
const category_to_update = inject('category_to_update');
const categories = inject('categories');

watch(category_to_update, () => {
    if (category_to_update.value != null) {
        establishment.value = `/api/establishments/${category_to_update.value.establishment_id}`;
        category.value = category_to_update.value["category"];
        type.value = 'edit';
    }
})

const submit = async () => {
    let data = {}
    if (type.value == 'edit') {
        data = {
            "category": category.value,
            "establishment": establishment.value
        };
    } else {
        data = {
            "category": category.value,
            "establishment": establishment.value.join(','),
        };
    }

    try {
        if (data.category !== '' && data.establishment !== '') {
            showSpinner.value = true;
            if (type.value == 'add') {
                const response = await new Promise((resolve) => {
                    services.createRecord('post/category/establishments', data, (response) => {
                        resolve(response);
                    });
                });

                if (response.status == 200) {
                    ElMessage({
                        message: 'category added successfully',
                        type: 'success',
                    })
                    loadData(establishment.value, response.data)
                    category.value = '';
                    establishment.value = [];
                    showSpinner.value = false;
                }
            } else {
                const response = await new Promise((resolve) => {
                    services.putRecord('categories', category_to_update.value['id'], data, (response) => {
                        resolve(response);
                    });
                });

                if (response.status == 200) {
                    ElMessage({
                        message: 'category updated successfully',
                        type: 'success',
                    })
                    updateData(establishment.value, response.data)
                    category.value = '';
                    establishment.value = '';
                    showSpinner.value = false;
                    type.value = 'add';

                }
            }
            router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'categories_list'} });
            
        } else {
            ElMessage.error(`Please, fill the form correctly!`);
        }
    } catch (error) {
        console.log(error);
    }
};

const loadData = (establishmentTags, category) => {
    for (const cat of category) {
        let newCategory = {};
        newCategory = {
            id: cat.id,
            category: cat.category,
            category_uri: `/api/category/` + cat.id,
            establishment: `/api/establishments/` + cat.establishment.establishment_id,
            establishment_id: cat.establishment.establishment_id,
            establishment_name: cat.establishment.name
        }
        categories.value.push(newCategory)

    }


};



const updateData = (establishmentTag, category) => {

    let establishment = userStore.user.customer.establishments.find(i => establishmentTag == `/api/establishments/${i.id}`);
    let currentCategory = {}
    if (establishment) {
        const { id, name } = establishment;
        currentCategory = {
            id: category.id,
            category: category.category,
            category_uri: category['@id'],
            establishment: category.establishment,
            establishment_id: id,
            establishment_name: name
        }
    }

    categories.value.forEach((item, index) => {
        if (item.id == currentCategory.id) categories.value[index] = currentCategory;
    })
};
onBeforeMount (() => {
       const establishments = userStore.user?.customer?.establishments;
       if (establishments?.length > 0) {
        establishment.value = type.value === 'edit' ? `/api/establishments/${establishments[0].id}`: [establishments[0].competitor_tag];
    }
});
</script>
<style scoped>
label span {
    color: red;
}
</style>