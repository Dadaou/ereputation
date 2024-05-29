import { defineStore } from "pinia";
import services from '@Services/services.js';

export const useStaffStore = defineStore("staff", {
    state: () => ({
        staffs: [],
        entity: 'staff',
        staff: null,
        unit: null
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

        setStaff(data){
          this.staff = data;
        },

        resetStaff(){
          this.staff = null;
        }, 

        getStaff(){
          return this.staff;
        },

        setUnit(data){
          this.unit = data;
        },

        resetUnit(){
          this.unit = null;
        }, 

        getUnit(){
          return this.unit;
        }

    },
})