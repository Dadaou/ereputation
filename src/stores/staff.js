import { defineStore } from "pinia";
import services from '@Services/services.js';

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
        },
        async removeStaff(id, next){
            await services.deleteRecord(this.entity, id, (response)=>{
                next(response);
            })
        },
        async updateStaff(staff, id, next){
            await services.patchRecord(this.entity, id, staff, (response)=>{
                next(response);
            })
        },
       async fetchOne(id, next){
          try {
            await services.getRecord(this.entity, id, (response)=>{
              next(response);
            });
          } catch (error) {
            console.error(error)
          }
        }, 
    },
})