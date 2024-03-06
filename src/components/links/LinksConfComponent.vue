<template>
    <div class="profile__header mt-2">
        <div class="profile__edit">
            <div class="links__header">
                <h2>{{title}}</h2>
                <button v-if="showLinkModal" @click="showLinkModal = !showLinkModal">Back</button>
            </div>
            <p v-if="!showLinkModal">Configure all links related to your establishments</p>
        </div>
    </div>
    <div class="mt-5 table__container" v-if="!showLinkModal">
        <el-table :data="establishments">
            <el-table-column width="200">
                <template #default="scope">
                    <img :src="scope.row.media">
                </template>
            </el-table-column>
            <el-table-column label="Name" prop="name" style="width: 75%; min-width: 200px;" />
            <el-table-column style="width: 25%; min-width: 200px;" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="showModal = !showModal, establishment = scope.row.uri"><i
                            class="uil uil-link-add"></i></el-button>

                    <el-button size="small" @click="loadLinksByEstablishment(scope.row), currentEstablishment = scope.row"><i
                            class="uil uil-file-alt"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="mt-5 table__container" v-else>
        <el-table :data="allLinks">
            <el-table-column label="Establishment" prop="establishment" style="width: 50%; min-width: 200px;" />
            <el-table-column label="Provider" prop="name" style="width: 50%; min-width: 200px;" />
            <el-table-column label="Value" prop="settings_value1" style="width: 50%; min-width: 200px;" />
            <el-table-column style="width: 25%; min-width: 200px;" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)"><i
                            class="uil uil-edit"></i></el-button>
                    <el-button size="small">
                         <a :href="scope.row.url" target="_blank" class="external-link"><i
                                class="uil uil-external-link-alt"></i></a>
                    </el-button>
                    <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
                        <template #reference>
                          <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ModalComponent :showModal="showModal" @close="resetValue" :width="modalWidth">
        <template #content>
            <div class="modal__header">
                <div class="modal__title">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        <i class="uil uil-link-add"></i> Add new link
                    </h3>
                </div>
                <div class="modal__close">
                    <i class="uil uil-times-circle" @click="resetValue"></i>
                </div>
            </div>

            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                            <span>*</span></label>
                        <el-select v-model="category" placeholder="Choose category" size="large">
                            <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div>
                        <label for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Providers
                            <span>*</span></label>
                        <el-select v-model="provider" placeholder="Choose provider" size="large" filterable>
                            <el-option v-for="item in filteredProviders" :key="item.uri" :label="item.name"
                                :value="`${item.uri}${item.url}`" />
                        </el-select>
                    </div>
                </div>
                <div> 
                    <div>
                        <div id="url_example" v-if="provider || isHashtag">
                            {{!isHashtag?`Follow this template: ${splitUriAndUrl(provider).url}`:' Follow this example: #hashtag' }}
                        </div>

                        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> {{!isHashtag?'Paste the link here':'Hashtag value'}} <span>*</span></label>
                        <p v-if="!isValidLink && !isHashtag" class="text-red-500 text-sm">Invalid URL format</p>
                        <p v-if="!isValidHashtag && isHashtag" class="text-red-500 text-sm">Invalid hashtag format</p>
                        <input v-if="isHashtag" type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']" placeholder="#hashtag" required>
                        <input v-else type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']" required>
                       
                    </div>
                </div>
                <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">

                    <button v-if="!isHashtag" type="submit" :disabled="!isValidLink || !provider"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidLink || !provider? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                    <button v-else type="submit" :disabled="!isValidHashtag || !provider"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidHashtag || !provider? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                </div>
            </form>
        </template>
    </ModalComponent>
