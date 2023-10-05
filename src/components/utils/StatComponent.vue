<template>
    <div class="stat__card" :style="{ background: props.bgColor || 'red' }">
        <div class="stat__icon" :class="`stat__icon_${props.iconStyle}`">
            <Icon :icon="icon" width="32" :style="{ color: props.color || 'red', margin: '4px' }"></Icon>
        </div>
        <div class="stat__value">{{ props.value }}</div>
        <p class="stat__description">{{ props.description }}</p>
        <span class="stat__trend">
            <Icon v-if="props.trend && props.trend == 'negative'" icon="uil:arrow-growth" style="display: inline;"
                :rotate="1" />
            <Icon v-if="props.trend && props.trend == 'positive'" icon="uil:arrow-growth" style="display: inline;" />
            <Icon v-if="props.trend && props.trend == 'linear'" icon="uil:arrow-right" style="display: inline;"></Icon>
            {{ props.percentage }}
        </span>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps(["color", "bgColor", "icon", "iconStyle", "value", "description", "percentage", "trend"]);
</script>

<style scoped>

.stat__card {
    width: 95%;
    max-width: 300px;
    height: 130px;
    border-radius: 4px;
    text-align: center;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    display: flex;
    padding: 8px;
}

.stat__icon {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    align-items: center;
}

.stat__icon_content {
    font-size: 25px;
}

.stat__icon_rounded {
    border-radius: 50%;
}

.stat__icon_rect {
    border-radius: 20px;
}

.stat__value {
    font-size: 160%;
    color: rgba(255, 255, 255, .95);
    font-weight: 600;
}

.stat__description {
    font-size: .6rem;
    color: rgba(255, 255, 255, .95);
    margin-top: -6px;
}

.stat__trend {
    font-size: .8rem;
    color: rgba(255, 255, 255, .95);
    font-weight: 700;
    margin-top: 4px;
}
</style>