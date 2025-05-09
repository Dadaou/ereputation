<template>
    <div v-show="show"> 
        <div class="closeView">
            <el-button :icon="Close" @click="toggleShow(true)" circle />
        </div>
        <div class="security__header border__bottom mt-10">
            <div class="security__edit">
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
                            :disabled="IsValueOkay(competitor)" clearable>
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
                        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ !isHashtag
                            ? 'Link' : 'Hashtag' }} </label>
                        <p v-if="!isValidLink && !isHashtag" class="text-red-500 text-sm">Invalid URL format</p>
                        <p v-if="!isValidHashtag && isHashtag" class="text-red-500 text-sm">Invalid hashtag format</p>
                        <input v-if="isHashtag" type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']"
                            placeholder="#hashtag">
                        <input v-else type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']">
                    </div>

                    <div class="tracking" v-if="!isEdit">
                        <el-checkbox v-model="noTracking" label="Direct link (no tracking)" size="large" />
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
        <div class = "addBtn">
            <el-button type="primary" :icon="Plus" @click="toggleShow">Add</el-button>
        </div>
        <LinksUrlsListComponent @edit="handleEdit" @deleteData="deleteRow" :table-data="externalUrlList"/>
    </div>

</template>
<script setup>
import { computed, ref, onBeforeMount, watch, inject, onMounted } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { ElMessage, ElOption, ElSelect, ElButton, ElCheckbox } from 'element-plus'
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
import { useLinkStore } from '../../stores/link';
import {Plus, Close} from '@element-plus/icons-vue'
import LinksUrlsListComponent from '../links/LinksUrlsListComponent.vue';
import { onBeforeUnmount } from 'vue';


const router = useRouter();
const route = useRoute();

const emit = defineEmits(['reload']);
const userStore = useUserStore();
const selectedDocument = ref(null);
const previewImage = ref(null);
const fileName = ref('');
const documentFiles = ref([]);
const linkStore = useLinkStore();
const link_to_update = inject('link_to_update');
const showModal = ref(false);

const category = ref('Platform')

const section = ref('')
const showSpinner = ref(false)
const search = ref('')

const link = ref('')
const caption = ref('')
const isValidLink = ref(true)
const establishment = ref(null)
const noTracking = ref(false)


const competitor = ref(null)
const links = inject('links');

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;
const isHashtag = computed(() => {
    return category.value == 'Hashtag';
})

const isEdit = ref(false)
const id = ref('')
const show = ref(false)
const externalUrlList = ref([])

const toggleShow = (closeForm = null) => {
    if (closeForm) {
        resetValue()
        localStorage.removeItem('showForms')
        linkStore.resetLink()
        linkStore.setAction(null)
        isEdit.value = false
    }
    show.value = !show.value;
}

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



const isValidHashtag = computed(() => {
    return true
})

const submit = async () => {
    showSpinner.value = true;

    const data = {
        externalUrl: true,
        value1: link.value,
        provider: null,
        enable: false,
        section: null,
        caption: caption.value,
        noTracking : noTracking.value
    };

    if (IsValueOkay(establishment.value)) data.establishment = establishment.value;
    if (IsValueOkay(competitor.value)) data.establishment = competitor.value;

    if (isEdit.value) {
        try {
            const response = await new Promise(async (resolve) => {
                services.putRecord('settings', id.value, data, async (response) => {
                    resolve(response);
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
            console.error("Error details:", error.response ? error.response.data : error);
            ElMessage.error("An error occurred while updating the link.");
        }
    } else {
        try {
            const response = await new Promise((resolve) => {
                services.createRecord('settings', data, async (response) => {
                    resolve(response);
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

const resetValue = () => {
    documentFiles.value = "";
    selectedDocument.value = null;
    fileName.value = '';
    previewImage.value = null;
    establishment.value = ''
    isValidLink.value = true
    link.value = ''
    section.value = ''
    caption.value = ''
    showModal.value = false
}

const handleEdit = async (data) => {
    category.value = data.category
    establishment.value = data.establishment
    noTracking.value = data.no_tracking === null ? false : data.no_tracking

    setTimeout(function () {
        link.value = data.link;
        if (establishments.value.length > 0) {
            const estab = establishments.value.find(item => item.name === data.establishment_name);
            establishment.value = estab ? estab.uri : null;
        }
        caption.value = data.caption;
        id.value = data.id;
    }, 250);

    isEdit.value = true;
    show.value = true;
}

watch(category, () => {
    isValidLink.value = true
    link.value = ''
})

const reloadData = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all&type=all`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            externalUrlList.value = response.data.filter(item => item.external_url === true);
        } else {
            console.error('Error fetching links:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteRow = (settingId) => {
    externalUrlList.value = externalUrlList.value.filter((data) => data.id != settingId)
}


onMounted(async () => {

    /*const data = linkStore.getLink();

    if (data) {
        link_to_update.value = data;
        linkStore.resetLink();
    } else {

        if (!userStore.user.customer.establishments || userStore.user.customer.establishments.length === 0) {
            await userStore.fetchCustomerEstablishments();
        }
    }*/


    if(localStorage.getItem('showForms')) {

        resetValue()
        show.value = true
        const action = linkStore.getAction()
        
        if(action === 'edit') {  

            const externalUrlData = linkStore.getLink()

            if(externalUrlData) {
                externalUrlData.link = externalUrlData.url
            }

            handleEdit(externalUrlData)
        }

    }
});


onBeforeMount(async() => {


if (establishments.value.length > 0) {
    establishment.value = establishments.value[0].uri;
}


try {
    const response = await new Promise((resolve) => {
        services.get_Record(`customer/setting/list?tag=${route.params.tag}&categ=all&type=all`, (response) => {
            resolve(response);
        });
    });

    if (response.status === 200) {

        const data = response.data;
        externalUrlList.value = data.filter(item => item.external_url === true)

    } else {
        console.error('Error setting:', response);
    }
} catch (error) {
    console.error('Error fetching setting', error);
}
});

onBeforeUnmount(() => {
    localStorage.removeItem('showForms')
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

.tracking {
    margin-top: 28px
}
.closeView, .addBtn {
    display: flex; 
    justify-content: flex-end;
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

    .table__container {
        width: 88%;
    }
    .security__header {
        width: 84%;
        /* Occuper toute la largeur sur les petits écrans */
    }

    .tracking {
        margin-top: 0
    }

    .closeView, .addBtn {
        display: flex; 
        justify-content: flex-start;
    }

    form {
        margin: 15px 0;
    }

}
@media screen and (max-width: 500px) {
    form {
        height: 850px !important;
        padding-right: 3.5rem !important;
    }
}
</style>