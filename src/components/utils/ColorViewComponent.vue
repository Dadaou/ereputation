<template>
	<div class="color-viewer" :style="{ 'background-color': value }">
	</div>
</template>
<script setup>

const props = defineProps({
	value: {
		type: String,
		required: false,
		default: null
	},
});

</script>
<style>
.color-viewer {
	border: 1px solid #E5E7EB;
	border-radius: 4px;
	height: 36px;
	width: 100%;
	cursor: pointer;
}
</style>