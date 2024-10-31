import { defineStore } from "pinia";
import services from '@Services/services.js';

export const useLinkStore = defineStore("link", {
    state: () => ({
        links: [],
        entity: 'link',
        link: null
    }),
    actions: {
        async updateLink(link, id, next){
            await services.putRecord(this.entity, id, link, (response)=>{
                next(response);
            })
        },

       async fetchOne(id, next){
          try {
            await services.getRecord(this.entity, id, (response)=>{
              next(response);
            });
          } catch (error) {
            console.error(error)
          }
        },

        setLink(data){
          this.link = data;
        },

        resetLink(){
          this.link = null;
        }, 

        getLink(){
          return this.link;
        }
    },
})