<template>
    <div>
        <div class="profile__header mt-2">
            <div class="profile__edit">
                <p>The inter-establishment partnership program allows you to offer your own benefits to others
                    platform’s
                    customers in order to promote your products and acquire new clients.</p>
            </div>
        </div>
        <form @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2">
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="advantage"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Advantage *</label>
                    <el-select v-model="advantage" placeholder="Choose an advantage" size="large">
                        <el-option v-for="item in advantages" :key="item.id" :label="item.name"
                            :value="`/api/advantages/${item.id}`">
                            <span><strong>{{ item.name }}</strong>, </span>
                            <span style="color: var(--el-text-color-secondary);font-size: 13px;"> {{
                                item.establishment_name }}</span>
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label for="partnership"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Partnership
                        <span>*</span></label>
                    <el-select v-model="partnership" placeholder="Choose a partnership" size="large">
                        <el-option v-for="item in partnerships" :key="item.id" :label="item.name"
                            :value="`/api/establishments/${item.id}`">
                            <span><strong>{{ item.name }}</strong>, </span>
                            <span style="color: var(--el-text-color-secondary);font-size: 13px;"> {{
                                item.address1 }}, {{ item.zipcode }}, {{
                                    item.city }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="expired_at" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expired
                        at <span>*</span></label>
                    <el-date-picker v-model="expiredAt" :size="'large'" />
                </div>
                <div>
                    <label for="limit"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Limit</label>
                    <input type="number" id="limit" v-model="limit"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-telegram-alt mr-1"></i> Request a new
                        partnership</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script setup>
// import moment from 'moment';
import { ref, inject, watch } from 'vue'
import services from '@Services/services.js'
// import { useUserStore } from "@Stores/user.js"
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

const partnership = ref('');
const partnerships = ref([]);
const advantage = ref('');
const expiredAt = ref(null);
const limit = ref(0);
const showSpinner = ref(false);
const activeCategorizationTab = inject('categorization_activeTab');

const advantages = inject('advantages');

watch(advantage, () => {
    if (advantage.value) {
        partnership.value = null;
        updatePartnershipList(advantage.value.split('/').pop());
    }
})

const updatePartnershipList = async (advantageId) => {
    const response = await new Promise((resolve) => {
        services.get_Record(`advantage/${advantageId}/other_establishments`, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        console.log(response.data)
        partnerships.value = response.data;
    }
}

const submit = async () => {
    let data = {
        "state": "pending",
        "enable": false,
        "advantage": advantage.value,
        "partnership": partnership.value,
        "limite": limit.value,
        "expired_at": expiredAt.value
    }

    try {
        if (data.partnership && data.advantage) {
            showSpinner.value = true;
            const response = await new Promise((resolve) => {
                services.createRecord('partnerships', data, (response) => {
                    resolve(response);
                });
            });

            if (response.status == 201) {
                ElMessage({
                    message: 'partnership requested successfully',
                    type: 'success',
                })

                partnership.value = '';
                advantage.value = '';
                showSpinner.value = false;
            }

            activeCategorizationTab.value = 'categorization_list'
        } else {
            ElMessage.error(`Please, fill the form correctly!`);
        }
    } catch (error) {
        console.log(error);
    }
};

</script>
<style scoped>
.profile__header p {
    font-size: 14px;
    color: grey;
    font-weight: 500;
}
</style>