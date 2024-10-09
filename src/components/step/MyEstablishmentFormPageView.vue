<template>
    <div>
        <div class="security__header border__bottom mt-10"></div>
        <h1 class="title">My establishment</h1>
        <h1>Let's start by setting up your first establishment </h1>
        <div class="table__container">
            <form id="establishmentForm" @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4">
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div class="md:order-2">
                        <div class="image-selector border-gray-300" @dragover.prevent="onDragOver"
                            @drop.prevent="onDrop" @click="selectImg">
                            <div v-if="previewImage" class="image-preview">
                                <img :src="previewImage" alt="Preview Image" class="uploading-image" />
                                <div class="img-hover">
                                    <i class="uil uil-image-edit"></i>
                                </div>
                            </div>
                            <i v-else class="uil uil-image-plus"></i>
                            <input id="imgInput" name="file" type="file" @change="updateImage" style="display:none">
                        </div>
                    </div>
                    <div class="md:order-1">
                        <div class="mb-6">
                            <label for="company_name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                                <span>*</span></label>
                            <input type="text" id="company_name" name="name" v-model="data.name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                        <div class="mb-6">
                            <label for="address1"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address 1
                                <span>*</span></label>
                            <input type="text" id="address1" name="address1" v-model="data.address1"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                        <div>
                            <label for="address2"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address
                                2</label>
                            <input type="text" id="address2" name="address2" v-model="data.address2"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                        </div>
                    </div>
                </div>
                <div class="grid gap-6 mb-6 md:grid-cols-4">
                    <div>
                        <label for="zipcode"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zipcode
                            <span>*</span></label>
                        <input type="text" id="zipcode" name="zipcode" v-model="data.zipcode"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div>
                        <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City
                            <span>*</span></label>
                        <input type="text" id="city" name="city" v-model="data.city"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div>
                        <label for="country"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country
                            <span>*</span></label>
                        <el-select v-model="data.country" placeholder="" size="large" filterable ref="selectCountry">
                            <el-option v-for="(country, index) in competitor_countries" :key="index"
                                :label="country.name" :value="country.name" />
                        </el-select>
                    </div>
                    <div>
                        <label for="category"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                            <span>*</span></label>
                        <el-select v-model="data.universe_id" placeholder="" size="large" filterable>
                            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </div>
                </div>
                <div class="grid gap-6 mb-6 md:grid-cols-5">
                    <div class="col-span-2">
                        <label for="gps" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website
                        </label>
                        <input type="text" id="website" name="website" v-model="data.website"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div>
                        <label for="rank" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rank
                        </label>
                        <input type="text" id="rank" name="rank" v-model="data.rank"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                    <div>
                        <label for="language" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Language
                            <span>*</span></label>
                        <el-select v-model="data.language" placeholder="" size="large" filterable ref="selectLanguage">
                            <el-option v-for="(language, index) in ['fr','en','es']" :key="index" :label="language"
                                :value="language" />
                        </el-select>
                    </div>
                    <div>
                        <label for="positionning"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">positionning
                        </label>
                        <input type="text" id="positionning" name="positionning" v-model="data.positionning"
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
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> Add establishment</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import { competitor_countries } from '@Services/input-list.js';

const emit = defineEmits(['changeStep']);
const previewImage = ref(null);
const imageInputHover = ref(false);
const data = ref({});
const showSpinner = ref(false);
const userStore = useUserStore();
const imgHasChanged = ref(false);
const categories = ref([]);
const selectLanguage = ref(null);

const onDragOver = (event) => {
    imageInputHover.value = true;
};

const onDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (isImageFile(file)) {
            updateImageFromFile(file);
            document.getElementById('imgInput').files = event.dataTransfer.files;
            imgHasChanged.value = true;
        } else {
            showErrorMessage("Veuillez télécharger un fichier image valide.");
        }
    }
};

const isImageFile = (file) => {
    return ['image/png', 'image/jpeg', 'image/gif'].includes(file.type);
};

const updateImageFromFile = (file) => {
    if (isImageFile(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            previewImage.value = e.target.result;
            const event = new Event('change', { bubbles: true });
            document.getElementById('imgInput').dispatchEvent(event);
        };
    } else {
        showErrorMessage("Veuillez télécharger un fichier image valide.");
    }
};


const updateImage = (e) => {
    const image = e.target.files[0];
    if (isImageFile(image)) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            previewImage.value = e.target.result;
        };
        imgHasChanged.value = true;
    } else {
        showErrorMessage("Please upload a valid image file.");
    }
};

const showErrorMessage = (message) => {
    ElMessage({
        message: message,
        type: 'error',
    });
};

const selectImg = () => {
    document.getElementById('imgInput').click();
}

const loadUniverseList = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/universe/list`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            categories.value = response.data;
        } else {
            console.error('Error fetching universe:', response);
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    loadUniverseList();
});


const submit = async () => {
    const form = document.querySelector('#establishmentForm');
    const formData = new FormData(form);
    const establishmentData = { ...data.value, customer: `${userStore.user.customer.tag}` };

    if (establishmentData.universe_id
        && establishmentData.country
        && establishmentData.city
        && establishmentData.language
        && establishmentData.zipcode
        && establishmentData.universe_id
        && establishmentData.name
        && establishmentData.address1) {

        formData.append('universe', establishmentData.universe_id);
        formData.append('country', establishmentData.country);
        formData.append('language', establishmentData.language);
        formData.append('customer', `${userStore.user.customer.tag}`)
        showSpinner.value = true;

        if (!imgHasChanged.value) formData.delete('file');

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
            const establishmentName = response.data.name;
            const competitorId = response.data.id;

            goToNextStep(establishmentName, competitorId);
        }
    } else {
        ElMessage.error(`Please, provide all required information to add an establishment`);
    }
};

const goToNextStep = (establishmentName, competitorId) => {
    emit('changeStep', { step: 2, establishmentName, competitorId });
};

const loadData = (establishment, type) => {
    establishment.url_source = establishment.media

    if (type == 'new') {
        userStore.user.customer.establishments.push(establishment);
    }
}
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