<template>
<div class="comment__pagination">
    <i class="uil uil-angle-left" @click=" showPreviousLink() ? updatePage(config.current - 1) : null" :style="{}"></i> 
    <span>{{  (config.size * (config.current + 1)) - config.size + 1}}</span> to 
    <span v-if="(config.size * (config.current + 1)) < nb">{{ config.size * (config.current + 1) }}</span>
    <span v-else>{{ nb }}</span>
     of 
    <span>{{ nb }}</span>
    <i class="uil uil-angle-right" @click="updatePage(config.current+ 1)"></i>
</div>
</template>
<script>
import { computed } from 'vue';
import { useCheckColor } from '@Composables/useful';
    export default{
        name:"Pagination",
        props:{
            config:Object,
            color: String,
            nb: Number,
            data: Array,
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

.comment__pagination{
    font-size: 13px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3rem;
    color: var(--color-primary);
}

.comment__pagination i{
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    transition: var(--transition)
}
</style>