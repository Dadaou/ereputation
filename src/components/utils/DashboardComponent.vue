<template>
    <div class="item">
        <div class="item__left">
            <div class="item__title">{{ item.title }}
                <i v-if="item.description" class="uil uil-question-circle"
                    style="color: var(--color-warning); font-size: 18px; cursor: pointer"
                    @mouseover="(e) => (buttonRef = e.currentTarget)" @click="visible = !visible">
                </i>
            </div>
            <span class="item__value" v-if="!isLoading">{{ item.value }}</span>
            <span v-else>
                <SpinnerComponent v-if="isLoading" :color="'red'" />
            </span>
        </div>
        <span class="item__icon">
            <i class="uil" :class="item.icon"></i>
        </span>
        <el-tooltip ref="tooltipRef" :visible="visible" :virtual-ref="buttonRef" virtual-triggering
            popper-class="singleton-tooltip" placement="top">
            <template #content>
                <span> {{ item.description }} </span>
            </template>
        </el-tooltip>
    </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { ElTooltip } from 'element-plus';
const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const buttonRef = ref()
const tooltipRef = ref()
const visible = ref(false)

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
.item {
    display: flex;
    gap: 3rem;
    justify-content: space-between;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    flex-basis: 210px;
    padding: 25px;
    border-radius: 10px;
}

/* .item__left{
    width: 100px;
} */

.item__title {
    color: var(--color-bg2);
    font-size: 15px;
    font-weight: bold;
}

.item__value {
    color: var(--color-danger);
    font-size: 25px;
    font-weight: bolder;
    transition: var(--transition);
}

.item__icon {
    color: var(--light-color-bg2);
    font-size: 25px;
    transition: var(--transition);
}

@media screen and (max-width:1287px) {
    .item__value {
        font-size: 20px !important;
    }

    .item__icon {
        font-size: 22px;
    }
}

@media screen and (max-width:1225px) {

    .item__value {
        font-size: 18px !important;
    }

    .item__icon {
        font-size: 20px !important;
    }
}

@media screen and (max-width:1075px) {

    .item {
        padding: 15px !important;
    }

    .item__icon {
        font-size: 18px !important;
    }

    .item__title {
        font-size: 13px !important;
    }
}

@media screen and (max-width: 550px) {
    .item {
        flex-basis: 100px !important;
    }

    .item__value {
        font-size: 15px !important;
    }

    .item__icon {
        font-size: 18px !important;
    }
}
</style>