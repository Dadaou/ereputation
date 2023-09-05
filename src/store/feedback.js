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
        }
    }
})