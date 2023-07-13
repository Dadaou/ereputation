import { defineStore } from "pinia";
import services from '@Services/index.js';
import moment from 'moment';

export const useCompanyStore = defineStore("company", {
  state: () => ({ 
   establishments: [], 
   entity: 'establishments',
   nb: 0,
  }),
  actions: {
    async fetchAll(next){
        await services.getRecords(this.entity, async (response)=>{
            if (response.status == 200) {
              this.establishments = response.data['hydra:member'];
              let data = response.data['hydra:member'];
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
    async fetchByUser(establishmentIds, next){
      try{
        let data = [];
        let promises = [];

        for(const id of establishmentIds){
          let promise = services.getRecord(this.entity, id, (response)=>{
            data.push(response.data);
          });
          promises.push(promise);
        }
        Promise.all(promises).then(()=>{
          this.establishments = data;
          this.nb = data.length;
          console.log(data)
          next(data);
        });

      }catch(error){
        console.error(error);
      }
    },
    async calculateRating(reviews, next){
      console.log(reviews);
      let total = 0;
      let nb = 0;
      let rating = 0;
      if(reviews.length > 0){
        reviews.forEach(element => {
          total += Number(element.rating);
          if(Number(element.rating)>5) nb+=2;
          else nb++;
        });
        rating = (total / nb).toFixed(2);
        // if (isNaN(rating)) rating = 0;
        if(isNaN(rating)) rating = 3.9;
      }
      next(rating);
    },
    calculateRatingV2(reviews){
      let total = 0;
      let nb = 0;
      let rating = 0;
      
      if(reviews.length > 0){
        reviews.forEach(element => {
          total += Number(element.rating);
          if(Number(element.rating)>5) nb+=2;
          else nb++;
        });
        rating = (total / nb).toFixed(2);
        // if (isNaN(rating)) rating = 0;
        if(isNaN(rating)) rating = 3.9;
      }
      return rating;
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
      next(reviews);
    },
    calculateReviewsV2(data, nbMonth, selected_date, year){
      let months = this.getLastMonths(nbMonth, selected_date, year);
      let result = [];
      months.forEach(month => {
        let review = {};
        review['name'] = month;
        data.forEach(company => {
          let monthlyReviews = this.getLastMonthReviews(company.reviews, nbMonth, selected_date, year);
          let key = company.name;
          let value = monthlyReviews[month].length;
          review[key] = value;
        });
        result.push(review);
      });
      return result;
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
      next(legend);
    },
    getTopThreeReviews(reviews, rating, result){
      reviews.forEach(review => {
        if(Number(review.rating)>5){
          if(Number(review.rating)/2 == rating && result.length < 3) result.push(review);
        }else{
          if(Number(review.rating) == rating && result.length < 3) result.push(review);
        }
      });
      rating --;
      if(result.length < 3 && rating >= 0) this.getTopThreeReviews(reviews, rating, result);
      return result;
    },
    getThreeLastReviews(reviews){
      let data = []
      if(reviews.length>0){
        reviews.sort(function(a, b) {
          return moment(b.date_review).diff(moment(a.date_review));
        });
        
        let lastReviews = reviews.slice(0, 3);
        
        lastReviews.forEach(function(review) {
         data.push(review);
        });
      }
      return data.reverse();
    },
    getReviewsBySource(reviews, website){
       let data = [];
       reviews.forEach(review => {
          if(review.source == website){
            console.log(review.source , website,review.source == website)
            data.push(review);
          } 
        });
        return data;
    },
    async getReviewsByWebsite(establishments, website, next){
      let data = [];
      establishments.forEach(establishment => {
        let company = {
          '@id': establishment['@id'],
          '@type': establishment['@type'],
          'address1': establishment['address1'],
          'address2': establishment['address2'],
          'city': establishment['city'],
          'competitor_tag': establishment['competitor_tag'],
          'country': establishment['country'],
          'customer': establishment['customer'],
          'gps': establishment['gps'],
          'id': establishment['id'],
          'name': establishment['name'],
          'region': establishment['region'],
          'reviews': [],
          'station_key': establishment['station_key'],
          'station_name': establishment['station_name'],
          'websites': establishment['websites'],
          'zipcode': establishment['zipcode'],
        }
        company.reviews = this.getReviewsBySource(establishment.reviews, website.toLowerCase());
         data.push(company);
      });
      next(data);
    },
    getLastMonths(nbMonth, actualMonth, year){
      let lastMonth = [];
      for (let i = 0; i < nbMonth; i++) {
        let month = actualMonth.clone().subtract(i, 'months').format('MMM');
        if(year) month = actualMonth.clone().subtract(i, 'months').format('MMM-YY');
        lastMonth.push(month);
      }
      return lastMonth.reverse();
    },
    initReviewsByMonth(months){
      const reviewsByMonth = {};
      months.forEach(month => {
        reviewsByMonth[month] = [];
      });
      return reviewsByMonth;
    },
    initReviewsByMonth(months){
      const reviewsByMonth = {};
      months.forEach(month => {
        reviewsByMonth[month] = [];
      });
      return reviewsByMonth;
    },
    getLastMonthReviews(reviews, nbMonth, currentDate, year){
      const lastMonths = this.getLastMonths(nbMonth, currentDate, year);
      const monthlyReviews = this.initReviewsByMonth(lastMonths);
    
      if(reviews.length > 0){
        reviews.forEach(review => {
          let reviewDate = moment(review.date_review).format('MMM');
          if(year) reviewDate = moment(review.date_review).format('MMM-YY');

          if(review.date_review == null) {
            reviewDate = moment(review.created_at).format('MMM');
            if(year) reviewDate = moment(review.created_at).format('MMM-YY');
          }

          lastMonths.forEach(month => {
           if(month === reviewDate) monthlyReviews[month].push(review);
          });
        });
      }

      return monthlyReviews;
    },
    getRatingLastMonths(reviews, nbMonth, date, year){
      let data = [];
      const months = this.getLastMonths(nbMonth, date, year);
      const lastMonthReviews = this.getLastMonthReviews(reviews, nbMonth, date, year);
      months.forEach(month => {
        console.log(month, lastMonthReviews[month])
        let rating = this.calculateRatingV2(lastMonthReviews[month]);
        data.push(Number(rating));
      });
      return data;
    },
    getfeedbackData(reviews){
      let sumConfidence = 0

      reviews.forEach((review)=>{
        sumConfidence += review.confidence
      })

      let confidencePercentage = sumConfidence * 100 / reviews.length
      let rawWidth = confidencePercentage * 2
      let width = rawWidth < 0 ? -1 * rawWidth : rawWidth
      let feeling = rawWidth > 0 ? 1 : -1
      let red = 255
      let green = 255
      if (feeling == 1){
        red = 200
      } else {
        green = 200
      }

      return {
        width: width,
        red: red,
        green: green,
        feeling: feeling
      }
    },
    getMonthsAndWeeks(startDate, endDate) {
      const months = [];
      const flag = startDate;
      while (flag.diff(endDate) <= 0) {
        months.push(flag.format('MMM YY'));
        flag.add(1, 'M');
      }
      return months;
    },
    getReviewsBetween2Dates(establishment, startDate, endDate){ 
      startDate = moment(startDate, 'YYYY-MM-DD');
      endDate = moment(endDate, 'YYYY-MM-DD');
  
      const reviews = establishment.reviews;
      const reviewsBetweenDates = [];
      const _reviews = this.initReviewsByMonth(this.getMonthsAndWeeks(startDate, endDate));
      reviews.forEach(function(review) {
        var reviewDate = moment(review.date_review, "YYYY-MM-DD");
        if(review.date_review == null) reviewDate = moment(review.created_at, "YYYY-MM-DD");
        var month = reviewDate.format("MMM YY");
      
        if (reviewDate.isBetween(startDate, endDate, null, '[]')) {
          reviewsBetweenDates.push(review);
          _reviews[month].push(review);
        }
      });
      console.log(reviewsBetweenDates);
      console.log(_reviews)
    },
    getNumberOfRating(reviews){
      let value = {
        rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0
      }

      reviews.forEach(review =>{
        let rating = parseInt(review.rating);
        if(rating > 5){
          rating = parseInt(rating/2)
        }
        if(rating == 5) value.rate5 ++;
        if(rating == 4) value.rate4 ++;
        if(rating == 3) value.rate3 ++;
        if(rating == 2) value.rate2 ++;
        if(rating == 1) value.rate1 ++;
      })

      return value;
    },
    capitalizeString(str) {
      if (typeof str !== 'string') {
        throw new Error('Input must be a string');
      }
      
      if (str.length === 0) {
        return str;
      }
      
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    isURL(string) {
      const urlPattern = /^(?:https?:\/\/)?(?:www\.)?[^\s.]+\.[^\s]{2,}$/i;
      return urlPattern.test(string);
    },
    getWebsites(websites){
      let _websites =  Object.entries(websites[0]);
      let data = [];
      _websites.forEach(([key, value]) => {
        if(typeof(value) == 'string'){
          if(this.isURL(value)){
            data.push(this.capitalizeString(key));
          }
        }
      });
      return data;
    }
  }
});