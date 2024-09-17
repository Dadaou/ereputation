<template>
    <div v-if="text" class="d-flex align-center justify-start" style="height: 100%">
        <i class="uil uil-check mr-2 icon"></i>{{ text }}
    </div>
</template>
<script setup>
const props = defineProps({
    text: {
        type: String,
        required: false,
        default: () => ""
    }
})
</script>
<style scoped>
.icon {
    color: #2da8e0;
}
</style>