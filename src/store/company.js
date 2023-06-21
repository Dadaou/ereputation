import { defineStore } from "pinia";
import services from '@Services/index.js';

export const useCompanyStore = defineStore("company", {
  state: () => ({ 
   establishments: [], 
   entity: 'establishments',
   nb: 0,
  }),
  actions: {
    async fetchAll(next){
        await services.getRecords(this.entity, (response)=>{
            if (response.status == 200) {
              this.establishments = response.data['hydra:member'];
              console.log(this.establishments)
              this.nb = this.establishments.length;
              next(response);
            }
        })
    },
    async fetchOne(id, next){
      try {
        await services.getRecord(this.entity, id, (response)=>{
          next(response.data);
        });
      } catch (error) {
        console.error(error)
      }
    },
    async calculateRating(reviews, next){
      console.log(reviews);
      let total = 0;
      
      reviews.forEach(element => {
        total += Number(element.rating);
      });
      let rating = (total / reviews.length).toFixed(2);
      if (isNaN(rating)) rating = 0;
      next(rating);
    },
    async calculateReviews(data, next){
      let reviews = {
        name: "Establishments"
      };

      data.forEach(element => {
        let key = element.name;
        let value = element.reviews.length;
        reviews[key] = value;
      });

      next(reviews)
    },
    async generateLegend(data, next){
      let legend = [];
      let colors = ['#6c63ff', '#f75842', '#aca8fd', '#424890'];
      
      var index = 0;
      
      data.forEach(element => {
        legend.push({
          "name": element.name,
          "color": colors[index]
        })

        if(index>=data.length) index = 0;
        index ++;
      });

      next(legend)
    },
    getTopThreeReviews(reviews, rating, result){
      reviews.forEach(review => {
        if(Number(review.rating) == rating && result.length < 3) result.push(review);
      });
      rating --;
      if(result.length < 3 && rating >= 0) this.getTopThreeReviews(reviews, rating, result);
      
      return result;
    }
  }
});