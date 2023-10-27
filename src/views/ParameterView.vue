<template>
   <div class="user__main__container">
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
        <el-tab-pane label="Staff" name="staff">
            <el-tabs :tab-position="position" v-model="activeStaffTab" class="demo-tabs mt-10">
                    <el-tab-pane label="Staff list"  name="staff_list">
                        <StaffListComponent @edit="(staff)=>handleEdit(staff, 'staff')"/>
                    </el-tab-pane>
                    <el-tab-pane label="Staff Form"  name="staff_form">
                        <StaffFormComponent/>
                    </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="Event" name="event">
            <el-tabs :tab-position="position" v-model="activeEventTab" class="demo-tabs mt-10">
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
import { ref, provide, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import moment from 'moment';
import { ElTabs, ElTabPane } from 'element-plus';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useCompanyStore } from "@Stores/company.js";
import 'element-plus/es/components/tabs/style/css';
import 'element-plus/es/components/tab-pane/style/css';

const{ width, height} = useWindowSize();
  
 
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

const position = ref('right')
watch(width, ()=>{
     if(width.value < 800) {
          position.value = 'top'
     } else{
          position.value = 'right'  
     } 
     console.log(position);
  });

const appStore = useAppStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const activeName = ref('staff');
const activeStaffTab = ref('staff_list')
const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update);

const allEvents = ref([]);
const allStaffs = ref([]);
const activeEventTab = ref('event_list')
const event_to_update = ref(null);
provide('event_to_update', event_to_update);
provide('staffs', allStaffs);
provide('events', allEvents);

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
    let staffs = [];
    let events = [];
    let promises = [];
    let event_promises = [];
    appStore.isLoading = true;
    
    if(width.value < 800){
          position.value = 'top'
     } else{
          position.value = 'right'  
     }

    if(userStore.user.customer !== null){

        userStore.user.customer.establishments.forEach((establishment, index)=> {
            let promise = services.get_Record(`/establishment/${establishment.competitor_tag}/staffs`, (response) => {
                staffs.push(response.data);
            });
            promises.push(promise); 

            let promise_event = services.get_Record(`/establishment/${establishment.competitor_tag}/event`, (response) => {
                events.push(response.data);
            });
            event_promises.push(promise_event); 
        })
        Promise.all(promises).then(() => {
            staffs.forEach(staffs_per_establisment=>{
                  staffs_per_establisment.forEach(staff=>{
                     allStaffs.value.push(staff);
                  })
            })
            appStore.isLoading = false;
        });

        Promise.all(event_promises).then(() => {
            events.forEach(events_per_establisment=>{
                  events_per_establisment.forEach(event=>{
                    let event_found = allEvents.value.find(obj => obj.id === event.id);
                    if(event_found) {
                        event_found.establishment_name =  `${event_found.establishment_name }, ${event.establishment_name}`;
                        event_found.establishment.push(event.establishment);
                       
                    }else{
                        event['date']= `${moment(event.datefrom).format('YYYY-MM-DD')} to ${moment(event.dateto).format('YYYY-MM-DD')}` 
                        const uri = event['establishment'];
                        event['establishment'] = [];
                        event['establishment'].push(uri)
                        allEvents.value.push(event);
                    }
                  })
            })
            console.log(allEvents.value)
        });
    }
});
</script>
<style scoped>
</style>
