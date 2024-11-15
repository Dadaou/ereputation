<template>
    <div class="profile__header mt-2">
        <!-- <div class="profile__edit">
            <h2>Establishments</h2>
        </div> -->
    </div>
    <div class="table__container">
        <el-table :data="establishments">
            <el-table-column width="100">
                <template #default="scope">
                    <img class="establishment_img" :src="scope.row.media">
                </template>
            </el-table-column>
            <el-table-column label="Name" prop="name" style="width: 25%; min-width: 200px;">
                <template #default="scope">
                    <el-tooltip :content="`Click to enter ${scope.row.name}'s page`" placement="top">
                        <h1 class="establishment_name" @click="goToCompany(route.params.tag, scope.row.tag)">
                            {{ scope.row.name }}</h1>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Reviews" prop="totalReviews" style="width: 20%; min-width: 300px;">
                <template #default="scope">
                    <div class="reviews-link">
                        <el-tooltip :content="'Reviews ' + scope.row.name" placement="top">
                            <span @click="redirectToReviews(route.params.tag, scope.row.tag)">
                                {{ scope.row.totalReviews }}
                            </span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column style="width: 25%; min-width: 200px;" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" class="search" />
                </template>
                <template #default="scope">
                    <div class="vertical-buttons">
                        <el-button size="small" @click="redirectToQRCode(route.params.tag, scope.row.tag)">
                            <i class="uil uil-print"></i>
                        </el-button>
                        <el-tooltip :content="`Click to enter ${scope.row.name}'s feedback formulary`" placement="top">
                            <a :href="scope.row.link" target="_blank" class="el-button el-button--small"><i
                                    class="uil uil-external-link-alt"></i></a>
                        </el-tooltip>
                        <el-button size="small" @click="showModal = true, establishment = scope.row"><i
                                class="uil uil-qrcode-scan"></i></el-button>
                    </div>
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
import { computed, defineAsyncComponent, ref, onBeforeMount, watch, inject } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useAppStore } from "@Stores/app.js";
import moment from 'moment';
import {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput, ElTooltip
} from 'element-plus'
import services from '@Services/services.js';
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
const providers = ref([]);
const provider = ref(null)
const showSpinner = ref(false)
const search = ref('')
const link = ref('')
const isValidLink = ref('true')
const establishment = ref(null)
const links = ref([])
const baseurl = window.location.origin;
const start_date = inject('start_date');
const end_date = inject('end_date');
const companies = ref([])

const redirectToReviews = async (customer, establishment) => {
    start_date.value = moment(new Date('2010-01-01')).format('YYYY-M-DD')
    end_date.value = moment().format('YYYY-M-DD') // null is to get the current date
    router.push(`/customer/${customer}/establishment/${establishment}/reviews/intern`)
}

const redirectToQRCode = async (customer, establishment) => {
    const link = `/customer/${customer}/establishment/${establishment}/qr_code_document_preview?section=establishment`;
    router.push(link);
}
const establishments = computed(() => {
    let data = [];
    let filteredData = [];
    // if (userStore.user && userStore.user.customer && userStore.user.customer.establishments) {
    // data = userStore.user.customer.establishments;
    data = companies.value
    data.forEach(establishment => {
        filteredData.push({
            name: establishment.name,
            media: (establishment.url_source) ? establishment.url_source : '',
            tag: establishment.competitor_tag,
            uri: `/api/establishments/${establishment.id}`,
            gps: establishment.locality_gps,
            country: establishment.country,
            city: establishment.city,
            category: establishment.category,
            address: establishment.address1,
            rank: establishment.rank,
            region: establishment.region,
            zipcode: establishment.zipcode,
            positionning: establishment.positionning,
            id: establishment.id,
            disable: establishment.disable,
            totalReviews: establishment.totalReviews,
            establishment_competitor_tag: establishment.establishment_competitor_tag,
            link: `${baseurl}/public/${route.params.tag}/establishment/${establishment.competitor_tag}/feedback?preview=true`
        })
    });
    //}
    filteredData = filteredData.filter((data) => {
        return !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()) || data.category.toLowerCase().includes(search.value.toLowerCase())
            || data.address.toLowerCase().includes(search.value.toLowerCase()) || (data.country && data.country.toLowerCase().includes(search.value.toLowerCase()))
    })

    return filteredData;
});

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

const getParametersEstablishments = async (customer) => {

    try {
        const userId = userStore.user.id;
        const response = await new Promise((resolve) => {
            services.get_Record(`/customer/establishments/parameters?tag=${customer}&user_id=${userId}`, (response) => {
                resolve(response);
            });
        });
        if (response.status == 200) {
            companies.value = response.data
        }
    } catch (error) {
        console.log(error)
    }
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
        await getParametersEstablishments(route.params.tag)
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

img.establishment_img {
    height: 50px;
    object-fit: cover;
    width: 100%;
}

/*#qrcode__container{
    background-color: white;
    padding: 5px;
    border-radius: 10px;
    border: 1px solid black;
}*/

.qr__code {
    width: 35% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__header {
    display: flex;
    justify-content: space-between;
}

.modal__header div {
    align-self: center;
}

.reviews-link span {
    cursor: pointer;
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
    width: 40% !important;
    padding: 50px auto !important;
    margin: auto;
}

.modal__close i:hover {
    transform: rotate(360deg);
}

.table__container {
    overflow-x: auto;
    /* Enable horizontal scrolling */
    width: 85%;
    /* Make sure the container takes full width */
    -webkit-overflow-scrolling: touch;
    /* Smooth scrolling for iOS */
}

.el-table {
    min-width: 600px;
    /* Ensure the table has a minimum width to trigger scrolling */
}

.search {
    max-width: 150px;
}

@media screen and (max-width: 768px) {
    .vertical-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .el-button--small {
        margin-bottom: 1px;
        margin-left: 6px;
    }

    .search {
        max-width: 300px;
    }
}

@media screen and (min-width: 800px) {

    .table__container {
        width: 100%;
    }
}

@media screen and (max-width: 468px) {
    .el-table--fit {
        font-size: 11px !important;
    }
}
</style>