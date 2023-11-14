s<template>
<transition name="modal-flip">
    <div v-if="showModal" class="modal">
        <div class="modal-content" :style="{'width':`${width}%`}">
            <slot name="content"></slot>
        </div>
    </div>
</transition>
</template>
<script setup>
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    }, 
    width: {
      type: Number,
      default: 90
    }
});
const emit = defineEmits(['close']);
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.modal-content {
background-color: #fff;
margin: 6rem auto;
padding: 25px;
border-radius: 5px;
/*overflow: auto; */
max-width: 90%; 
min-width: 300px; 
}
</style>  