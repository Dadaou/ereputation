<template>
    <div class="profile__header mt-2">
        <div class="profile__edit">
            <h2>Competitors</h2>
        </div>
    </div>
    <div class="mt-5 table__container">
        <el-table :data="competitorsData">
            <!-- <el-table-column width="100">
                <template #default="scope">
                    <img :src="scope.row.media">
                </template>
            </el-table-column> -->
            <el-table-column label="Competitors" prop="name" style="width: 25%; min-width: 200px;" />
            <el-table-column label="Establishments" style="width: 15%; min-width: 200px;" >
                <template #default="scope">
                   {{scope.row.establishments.join(', ')}}
                </template>
            </el-table-column>
            <!-- <el-table-column label="Category" prop="category" style="width: 15%; min-width: 200px;" />
            <el-table-column label="Address" prop="address" style="width: 25%; min-width: 200px;" />
            <el-table-column label="Country" prop="country" style="width: 15%; min-width: 200px;" /> -->
            <el-table-column style="width: 25%; min-width: 200px;" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="showModal = !showModal, establishment = scope.row.uri"><i
                            class="uil uil-link-add"></i></el-button>

                    <el-button size="small" @click="showLinkModal = !showLinkModal, establishment = scope.row.uri"><i
                            class="uil uil-file-alt"></i></el-button>
                    <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
                        <template #reference>
                            <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
                        </template>
                    </el-popconfirm>
                     <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i
                            class="uil uil-edit"></i></el-button>

                    <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i
                            class="uil uil-edit"></i></el-button> -->
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
                    <i class="uil uil-times-circle" @click="showModal = false"></i>
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
                        <el-select v-model="provider" placeholder="Choose provider" size="large">
                            <el-option v-for="item in filteredProviders" :key="item.uri" :label="item.name"
                                :value="`${item.uri}${item.url}`" />
                        </el-select>
                    </div>
                </div>
                <div>
                    <div>
                        <div v-if="provider" id="url_example">
                            Follow this template: {{ splitUriAndUrl(provider).url }}
                        </div>
                        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Paste the
                            link here <span>*</span></label>
                        <p v-if="!isValidLink && link !== ''" class="text-red-500 text-sm">Invalid URL format</p>
                        <input type="text" id="link" v-model="link"
                            :class="['bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2', (!isValidLink && link !== '') ? 'border-red-500 ring-red-500 text-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 focus:outline-none hover:text-red-500 focus:text-red-500' : '']">
                    </div>
                </div>
                <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                    <button type="submit" :disabled="!isValidLink"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800', !isValidLink ? 'bg-gray-500 hover:bg-gray focus:ring-gray-500' : '']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                            ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> submit</span>
                    </button>
                </div>
            </form>

        </template>
    </ModalComponent>
    <ModalComponent :showModal="showLinkModal" @close="showLinkModal = !showLinkModal" :width="modalWidth">
        <template #content>
            <div class="modal__header">
                <div class="modal__title">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        <i class="uil uil-link"></i> All links
                    </h3>
                </div>
                <div class="modal__close">
                    <i class="uil uil-times-circle" @click="showLinkModal = !showLinkModal"></i>
                </div>
            </div>
            <ul class="link-list">
                <li v-for="link in filteredLinks">
                    <div class="link-text">
                        {{ link.url }}
                    </div>
                    <div class="actions">
                        <a :href="link.url" target="_blank" class="external-link"><i
                                class="uil uil-external-link-alt"></i></a>
                        <i @click="remove(link.id)" class="delete-icon uil uil-multiply"></i>
                    </div>
                </li>
            </ul>
        </template>
    </ModalComponent>
</template>
<script setup>
import { computed, defineAsyncComponent, ref, onBeforeMount, watch, inject } from 'vue'
import { useUserStore } from "@Stores/user.js"
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElInput, ElOption, ElSelect, ElDatePicker
} from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import services from '@Services/services.js'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const emit = defineEmits(['edit', 'reload']);

const userStore = useUserStore();
const { width, height } = useWindowSize();
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
const competitorsData = inject('competitorsData')
const reloadCompetitor = inject('reloadCompetitor')

const handleEdit = (index, establishment) => {
    emit('edit', establishment);
}

const establishments = computed(() => {
    let data = [];
    let filteredData = [];
    if (userStore.user && userStore.user.customer) {
        data = userStore.user.customer.establishments;

        data.forEach(establishment => {
            filteredData.push({
                name: establishment.name,
                media: (establishment.media.length > 0) ? establishment.media[0].url_source : '',
                tag: establishment.competitor_tag,
                uri: `/api/establishments/${establishment.id}`,
                gps: establishment.gps,
                country: establishment.country,
                city: establishment.city,
                category: establishment.category,
                address: establishment.address1,
                rank: establishment.rank,
                region: establishment.region,
                zipcode: establishment.zipcode,
                positionning: establishment.positionning
            })
        });
    }
    return filteredData;
});

const filteredLinks = computed(() => {
    let data = links.value;
    return data.filter(item => item.establishment == establishment.value);
})

const filteredProviders = computed(() => {
    let data = providers.value;
    return data.filter(item => item.category == category.value);
})

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

const handleDelete = async(index, competitor)=>{
    console.log(competitor)
    try {
        const response = await new Promise((resolve, reject) => {
            services.deleteRecord('establishments', competitor.id, (response) => {
                resolve(response);
            });
        });
        console.log(response)
        if (response.status == 204) {
            ElMessage({
                message: `Competitor deleted successfully`,
                type: 'success',
            })
            emit('reload')
        }
    } catch (error) {
        console.log(error)
    }
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

const submit = async () => {
    showSpinner.value = true;
    let urlObject = splitUriAndUrl(provider.value)
    const data = {
        value1: getValueUrl(link.value, urlObject.url),
        establishment: establishment.value,
        provider: urlObject.uri,
        enable: true
    }

    try {
        const response = await new Promise((resolve, reject) => {
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

const resetValue = () => {
    establishment.value = ''
    provider.value = ''
    isValidLink.value = false
    link.value = ''
    showModal.value = false
}

const remove = (id) => {
    console.log(id)
}

watch([provider, link], () => {
    let urlTemplate;

    if ((provider.value !== '' || provider.value !== undefined || provider.value !== null) && (link.value !== '' || link.value !== undefined || link.value !== null)) {
        urlTemplate = splitUriAndUrl(provider.value).url;
        if (urlTemplate) isValidLink.value = isValidUrl(link.value, urlTemplate)
    }

})

onBeforeMount(async () => {
    try {
        const response = await new Promise((resolve, reject) => {
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
        const response = await new Promise((resolve, reject) => {
            services.get_Record(`setting/list`, (response) => {
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
button {
    border: none;
    cursor: pointer;
    font-size: 15px;
}

button i.uil-trash-alt {
    color: var(--color-danger) !important;
}

button i.uil-edit {
    color: var(--color-primary) !important;
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

.table__container {
    overflow-x: scroll; 
    width: 85%;
}

/*@media screen and (min-width: 1260px){
    .table__container{
        overflow-x: scroll;
        width: 70%
    }
}*/

@media screen and (min-width: 800px) {

    .table__container {
        width: 100%;
    }
}
</style>