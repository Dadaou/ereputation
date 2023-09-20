import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useFeedbackStore = defineStore("feedback", {
    state: () => ({
        entity: 'reviews',
    }),
    actions: {
        async createReview(review, next){
            await services.createRecord(this.entity, review, (response)=>{
                next(response);
            });
        }, 
        async updateReview(id, review, next){
            await services.patchRecord(this.entity, id, review, (response)=>{
                next(response);
            });
        }
    },
    persist: true,
})