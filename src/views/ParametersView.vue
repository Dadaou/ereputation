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
                        <StaffListComponent @edit="(staff)=>handleEdit(staff)"/>
                    </el-tab-pane>
                    <el-tab-pane label="Staff Form"  name="staff_form">
                        <StaffFormComponent/>
                    </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="Event" name="event">
            <el-tabs :tab-position="'right'" class="demo-tabs mt-10">
                    <el-tab-pane label="Event list">
                        <EventListComponent/>
                    </el-tab-pane>
                    <el-tab-pane label="Event Form">
                        <EventFormComponent/>
                    </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
  </el-tabs>
    </div>
</template>
<script setup>
import { ref, provide } from 'vue';
import StaffFormComponent from "@Components/Staff/StaffFormComponent.vue";
import StaffListComponent from "@Components/Staff/StaffListComponent.vue";
import EventFormComponent from "@Components/Event/EventFormComponent.vue";
import EventListComponent from "@Components/Event/EventListComponent.vue";
/**
 * tabs
 */
const activeName = ref('staff');
const activeStaffTab = ref('staff_list')
const staff_to_update = ref(null);
provide('staff_to_update', staff_to_update);

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const handleEdit = (staff)=>{
    console.log(staff);
    activeStaffTab.value = 'staff_form';
    staff_to_update.value = staff;
}
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
