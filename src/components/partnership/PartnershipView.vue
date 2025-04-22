<template>
    <div class="user__main__container">
        <el-tabs v-model="activePartnershipTab" class="demo-tabs" @tab-change="changeRoute">
                    <el-tab-pane label="Partnerships requested by your establishment" name="partnership_list">
                        <PartnershipListComponent @update="() => reloadPartnershipsData()"  @edit="handleEdit"/>
                    </el-tab-pane>
                    <el-tab-pane label="Outside requests" name="partnership_request">
                        <PartnershipRequestComponent @update="() => reloadPartnershipsData()"/>
                    </el-tab-pane>
                    <el-tab-pane label="Request a new partnership" name="partnership_form">
                        <PartnershipFormComponent @update="() => reloadPartnershipsData()" :dataToEdit="dataToEdit"/>
                    </el-tab-pane>
                </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import moment from 'moment';
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
const router = useRouter();
const activePartnershipTab = ref(null)

const PartnershipFormComponent = defineAsyncComponent(() =>
    import("@Components/partnership/PartnershipFormComponent.vue")
)

const PartnershipListComponent = defineAsyncComponent(() =>
    import("@Components/partnership/PartnershipListComponent.vue")
)

const PartnershipRequestComponent = defineAsyncComponent(() =>
    import("@Components/partnership/PartnershipRequestComponent.vue")
)
const position = ref('top')
watch(width, () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
});

const changeRoute = () => {

    switch (activePartnershipTab.value) {

        case 'partnership_list':
            router.push({ name: 'partnership_list', params : {...route.params}, query : {...route.query, active_tab : 'partnership_list'}});
            break;
        case 'partnership_request':
            router.push({ name: 'partnership_outside_request', params : {...route.params}, query : {...route.query, active_tab: 'partnership_request'} });
            break;
        case 'partnership_form':
            router.push({ name: 'partnership_form', params : {...route.params}, query : {...route.query, active_tab: 'partnership_form'} });
            break;
        default:
            break;
    } 
}

watch(activePartnershipTab, () => {
    changeRoute()
})

watch(()=> route, () => {
    activePartnershipTab.value = route?.query?.active_tab || 'partnership_list'
}, {deep : true})

const clearEstablishmentForm = () => {
    cleanEstablishmentForm.value = !cleanEstablishmentForm.value
}

const dataToEdit = ref({})
const appStore = useAppStore()
const userStore = useUserStore()
const activeName = ref('establishments')
const allPartnerships = ref({})
provide('partnerships', allPartnerships)
provide('partnership_activeTab', activePartnershipTab)

const reloadPartnershipsData = async () => {
    const response = await new Promise((resolve) => {
        services.get_Record(`partnership/${route.params.tag}/list`, (response) => {
            resolve(response);
        });
    });
    if (response.status === 200) {
        allPartnerships.value = response.data;
    }
}

const handleEdit = (data) => {
    activePartnershipTab.value = 'partnership_form'
    dataToEdit.value = data
}

onBeforeMount(async () => {
    activePartnershipTab.value = route?.query?.active_tab || 'partnership_list'

    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
    await reloadPartnershipsData();
});

</script>
<style scoped>

* {
    overflow: hidden;
}
</style>
