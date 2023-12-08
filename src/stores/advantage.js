import { defineStore } from "pinia";
import services from '@Services/services.js';

export const useEventStore = defineStore("advantage", {
    state: () => ({
        advantages: [],
        entity: 'advantages'
    }),
    actions: {
        async addAdvantage(advantage, next){
            await services.createRecord(this.entity, advantage, (response)=>{
                return next(response);
            });
        },
        async removeAdvantage(id, next){
            await services.deleteRecord(this.entity, id, (response)=>{
                next(response);
            })
        },
        async updateAdvantage(event, id, next){
            await services.patchRecord(this.entity, id, staff, (response)=>{
                next(response);
            })
        },
    },
})