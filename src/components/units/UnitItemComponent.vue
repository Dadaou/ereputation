<template>
    <div class="unit__list" v-if="units.length>0">
        <div class="unit__card" v-for="unit in units" :key="unit">
            <div class="unit__qrcode">    
                <div>
                    <ul>
                        <li>
                        	<span class="label name">{{unit.name}}</span>
                        </li>
                        <li v-if="unit.code">
                        	<span class="label">Code: {{unit.code}}</span>
                        </li>
                    </ul>
                </div>
            </div>
		</div>
	</div>
<div v-if="units.length==0">No units</div>
</template>
<script setup>
import {ref, inject, computed, defineAsyncComponent} from 'vue';
import moment from 'moment';

const props = defineProps({
	category:{
		type: String,
		required: true
	},
	units:{
		type: Array,
		required: true
	}
});
</script>
<style scoped>

a{
    text-decoration: none;
}

.unit__list{
	display: flex;
	flex-direction: row;
	gap: 1rem;
}

.unit__card{
    border: 1px solid var(--light-color-bg2);
    padding: 15px;
    /*flex-basis: 500px;*/
    /*flex-grow: 1;*/
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap:1rem;
    flex-direction: column;
    margin-bottom: 10px;
}

span.rating{
    color: var(--color-danger);
    font-weight: 600;
}

.unit__card h5{
    color: var(--color-primary);
}

span{
    font-size: 14px;
    color: var(--color-bg2);
    font-weight: 500;
}
span.label{
    color: var(--color-bg1);
    font-size: 14px;
}

span.name{
	color: var(--color-primary);
	font-weight: 800;
}
</style>