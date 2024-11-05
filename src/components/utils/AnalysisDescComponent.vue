<template>
	<div class="mb-2 cat_desc">
		<p class="mb-2">
			<!-- <Icon icon="ic:twotone-arrow-right" width="2rem" height="2rem"  style="color: var(--color-danger)"></Icon> -->
			<span v-if="condition == 'condition1'">
				😀
			</span>
			<span v-if="condition == 'condition2'">
				😐
			</span>
			<span v-if="condition == 'condition3'">
				😕
			</span>
			{{ text }} :
		</p>
		<div class="contain">
			<span v-for="rating in ratings" :key="rating.label" :style="{
				background: rating.color,
				color: 'white',
				padding: '5px',
				borderRadius: '5px',
				marginRight: '10px',
				cursor: 'pointer',
				display: 'inline-block',
				marginBottom: '5px',
			}" @click="emitLabelChange(rating.label)">
				{{ rating.label }} : {{ rating.avg_rating }}
			</span>
		</div>

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
const emit = defineEmits(['labelChange']);

const emitLabelChange = (label) => {
	emit('labelChange', label);
}
</script>
<style scoped>
.cat_desc {
	font-weight: 450;
}

.contain {
	margin-left: 4px;
}

.cat_desc p {
	display: flex;
	align-items: center;
	font-size: 15px;
}

.cat_desc span {
	font-size: 12px;
}

.cat_desc span:nth-child(2) {
	margin-left: .2rem;
}

.cat_desc p span {
	font-size: 18px;
}



@media screen and (max-width: 768px) {
	.contain {
		display: flex;
		overflow-x: scroll;
		overflow-y: hidden;
		max-width: 95%;
		width: 760px;
		padding-bottom: 5px;
	}

	.contain span {
		display: inline;
		white-space: nowrap;
	}

	.contain::-webkit-scrollbar {
		width: 8px;
	}

	.contain::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.contain::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 10px;
	}

	.contain::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.contain {
		scrollbar-color: #888 #f1f1f1;
		scrollbar-width: thin;
	}
}

@media screen and (max-width: 675px) {
	.contain {
		display: flex;
		overflow-x: scroll;
		overflow-y: hidden;
		max-width: 95%;
		width: 470px;
		padding-bottom: 5px;
	}
}
</style>