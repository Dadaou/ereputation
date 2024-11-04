<template>
    <div class="expansion-panel">
        <div class="expansion-panel-header" @click="togglePanel">
            <h3>{{ title }}</h3>
            <span v-if="isOpen">▲</span>
            <span v-else>▼</span>
        </div>
        <div v-if="isOpen" class="expansion-panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "ExpansionPanel",
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isOpen: false
        };
    },
    methods: {
        togglePanel() {
            this.isOpen = !this.isOpen;
        }
    }
};
</script>

<style scoped>
.expansion-panel {
    /* border: 1px solid #ccc; */
    /* border-radius: 5px; */
    margin-bottom: 10px;
}

.expansion-panel-header {
    /* padding: 10px; */
    cursor: pointer;
    background-color: transparent;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    color: var(--color-danger);
    font-size: 14px;
    font-weight: 600;
}

.expansion-panel-content {
    padding-block: 8px;
    padding-inline: 4px;
    border-radius: 4px;
    /* border-top: 1px solid #ccc; */
    /* border-bottom: var(--color-bgp) 1px solid; */
    font-size: 14px;
    font-weight: 500;
    color: var(--color-bg1);
    background: color-mix(in srgb, var(--color-bgp) 8%, white);
    margin-top: 8px;
}
</style>