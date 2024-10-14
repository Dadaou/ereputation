<template>
    <div class="user__main__container">
    
                <el-tabs v-model="myscreensUrlsConf.screens" class="demo-tabs" @tab-click="() => clearScreenForm()">
                    <el-tab-pane label="Screens" name="screens_list">
                        <ScreenListComponent
                            @edit="(screen) => handleEdit(screen, 'screens')" />
                    </el-tab-pane>
                    <el-tab-pane label="Add a new screen" name="screens_form">
                        <ScreenFormComponent @show-screen-list = "showScreenList"/>
                    </el-tab-pane>
                </el-tabs>
  
    </div>
</template>
<script setup>
import { ref, reactive, provide, defineAsyncComponent, onBeforeMount, watch, computed } from 'vue';

import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';

import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';




const { width } = useWindowSize();
const route = useRoute();
const router = useRouter();


const ScreenListComponent = defineAsyncComponent(() =>
    import("@Components/screen/ScreenListComponent.vue")
)

const ScreenFormComponent = defineAsyncComponent(() =>
    import("@Components/screen/ScreenFormComponent.vue")
)



const position = ref('top')
watch(width, () => {
    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }
});




const myscreensUrlsConf = reactive({
    tabs: 'screens',
    screens : 'screens_list'
})

provide('myscreensUrlsConf', myscreensUrlsConf);

const cleanScreenForm = ref(0);

provide('cleanScreenForm', cleanScreenForm);

const clearScreenForm = () => {
    cleanScreenForm.value = cleanScreenForm.value + 1;
    
}

const showScreenList = (payload) => {
    myscreensUrlsConf.screens = payload.elTabPaneName
}


const allscreens = ref([]);
const advantages = ref([]);


provide('screens', allscreens);
provide('advantages', advantages);

const screen_to_update = ref(null)
provide('screen_to_update', screen_to_update)


const handleEdit = (value, type) => {
    myscreensUrlsConf[type] = `${type}_form`;

    // if (type == 'screens') {
        screen_to_update.value = value;
        screen_to_update.value['establishment'] = `/api/establishments/${value.establishment_id}`
         screen_to_update.value['screentemplate'] = `/api/screentemplates/${value.screentemplate_id}`
    // }
         cleanScreenForm.value = 0;
         console.log(value)

};


const loadScreens = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/screens?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            allscreens.value = response.data
            console.log(allscreens.value)
        }
  

    } catch (error) {
        console.error(error);
    }
}

const loadAdvantages = async () => {
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantages?tag=${route.params.tag}`, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200) {
            advantages.value = response.data
            console.log(advantages)
        }
  
    } catch (error) {
        console.error(error);
    }
}




const routeParameters = async (conf)=>{
    router.push({ name: route.name, params: { ...route.params, tab: conf.tabs, sub_tab: conf[conf.tabs] } });
}

watch(myscreensUrlsConf, (newValue)=>{
    routeParameters(newValue)
})

const params = computed(()=> route.params);

watch(params, ()=>{
    myscreensUrlsConf.tabs = route.params.tab;
    myscreensUrlsConf[myscreensUrlsConf.tabs] = route.params.sub_tab; 
})

onBeforeMount(async () => {
    myscreensUrlsConf.tabs = (route.params.tab !== '')?route.params.tab:'screens';
    myscreensUrlsConf[myscreensUrlsConf.tabs] = (route.params.sub_tab !== '')?route.params.sub_tab:'screens_list';
    await routeParameters(myscreensUrlsConf)

    if (width.value < 800) {
        position.value = 'top'
    } else {
        position.value = 'right'
    }

    await loadScreens();
    await loadAdvantages();
   
});

</script>
<style scoped>

* {
    overflow: hidden;
}
</style>
