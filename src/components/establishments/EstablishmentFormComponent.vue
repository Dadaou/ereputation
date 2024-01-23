<template>
    <div class="security__header border__bottom mt-10">
        <div class="security__edit">
            <h4><i class="uil uil-company"></i> Establishment</h4>
            <p>Please provide the necessary information to add a new staff member to one of your establishment.</p>
        </div>
    </div>
    <div class="table__container">
        <form id="establishmentForm" @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div class="md:order-2">
                    <div class="image-selector border-gray-300" :class="!previewImage && 'hover'" @click="selectImg"
                        @mouseover="imageInputHover = true" @mouseleave="imageInputHover = false">
                        <img v-if="previewImage" :src="previewImage" class="uploading-image" />
                        <i v-else class="uil uil-image-plus"></i>
                        <div v-if="imageInputHover && previewImage" class="img-hover">
                            <i class="uil uil-image-edit"></i>
                        </div>
                    </div>

                    <input id="imgInput" name="file" type="file" @change=updateImage style="display:none">
                </div>
                <div class="md:order-1">
                    <div class="mb-6">
                        <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                            <span>*</span></label>
                        <input type="text" id="company_name" name="name" v-model="data.name" required
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div class="mb-6">
                        <label for="address1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address 1
                            <span>*</span></label>
                        <input type="text" id="address1" name="address1" v-model="data.address1" required
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div>
                        <label for="address2" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address
                            2</label>
                        <input type="text" id="address2" name="address2" v-model="data.address2"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-4">
                <div>
                    <label for="zipcode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zipcode
                        <span>*</span></label>
                    <input type="text" id="zipcode" name="zipcode" v-model="data.zipcode" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
                <div>
                    <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                        <span>*</span></label>
                    <!-- <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                            :value="`/api/establishments/${item.id}`" />
                    </el-select> -->
                    <input type="text" id="city" name="city" v-model="data.city" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
                <div class="col-span-2">
                    <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country
                        <span>*</span></label>
                    <el-select v-model="data.country" placeholder="" size="large">
                        <el-option v-for="(country, index) in countries" :key="index" :label="country.name"
                            :value="country.name" />
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="region" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Region
                        <span>*</span></label>
                    <!-- <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                            :value="`/api/establishments/${item.id}`" />
                    </el-select> -->
                    <input type="text" id="region" name="region" v-model="data.region"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
                <div>
                    <label for="gps" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gps
                    </label>
                    <!-- <el-select v-model="department" placeholder="Choose department" size="large">
                        <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
                    </el-select> -->
                    <input type="text" id="gps" name="gps" v-model="data.gps"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-4">

                <div class="col-span-2">
                    <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                        <span>*</span></label>
                    <el-select v-model="data.category" placeholder="" size="large">
                        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
                    </el-select>
                    <!-- <input type="text" id="category" v-model="data.category"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"> -->
                </div>
                <div>
                    <label for="rank" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rank
                    </label>
                    <!-- <el-select v-model="department" placeholder="Choose department" size="large">
                        <el-option v-for="item in departments" :key="item" :label="item" :value="item" />
                    </el-select> -->
                    <input type="text" id="rank" name="rank" v-model="data.rank"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
                <div>
                    <label for="positionning"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">positionning
                    </label>
                    <!-- <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                        <el-option v-for="item in userStore.user.customer.establishments" :key="item.id" :label="item.name"
                            :value="`/api/establishments/${item.id}`" />
                    </el-select> -->
                    <input type="text" id="positionning" name="positionning" v-model="data.positionning"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            </div>
            <div class="flex flex-wrap gap-3 items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} establishment</span>
                </button>
                <button @click="resetForm"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800">
                    <span><i class="uil uil-times"></i> Clear </span>
                </button>
            </div>
        </form>
    </div>
</template>
<script setup>
import moment from 'moment';
import { ref, inject, watch } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import { useStaffStore } from "@Stores/staff.js";
import { useCompanyStore } from "@Stores/company.js";
import { useAppStore } from "@Stores/app.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import { useRouter } from 'vue-router';
import { countries, categories } from '@Services/input-list.js';

