<template>
    <div class="user__main__container">
        <el-tabs v-model="activeAdvantageTab" class="demo-tabs"   @tab-change="changeRoute">
            <el-tab-pane label="Advantages" name="advantage_list">
                <AdvantageListComponent @edit="(advantage) => handleEdit(advantage, 'advantage')"
                    @setEnable="(advantage) => handleEnable(advantage, 'advantage')"
                    @setDisable="(advantage) => handleDisable(advantage, 'advantage')"
                    @advantage-updated="loadAdvantage" />
            </el-tab-pane>
            <el-tab-pane label="Add a new advantage" name="advantage_form">
                <AdvantageFormComponent @advantage-updated="loadAdvantage" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();
const router = useRouter()

const activeAdvantageTab = ref(null)

const AdvantageFormComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageFormComponent.vue")
)

const AdvantageListComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageListComponent.vue")
)

const changeRoute = () => {

    switch (activeAdvantageTab.value) {
        case 'advantage_list':
            router.push({ name: 'advantage_list', params : {...route.params}, query : {...route.query, active_tab : 'advantage_list'}});
            break;
        case 'advantage_form':
            router.push({ name: 'advantage_form', params : {...route.params}, query : {...route.query, active_tab: 'advantage_form'} });
            break;
        default:
            break;
    } 
}

watch(activeAdvantageTab, () => {
    changeRoute()
})

watch(()=> route, () => {
    activeAdvantageTab.value = route?.query?.active_tab || 'advantage_list'
}, {deep : true})

const position = ref('top')
watch(width, () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
});

const clearEstablishmentForm = () => {
    cleanEstablishmentForm.value = !cleanEstablishmentForm.value
}

const appStore = useAppStore()
const userStore = useUserStore()
const activeName = ref('establishments')

const allAdvantages = ref([])

provide('advantages', allAdvantages)
provide('advantage_activeTab', activeAdvantageTab)

const advantage_to_update = ref(null)
provide('advantage_to_update', advantage_to_update)

const handleEdit = (value, type) => {

    if (type == 'advantage') {
        activeAdvantageTab.value = 'advantage_form';
        advantage_to_update.value = value;
    }
};

const loadAdvantage = async () => {

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantages?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            allAdvantages.value = response.data.map(adv => {
                const { advantage_limit, ...advantage } = adv;
                return { ...advantage, advantageLimit: advantage_limit }
            });
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error(error);
    }

    finally {
        activeAdvantageTab.value = 'advantage_list'
    }
}

const handleEnable = async (value, type) => {
    const response = await new Promise((resolve) => {
        services.post_Record(`/customer/establishments/advantage/${value}/enable`, {}, (response) => {
            resolve(response)
        }, false);
    });
    if (response.status == 200) {
        allAdvantages.value = allAdvantages.value.map((adv) => {
            if (adv.id == value) {
                adv.enable = true;
            }
            return adv;
        })
    }
};

const handleDisable = async (value, type) => {
    const response = await new Promise((resolve) => {
        services.post_Record(`/customer/establishments/advantage/${value}/disable`, {}, (response) => {
            resolve(response)
        }, false);
    });
    if (response.status == 200) {
        allAdvantages.value = allAdvantages.value.map((adv) => {
            if (adv.id == value) {
                adv.enable = false;
            }
            return adv;
        })
    }
};

onBeforeMount(async () => {
    
    activeAdvantageTab.value = route?.query?.active_tab || 'advantage_list'
    
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
    await loadAdvantage();
});

</script>
<style scoped>
/*@media screen and (max-width: 800px) {
    .user__main__container {
        width: 100%;
    }
}*/

* {
    overflow: hidden;
}
</style>
