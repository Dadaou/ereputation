<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="container comparison__container">
            <div class="company__item" v-for="company in companies">
                    <div class="company__status" v-if="!company.isConcurrent">owned</div>
                    <img class="company__logo" :src="company.logo" alt="">  
                    <div class="company__main__info">
                       <div class="item__head">
                        <div class="company__info">
                            <label class="company__name">{{ company.name }}</label>
                            <div class="company__location">
                                <i class="uil uil-location-point"></i>
                                <span>{{ company.address }}</span>
                            </div>
                            <div class="flex items-center mb-3">
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <p class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ company.rate }} out of 5</p>
                                </div>

                        </div>
                        <div class="company__description">
                        {{ company.description }}
                       </div>
                        <div class="company__rating">
                            <div class="review">       
                                <label>Reviews and rating</label>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ company.nb_reviews }} global ratings from {{ company.nb_customers }} customers</p>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">5 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 70%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">70%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">4 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 17%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">17%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">3 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 8%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">8%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">2 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 4%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">4%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">1 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 10%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">10%</span>
                                </div>   
                            </div>
                        </div>
                        <div>
                                    <label>Chart</label>
                                    <LineChart :plot-data="plotData" x-key="date"
                                                :width="450" :height="250" :margin="margin"
                                                x-axis-label="Year"
                                                :y-tick-format="d => `$${d}`">
                                    </LineChart>
                                </div>
                       </div>
                    </div>
               </div>
               <div class="company__item" v-for="company in companies">
                    <div class="company__status" v-if="!company.isConcurrent">owned</div>
                    <img class="company__logo" :src="company.logo" alt="">  
                    <div class="company__main__info">
                       <div class="item__head">
                        <div class="company__info">
                            <label class="company__name">{{ company.name }}</label>
                            <div class="company__location">
                                <i class="uil uil-location-point"></i>
                                <span>{{ company.address }}</span>
                            </div>
                            <div class="flex items-center mb-3">
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg aria-hidden="true" class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <p class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ company.rate }} out of 5</p>
                                </div>
                        </div>
                        <div class="company__description">
                        {{ company.description }}
                       </div>
                        <div class="company__rating">
                            <div class="review">       
                                <label>Reviews and rating</label>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ company.nb_reviews }} global ratings from {{ company.nb_customers }} customers</p>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">5 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 70%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">70%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">4 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 17%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">17%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">3 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 8%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">8%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">2 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 4%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">4%</span>
                                </div>
                                <div class="flex items-center mt-4">
                                    <span class="text-sm font-medium text-blue-600 dark:text-blue-500">1 star</span>
                                    <div class="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div class="h-2 bg-yellow-300 rounded" style="width: 10%"></div>
                                    </div>
                                    <span class="text-sm font-medium text-grey-600 dark:text-blue-500">10%</span>
                                </div>   
                            </div>
                        </div>
                        <div>
                            <label>Chart</label>
                            <LineChart :plot-data="plotData" x-key="date"
                                        :width="450" :height="250" :margin="margin"
                                        x-axis-label="Year"
                                        :y-tick-format="d => `$${d}`">
                            </LineChart>
                        </div>
                       </div>
                    </div>
               </div>
        </div>
        <div class="container chart__container">
            <div class="chart__title">Comparatative chart between company1 & company2</div>
            <div>
                <GroupedBarChart :plot-data="plotData" x-key="date"
                                :width="450" :height="300" :margin="margin"
                                x-axis-label="Year" y-axis-label="Expenses"
                                :y-tick-format="d => `$${d}`">
                </GroupedBarChart>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import {ref} from 'vue';

const page=ref({
    title1: "Company",
    title2: "Comparison",
    icon: "uil-building",
});

const companies = ref([
    {
        logo: "/src/assets/images/Portrait_Placeholder.png",
        name: "Trip Advisor",
        rate: 4.3,
        nb_reviews: 200,
        nb_customers: 100,
        address: "New York, USA",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nihil quasi odit eaque doloremque, quos consequatur harum ipsam inventore",
        website: "https://booking.com",
        isConcurrent: true,
    }
]);

const plotData =[
  {
    "date": "2019",
    "Utilities": 5921,
    "Rent": 1026,
    "Insurance": 2324
  },
  {
    "date": "2020",
    "Utilities": 1539,
    "Rent": 1560,
    "Insurance": 1257
  },
  {
    "date": "2021",
    "Utilities": 109,
    "Rent": 160,
    "Insurance": 125
  },
]
</script>

<style scoped>

@tailwind base;
@tailwind components;
@tailwind utilities;

.comparison__container{
    position: relative;
    top:3rem;
    height: inherit;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    padding: 25px;
    width: var(--container-width-md);
}

.company__statistics{
    flex-basis:50%;
}

.competitor__statistics{
    background-color:green;
    flex-basis:50%;
}

.society__logo{
    height: 75px;
}

.company__item{
    display: flex;
    gap:2rem;
    padding: 15px;
    border-radius: 15px;
    transition: var(--transition);
    border: 1px solid var(--light-color-bg2);
    cursor: pointer;
}

.company__item:hover{
    border: 1px solid var(--color-white);
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
}
.company__item .company__logo{
    width: 15%;
    height: 100px;
}

.company__item .company__name{
    color: var(--color-primary);
    font-weight: bold;
    font-size: 16px;
}

.company__item .company__location{
    font-size: 13px;
}

.company__item .company__location i{
    color: var(--color-danger);
}

.company__description{
    font-size: 14px;
}

.company__rating .review label, .chart__container .chart__title{
    margin: 20px 0 ;
    font-size: 14px;
    font-weight: bold;
    color: var(--color-success);
    text-align: center;
}

.chart__container{
    position: relative;
    top:5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
}

footer{
    margin-top: 0px !important;
}


/*.comparison__container{
    margin: 10px;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
}

.company__statistics{
    margin-top: 50px;
    width: 30%;
}

.reviews{
    cursor: pointer;
}
.statistics__comment{
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
    padding: 15px;
    font-size: 13px;
}

.statistics__comment span{
   font-size: 18px;
   color: var(--color-bg2);
   font-weight: bold;
}

.title{
    font-weight: bolder;
    font-size: 18px;
    color: var(--color-danger);
    margin: 15px 0px;
}

.review__item{
    border: 1px solid rgb(229, 229, 229);
    margin: 15px;
    padding: 15px;
    border-radius: 15px;
    font-size: 13px;
}

.review__item .review__title{
   font-weight: bolder;
} */
</style>