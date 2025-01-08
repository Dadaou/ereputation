<template>
    <div v-show="show"> 
        <div style="display: flex; justify-content: end;">
            <el-button :icon="Close" @click="toggleShow(true)" circle />
        </div>
        <div class="security__header border__bottom mt-10">
            <div class="security__edit">
                <p>Add the URLs pointing to your internal resources (menus, promotional offers, websites…) so that they are
                    displayed in your Gate.</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
                            <span>*</span></label>
                        <el-select v-model="establishment" placeholder="Choose establishment" size="large"
                            :disabled="IsValueOkay(competitor)" clearable filterable>
                            <el-option v-for="item in establishments" :key="item.tag" :label="item.name"
                                :value="item.uri" />
                        </el-select>
                    </div>
                    <div>
                        <label for="caption"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Caption</label>
                        <input type="text" id="caption" v-model="caption"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                    </div>
                    <div>
                        <label for="section"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Section</label>
                        <el-select id="section" v-model="section" placeholder="" size="large">
                            <el-option v-for="item in sections" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div>
                        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ !isHashtag
                            ? 'Link' : 'Hashtag' }} </label>
                        <p v-if="!isHashtag && provider" class="text-gray-900 text-sm">Url must start with {{
                            splitUriAndUrl(provider).url }}</p>
                        <p v-if="!isValidLink && !isHashtag" class="text-red-500 text-sm">Invalid URL format</p>
                        <p v-if="!isValidHashtag && isHashtag" class="text-red-500 text-sm">Invalid hashtag format</p>
                        <input v-if="isHashtag" type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']"
                            placeholder="#hashtag">
                        <input v-else type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']">
                    </div>
                    <div>
                        <label for="logoFile"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo</label>
                        <div class="drop-area" @dragover.prevent @drop="onLogoDrop">
                            <div class="image-selector border-gray-300" :class="!previewImage && 'hover'"
                                @click="selectLogo" @mouseover="imageInputHover = true"
                                @mouseleave="imageInputHover = false">
                                <draggable v-model="logoFiles" @end="onEnd" @change="onChange">
                                    <template #item="{ element }">
                                        <div class="file-item">
                                            <img v-if="previewImage" :src="previewImage" class="uploading-image" />
                                            <i v-if="imageInputHover" class="uil uil-image-edit img-hover"></i>
                                        </div>
                                    </template>
                                </draggable>
                                <i v-if="!logoFiles.length" class="uil uil-image-plus"></i>
                            </div>
                            <input type="file" id="logoFile" ref="logoInput" @change="handleFileChange('logo', $event)"
                                accept="image/png, image/jpeg, image/gif" style="display:none">
                        </div>
                    </div>
                    <div>
                        <label for="documentFile"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Document</label>
                        <div class="drop-area" @dragover.prevent @drop="onDocumentDrop">
                            <div class="image-selector border-gray-300" @click="selectDocument"
                                @mouseover="documentInputHover = true" @mouseleave="documentInputHover = false">
                                <draggable v-model="documentFiles" @end="onEnd" @change="onChange">
                                    <template #item="{ element }">
                                        <div class="file-item" style="font-size: 16px">
                                            {{ element.name }}
                                            <i v-if="documentInputHover && documentFiles.length"
                                                class="uil uil-file-edit-alt img-hover"></i>
                                        </div>
                                    </template>
                                </draggable>
                                <i v-if="!documentFiles.length" class="uil uil-file-plus"></i>
                            </div>
                            <input type="file" id="documentFile" ref="documentInput"
                                @change="handleFileChange('document', $event)" accept="application/pdf"
                                style="display:none">
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                    <button v-if="!isHashtag" type="submit" :disabled="!isValidLink"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidLink ? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                    <button v-else type="submit" :disabled="!isValidHashtag"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidHashtag ? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div v-show="!show">
        <div style="display: flex; justify-content: end;">
            <el-button type="primary" :icon="Plus" @click="toggleShow">Add</el-button>
        </div>
        <LinksUrlsListComponent @edit="handleEdit" @deleteData="deleteRow" :table-data="urlGateList"/>
    </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, watch, inject } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { ElMessage, ElOption, ElSelect, ElButton } from 'element-plus'
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
import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import {Plus, Close} from '@element-plus/icons-vue'

import LinksUrlsListComponent from '../links/LinksUrlsListComponent.vue';

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['reload']);
const userStore = useUserStore();
const { width } = useWindowSize();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 45;
});
const selectedLogo = ref(null);
const selectedDocument = ref(null);
const previewImage = ref(null);
const imageInputHover = ref(false);
const documentInputHover = ref(false);
const imgHasChanged = ref(false);
const fileName = ref('');
const logoFiles = ref([]);
const documentFiles = ref([]);
const show = ref(false)


