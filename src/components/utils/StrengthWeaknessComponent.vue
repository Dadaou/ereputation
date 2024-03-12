<template>
 <div class="categories_comparison">
    <div>
    	<h2 class="strength">Strengths</h2>
	    <ul v-if="strengths.length>0">
	      <li v-for="item in strengths" :key="item" class="strength">
	        {{ item.label }}
	      </li>
	    </ul>
	    <span v-else>...</span>
    </div>
    <div>
    	 <h2 class="weakness">Weaknesses</h2>
    	<ul v-if="weaknesses.length>0">
	      <li v-for="item in weaknesses" :key="item" class="weakness">
	        {{ item.label }}
	      </li>
	    </ul>
	     <span v-else>...</span>
    </div>
 </div>
</template>

<script setup>

const props = defineProps({
	weaknesses: {
		type: Array,
		default: []
	},
	strengths :{
		type: Array,
		default: [],
	},
});

</script>

<style scoped>
ul {
    list-style: none; /* Remove default bullets */
    padding-left: 0;
    font-size: 15px;
    font-weight: 500;
}

li.strength::before {
    content: "➡️ "; /* Unicode arrow for strengths */
    color: green; /* Green color for strengths */
}

li.weakness::before {
    content: "⬅️ "; /* Unicode arrow for weaknesses */
    color: red; /* Red color for weaknesses */
}

li {
    padding: 2px 0; /* Vertical padding for list items */
    margin-bottom: 2px; /* Space between list items */
}

.categories_comparison {
	display: flex;
	gap: 2rem;
	margin-left: 2rem;
	margin-top: 2rem; 
}

.categories_comparison h2{
	font-size: 16px;
	font-weight: 600;
	padding: 5px;
	border-radius: 5px;
}

.categories_comparison h2.strength{
	background: green;
	color: white;
}

.categories_comparison h2.weakness{
	background: red;
	color: white;
}

span{
 font-size: 15px;
 font-weight: 500;
 color: grey
}
</style>
