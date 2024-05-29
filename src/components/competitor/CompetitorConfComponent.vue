<template>
    <div class="profile__header mt-2">
        <div class="profile__edit">
            <!--  <h2 v-if="!showCompetitors">Competitors configuration</h2> -->
            <div class="competitor__head" v-if="showCompetitors">
                <h2>Competitors list for "{{ selectedEstablishment.name }}"</h2>
                <button @click="showCompetitors = !showCompetitors">Back</button>
            </div>
        </div>
    </div>
    <div class="mt-5 table__container" v-if="!showCompetitors">
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
                    <el-button size="small"
                        @click="showModal = !showModal, establishment = scope.row.uri, selectedEstablishment = scope.row"><i
                            class="uil uil-plus"></i></el-button>

                    <el-button size="small"
                        @click="showCompetitors = !showCompetitors, establishment = scope.row.uri, selectedEstablishment = scope.row"><i
                            class="uil uil-file-alt"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="mt-5 table__container" v-else>
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
                    <el-popconfirm title="Are you sure to delete this?">
                        <template #reference>
                            <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
                        </template>
                    </el-popconfirm>

                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i
                            class="uil uil-edit"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ModalComponent :showModal="showModal" @close="resetValue" :width="modalWidth">
        <template #content>
            <div class="modal__header">
                <div class="modal__title">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        <i class="uil uil-link-add"></i> Add new Competitor for "{{ selectedEstablishment.name }}"
                    </h3>
                </div>
                <div class="modal__close">
                    <i class="uil uil-times-circle" @click="showModal = false"></i>
                </div>
            </div>

            <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
                <div>
                    <label for="countries"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Competitor
                        <span>*</span></label>
                    <el-select v-model="competitor" placeholder="Choose competitor" size="large">
                        <el-option v-for="item in competitors" :key="item" :label="item.name" :value="item.uri" />
                    </el-select>
                </div>
                <div class="flex items-center justify-between py-4 border-t border-b dark:border-gray-600">
                    <button type="submit"
                        :class="['inline-flex items-center py-2.5 px-6 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800']">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                            v-if="showSpinner">Loading
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
import { computed, defineAsyncComponent, ref, onBeforeMount, watch } from 'vue'
import { useUserStore } from "@Stores/user.js"
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElInput, ElOption, ElSelect, ElDatePicker
} from 'element-plus'
import { useWindowSize } from '@vueuse/core';
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

const ModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ModalComponent.vue')
)

const userStore = useUserStore();
const { width, height } = useWindowSize();
const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 45;
});
const showModal = ref(false);
const showLinkModal = ref(false);
const showSpinner = ref(false)
const search = ref('')
const establishment = ref('')
const selectedEstablishment = ref(null)
const competitors = ref([])
const competitor = ref('')
const showCompetitors = ref(false)

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
                competitors: establishment.competitors
            })
        });
    }
    return filteredData;
});

const submit = async () => {
    showSpinner.value = true;
    const data = {
        establishment: competitor.value,
        competitorTag: selectedEstablishment.value.tag
    }

    try {
        const response = await new Promise((resolve, reject) => {
            services.createRecord('competitors', data, (response) => {
                resolve(response);
            });
        });
        if (response.status == 201) {
            ElMessage({
                message: `competitors added successfully`,
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
    selectedEstablishment.value = null
    competitor.value = ''
    showModal.value = false
}

const remove = (id) => {
    // Do nothing
}

onBeforeMount(async () => {

    try {
        const response = await new Promise((resolve, reject) => {
            services.get_Record(`establishments`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            const data = response.data['hydra:member'];
            let companies = [];
            if (userStore.user && userStore.user.customer) {
                companies = userStore.user.customer.establishments;

                const dataIds = new Set(companies.map(establishment => establishment.id));

                const establishmentCompetitors = data.filter(competitor => !dataIds.has(competitor.id));

                competitors.value = establishmentCompetitors.map(competitor => ({
                    id: competitor.id,
                    name: competitor.name,
                    uri: competitor['@id']
                }));
            }

        } else {
            console.error('Error fetching establishments:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>
<style scoped>
.competitor__head {
    display: flex;
    justify-content: space-between;
}

.competitor__head button {
    font-weight: 500;
    background-color: var(--color-primary);
    color: white;
    font-size: 14px;
    padding: 3px 8px;
    border-radius: 5px;
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