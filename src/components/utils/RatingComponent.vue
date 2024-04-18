<template>
  <div class="rating_container">
    <div class="society__rating">
      <div class="reviews">
         <div class="rating__observation" v-if="rating > 0">
         {{feeling}}
         </div>
         <div class="reviews__value">
              {{ reviews }} 
              <span v-if="Number(props.reviews) >= 2">
                  reviews
              </span> 
              <span v-else>
                  review
              </span> 
          </div>
      </div>
      <div class="global__rating">
             <!--  <span class="font-bold" :data-tooltip="`Score: ${score}`">{{ score }} </span>
              <span> | </span> -->
              <span class="font-medium" :data-tooltip="`Rating: ${rating}`">{{ rating }}</span>
      </div>
  </div>
  <div class="ratio">{{company.ratio?`Ratio ${Number(company.ratio).toFixed(1)}%`:''}}</div>
</div>
</template>

<script setup>
const props = defineProps(['reviews', 'rating', 'score', 'feeling', 'company']);

</script>

<style scoped>
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
        width: 125px;
    }

    .reviews{
        flex-basis: 100px;
        font-size: 11px;
    }

    .reviews__value, .reviews__value span{
        color: rgb(150, 150, 150);
        font-weight: 500 !important;
        font-size: 11px;
    }

    .global__rating{
        flex-grow: 1;
        flex-basis: 50px;
        background-color: var(--color-danger);
        color: white;
        font-size: 12px;
        padding: 4px 3px;
        border-radius: 5px 5px 5px 0px;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 3px;
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