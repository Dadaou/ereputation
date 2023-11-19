<template>
    <div class="comment__pagination">
        <i class="uil uil-angle-left" @click="prev((serverOptions.current - serverOptions.rowLimit))"></i>
        <span>{{ serverOptions.current }}</span> to
        <span v-if="(serverOptions.current + serverOptions.rowLimit - 1) < serverOptions.max">{{ serverOptions.current +
            serverOptions.rowLimit - 1 }}</span>
        <span v-else>{{ serverOptions.max }}</span>
        of
        <span>{{ serverOptions.max }}</span>
        <i class="uil uil-angle-right" @click="next((serverOptions.current + serverOptions.rowLimit))"></i>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        required: false,
        default: {
            rowLimit: 20,
            max: 100,
            current: 1,
            page: 1
        }
    }
});

const serverOptions = computed(() => props.options);

const emits = defineEmits(['next', 'prev'])

const next = (current) => {
    if (current < serverOptions.value.max) emits('next', { current: current, page: serverOptions.value.page + 1, limit: serverOptions.value.rowLimit });
    window.scrollTo(0, 0); window.scrollTo(0, 600);
};

const prev = (current) => {
    if (current > 0) emits('prev', { current: current, page: serverOptions.value.page - 1, limit: serverOptions.value.rowLimit });
    window.scrollTo(0, 600);
};

</script>
<style scoped>
.comment__pagination {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3rem;
    color: var(--color-primary);
}

.comment__pagination i {
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    transition: var(--transition)
}

.disabled {
    color: var(--light-color-bg2) !important;
}
</style>