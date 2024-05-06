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
                    <el-select v-model="advantage" placeholder="Choose an advantage" size="large" filterable remote
                        reserve-keyword remote-show-suffix :loading="loading" :remote-method="searchAdvantage">
                        <el-option v-for="item in advantageOptions" :key="item.id" :label="item.name"
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
                    <el-select v-model="partnership" placeholder="Choose a partnership" size="large" filterable remote
                        reserve-keyword remote-show-suffix :loading="loading2" :remote-method="searchPartnership">
                        <el-option v-for="item in partnershipOptions" :key="item.id" :label="item.name"
                            :value="item.tag">
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
                        at </label>
                    <el-date-picker v-model="expiredAt" :size="'large'" />
                </div>
                <div>
                    <label for="limit"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Limit</label>
                    <input type="number" id="limit" v-model="limit"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                </div>
            </div>
            <AdvantagePartnershipList :items="allAdvantageList" class="mt-5" />
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
        <div class="profile__header mt-6">
            <div class="profile__edit">
                <p>Do you wish to establish a partnership with a new establishment not listed?
                    Let them know through a simple email and take advantage of the benefits of our endorsement program :
                </p>
            </div>
        </div>
        <form @submit.prevent="submitEmail" @keydown.enter.prevent="submitEmail" class="mt-4 px-2">
            <div class="inline-flex items-center gap-2">
                <input type="email" id="email" v-model="email" placeholder="Enter an email address"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-50 p-2">
                <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinnerEmail" :color="'gray'" /> <span
                        v-if="showSpinnerEmail">Loading
                        ...</span>
                    <span v-show="!showSpinnerEmail"><i class="uil uil-telegram-alt mr-1"></i> Invite a friend</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script setup>
// import moment from 'moment';
import { ref, inject, watch, defineAsyncComponent, computed, onBeforeMount } from 'vue'
import services from '@Services/services.js'
// import { useUserStore } from "@Stores/user.js"
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue'
import { ElMessage, ElOption, ElSelect, ElDatePicker } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import { useRoute } from 'vue-router';
import { useAppStore } from "@Stores/app.js"

const AdvantagePartnershipList = defineAsyncComponent(() =>
    import('@Components/utils/AdvantagePartnershipListComponent.vue')
);

const partner = ref(import.meta.env.VITE_PARTNER_CODE);
const app_url = inject('app_url')
const partnership = ref('');
const establishment = ref('');
const partnerships = ref([]);
const other_advantages = ref([]);
const advantage = ref('');
const email = ref('');
const expiredAt = ref(null);
const limit = ref(0);
const showSpinner = ref(false);
const showSpinnerEmail = ref(false);
const activePartnershipTab = inject('partnership_activeTab');
const route = useRoute();
const emit = defineEmits(['update']);
const appStore = useAppStore()

const advantages = ref([]);
const advantageOptions = ref([]);
const loading = ref(false)
const partnershipOptions = ref([]);
const loading2 = ref(false)

watch(advantage, () => {
    if (advantage.value) {
        partnership.value = null;
        let advantage_id = advantage.value.split('/').slice(-1);
        updatePartnershipList(advantage_id);
        updateOtherAdvantageList(advantage_id);
        establishment.value = advantages.value.find(v => { return v.id == Number(advantage.value.split('/').pop()) }).establishment_tag
    }
})

watch(partnership, () => {
    if (partnership.value) {
        let estab = partnerships.value.find(v => { return v.tag == partnership.value })
        if (estab) {
            email.value = estab.email
        }
    }
})

onBeforeMount(async () => {
    await loadAdvantage();
})

const searchAdvantage = (query) => {
    if (query) {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            advantageOptions.value = advantages.value.filter((item) => {
                return item.name.toLowerCase().includes(query.toLowerCase()) || item.establishment_name.toLowerCase().includes(query.toLowerCase())
                // return true
            })
        }, 200)
    } else {
        advantageOptions.value = advantages.value
    }
}

const searchPartnership = (query) => {
    if (query) {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            partnershipOptions.value = partnerships.value.filter((item) => {
                return item.name.toLowerCase().includes(query.toLowerCase())
            })
        }, 200)
    } else {
        partnershipOptions.value = partnerships.value
    }
}

const allAdvantageList = computed(() => {
    return other_advantages.value.map((discount, index) => {
        let icon = '';
        if (index % 2 === 0) {
            icon = "🎁";
        } else {
            icon = "🎉";
        }
        return { ...discount, icon };
    });
})

const updatePartnershipList = async (advantageId) => {
    appStore.isLoading = true;
    const response = await new Promise((resolve) => {
        services.get_Record(`advantage/${advantageId}/other_establishments`, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        partnerships.value = response.data;
        appStore.isLoading = false;
    }
    appStore.isLoading = false;
}

const updateOtherAdvantageList = async (advantageId) => {
    appStore.isLoading = true;
    const response = await new Promise((resolve) => {
        services.get_Record(`advantage/${advantageId}/other_advantage`, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        other_advantages.value = response.data;
        appStore.isLoading = false;
    }
    appStore.isLoading = false;
}

const submit = async () => {
    let data = {
        "state": "pending",
        "enable": false,
        "advantage": advantage.value,
        "partnership": partnership.value,
        "limite": limit.value,
        "expiredAt": expiredAt.value
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
                expiredAt.value = '';
            }
            emit('update');

            activePartnershipTab.value = 'partnership_list'
        } else {
            ElMessage.error(`Please, fill the form correctly!`);
        }
    } catch (error) {
        console.log(error);
    }
};

const submitEmail = async () => {
    if (partner.value && email.value && establishment.value) {
        showSpinnerEmail.value = true;

        let data = {
            "email": email.value,
            "code": establishment.value,
            "partner": partner.value,
            "url": app_url.value,
            "template": partnership.value ? "partnership_customer" : "partnership_nocustomer"
        }

        const response = await new Promise((resolve) => {
            services.createRecord('partnership/invite', data, (response) => {
                resolve(response);
            });
        });

        if (response.status == 200) {
            ElMessage({
                message: 'partnership invitation sent successfully',
                type: 'success',
            })

            partnership.value = '';
            email.value = '';
            establishment.value = '';
            advantage.value = '';
            expiredAt.value = '';
            showSpinnerEmail.value = false;
        }
    }
    // if (partnership.value && partnership.value) {
    //     try {

    //     } catch (e) {

    //     }
    //     // } else {
    //     //     ElMessage.error(`Please, fill the form correctly!`);
    //     // }
    // };
}

const loadAdvantage = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantages?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            advantages.value = response.data.map(adv => {
                const { advantage_limit, ...advantage } = adv;
                return { ...advantage, advantageLimit: advantage_limit }
            });
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

</script>
<style scoped>
.profile__header p {
    font-size: 14px;
    color: grey;
    font-weight: 500;
}
</style>