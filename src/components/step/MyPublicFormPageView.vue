<template>
    <div>
        <div class="security__header border__bottom mt-10"></div>
        <h1 class="title">My public platforms</h1>
        <h1>Let's start by setting up your first establishment </h1>
        <div class="table__container mt-4">
            <div>
                <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="google"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google</label>
                            <input type="text" id="google" v-model="google"
                                :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                        </div>
                        <div>
                            <label for="tripadvisor"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tripadvisor</label>
                            <input type="text" id="tripadvisor" v-model="tripadvisor"
                                :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                        </div>
                        <div>
                            <label for="providers"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Providers</label>
                            <el-select id="providers" v-model="provider" placeholder="Choose provider" size="large"
                                filterable clearable>
                                <el-option v-for="item in dataPlatforms" :key="item.uri" :label="item.name"
                                    :value="`${item.uri}${item.url}`" />
                            </el-select>
                        </div>
                        <div>
                            <label for="socials"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Social</label>
                            <el-select id="socials" v-model="social" placeholder="Choose social" size="large" filterable
                                clearable>
                                <el-option v-for="item in dataSocials" :key="item.uri" :label="item.name"
                                    :value="`${item.uri}${item.url}`" />
                            </el-select>
                        </div>

                    </div>
                    <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                        <button v-if="!isHashtag" type="submit" :disabled="!isValidLink"
                            :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidLink ? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                            <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                                v-if="showSpinner">Loading
                                ...</span>
                            <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                        </button>
                        <button v-else type="submit" :disabled="!isValidHashtag"
                            :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidHashtag ? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                            <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                                v-if="showSpinner">Loading
                                ...</span>
                            <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import services from '@Services/services.js';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['reload']);
const showModal = ref(false);
const showSpinner = ref(false);
const provider = ref(null);
const section = ref('');
const caption = ref('');
const link = ref('');
const isValidLink = ref(true);
const dataSocials = ref([]);
const dataPlatforms = ref([]);

const submit = async () => {
    showSpinner.value = true;

    let urlObject = null;
    if (provider.value) {
        urlObject = splitUriAndUrl(provider.value);
    }

    const data = {
        value1: urlObject ? getValueUrl(link.value, urlObject.url) : link.value,
        provider: urlObject ? urlObject.uri : null,
        enable: true,
        section: section.value,
        caption: caption.value,
    };

    try {
        const response = await new Promise((resolve) => {
            services.createRecord('settings', data, (response) => {
                resolve(response);
            });
        });

        if (response.status == 201) {
            ElMessage({
                message: `provider URL added successfully`,
                type: 'success',
            });
            showSpinner.value = false;
            resetValue();
            emit('reload');
        }
    } catch (error) {
        console.log(error);
    }

    router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'urls_list' } });
};

watch([provider, link], () => {
    let urlTemplate;

    if (provider.value !== null && link.value !== '') {
        urlTemplate = splitUriAndUrl(provider.value).url;
        if (urlTemplate) isValidLink.value = isValidUrl(link.value, urlTemplate);
    } else {
        isValidLink.value = true;
    }
});


const resetValue = () => {
    provider.value = null;
    isValidLink.value = true;
    link.value = '';
    section.value = '';
    caption.value = '';
    showModal.value = false;
};


onBeforeMount(async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`providers`, (response) => {

                resolve(response);
            });
        });

        if (response.status === 200) {
            const dataSocial = response.data['hydra:member'];
            dataSocials.value = dataSocial.filter(item => item.category === 'Social');
            const dataPlatform = response.data['hydra:member'];
            dataPlatforms.value = dataPlatform.filter(item => item.category === 'Platform');
        } else {
            console.error('Error fetching providers:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
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