const toggleShow = (closeForm = null) => {
    if (closeForm) {
        resetValue()
        isEdit.value = false
    }
    show.value = !show.value;
}

const onLogoDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
        if (isImageFile(droppedFiles[0])) {
            handleFiles(droppedFiles[0], 'logo');
        } else {
            showErrorMessage('Please upload a valid image file for the logo.');
        }
    }
};

const onDocumentDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
        if (isPdfFile(droppedFiles[0])) {
            handleFiles(droppedFiles[0], 'document');
        } else {
            showErrorMessage('Please upload a valid PDF file for the document.');
        }
    }
};

const handleFiles = (file, type) => {
    if (type === 'logo') {
        const reader = new FileReader();
        selectedLogo.value = file;
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            logoFiles.value = [{
                file: file,
                previewImage: e.target.result
            }];
            previewImage.value = e.target.result;
        };
    } else if (type === 'document') {
        selectedDocument.value = file;
        documentFiles.value = [{
            file: file,
            name: file.name
        }];
    }
};

const isImageFile = (file) => {
    return ['image/png', 'image/jpeg', 'image/gif'].includes(file.type);
};

const isPdfFile = (file) => {
    return file.type === 'application/pdf';
};

const selectFiles = () => {
    document.querySelector('input[type="file"]').click();
};

const onEnd = (event) => {
    console.log('Drag ended', event);
};

const onChange = (event) => {
    console.log('Order changed', event);
};

const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
        if (type === 'document') {
            if (isPdfFile(file)) {
                selectedDocument.value = file;
                documentFiles.value = [{ file: file, name: file.name }];
            } else {
                showErrorMessage('Please upload a valid PDF file for the document.');
            }
        } else if (type === 'logo') {
            if (isImageFile(file)) {
                handleFiles(file, 'logo');
            } else {
                showErrorMessage('Please upload a valid image file for the logo.');
            }
        }
        // Reset the input value
        e.target.value = '';
    }
};
const selectLogo = () => {
    document.getElementById('logoFile').click();
}
const selectDocument = () => {
    document.getElementById('documentFile').click();
}
const showErrorMessage = (message) => {
    ElMessage({
        message: message,
        type: 'error',
    });
};
const link_to_update = inject('link_to_update');
const showModal = ref(false);
const showLinkModal = ref(false);
const providers = ref([]);
const provider = ref(null)
const categories = ref(['', 'Hashtag', 'Platform', 'Social'])
const category = ref('Platform')
const sections = ref(['', 'MENUS', 'REVIEWS', 'OFFERS', 'INFOS', 'FOLLOW US'])
const section = ref('')
const showSpinner = ref(false)
const search = ref('')
const searchLink = ref('')
const link = ref('')
const caption = ref('')
const isValidLink = ref(true)
const establishment = ref(null)
const allLinks = ref([])
const isLoading = ref(false)
const title = computed(() => {
    return showLinkModal.value ? 'Links list' : 'Links configuration'
})
const currentEstablishment = ref(null)
const competitors = inject('competitorsData');
const competitor = ref(null)
const links = inject('links');

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const isHashtag = computed(() => {
    return category.value == 'Hashtag';
})

const isEdit = ref(false)
const id = ref('')

const urlGateList = ref([])


const establishments = computed(() => {
    let data = [];
    let filteredData = [];
    if (userStore.user && userStore.user.customer) {
        data = userStore.user.customer.establishments;
        if(data) {
            data.forEach(establishment => {
            filteredData.push({
                name: establishment.name,
                media: (establishment.url_source) ? establishment.url_source : '',
                tag: establishment.competitor_tag,
                uri: `/api/establishments/${establishment.id}`,
            })
        });
        }

    }

    filteredData = filteredData.filter((data) => {
        return !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
    })

    return filteredData;
});

