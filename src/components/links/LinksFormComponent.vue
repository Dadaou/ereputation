<template>
    <div class="security__header border__bottom mt-10">
       <!--  <div class="security__edit">
            <h4><i class="uil uil-company"></i> Establishment</h4>
            <p>Please provide the necessary information to add a new establishment.</p>
        </div> -->
    </div>
    <div class="table__container">
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-12 mb-12 ">
                
                <div class="md:order-1">
                    <div  class="mb-6">
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment <span>*</span></label>
                        <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                            <el-option
                            v-for="item in userStore.user.customer.establishments"
                            :key="item.id"
                            :label="item.name"
                            :value="`/api/establishments/${item.id}`"
                            />
                        </el-select>
                    </div>
                    <div class="mb-6">
                        <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categorie
                            <span>*</span></label>
                        <input type="text" id="company_name" name="name" v-model="category"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                   
                    <div  class="mb-6">
                        <label for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Providers
                            <span>*</span></label>
                        <el-select v-model="provider" placeholder="Choose provider" size="large" filterable>
                            <el-option v-for="item in filteredProviders" :key="item.uri" :label="item.name"
                                :value="`${item.uri}${item.url}`" />
                        </el-select>
                    </div>
                    <div> 
                    <div>
                        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> {{!isHashtag?'Link':'Hashtag'}} <span>*</span></label>
                        <p v-if="!isHashtag && provider" class="text-gray-900 text-sm">Url must start with {{splitUriAndUrl(provider).baseUrl}}</p>
                        <p v-if="!isValidLink && !isHashtag" class="text-red-500 text-sm">Invalid URL format</p>
                        <p v-if="!isValidHashtag && isHashtag" class="text-red-500 text-sm">Invalid hashtag format</p>
                        <input v-if="isHashtag" type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']" placeholder="#hashtag" required>
                        <input v-else type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']" required>
                       
                    </div>
                </div>
                </div>
            </div>
            
            <div class="grid gap-6 mb-6 md:grid-cols-4">

            </div>
            <div class="flex flex-wrap gap-3 items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} links</span>
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
import { ref, inject, watch, onBeforeMount, computed } from 'vue';
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
import { countries, categories, competitor_countries } from '@Services/input-list.js';


const showSpinner = ref(false);
const type = ref('Add');
const userStore = useUserStore();


const isValidLink = ref(true);
const category = ref('Platform');
const provider = ref(null);
const link = ref('');
const establishment = ref('');
const providers = ref([]);
const links = ref([]);

const isHashtag = computed(()=>{
    return category.value == 'Hashtag';
})


const filteredProviders = computed(() => {
    let data = providers.value;
    data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    provider.value = null
    return data.filter(item => item.category == category.value);
})


const resetValue = () => {
    establishment.value = ''
    provider.value = null
    isValidLink.value = true
    link.value = ''
    category.value = ''
}

const splitUriAndUrl = (combinedString) => {
    if (combinedString !== '') {
        const urlPattern = /https?:\/\/\S+/;
        const match = combinedString.match(urlPattern);

        if (match) {
            const url = match[0];
            const uri = combinedString.replace(url, '').trim();

            const urlObject = new URL(url);
            console.log(urlObject)
            const baseUrl = urlObject.origin;

            return { uri, url, baseUrl };
        }
    }

    return { uri: combinedString, url: null, baseUrl: null };
}


const getHashtagValue = (value)=>{
    if (value.startsWith("#")) {
        return value.slice(1); 
    }
    return value
}

const getValueUrl = (url, urlTemplate) => {
    const pattern = urlPattern(urlTemplate);
    const matches = url.match(pattern);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return null;
}

const urlPattern = (urlTemplate) => {
    let regexPattern = urlTemplate.replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    regexPattern = regexPattern.replace(/{value1}/g, '(.+)');
    return new RegExp('^' + regexPattern);
}

const submit = async () => {
    showSpinner.value = true;
    let urlObject = splitUriAndUrl(provider.value)

    console.log("uuuuurlObject",  urlObject);

    const data = {
        value1: isHashtag.value?getHashtagValue(link.value):getValueUrl(link.value, urlObject.url),
        //value1:"tesstttt",
        establishment: establishment.value,
        category: category.value,
        provider: urlObject.uri,
        link: link.value,
        enable: true
    }
   
    console.log(data)
    try {
        const response = await new Promise((resolve) => {
                services.createRecord('settings', data, (response) => {
                    resolve(response);
                });
        });
        console.log("resonseeee ",response);
        if (response.status == 201) {
            ElMessage({
                message: `link added successfully`,
                type: 'success',
            })
            showSpinner.value = false;
            resetValue()
        }
    } catch (error) {
        console.log("erreur   ",error)
    }
};

onBeforeMount(async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`providers`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            const data = response.data['hydra:member'];

            data.forEach(item => {
                providers.value.push({
                    category: item.category,
                    name: item.name,
                    url: item.url,
                    uri: `/api/providers/${item.id}`
                })
            })

        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`setting/list`, (response) => {
                resolve(response);
            });
        });

        console.log(response.data);

        if (response.status === 200) {
            const data = response.data;

            data.forEach(item => {
                links.value.push({
                    category: item.category,
                    source: item.source,
                    url: item.url,
                    establishment: `/api/establishments/${item.establishment_id}`,
                    id: item.id
                })
            })

        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});

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