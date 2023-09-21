import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useEventStore = defineStore("event", {
    state: () => ({
        events: [],
        entity: 'events'
    }),
    actions: {
        async addEvent(event, next){
            await services.createRecord(this.entity, event, (response)=>{
                next(response);
            });
        }
    },
})