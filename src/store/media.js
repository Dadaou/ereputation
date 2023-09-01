import { defineStore } from "pinia";

export const useMediaStore = defineStore("media", {
    state: () => ({
        entity: 'media',
    }),
    actions: {
        async fetchOne(id, next){
            try {
              await services.getRecord(this.entity, id, (response)=>{
                next(response.data);
              });
            } catch (error) {
              console.error(error)
            }
        },
        isImageFile(text) {
            const imageFileExtensions = /\.(jpeg|jpg|gif|png|bmp|svg)$/i;
            const imageMimeTypes = /^image\/(jpeg|jpg|gif|png|bmp|svg\+xml)$/i;
            return imageFileExtensions.test(text) || imageMimeTypes.test(text);
          }
    }
})