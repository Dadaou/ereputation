<template>
    <div class="user__main__container">
       <el-tabs v-model="activeAdvantageTab" class="demo-tabs">
                    <el-tab-pane label="Advantages" name="advantage_list">
                        <AdvantageListComponent @edit="(advantage) => handleEdit(advantage, 'advantage')"
                            @setEnable="(advantage) => handleEnable(advantage, 'advantage')"
                            @setDisable="(advantage) => handleDisable(advantage, 'advantage')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new advantage" name="advantage_form">
                        <AdvantageFormComponent />
                    </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useRoute } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';


const { width } = useWindowSize();
const route = useRoute();

const AdvantageFormComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageFormComponent.vue")
)

const AdvantageListComponent = defineAsyncComponent(() =>
    import("@Components/advantage/AdvantageListComponent.vue")
)

const position = ref('top')
watch(width, () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
});

const allAdvantages = ref([])

provide('advantages', allAdvantages)
const activeAdvantageTab = ref('advantage_list')
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
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
    await loadAdvantage();
});

</script>
<style scoped>
* {
    overflow: hidden;
}
</style>
