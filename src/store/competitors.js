import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompetitorStore = defineStore("competitor", {
  state: () => ({
   entity: 'competitors',
  }),
  actions: {
    async fetchOne(id, next){
      await services.getRecord(this.entity, id, (response) => {
         next(response);
      })
    },
    async getAllCompetitors(params, next){
        await services.getRecordsByParams(this.entity, params, (response) => {
          console.error('competitor', params);
          if (response.status == 200) {
            let data = [];
            let promises = [];

            response.data['hydra:member'].forEach(competitor => {
              let promise = services.getRecord('establishments', competitor.establishment.id, (response) => {
                data.push(response.data);
              });
              promises.push(promise);
            });

            Promise.all(promises).then(() => {
              next(data);
            });
          }
        })
    }
  }
});