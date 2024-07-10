<template>
  <div class="rating_container">
    
    <div class="society__rating">
      <div class="reviews">
         <div class="rating__observation" v-if="rating > 0">
         {{feeling}}
         </div>
         <div class="reviews__value" v-if="!company.isTrends">
              {{ reviews }} 
              <span v-if="Number(props.reviews) >= 2">
                  reviews
              </span> 
              <span v-else>
                  review
              </span> 
         </div>
      </div>
      <div :class="['global__rating', company.ratio>0?'green':(company.ratio === 0 ? 'grey' :'red')]" v-if="company.isTrends">
              <span class="font-medium" :data-tooltip="`Ratio: ${company.ratio_text}`"> 
              {{ company.ratio_text }}
              </span>
      </div>
      <div class="global__rating" v-else>
            <span class="font-medium" :data-tooltip="`Note: ${rating}`" v-if="company.isGlobal">{{ rating }}</span>
            <span class="font-medium" :data-tooltip="`Score: ${rating}`" v-else>{{ rating }}</span>
      </div>
      
    </div>
    <div class="reviews__value mb-2" v-if="company.isTrends">
      
      <div v-if="selectedDate">
        <div> <Tooltip :text="info_bulle_text" class="infobulle" />Selected Date: {{ selectedDate }} , Score: {{ company.previous.note }} 
        </div>
        <div class="curent">Current Date: {{ company.curent.to }} , Score: {{ company.curent.note }}</div>
    </div>
      <div v-else>
        
        <div><Tooltip :text="info_bulle_text"/>Previous: {{ company.previous.from }} / {{ company.previous.to }} , Score: {{ company.previous.note }}
        </div>
        <div class="curent">Period: {{ company.curent.from }} / {{ company.curent.to }} , Score: {{ company.curent.note }}</div>
      </div>
    </div>
 <!--  <div class="ratio">{{company.ratio?`Ratio ${Number(company.ratio).toFixed(1)}%`:''}}</div> -->
</div>
</template>

<script setup>
import { inject, defineAsyncComponent} from 'vue';

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
);

const info_bulle_text = `the last x days compared to the previous x days.`;
const selectedDate = inject('selectedDate')
const props = defineProps(['reviews', 'rating', 'score', 'feeling', 'company', 'selectedDate']);

const arrondirRatio = (ratio)=>{
    ratio = ratio ? Number(ratio) : 0;
    let ratioArrondi = ratio > 1.5 ? Math.ceil(ratio) : Math.round(ratio);

    return ratioArrondi;
};

</script>

<style scoped>
    .curent{
      margin-left: 18px;
    } 

    .rating_container{
      display: flex;
      flex-direction: column;
      align-content: flex-start;
    }

    .ratio{
      font-size: 11px;
      font-weight: 500;
    }

    .society__rating{
        display: flex;
        align-items: center;
        /*width: 125px;*/
    }

    .reviews{
        flex-basis: 100px;
        font-size: 11px;
    }

    .reviews__value, .reviews__value span{
        color: rgb(150, 150, 150);
        font-weight: 500 !important;
        font-size: 11px;
        display: block;
    }

    .global__rating{
        flex-grow: 1;
        flex-basis: 50px;
        background-color: var(--color-danger);
        color: white;
        font-size: 11px;
        padding: 4px 3px;
        border-radius: 5px 5px 5px 0px;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 3px;
        margin-left: 30px;
    }

    .global__rating.red{
      background-color: red;
    }

    .global__rating.green{
      background-color: green;
    }

    .global__rating.grey{
      background-color: grey;
    }

    .society__rating a{
        font-size: 12px;
        font-weight: 600;
    } 

    .society__rating .rating__observation{
        font-size: 13px;
        font-weight: bold;
    }

    [data-tooltip] {
      position: relative;
      cursor: pointer;
    }

    /* Tooltip text */
    [data-tooltip]::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 5px); /* Adjust the position of the tooltip */
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      pointer-events: none;
    }

    /* Tooltip visibility on hover */
    [data-tooltip]:hover::before {
      opacity: 1;
    }

</style>