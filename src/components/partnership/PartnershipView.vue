<template>
    <div class="user__main__container">
        <el-tabs v-model="activePartnershipTab" class="demo-tabs">
                    <el-tab-pane label="Partnerships requested by your establishment" name="partnership_list">
                        <PartnershipListComponent @update="() => reloadPartnershipsData()" />
                    </el-tab-pane>
                    <el-tab-pane label="Request for partnerships" name="partnership_request">
                        <PartnershipRequestComponent @update="() => reloadPartnershipsData()" />
                    </el-tab-pane>
                    <el-tab-pane label="Request a new partnership" name="partnership_form">
                        <PartnershipFormComponent @update="() => reloadPartnershipsData()" />
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
import { useRoute } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();

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

const clearEstablishmentForm = () => {
    cleanEstablishmentForm.value = !cleanEstablishmentForm.value
}

const appStore = useAppStore()
const userStore = useUserStore()
const activeName = ref('establishments')
const allPartnerships = ref({})
provide('partnerships', allPartnerships)
const activePartnershipTab = ref('partnership_list')
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

onBeforeMount(async () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
    await reloadPartnershipsData();
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
