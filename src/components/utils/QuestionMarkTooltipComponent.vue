<template>
<i class="uil uil-question-circle"
   style="color: var(--color-warning); font-size: 18px; cursor: pointer"
   @mouseover="(e) => {buttonRef = e.currentTarget, visible = true}" @mouseleave="visible = false">
</i>
<el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering popper-class="singleton-tooltip" placement="top">
 <template #content>
    <span>{{text}}</span>
 </template>
</el-tooltip>
</template>
<script setup>
import { ElTooltip } from 'element-plus';
import { ref } from 'vue';

const buttonRef = ref();
const tooltipRef = ref();
const visible = ref(false);
const props = defineProps({
	text:{
		type: String,
		default: "Tootip text example"
	}
});

</script>
<style scoped>
	
</style>