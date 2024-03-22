<template>
	<div class="society__location">
      <i class="uil" :class="item.icon"></i>
       <span>
       	{{ item.value }}
       </span>
       <i v-if="item.description" class="uil uil-question-circle"
        style="color: var(--color-warning); font-size: 14px; cursor: pointer"
        @mouseover="(e) => {buttonRef = e.currentTarget, visible = true}" @mouseleave="visible = false">
        </i>
       <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
            popper-class="singleton-tooltip" placement="top">
            <template #content>
                <span> {{ item.description }} </span>
            </template>
        </el-tooltip>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElTooltip } from 'element-plus';

const buttonRef = ref()
const tooltipRef = ref()
const visible = ref(false)

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
});
</script>
<style scoped>
.society__location{
	display: flex;
	align-content: center;
	align-items: center;
	gap: 2px;
}

.society__location *{
	/*color: white*/
}
</style>