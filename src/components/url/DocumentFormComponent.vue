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
                        <el-select v-model="establishment" placeholder="Choose establishment" size="large" clearable
                            filterable :disabled="isEdit">
                            <el-option v-for="item in establishments" :key="item.tag" :label="item.name"
                                :value="item.tag" />
                        </el-select>
                    </div>
                    <div>
                        <label for="caption"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Caption</label>
                        <input type="text" id="caption" v-model="caption" :disabled="isEdit"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2']">
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
                                @change="handleFileChange('document', $event)" accept=".jpg,.jpeg,.png,.gif,.pdf,.zip,.rar,
                                    image/jpeg, image/png, image/gif, image/*,
                                    application/pdf,
                                    application/zip, 
                                    application/x-rar-compressed" style="display:none">
                        </div>
                    </div>

                    <div v-if="isEdit">
                        <label for="link"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link</label>
                        <input type="text" id="link" v-model="link" disabled
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>
                </div>

                <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                    <button type="submit"
                        class="inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                            v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-show="!show">
        <div class="addBtn">
            <el-button type="primary" :icon="Plus" @click="toggleShow">Add</el-button>
        </div>
        <LinksDocumentListComponent @edit="handleEdit" @deleteData="deleteRow" :table-data="documentList" />
    </div>

</template>
<script setup>
import { computed, ref, onBeforeMount, watch, onMounted } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { ElOption, ElSelect, ElButton } from 'element-plus'
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
import { useRoute } from 'vue-router';
import { useLinkStore } from '../../stores/link';
import { Plus, Close } from '@element-plus/icons-vue'
import LinksDocumentListComponent from '../links/LinksDocumentListComponent.vue';
import { onBeforeUnmount } from 'vue';
import draggable from 'vuedraggable';


const route = useRoute();

const userStore = useUserStore();
const selectedDocument = ref(null);
const documentInput = ref(null);
const documentInputHover = ref(false);
const fileName = ref('');
const documentFiles = ref([]);
const linkStore = useLinkStore();
const showModal = ref(false);

const category = ref('Platform')

const showSpinner = ref(false)
const search = ref('')

const link = ref('')
const caption = ref('')
const isValidLink = ref(true)
const establishment = ref(null)

const isEdit = ref(false)
const id = ref('')
const show = ref(false)
const documentList = ref([])

const onEnd = (event) => {
    console.log('Drag ended', event);
};

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
        if (data) {
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

const onChange = (event) => {
    console.log('onChange', event);
};

const handleFiles = (file) => {

    console.log("handleFiles")
    selectedDocument.value = file;
    documentFiles.value = [{
        file: file,
        name: file.name
    }];
    // }
};

const onDocumentDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
        handleFiles(droppedFiles[0]);
    }
};

const selectDocument = () => {
    documentInput.value.click()
}

const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
        selectedDocument.value = file;
        documentFiles.value = [{ file: file, name: file.name }];
    }
};

const submit = async () => {
    showSpinner.value = true;
    const formData = new FormData();

    if (selectedDocument.value) {
        formData.append('file', selectedDocument.value);
        formData.append('type', "document");
    }

    if (isEdit.value) {

        formData.append('id', id.value);
        formData.append('tag', establishment.value)

        let uploadErrors = [];

        if (formData.has('file')) {
            try {
                const response = await new Promise((resolve) => {
                    services.post_Record_formData(`/customer/settings/upload/document`, formData, (response) => {
                        resolve(response);
                    }, false);
                });

                if (response.status !== 200 && response.status !== 201) {
                    uploadErrors.push('An error occurred while uploading the document.');
                    showSpinner.value = false;
                } else {
                    showSpinner.value = false;
                    resetValue()
                    reloadData()
                }
            } catch (error) {
                uploadErrors.push('An error occurred while uploading the document.');
            }
        }
    } else {
        formData.append('tag', establishment.value)
        formData.append('caption', caption.value)

        let uploadErrors = [];

        if (formData.has('file')) {
            try {
                const response = await new Promise((resolve) => {
                    services.post_Record_formData(`/customer/settings/upload/document`, formData, (response) => {
                        resolve(response);
                    }, false);
                });

                if (response.status !== 200 && response.status !== 201) {
                    uploadErrors.push('An error occurred while uploading the document.');
                    showSpinner.value = false;
                } else {
                    showSpinner.value = false;
                    resetValue()
                    reloadData()
                }
            } catch (error) {
                uploadErrors.push('An error occurred while uploading the document.');
            }
        }
    }

    toggleShow()
    //router.push({ name: route.name, params: { ...route.params, tab: route.params.tab, sub_tab: 'urls_list' } });
}

const resetValue = () => {
    documentFiles.value = "";
    selectedDocument.value = null;
    fileName.value = '';
    establishment.value = ''
    link.value = ''
    caption.value = ''
    showModal.value = false
}

const handleEdit = async (data) => {
    establishment.value = data.establishment;
    setTimeout(function () {
        caption.value = data.caption;
        id.value = data.id;
        link.value = data.document_url;

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

watch(category, () => {
    isValidLink.value = true
    link.value = ''
})

const reloadData = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/document/list?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            documentList.value = response.data;
        } else {
            console.error('Error fetching links:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteRow = (settingId) => {
    documentList.value = documentList.value.filter((data) => data.id != settingId)
}


onMounted(async () => {

    if (localStorage.getItem('showForms')) {

        resetValue()
        show.value = true
        const action = linkStore.getAction()

        if (action === 'edit') {

            const externalUrlData = linkStore.getLink()

            if (externalUrlData) {
                externalUrlData.link = externalUrlData.url
            }

            handleEdit(externalUrlData)
        }

    }
});


onBeforeMount(async () => {

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/document/list?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {

            const data = response.data;
            documentList.value = data

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

.closeView,
.addBtn {
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

    .table__container,
    .security__header {
        width: 84%;
        /* Occuper toute la largeur sur les petits écrans */
    }

    .tracking {
        margin-top: 0
    }

    .closeView,
    .addBtn {
        display: flex;
        justify-content: flex-start;
    }

    .closeView {
        margin-left: 30px;
    }

    .addBtn {
        margin-left: 10px;
    }

}

@media screen and (max-width: 500px) {
    form {
        height: 850px !important;
        padding-right: 3.5rem !important;
    }
}

input:disabled {
    background-color: var(--el-fill-color-light);
    box-shadow: 0 0 0 1px var(--el-select-disabled-border) inset;
    color: var(--el-text-color-placeholder);
    cursor: not-allowed;
}
</style>