</template>
<script setup>
import { computed, defineAsyncComponent, ref, onBeforeMount, watch } from 'vue'
import { useUserStore } from "@Stores/user.js"
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput, ElOption, ElSelect, ElPopconfirm
} from 'element-plus'
import { useWindowSize } from '@vueuse/core';
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import services from '@Services/services.js';
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const userStore = useUserStore();
const { width } = useWindowSize();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 45;
});
const showModal = ref(false);
const showLinkModal = ref(false);
const providers = ref([]);
const provider = ref(null)
const categories = ref(['Hashtag','Platform', 'Social'])
const category = ref('Platform')
const showSpinner = ref(false)
const search = ref('')
const link = ref('')
const isValidLink = ref('true')
const establishment = ref('')
const links = ref([])
const allLinks = ref([])
const isLoading = ref(false)
const title = computed(()=>{
    return showLinkModal.value?'Links list': 'Links configuration'
})
const currentEstablishment = ref(null)

const isHashtag = computed(()=>{
    return category.value == 'Hashtag';
})

const isEdit = ref(false)
const id= ref('')

const establishments = computed(() => {
    let data = [];
    let filteredData = [];
    if (userStore.user && userStore.user.customer) {
        data = userStore.user.customer.establishments;
        data.forEach(establishment => {
            filteredData.push({
                name: establishment.name,
                media: (establishment.url_source) ? establishment.url_source : '',
                tag: establishment.competitor_tag,
                uri: `/api/establishments/${establishment.id}`,
            })
        });
    }
     filteredData = filteredData.filter((data)=>{
        return !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
    })
    return filteredData;
});

