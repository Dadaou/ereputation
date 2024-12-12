<template>
    <div class="profile__header mt-2">
        <!-- <div class="profile__edit">
            <h2>Establishments</h2>
        </div> -->
    </div>
    <div class="search">
        <el-input v-model="search" size="small" placeholder="Type to search" />
    </div>
    <div class="mt-5 table__container">
        <el-table :data="establishments" class="custom-header">
            <el-table-column width="100">
                <template #default="scope">
                    <img class="establishment_img" :src="scope.row.media">
                </template>
            </el-table-column>
            <el-table-column label="Name" prop="name" style="width: 25%; min-width: 200px;">
                <template #default="scope">
                    <h1 class="establishment_name" @click="goToCompany(route.params.tag, scope.row.tag)">
                        {{ scope.row.name }}
                    </h1>
                </template>
            </el-table-column>
            <el-table-column label="Language" align="center" prop="language" style="width: 15%; min-width: 200px;" />
            <el-table-column label="Category" prop="universe_name" style="width: 15%; min-width: 200px;" />
            <el-table-column label="Address" prop="address" style="width: 25%; min-width: 200px;" />
            <el-table-column label="Country" prop="country" style="width: 15%; min-width: 200px;"
                :header-style="{ fontSize: '12px' }" />
            <el-table-column style="width: 25%; min-width: 200px;" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
                </template>
                <template #default="scope">
                    <!--  <el-button size="small" @click="showModal = true, establishment = scope.row"><i class="uil uil-qrcode-scan"></i></el-button> -->
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i
                            class="uil uil-edit"></i></el-button>
                    <el-popconfirm title="Are you sure to delete this?"
                        @confirm="handleDisable(scope.$index, scope.row)">
                        <template #reference>
                            <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
    </div>
    <QrCodeModalComponent v-if="establishment"
        :qrcodeValue="`${baseurl}/public/${route.params.tag}/establishment/${establishment.tag}/feedback`"
        :showModal="showModal" :filename="`${establishment.name}-feedback-link`" @close="showModal = false"
        :customer="route.params.tag" :establishment="establishment.tag" type="establishment" />
</template>
<script setup>
import { computed, defineAsyncComponent, ref, onBeforeMount, watch } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useAppStore } from "@Stores/app.js";
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElInput, ElOption, ElSelect, ElDatePicker, ElTooltip
} from 'element-plus'
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import services from '@Services/services.js';
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
import 'element-plus/es/components/tooltip/style/css'
import { useRoute, useRouter } from "vue-router";

const QrCodeModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/QrCodeModalComponent.vue')
)

const emit = defineEmits(['edit', 'setEnable', 'setDisable']);

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute()
const router = useRouter()
const showModal = ref(false);
const showLinkModal = ref(false);
const providers = ref([]);
const provider = ref(null)
const categories = ref(['Platform', 'Social'])
const category = ref('Platform')
const showSpinner = ref(false)
const search = ref('')
const link = ref('')
const isValidLink = ref('true')
const establishment = ref(null)
const links = ref([])
const baseurl = window.location.origin;
const downloaded = ref(false)

const handleEdit = (index, establishment) => {
    emit('edit', establishment);
}

const establishments = computed(() => {
    let data = [];
    let filteredData = [];
    if (userStore.user && userStore.user.customer && userStore.user.customer.establishments) {
        data = userStore.user.customer.establishments;

        data.forEach(establishment => {
            filteredData.push({
                name: establishment.name,
                language: establishment.language,
                media: (establishment.url_source) ? establishment.url_source : '',
                tag: establishment.competitor_tag,
                uri: `/api/establishments/${establishment.id}`,
                gps: establishment.locality_gps,
                website: establishment.website,
                country: establishment.country,
                city: establishment.city,
                category: establishment.category,
                address: establishment.address1,
                rank: establishment.rank,
                region: establishment.region,
                zipcode: establishment.zipcode,
                positionning: establishment.positionning,
                id: establishment.id,
                universe_id: establishment.universe_id,
                universe_name: establishment.universe_name,
                disable: establishment.disable,
                pin: establishment.pin
            })
        });
    }
    filteredData = filteredData.filter((data) => {
        return !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()) || data.category.toLowerCase().includes(search.value.toLowerCase())
            || data.address.toLowerCase().includes(search.value.toLowerCase()) || (data.country && data.country.toLowerCase().includes(search.value.toLowerCase()))
    })

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

const goToCompany = (customerTag, establishmentTag) => {
    appStore.isLoading = true;
    setTimeout(() => {
        router.push({
            name: 'Establishment',
            params: {
                id: establishmentTag,
                tag: customerTag
            },
        });
    }, 100);
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

const submit = async () => {
    showSpinner.value = true;
    let urlObject = splitUriAndUrl(provider.value)
    const data = {
        value1: getValueUrl(link.value, urlObject.url),
        establishment: establishment.value,
        provider: urlObject.uri,
        enable: false
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
    // Do nothing
}

const handleEnable = (index, establishment) => {
    emit('setEnable', establishment.id);
};

const handleDisable = (index, establishment) => {
    emit('setDisable', establishment.id);
};

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
.establishment_name {
    cursor: pointer;
    font-weight: 500;
}

button {
    border: none;
    cursor: pointer;
    font-size: 15px;
}

button i.uil-trash-alt {
    color: red !important;
}

button i.uil-edit {
    color: var(--color-danger) !important;
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

img.establishment_img {
    height: 50px;
    object-fit: cover;
    width: 100%;
}

.table__container {
    /* overflow-x: scroll; */
    width: 85%;
}

.search {
    display: none;
}

@media screen and (max-width: 468px) {
    .search {
        display: flex;
        max-width: 220px;
        float: right;
    }

    .searchtab {
        display: none;
    }

    .el-table--fit {
        font-size: 11px !important;
    }
}

@media screen and (min-width: 800px) {

    .table__container {
        width: 100%;
    }
}
</style>