const previewImage = ref(null);
const imageInputHover = ref(false);
const data = ref({});
const showSpinner = ref(false);
const type = ref('Add');
const userStore = useUserStore();
const establishment_to_update = inject('establishment_to_update');
const imgHasChanged = ref(false);
const activeEstablishmentTab = inject('establishment_activeTab');

const cleanEstablishmentForm = inject('clearEstablishmentForm');

const resetForm = () => {
    data.value = {};
    previewImage.value = null;
    type.value = 'Add';
}

watch(cleanEstablishmentForm, () => {
    resetForm();
})

const updateImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
        previewImage.value = e.target.result;
    };
    imgHasChanged.value = true;
};

const selectImg = () => {
    document.getElementById('imgInput').click();
}

const submit = async () => {

    const form = document.querySelector('#establishmentForm');

    const formData = new FormData(form);

    const establishmentData = { ...data.value, customer: `${userStore.user.customer.tag}` };
    console.log(establishmentData);

    if (establishmentData.category && establishmentData.country) {

        formData.append('category', establishmentData.category);
        formData.append('country', establishmentData.country);
        formData.append('customer', `${userStore.user.customer.tag}`)
        showSpinner.value = true;

        if (!imgHasChanged.value) formData.delete('file');

        if (type.value === 'Edit') {

            if (establishmentData.uri) {
                formData.append('id', establishmentData.uri.split('/').pop());
            }

        }

        formData.delete('media');

        const response = await new Promise((resolve, reject) => {
            services.postFormData('establishments/front_post', formData, (response) => {
                resolve(response);
            });
        });

        if (response.status == 201) {
            loadData(response.data, 'new')
            ElMessage({
                message: `Establishment added successfully.`,
                type: 'success',
            });
            data.value = {}
            showSpinner.value = false;
        }

        if (response.status == 200) {
            loadData(response.data, 'edit')
            ElMessage({
                message: `Establishment updated successfully.`,
                type: 'success',
            });
            data.value = {}
            showSpinner.value = false;
        }
    };

};

const loadData = (establishment, type) => {

    establishment.media = [{ url_source: establishment.media }]

    if (type == 'new') {
        userStore.user.customer.establishments.push(establishment);
    }
    if (type == 'edit') {
        userStore.user.customer.establishments = userStore.user.customer.establishments.map((x) => {
            if (x.id == establishment.id) {
                return establishment;
            } else {
                return x;
            }
        });
    }

    activeEstablishmentTab.value = 'establishment_list';
}

watch(establishment_to_update, () => {
    if (establishment_to_update.value != null) {
        data.value = establishment_to_update.value;
        data.value['address1'] = establishment_to_update.value.address || "";
        previewImage.value = establishment_to_update.value.media || "";
        type.value = 'Edit';
    }
})


</script>
<style scoped>
form {
    height: 750px !important;
}

form button {
    min-width: 8rem !important;
}

button.isLoaded {
    display: flex;
    justify-content: center;
    align-items: center;
}

.security__header {
    display: flex;
    justify-content: space-between;
}

.security__header h4 {
    color: var(--color-bg2);
    font-size: 19px;
    font-weight: bold;
}

.security__header p {
    font-size: 15px;
    margin: 8px 0;
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

.image-selector {
    width: 100%;
    height: 250px;
    border-radius: 8px;
    border-width: 2px;
    border-style: solid;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.image-selector.hover:hover {
    background: rgba(245, 245, 250, .4);
}

.image-selector * {
    font-size: 64px;
    color: var(--color-bg2)
}

.img-hover {
    width: 100%;
    height: 100%;
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(245, 245, 250, .4);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.table__container {
    /* overflow-x: scroll; */
    overflow-y: auto;
    width: 85%;
}

form button {
    width: 100%;
}

@media screen and (min-width: 480px) {

    .table__container {
        width: 100%;
    }

    form button {
        width: 12rem !important;
    }
}

@media screen and (max-width: 800px) {

    .table__container,
    .security__header {
        width: 84%;
        /* Occuper toute la largeur sur les petits écrans */
    }
}
</style>