onBeforeMount(() => {

    if (establishments.value.length > 0) {
        establishment.value = establishments.value[0].uri; // Ou équivalent en fonction de la structure de vos données
    }
});
const filteredLinks = computed(() => {
    let filteredData = allLinks.value;
    filteredData = filteredData.filter((data) => {
        return !searchLink.value ||
            data.name.toLowerCase().includes(searchLink.value.toLowerCase()) ||
            (data.category && data.category.toLowerCase().includes(searchLink.value.toLowerCase())) ||
            (data.establishment && data.establishment.toLowerCase().includes(searchLink.value.toLowerCase()))
    })
    return filteredData
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

const isValidHashtag = computed(() => {
    return true
})

const handleDelete = async (index, link) => {
    try {
        const response = await new Promise((resolve, reject) => {
            services.patchRecord('settings', link.id, { enable: false }, (response) => {
                resolve(response);
            });
        });
        if (response.status == 200) {
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


const urlPattern = (urlTemplate, extensions = ['fr', 'es', 'com']) => {
    const url = new URL(urlTemplate);

    const domainParts = url.hostname.split('.');

    let regexPattern = urlTemplate.replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    regexPattern = regexPattern.replace(/{value1}/g, '(.+)');
    regexPattern = regexPattern.replace(/q=/g, '');

    const extensionPattern = extensions.join('|');
    regexPattern = regexPattern.replace(new RegExp(`\\.${domainParts[domainParts.length - 1]}`), `.(?:${extensionPattern})`);

    return new RegExp('^' + regexPattern);
};

const splitUriAndUrl = (combinedString) => {
    if (combinedString !== '') {
        const urlPattern = /https?:\/\/\S+/;
        const match = combinedString.match(urlPattern);

        if (match) {
            const url = match[0];
            const uri = combinedString.replace(url, '').trim();

            const urlObject = new URL(url);
            const baseUrl = urlObject.origin;

            return { uri, url, baseUrl };
        }
    }

    return { uri: combinedString, url: null, baseUrl: null };
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

const transformLinksData = (inputData, tag) => {
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

const LoadLinks = (link) => {
    links.value.push(link);
}

const loadLinksByEstablishment = async (etab) => {
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
            allLinks.value = transformLinksData(response.data.data, etab.tag)
            isLoading.value = false
        }
    } catch (error) {
        console.log(error)
    }
}

const getHashtagValue = (value) => {
    if (value.startsWith("#")) {
        return value.slice(1);
    }
    return value
}


const submit = async () => {
    const formData = new FormData();
    const formDataTwo = new FormData();
    if (selectedLogo.value) {
        formData.append('file', selectedLogo.value);
        formData.append('type', "logo");
    }
    if (selectedDocument.value) {
        formDataTwo.append('file', selectedDocument.value);
        formDataTwo.append('type', "document");
    }
   

    let urlObject = null;
    if (provider.value) {
        urlObject = splitUriAndUrl(provider.value);
    }

    if(!section.value) {

        ElMessage({
            message: `Please select a section`,
            type: 'warning',
        });

        return
    }

    showSpinner.value = true;

    const data = {
        value1: isHashtag.value ? getHashtagValue(link.value) : (urlObject ? getValueUrl(link.value, urlObject.url) : link.value),
        provider: null,
        enable: false,
        section: section.value,
        caption: caption.value,
    };

    if (IsValueOkay(establishment.value)) data.establishment = establishment.value;
    if (IsValueOkay(competitor.value)) data.establishment = competitor.value;

    if (isEdit.value) {
        try {
            const response = await new Promise(async (resolve) => {
                services.putRecord('settings', id.value, data, async (response) => {
                    resolve(response);
                    const settingUrl = response.data['@id'];
                    const lastSlashIndex = settingUrl.lastIndexOf('/') + 1;
                    const settingId = settingUrl.substring(lastSlashIndex);

                    formData.append('id', settingId);
                    formDataTwo.append('id', settingId);

                    let uploadErrors = [];

                    if (formData.has('file')) {
                        try {
                            const response = await new Promise((resolve) => {
                                services.post_Record_formData(`/customer/settings/upload`, formData, (response) => {
                                    resolve(response);
                                }, false);
                            });

                            

                            if (response.status !== 200 && response.status !== 201) {
                                uploadErrors.push('An error occurred while uploading the logo.');
                            }
                        } catch (error) {
                            uploadErrors.push('An error occurred while uploading the logo.');
                        }
                    }

                    if (formDataTwo.has('file')) {
                        try {
                            const response = await new Promise((resolve) => {
                                services.post_Record_formData('/customer/settings/upload', formDataTwo, (response) => {
                                    resolve(response);
                                }, false);
                            });
                            if (response.status !== 200 && response.status !== 201) {
                                // uploadErrors.push('An error occurred while uploading the document.');
                            }
                        } catch (error) {
                            // uploadErrors.push('An error occurred while uploading the document.');
                        }
                    }

                    if (uploadErrors.length > 0) {
                        uploadErrors.forEach(error => ElMessage.error(error));
                    }
                });
            });

            if (response.status == 200) {
                ElMessage({
                    message: `link updated successfully`,
                    type: 'success',
                })
                showSpinner.value = false;
                isEdit.value = false
                resetValue()
                reloadData()
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const response = await new Promise((resolve) => {
                services.createRecord('settings', data, async (response) => {
                    resolve(response);
                    const settingUrl = response.data['@id'];
                    const lastSlashIndex = settingUrl.lastIndexOf('/') + 1;
                    const settingId = settingUrl.substring(lastSlashIndex);
                    formData.append('id', settingId);
                    formDataTwo.append('id', settingId);
                    let uploadErrors = [];
                    if (formData.has('file')) {
                        try {
                            const response = await new Promise((resolve) => {
                                services.post_Record_formData('/customer/settings/upload', formData, (response) => {
                                    resolve(response)
                                }, false);
                            })

                            if (response.status !== 200 && response.status !== 201) {
                                uploadErrors.push('An error occurred while uploading the logo.');
                            }
                        } catch (error) {
                            uploadErrors.push('An error occurred while uploading the logo.');
                        }
                    }

                    if (formDataTwo.has('file')) {
                        try {
                            const response = await new Promise((resolve) => {
                                services.post_Record_formData('/customer/settings/upload', formDataTwo, (response) => {
                                    resolve(response)
                                }, false);
                            });
                            if (response.status !== 200 && response.status !== 201) {
                                uploadErrors.push('An error occurred while uploading the document.');
                            }
                        } catch (error) {
                            uploadErrors.push('An error occurred while uploading the document.');
                        }
                    }

                    if (uploadErrors.length > 0) {
                        uploadErrors.forEach(error => ElMessage.error(error));
                    }
                });
            });

            if (response.status == 201) {
                ElMessage({
                    message: `url to gate added successfully`,
                    type: 'success',
                })
                showSpinner.value = false;
                resetValue()
                reloadData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    toggleShow()
    //router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'urls_list' } });
}

const reloadData = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all&type=all`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            urlGateList.value = response.data.filter(item => (item.idprovider === null || item.idprovider === "") && (item.section !== null || item.section !== "") && item.category == null && item.external_url == null )
        } else {
            console.error('Error fetching links:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteRow = (settingId) => {
    urlGateList.value = urlGateList.value.filter((data) => data.id != settingId)
}

const resetValue = () => {
    documentFiles.value = "";
    selectedDocument.value = null;
    fileName.value = '';
    previewImage.value = null;
    establishment.value = ''
    provider.value = null
    isValidLink.value = true
    link.value = ''
    section.value = ''
    caption.value = ''
    showModal.value = false
}

const getURIbyName = (name) => {
    let data = filteredProviders.value
    data = data.filter(item => item.name == name)
    if (data.length > 0) return `${data[0].uri}${data[0].url}`
    return ''
}

const handleEdit = async (data) => {
    category.value = data.category
    establishment.value = data.establishment;
    setTimeout(function () {
        category.value = data.category;
        link.value = data.link;
        provider.value = data.provider;
        section.value = data.section;
        caption.value = data.caption;
        id.value = data.id;

        if (data.logo) {
            previewImage.value = data.logo;
            logoFiles.value = [{
                file: null,
                previewImage: data.logo
            }];
        } else {
            previewImage.value = null;
            logoFiles.value = [];
        }

        if (data.document_url) {
            selectedDocument.value = { name: data.document_url.split('/').pop() };
            documentFiles.value = [{
                file: null,
                name: data.document_url.split('/').pop()
            }];
        } else {
            selectedDocument.value = null;
            documentFiles.value = [];
        }
    }, 250);

    isEdit.value = true;
    toggleShow()
}

watch([provider, link], () => {
    let urlTemplate;

    if (provider.value !== null && link.value !== '') {
        urlTemplate = splitUriAndUrl(provider.value).url;
        if (urlTemplate) isValidLink.value = isValidUrl(link.value, urlTemplate)
    } else {
        isValidLink.value = true
    }

})

watch(category, () => {
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
            services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all&type=all`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {

            const data = response.data;
            urlGateList.value = data.filter(item => (item.idprovider === null || item.idprovider === "") && (item.section !== null || item.section !== "") && item.external_url == null && item.external_url == null)

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
    height: 150px !important;
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

.profile__header {
    display: flex;
    justify-content: space-between;
}


.profile__header h2 {
    color: var(--color-bg2);
}

.profile__header p {
    font-size: 14px;
    color: grey;
    font-weight: 500;
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

@media screen and (max-width: 500px) {
    form {
        height: 850px !important;
        padding-right: 3.5rem !important;
    }
}
</style>