<template>
<div class="comment__pagination">
    <i class="uil uil-angle-left" :class="[disabledPrev==false?'':'disabled']" @click="showPreviousLink() ? updatePage(config.current - 1) : null" :style="{}"></i> 
    <span>{{  (config.size * (config.current + 1)) - config.size + 1}}</span> to 
    <span v-if="(config.size * (config.current + 1)) < nb">{{ config.size * (config.current + 1) }}</span>
    <span v-else>{{ nb }}</span>
     of 
    <span>{{ nb }}</span>
    <i class="uil uil-angle-right" :class="[disabled==false?'disabled':'']" @click="updatePage(config.current+ 1)"></i>
</div>
</template>
<script>
import { computed, ref } from 'vue';
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
            let disabledNext = computed(() => (props.config.size * (props.config.current + 1) < props.nb));
            let disabled = ref(disabledNext.value); 
            let disabledPrev = computed(() => props.config.current == 0);

            let updatePage = function(pageNumber){
                ctx.emit('updatePage', pageNumber)
                disabled.value = props.config.size * (props.config.current + 1) < props.nb; 
            }

            let totalPages = function(){
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
                showNextLink, textColor, disabledNext, disabledPrev, disabled
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

.disabled{
    color: var(--light-color-bg2) !important;
}
</style>