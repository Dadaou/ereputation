import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompanyStore = defineStore("company", {
  state: () => ({
   establishments: [], 
   entity: 'establishments',
   nb: 0,
  }),
  actions: {
    async fetchAll(next){
        await services.getRecords(this.entity, (response)=>{
            if (response.status == 200) {
              this.establishments = response.data['hydra:member'];
              console.log(this.establishments)
              this.nb = this.establishments.length;
              next(response);
            }
        })
    },
    async fetchOne(id, next){
      await services.getRecord(this.entity, id, (response)=>{
          if (response.status == 200) {
            next(response.data);
          }
      })
  }
  }
});