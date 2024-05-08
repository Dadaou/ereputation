<template>
    <div class="gate__menu">
        <div :class="[item.active ? 'clicked' : '']" @click="select()">
            <Icon :icon="item.icon" class="mr-1" width="28px" />
            <span>{{ item.label }}</span>
        </div>
    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['select']);

const select = () => {
    emit('select', props.item.id)
}

</script>
<style scoped>
.gate__menu {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: auto;
}

.gate__menu div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    border-radius: 5px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    cursor: pointer;
    padding: 8px;
}

.gate__menu span {
    font-size: .9rem;
    color: var(--color-primary);
}

.gate__menu .clicked {
    border-bottom: 1px solid var(--color-primary);
}

.clicked span {
    color: var(--color-danger) !important;
}

@media screen and (max-width:1400px) {
    .gate__menu {
        width: 100% !important;
    }
}

@media screen and (max-width:670px) {
    .gate__menu {
        width: 100% !important;
        gap: 5px;
    }
}

@media screen and (max-width:600px) {
    .gate__menu div {
        width: 100% !important;
    }

    .gate__menu span {
        font-size: 10px !important;
        font-weight: 500;
    }
}
</style>