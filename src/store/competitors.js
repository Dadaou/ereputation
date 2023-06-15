import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompetitorStore = defineStore("competitor", {
  state: () => ({
   competitors: [], 
   entity: 'competitors',
   nb: 0,
  }),
  actions: {
    fetchByEstablishment(data, next){
        data.forEach(async url => {
            await services.get_Record(url.replace("/api", ""), (response)=>{
                if (response.status == 200) {
                  this.competitors.push(response.data['hydra:member']);
                }
            })       
        });
        next()
    }
  }
});