<template>
   <div class="user__main__container">
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
        <el-tab-pane label="Staff" name="staff">
            <el-tabs :tab-position="'right'" v-model="activeStaffTab" class="demo-tabs mt-10">
                    <el-tab-pane label="Staff list"  name="staff_list">
                        <StaffListComponent @edit="(staff)=>handleEdit(staff, 'staff')"/>
                    </el-tab-pane>
                    <el-tab-pane label="Staff Form"  name="staff_form">
                        <StaffFormComponent/>
                    </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="Event" name="event">
            <el-tabs :tab-position="'right'" v-model="activeEventTab" class="demo-tabs mt-10">
                    <el-tab-pane label="Event list" name="event_list">
                        <EventListComponent @edit="(event)=>handleEdit(event, 'event')"/>
                    </el-tab-pane>
                    <el-tab-pane label="Event Form" name="event_form">
                        <EventFormComponent/>
                    </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
  </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide, defineAsyncComponent, onBeforeMount } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

const StaffFormComponent = defineAsyncComponent(()=>
        import("@Components/staffs/StaffFormComponent.vue")
)

const StaffListComponent = defineAsyncComponent(()=>
        import("@Components/staffs/StaffListComponent.vue")
)

const EventFormComponent = defineAsyncComponent(()=>
        import("@Components/events/EventFormComponent.vue")
)

const EventListComponent = defineAsyncComponent(()=>
        import("@Components/events/EventListComponent.vue")
)

const appStore = useAppStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const activeName = ref('staff');
const activeStaffTab = ref('staff_list')
const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update);


const activeEventTab = ref('event_list')
const event_to_update = ref(null);
provide('event_to_update', event_to_update);

const handleClick = (tab, event) => {
  // console.log(tab, event)
};

const handleEdit = (value, type)=>{
    if(type=='staff'){
         activeStaffTab.value = 'staff_form';
         staff_to_update.value = value;
    }else{
         activeEventTab.value = 'event_form';
         event_to_update.value = value;
    }
};

onBeforeMount(()=>{
    let data = [];
    let promises = [];
    appStore.isLoading = true;
    if(userStore.user.customer !== null){
        userStore.user.customer.establishments.forEach((establishment, index)=> {
        let promise = services.get_Record(`/establishment/${establishment.id}/detail`, (response) => {
                data.push(response.data);
            });
            promises.push(promise); 
        })
        Promise.all(promises).then(() => {
            companyStore.establishments = data;
            appStore.isLoading = false;
            console.log(data);
        });
    }
});
</script>
<style scoped>
</style>
