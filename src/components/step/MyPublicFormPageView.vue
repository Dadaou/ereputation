<template>
    <div>
        <div class="security__header border__bottom mt-10"></div>
        <h1 class="title">My public platforms</h1>
        <h1>Let's start by setting up your first establishment </h1>
        <div class="table__container mt-4">
            <form id="establishmentForm" @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                <div class="grid gap-6 mb-6 md:grid-cols-5">
                    <div class="col-span-2">
                        <label for="gps" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google link
                        </label>
                        <input type="text" id="website" name="website" v-model="data.website"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div class="col-span-2">
                        <label for="gps" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tripadvisor link
                        </label>
                        <input type="text" id="website" name="website" v-model="data.website"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                </div>
                <div class="grid gap-6 mb-6 md:grid-cols-4"></div>
                <div
                    class="flex flex-wrap gap-3 items-center justify-between py-2 border-t border-b dark:border-gray-600">
                    <button type="submit"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                            v-if="showSpinner">Loading
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
    </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const previewImage = ref(null);
const data = ref({});
const showSpinner = ref(false);
const type = ref('Add');
const userStore = useUserStore();
const establishment_to_update = inject('establishment_to_update');
const imgHasChanged = ref(false);
const cleanEstablishmentForm = inject('clearEstablishmentForm');


const category = ref('Platform')

const resetForm = () => {
    data.value = {};
    previewImage.value = null;
    type.value = 'Add';
}

watch(cleanEstablishmentForm, () => {
    resetForm();
})

const submit = async () => {

    const form = document.querySelector('#establishmentForm');

    const formData = new FormData(form);

    const establishmentData = { ...data.value, customer: `${userStore.user.customer.tag}` };

    if (establishmentData.universe_id
        && establishmentData.country
        && establishmentData.city
        && establishmentData.zipcode
        && establishmentData.universe_id
        && establishmentData.name
        && establishmentData.address1) {

        formData.append('universe', establishmentData.universe_id);
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

        if (response && response.status == 201) {
            loadData(response.data, 'new')
            ElMessage({
                message: `Establishment added successfully.`,
                type: 'success',
            });
            data.value = {}
            showSpinner.value = false;
        }

        if (response && response.status == 200) {
            loadData(response.data, 'edit')
            ElMessage({
                message: `Establishment updated successfully.`,
                type: 'success',
            });
            data.value = {}
            showSpinner.value = false;
        }
    } else {
        ElMessage.error(`Please, provide all required information to add / update an establishment`);
    }

};

const loadData = (establishment, type) => {
    establishment.url_source = establishment.media

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
    router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'establishments_list' } });
}

watch(establishment_to_update, () => {
    if (establishment_to_update.value != null) {
        data.value = establishment_to_update.value;
        data.value['address1'] = establishment_to_update.value.address || "";
        previewImage.value = establishment_to_update.value.media || "";
        type.value = 'Edit';

    }
});

</script>
<style scoped>
.title {
    margin-bottom: 1.5rem;
    font-weight: 600;
}

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
    overflow-y: auto;
    width: 100%;
}

form button {
    width: 100%;
}

@media screen and (min-width: 480px) {
    form button {
        width: 12rem !important;
    }
}

@media screen and (max-width: 800px) {
    .security__header {
        width: 100%;
    }
}
</style>