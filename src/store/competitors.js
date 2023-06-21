import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompetitorStore = defineStore("competitor", {
  state: () => ({
   entity: 'competitors',
  }),
  actions: {
    async fetchOne(id, next){
      await services.getRecord(this.entity, id, (response) => {
         console.log(response);
         next(response);
      })
    },
    async getAllCompetitors(params, next){
        await services.getRecordsByParams(this.entity, params, (response) => {
          if (response.status == 200) {
            // this.competitors = response.data['hydra:member'];
            // this.nb = this.competitors.length;
            next(response.data['hydra:member']);
          }
        })
    }
  }
});