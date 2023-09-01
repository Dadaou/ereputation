import { defineStore } from "pinia";
import services from '@Services/index.js';
import moment from 'moment';

export const useCompanyStore = defineStore("company", {
  state: () => ({ 
   establishments: [],
   _establishments: [], 
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
          next(data);
        });

      }catch(error){
        console.error(error);
      }
    },
    async calculateRating(reviews, next){
      let total = 0;
      let nb = 0;
      let rating = 0;
      if(reviews.length > 0){
        reviews.forEach(element => {
          total += this.formatRating(element.rating);
          if(this.formatRating(element.rating) > 5) nb+=2;
          else nb++;
        });
        rating = (total / nb).toFixed(2);
        if(isNaN(rating)) rating = 3.9;
      }
      next(rating);
    },
    formatRating(rating){
      rating = rating.includes("/") ? rating.slice(0, -2): rating;
      rating = rating.includes("/") ? rating.slice(0, -1): rating;
      rating = rating.includes(",") ? rating.replace(',', '.') : rating
      return Number(rating);
    },
    calculateRatingV2(reviews){
      let total = 0;
      let nb = 0;
      let rating = 0;
      if(reviews.length > 0){
        reviews.forEach(element => {
          total += this.formatRating(element.rating);
          if(this.formatRating(element.rating) > 5) nb+=2;
          else nb++;
        });
        rating = (total / nb).toFixed(2);
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
    calculateReviewsV3(timePeriod, startDate, endDate, companies){
      let result = [];
      let quarters = this.splitRangeIntoQuarters(startDate, endDate);
      let semesters = this.splitRangeIntoSemesters(startDate, endDate);
      let months = this.getAllMonthsInRange(startDate, endDate);
      let weeks = this.getAllWeeksInRange(startDate, endDate);
      
      if(timePeriod == 'Quarters'){
        quarters.forEach((quarter, index) => {
          let review = {};
          review['name'] = `Q${index} ${moment(quarter.start).format('DD/M/YY')} -${moment(quarter.end).format('DD/M/YY')}`;
          companies.forEach(company => {
            let reviews = this.getReviewsBetweenDates(company.reviews, moment(quarter.start).format('YYYY-M-DD'), moment(quarter.end).format('YYYY-M-DD'));
            let key = company.name;
            // let value = reviews.length;
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
      }

      if(timePeriod == 'Semesters'){
        semesters.forEach((semester, index) => {
          let review = {};
          review['name'] = `S${index} ${moment(semester.start).format('DD/M/YY')} -${moment(semester.end).format('DD/M/YY')}`;
          companies.forEach(company => {
            let reviews = this.getReviewsBetweenDates(company.reviews, moment(semester.start).format('YYYY-M-DD'), moment(semester.end).format('YYYY-M-DD'));
            let key = company.name;
            // let value = reviews.length;
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
      }

      if(timePeriod == 'Months'){
          months.forEach(month => {
            let review = {};
            review['name'] = `${moment(month).format('MMM-YY')}`;
            companies.forEach(company => {
              let reviews = this.getReviewsByMonth(company.reviews, moment(month).format('MMM-YY'));
              let key = company.name;
              // let value = reviews.length;
              let value = Number(this.calculateRatingV2(reviews));
              review[key] = value;
            });
            result.push(review);
          });
      }

      if(timePeriod == 'Weeks'){
        weeks.forEach((week, index) => {
          let review = {};
          // review['name'] = `W${index} ${moment(week.begin).format('MM-YY')}/${moment(week.end).format('MM-YY')}`;
          review['name'] = `${index}`;
          companies.forEach(company => {
            let reviews =  this.getReviewsBetweenDates(company.reviews, week.begin, week.end);
            let key = company.name;
            // let value = reviews.length;
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
    }
      return result;
    },
    calculateReviewsBySources(company, websites, timePeriod, startDate, endDate){
      let result = [];
      let quarters = this.splitRangeIntoQuarters(startDate, endDate);
      let semesters = this.splitRangeIntoSemesters(startDate, endDate);
      let months = this.getAllMonthsInRange(startDate, endDate);
      let weeks = this.getAllWeeksInRange(startDate, endDate);
      console.log('weeks', weeks)
     
      if(timePeriod == 'Quarters'){
        quarters.forEach((quarter, index) => {
          let review = {};
          review['name'] = `Q${index} ${moment(quarter.start).format('DD/M/YY')} -${moment(quarter.end).format('DD/M/YY')}`;
          websites.forEach(website => {
            let data = this.getReviewsBySource(company.reviews, website.toLowerCase());
            let reviews = this.getReviewsBetweenDates(data, moment(quarter.start).format('YYYY-M-DD'), moment(quarter.end).format('YYYY-M-DD'));
            let key = website;
            // let value = reviews.length; //this.calculateRatingV2(lastMonthReviews[month]);
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
      }

      if(timePeriod == 'Semesters'){
        semesters.forEach((semester, index) => {
          let review = {};
          review['name'] = `S${index} ${moment(semester.start).format('DD/M/YY')} -${moment(semester.end).format('DD/M/YY')}`;
          websites.forEach(website => {
            let data = this.getReviewsBySource(company.reviews, website.toLowerCase());
            let reviews = this.getReviewsBetweenDates(data, moment(semester.start).format('YYYY-M-DD'), moment(semester.end).format('YYYY-M-DD'));
            let key = website;
            // let value = reviews.length;
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
      }

      if(timePeriod == 'Months'){
          months.forEach(month => {
            let review = {};
            review['name'] = `${moment(month).format('MMM-YY')}`;
            websites.forEach(website => {
              let data = this.getReviewsBySource(company.reviews, website.toLowerCase());
              let reviews = this.getReviewsByMonth(data, moment(month).format('MMM-YY'));
              let key = website;
              // let value = reviews.length;
              let value = Number(this.calculateRatingV2(reviews));
              review[key] = value;
            });
            result.push(review);
          });
      }

      if(timePeriod == 'Weeks'){
        weeks.forEach((week, index) => {
          let review = {};
          review['name'] = `${index}`;
          websites.forEach(website => {
            let data = this.getReviewsBySource(company.reviews, website.toLowerCase());
            let reviews =  this.getReviewsBetweenDates(data, week.begin, week.end);
            let key = website;
            // let value = reviews.length;
            let value = Number(this.calculateRatingV2(reviews));
            review[key] = value;
          });
          result.push(review);
        });
    }
      return result;
    },
    generateLegend(data, colors){
      let legend = [];
      var index = 0;
      
      data.forEach(element => {
        legend.push({
          "name": element.name,
          "color": colors[index]
        })
        if(index>=data.length) index = 0;
        index ++;
      });
      return legend;
    },
    generateLegendV2(data, colors){
      let legend = [];
      
      var index = 0;
      
      data.forEach(element => {
        legend.push({
          "name": element,
          "color": colors[index]
        })
        if(index>=(data.length - 1)) index = 0;
        index ++;
      });
      return legend;
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
    getLastReviews(reviews, n){
      let data = []
      if(reviews.length>0){
        reviews.sort(function(a, b) {
          return moment(b.date_review).diff(moment(a.date_review));
        });
        let lastReviews = reviews.slice(0, n);
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
        let rating = this.calculateRatingV2(lastMonthReviews[month]);
        data.push(Number(rating));
      });
      return data;
    },
    getfeedbackData(reviews){
      let sumConfidence = 0;
      let percentage = (this.calculateRatingV2(reviews) / 5) * 100;
      
      reviews.forEach((review)=>{
        sumConfidence += review.confidence;
      })

      // let confidencePercentage = sumConfidence * 100 / reviews.length;
      // let rawWidth = confidencePercentage / 1.5;
      let rawWidth = percentage / 3;
      let width = rawWidth < 0 ? -1 * rawWidth : rawWidth;
      let feeling = rawWidth > 0 ? 1 : -1;
      let red = 255;
      let green = 255;
      if (feeling == 1){
        red = 200;
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
          if(this.isURL(value) && key !== 'url'){
            data.push(this.capitalizeString(key));
          }
        }
      });
      return data;
    },
    getReviewsBetweenDates(reviews, start_date, end_date){
      let result = [];
      const startDate = moment(start_date);
      const endDate = moment(end_date);
      result = reviews.filter(review => {
        const reviewDate = moment(review.date_review);
        return reviewDate.isBetween(startDate, endDate, null, '[]');
      });
      return result;
    },
    splitRangeIntoQuarters(start_date, end_date){
      const start = new Date(start_date);
      const end = new Date(end_date);
      
      const quarters = [];
      
      while (start <= end) {
        const quarterStart = new Date(start);
        const quarterEnd = new Date(start);
        quarterEnd.setDate(quarterEnd.getDate() + 89); // 89 days for each quarter
        
        if (quarterEnd > end) {
          quarters.push({ start: quarterStart, end: end }); // Last quarter may have fewer than 90 days
        } else {
          quarters.push({start: quarterStart, end: quarterEnd});
        }
        start.setDate(start.getDate() + 90); // Move to the next quarter
      }

      return quarters;
    },
    splitRangeIntoSemesters(start_date, end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const totalDuration = endDate.getTime() - startDate.getTime();
      
      // Calculate the number of semesters based on the total duration
      const numberOfSemesters = Math.ceil(totalDuration / (365 * 24 * 60 * 60 * 1000 / 2));
    
      const semesterDuration = totalDuration / numberOfSemesters;
      const semesters = [];
    
      for (let i = 0; i < numberOfSemesters; i++) {
        const semesterStart = new Date(startDate.getTime() + i * semesterDuration);
        const semesterEnd = new Date(semesterStart.getTime() + semesterDuration);
    
        semesters.push({ start: semesterStart, end: semesterEnd });
      }
      return semesters;
    },
    getAllMonthsInRange(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const months = [];

      start.setDate(1);
    
      while (start <= end) {
        const year = start.getFullYear();
        const month = start.getMonth();
        months.push(new Date(year, month));
        start.setMonth(start.getMonth() + 1);
      }
      return months;
    },
    getAllWeeksInRange(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      let dates = [];
      const addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    
      let currentDate = start;
      if (currentDate.getDay() > 0) {
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
      }
    
      while (currentDate <= end) {
        let endWeekDate = addDays.call(currentDate, 6);
        dates.push({ begin: currentDate, end: endWeekDate });
        currentDate = addDays.call(currentDate, 7);
      }
    
      return dates;
    },
    getReviewsByMonth(reviews, month){
      const result = [];

      reviews.forEach((review) => {
        const reviewDate = moment(review.date_review);
        const monthYear = reviewDate.format('MMM-YY');
        if(monthYear == month) result.push(review);
        
      });
      return result;
    },
  }
});