const filteredLinks = computed(() => {
    let data = links.value;
    return data.filter(item => item.establishment == establishment.value);
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

const isValidHashtag = computed(()=>{
    console.log(link.value.startsWith("#"))
    if(link.value != ''){
        if (link.value.startsWith("#")) {
            return true;
        }else{
            return false
        }
    }
    return true
})

const handleDelete = async (index, link)=>{
    try {
        const response = await new Promise((resolve, reject) => {
            services.patchRecord('settings', link.id, {enable: false}, (response) => {
                resolve(response);
            });
        });
        
        if (response.status == 204) {
            ElMessage({
                message: `Links deleted successfully`,
                type: 'success',
            })
            loadLinksByEstablishment(currentEstablishment.value)
        }
    } catch (error) {
        console.log(error)
    }
}

const urlPattern = (urlTemplate) => {
    let regexPattern = urlTemplate.replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    regexPattern = regexPattern.replace(/{value1}/g, '(.+)');
    return new RegExp('^' + regexPattern);
}

const splitUriAndUrl = (combinedString) => {
    if (combinedString !== '') {
        const urlPattern = /https?:\/\/\S+/;
        const match = combinedString.match(urlPattern);

        if (match) {
            const url = match[0];
            const uri = combinedString.replace(url, '').trim();
            return { uri, url };
        }
    }

    return { uri: combinedString, url: null };
}

const isValidUrl = (url, urlTemplate) => {
    const pattern = urlPattern(urlTemplate);
    let isValid = false

    if (pattern.test(url)) {
        isValid = true;
    }

    return isValid
}

const getValueUrl = (url, urlTemplate) => {
    const pattern = urlPattern(urlTemplate);
    const matches = url.match(pattern);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return null;
}

const transformLinksData = (inputData, tag)=> {
    return inputData.map(item => {
        return {
            establishment: item.establishment_name || '',
            establishmentTag: tag,
            category: item.provider_category || '',
            name: item.provider_name || '',
            providerurl: item.provider_url,
            url: item.provider_url ? item.provider_url.replace('{value1}', item.settings_value1) : '',
            id: item.settings_id || 0,
            settings_value1: item.settings_value1 || ''
        };
    });
}

const loadLinksByEstablishment = async (etab) =>{
     showLinkModal.value = !showLinkModal.value
     isLoading.value = true
     establishment.value = etab.uri

     try {
        const response = await new Promise((resolve) => {
            services.get_Record(`establishment/url?tag=${etab.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status == 200) {
           console.log(response.data)
           allLinks.value = transformLinksData(response.data.data, etab.tag)
           console.log(allLinks.value)
           isLoading.value = false
        }
    } catch (error) {
        console.log(error)
    }
}

const getHashtagValue = (value)=>{
    if (value.startsWith("#")) {
        return value.slice(1); 
    }
}

const submit = async () => {
    showSpinner.value = true;
    let urlObject = splitUriAndUrl(provider.value)

    const data = {
        value1: isHashtag.value?getHashtagValue(link.value):getValueUrl(link.value, urlObject.url),
        establishment: establishment.value,
        provider: urlObject.uri,
        enable: true
    }
    if(isEdit.value){
        try {
            const response = await new Promise((resolve) => {
                    services.putRecord('settings', id.value, data, (response) => {
                        resolve(response);
                    });
            });
            console.log(response)
            if (response.status == 200) {
                ElMessage({
                    message: `link updated successfully`,
                    type: 'success',
                })
                loadLinksByEstablishment(establishment.value)
                showSpinner.value = false;
                isEdit.value = false
                resetValue()
            }
        } catch (error) {
            console.log(error)
        }
    }else{
        try {
            const response = await new Promise((resolve) => {
                    services.createRecord('settings', data, (response) => {
                        resolve(response);
                    });
            });
            if (response.status == 201) {
                ElMessage({
                    message: `link added successfully`,
                    type: 'success',
                })
                showSpinner.value = false;
                resetValue()
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const resetValue = () => {
    establishment.value = ''
    provider.value = null
    isValidLink.value = true
    link.value = ''
    showModal.value = false
}

const getURIbyName = (name)=>{
    let data = filteredProviders.value
    console.log(data)
    data = data.filter(item=> item.name == name)
    console.log(data)
    if(data.length>0) return `${data[0].uri}${data[0].url}`
    return ''
}

const handleEdit = (data) => {
    showModal.value = true
    category.value = data.category
    setTimeout(function() {
      link.value = data.category=='Hashtag'?`#${data.settings_value1}`:data.url
    }, 250);
    id.value = data.id
    isEdit.value = true
    provider.value = getURIbyName(data.name)
}

watch([provider, link], () => {
    let urlTemplate;
    
    if (provider.value !== null && link.value !== '') {
        urlTemplate = splitUriAndUrl(provider.value).url;
        if (urlTemplate) isValidLink.value = isValidUrl(link.value, urlTemplate)
    }

})

watch(category, ()=>{
    isValidLink.value = true
    link.value = ''
})

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
.links__header{
    display: flex;
    justify-content: space-between;
}

.links__header button{
    background-color: var(--color-primary);
    color: white;
    font-weight: 500;
    font-size: 14px;
    padding: 2px 10px;
    border-radius: 2px;
}

.link-list {
    list-style: none;
    padding: 0;
}

.link-list li {
    border-bottom: 1px solid #ccc;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.link-text {
    font-size: 16px;
    color: #333;
    margin-right: 10px;
}

.actions {
    display: flex;
    align-items: center;
}

.actions a,
.actions i {
    color: #555;
    font-size: 18px;
    margin-left: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.actions a:hover,
.actions i:hover {
    color: #000;
}

.external-link {
    text-decoration: none;
    cursor: pointer;
}

.delete-icon {
    /* Optional: You might want to add some specific style for the delete icon */
}


input {
    caret-color: var(--color-primary) !important;
}

#url_example {
    font-size: 14px;
    color: grey;
    font-weight: 500;
}

.profile__edit h2 {
    font-weight: 600;
    font-size: 18px;
}

.profile__header h2 {
    color: var(--color-bg2);
}

.profile__header p {
    font-size: 14px;
    color: grey;
    font-weight: 500;
}

img {
    height: 50px;
    object-fit: cover;
    width: 100%;
}

.modal__header {
    display: flex;
    justify-content: space-between;
}

.modal__header div {
    align-self: center;
}

.modal__close i {
    float: right;
    font-size: 25px;
    color: red;
    cursor: pointer;
    transition: var(--transition);
}

.establishment__review__qrcode p {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.qr__code {
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__close i:hover {
    transform: rotate(360deg);
}

.link-list li {
    max-width: 100%;
    overflow: auto hidden;
}

.table__container {
    /* overflow-x: scroll; */
    width: 85%;
}

@media screen and (min-width: 800px) {

    .table__container {
        width: 100%;
    }
}
</style>