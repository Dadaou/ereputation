<template>
	<div class="color-picker">
		<el-color-picker v-model="color_value" show-alpha :predefine="colors" />
	</div>
</template>
<script setup>
import { ElColorPicker } from 'element-plus';
import 'element-plus/es/components/color-picker/style/css';
import { ref, computed, watch } from 'vue'


const emits = defineEmits(['sync'])
const props = defineProps({
	value: {
		type: String,
		required: false,
		default: null
	},
	predefineColors: {
		type: Array,
		required: false,
		default: [
			'#ff4500',
			'#ff8c00',
			'#ffd700'
		]
	}
});

const colors = computed(() => {
	return props.predefineColors;
});

const color = computed(() => {
	return props.value
})
const color_value = ref(null)

watch(color, () => {
	color_value.value = color.value
	emits('sync', color.value)
})

function rgbaStringToHex(rgbaString) {

	if (!rgbaString.startsWith('rgba')) {
		return rgbaString
	}

	const rgbaRegex = /rgba?\((\d+), (\d+), (\d+),? (\d*(?:\.\d+)?)?\)/;
	const match = rgbaString.match(rgbaRegex);

	if (!match) {
		throw new Error('Invalid RGBA string format');
	}

	const [, r, g, b, a] = match.map(parseFloat);

	const toHex = (value) => {
		const hex = Math.round(value).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const hexR = toHex(r);
	const hexG = toHex(g);
	const hexB = toHex(b);
	const hexA = a !== undefined ? Math.round(a * 255).toString(16) : 'FF';
	return `#${hexR}${hexG}${hexB}${hexA}`;
}

watch(color_value, () => {
	emits('sync', rgbaStringToHex(color_value.value));
});
</script>
<style>
.color-picker .el-color-picker,
.color-picker .el-color-picker__trigger {
	width: 100% !important;
}
</style>