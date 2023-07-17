<template>
<div class="establishments__comparison">
    <ul class="filter__menu">
      <li @click="viewFullscreen()"> <i class="uil uil-expand-arrows-alt"></i> View fullscreen</li>
    </ul>
    <GroupedBarChart :plot-data="props.data" x-key="name"
    :width="width" :height="height" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="props.labels.x" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
    </GroupedBarChart>
    <ModalComponent :showModal="showModal" @close="showModal = false">
        <template #content>
            <h4>Comparison</h4>
            <button @click="showModal = false">Close</button>
            <GroupedBarChart :plot-data="props.data" x-key="name"
                    :width="1250" :height="400" :margin="margin" :colors="['#6c63ff', '#f75842', '#aca8fd', '#424890']" :x-axis-label="props.labels.x" :y-axis-label="props.labels.y" :y-tick-format="d => `${d}`">
            </GroupedBarChart>
        </template>
    </ModalComponent>
</div>
</template>
<script setup>
import {ref} from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';

const props = defineProps({
    data:{
        type: Array,
        default: [],
        required: true
    },
    width: {
        type: Number,
        default: 300
    },
    height: {
        type: Number,
        default: 300
    },
    margin: {
        type: Object,
        default: { top: 20, bottom: 35, left: 55, right: 20 }
    },
    colors: {
        type: Array,
        default: ['#6c63ff', '#f75842', '#aca8fd', '#424890'] 
    },
    labels: {
        type: Object,
        default: {x: "Months", y: "Reviews"}
    }
});

const showModal = ref(false);

const viewFullscreen = () => {
    showModal.value = !showModal.value;
}

</script>

<style scoped>
.filter__menu{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: small;
    margin: auto;
}

.filter__menu li{
    padding: 4px 8px;
    cursor: pointer;
    transition: var(--transition);
    background-color: var(--light-color-bg2);
    border-radius: 5px;
    color: white;
    font-size: 13px;
}

.filter__menu li:hover{
    background-color: var(--color-primary);
}
</style>