import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompetitorStore = defineStore("competitor", {
  state: () => ({
   competitors: [], 
   entity: 'competitors',
   nb: 0,
  }),
  actions: {
    async fetchOne(id, next){
      await services.getRecord(this.entity, id, (response)=>{
         console.log(response)
         next(response)
      })
    },
    async getAllCompetitors(data, next){
      console.log(data)
      // for (let i = 0; i < data.length; i++) {
      //   const id = data[i].replace(`/api/${this.entity}/`, "");
      //   console.log(id)
      //   // await this.fetchOne(id, (response) => {
      //   //   console.log(response.data)
      //   // })
      //   // await services.getRecord(this.entity, id, (response)=>{
      //   //     console.log(response)
      //   // })
      // }
      next('hello')
    },
    fetchByEstablishment(data, next){
        next();
    }
  }
});