<template>
	<div class="mb-2 cat_desc">
        <p>
            <Icon icon="ic:twotone-arrow-right" width="2rem" height="2rem"  style="color: #d9d208"></Icon> 
            {{text}} :
        </p>
        <span v-for="rating in ratings" :key="rating.label" :style="{
		    background: services.generateColor(rating.label),
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
    	margin-left: 2rem;
    	font-size: 12px;
    }
</style>