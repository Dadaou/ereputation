<template>
	<div class="mb-2 cat_desc">
        <p class="mb-2">
            <!-- <Icon icon="ic:twotone-arrow-right" width="2rem" height="2rem"  style="color: var(--color-danger)"></Icon> --> 
            <span v-if="condition == 'condition1'">
            	😀
            </span>
            <span  v-if="condition== 'condition2'">
            	😐
            </span>
            <span  v-if="condition== 'condition3'">
            	😕
            </span>
            {{text}} :
        </p>
        <span v-for="rating in ratings" :key="rating.label" :style="{
		    background: rating.color,
		    color: 'white',
		    padding: '5px',
		    borderRadius: '5px',
		    marginRight: '5px' 
		}">
		    {{ rating.label }}
		</span>

    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
import services from '@Services/services.js';
const props = defineProps({
	ratings: {
		type: Array,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	condition: {
		type: String,
		default: ''
	}
});
</script>
<style scoped>
	.cat_desc{
        font-weight: 450;
    }

    .cat_desc p{
        display: flex;
        align-items: center;
        font-size: 15px;
    }

    .cat_desc span{
    	font-size: 12px;
    }

    .cat_desc span:nth-child(2) {
	    margin-left: 1rem;
	}

    .cat_desc p span{
    	font-size: 18px;
    }
</style>