import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useStaffStore = defineStore("staff", {
    state: () => ({
        staffs: [],
        entity: 'staff'
    }),
    actions: {
        async addStaff(staff, next){
            await services.createRecord(this.entity, staff, (response)=>{
                next(response);
            });
        }
    }
})