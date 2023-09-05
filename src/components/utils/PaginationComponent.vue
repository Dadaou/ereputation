<template>
  <div class="pagination__container">
    <div class="pagination__content">
        <div class="previous-btn" @click=" showPreviousLink() ? updatePage(config.current - 1) : null" :style="{}">
            <i class="uil uil-angle-left-b"></i>
        </div>
        <div class="current__page" :style="{backgroundColor:color, color:textColor}">
           {{ config.current + 1 }}
        </div>
        <div class="next-btn" @click="updatePage(config.current+ 1)">
            <i class="uil uil-angle-right-b"></i>
        </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCheckColor } from '@Composables/useful'
    export default{
        name:"Pagination",
        props:{
            config:Object,
            color: String,
        },
        emits:['updatePage'],
        setup(props, ctx){
            let updatePage = function(pageNumber){
                ctx.emit('updatePage', pageNumber)
            }

            let totalPages = function(){
                console.log(Math.ceil(props.config._data.length / props.config.size));
                 return Math.ceil(props.config._data.length / props.config.size);
            }

            let showPreviousLink = function(){
                 return props.config.current == 0 ? false : true;
            }

            let showNextLink = function(){
                 return  props.config.current == (totalPages()-1) ? false : true;
            }

            /** this function is not really necessary but it just to make the pagination working */
            let textColor = computed(()=>{
                let color = "black";
            
                if(useCheckColor(props.color) == "light") color = "black";
                else color= "rgb(238, 246, 254)";
                return color = 'white';
            })

            return{
                updatePage, totalPages, showPreviousLink,
                showNextLink, textColor,
            }
        }
    }
</script>

<style scoped>
    span{
        cursor: pointer;
        caret-color: transparent !important;
    }

    .pagination__container{
        display: flex;
        justify-content: center;
        font-size: 13px;
       
    }

    .pagination__container i{
        font-size: 20px;
        color: black;
    }

    .pagination__content{
        display: flex;
        align-items: center;
    }

    .current__page{
        padding: 1px 10px;
        margin: 0px 10px;
        border-radius: 3px;
        box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
    }
</style>

