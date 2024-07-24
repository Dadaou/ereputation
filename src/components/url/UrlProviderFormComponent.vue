<template>
    <div class="security__header border__bottom mt-10">
        <div class="security__edit">
            <!-- <h4><i class="uil uil-company"></i> Establishment</h4> -->
            <p>Add the URL of your public review platforms, social medoia profiles, or hashtags you wish to monitor.
                You can display these links into your Gate (Your unique QR Code) by selecting the corresponding section
                in the section field. </p>
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
                    <label for="category"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                    <el-select id="category" v-model="category" placeholder="Choose category" size="large" clearable>
                        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
                    </el-select>
                </div>
                <div>
                    <label for="providers"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Providers</label>
                    <el-select id="providers" v-model="provider" placeholder="Choose provider" size="large" filterable
                        clearable>
                        <el-option v-for="item in filteredProviders" :key="item.uri" :label="item.name"
                            :value="`${item.uri}${item.url}`" />
                    </el-select>
                </div>
                <!-- <div>
                    <label for="caption"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Caption</label>
                    <input type="text" id="caption" v-model="caption"
                        :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
                </div> -->
                <div>
                    <label for="section" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Section
                        <Tooltip
                            text="Please choose the section of the gate (Unified QR code) in which you wish to share this link. Leave it blank to not share it." />
                    </label>
                    <el-select id="section" v-model="section" placeholder="" size="large">
                        <el-option v-for="item in sections" :key="item" :label="item" :value="item" />
                    </el-select>
                </div>
            </div>
            <div>
                <div>
                    <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ !isHashtag
                        ? 'Link' : 'Hashtag' }} <span>*</span></label>
                    <p v-if="!isHashtag && provider" class="text-gray-900 text-sm">Url must start with {{
                        splitUriAndUrl(provider).url }}</p>
                    <p v-if="!isValidLink && !isHashtag" class="text-red-500 text-sm">Invalid URL format</p>
                    <p v-if="!isValidHashtag && isHashtag" class="text-red-500 text-sm">Invalid hashtag format</p>
                    <input v-if="isHashtag" type="text" id="link" v-model="link"
                        :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']"
                        placeholder="#hashtag" required>
                    <input v-else type="text" id="link" v-model="link"
                        :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']"
                        required>
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
</template>

<script setup>
import { computed, defineAsyncComponent, ref, onBeforeMount, watch, inject } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { ElMessage, ElTable, ElTableColumn, ElButton, ElInput, ElOption, ElSelect, ElPopconfirm } from 'element-plus'
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

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
)

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

watch(link_to_update, () => {
    if (link_to_update.value != null) {
        handleEdit(link_to_update.value);
    }
})

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

    filteredData = filteredData.filter((data) => {
        return !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
    })

    return filteredData;
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
    const langAccept = ['fr', 'mu']
    const splitLink = link.value.split('/')
    const existsInB = langAccept.some(item => splitLink.includes(item));
    const pattern = urlPattern(urlTemplate);
    let isValid = false

    if (pattern.test(url)) {
        isValid = true;
    }

    if (existsInB) {
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
    showSpinner.value = true;

    let urlObject = null;
    if (provider.value) {
        urlObject = splitUriAndUrl(provider.value);
    }

    const data = {
        // value1: isHashtag.value ? getHashtagValue(link.value) : (urlObject ? getValueUrl(link.value, urlObject.url) : link.value),
        value1: link.value,
        provider: urlObject ? urlObject.uri : null,
        enable: true,
        section: section.value,
        caption: caption.value,
    };

    if (IsValueOkay(establishment.value)) data.establishment = establishment.value;
    if (IsValueOkay(competitor.value)) data.establishment = competitor.value;

    if (isEdit.value) {
        try {
            const response = await new Promise((resolve) => {
                services.putRecord('settings', id.value, data, (response) => {
                    resolve(response);
                });
            });

            if (response.status == 200) {
                ElMessage({
                    message: `Url provider updated successfully`,
                    type: 'success',
                })
                showSpinner.value = false;
                isEdit.value = false
                resetValue()
                emit('reload');
            }
        } catch (error) {
            console.log(error)
        }
    } else {
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
                })
                showSpinner.value = false;
                resetValue()
                emit('reload');
            }
        } catch (error) {
            console.log(error)
        }
    }

    router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'urls_list' } });
}

const resetValue = () => {
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
    }, 250);

    isEdit.value = true;
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
    if (establishments.value.length > 0) {
        establishment.value = establishments.value[0].uri; // Set the URI of the first establishment
    }
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
            services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all`, (response) => {
                resolve(response);
            });
        });

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

@media screen and (max-width: 500px) {
    form {
        padding-right: 3.5rem !important;
    }
}
</style>