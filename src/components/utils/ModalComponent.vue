s<template>
<transition name="modal-flip">
    <div v-if="props.showModal" class="modal">
          <!-- Modal content here -->
        <div class="modal-content" :style="{'width':`${props.width}%`}">
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
const emit = defineEmits(['close'])
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* display: flex; */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.modal-content {
  background-color: #fff;
  /* width: 90%; */
  margin: 6rem auto;
  padding: 25px;
  border-radius: 5px;
}
</style>  