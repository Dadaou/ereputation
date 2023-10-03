import { defineStore } from "pinia";
import services from '@Services/services.js';

export const useEventStore = defineStore("event", {
    state: () => ({
        events: [],
        entity: 'events'
    }),
    actions: {
        async addEvent(event, next){
            await services.createRecord(this.entity, event, (response)=>{
                return next(response);
            });
        },
        async removeEvent(id, next){
            await services.deleteRecord(this.entity, id, (response)=>{
                next(response);
            })
        },
        async updateEvent(event, id, next){
            await services.patchRecord(this.entity, id, staff, (response)=>{
                next(response);
            })
        },
    },
})