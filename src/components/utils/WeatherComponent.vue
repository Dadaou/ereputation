<template>
<ModalComponent :showModal="showModal" @close="closeModal" :width="50">
    <template #content>
        <div class="modal__header">
            <div class="modal__title">
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                            <i class="uil uil-edit"></i> Weather
                        </h3>
            </div>
            <div class="modal__close">
                <i class="uil uil-times-circle"  @click="showModal = false"></i>
            </div>
        </div>
            <div class="mb-6 feedback__rating">
                       
           </div>
    </template>
</ModalComponent>
</template>
<script setup>
import { ref, inject } from 'vue';
import moment from 'moment';
import ModalComponent from '@Components/utils/ModalComponent.vue';


let showModal = inject('showModal');
const emits = defineEmits(['updateModal'])

const closeModal = ()=>{
    emits.push('updateModal', false);
}

</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.modal__header{
    display: flex;
    justify-content: space-between;
}

.modal__header div{
    align-self: center;
}

.modal__close i{
   float: right;
   font-size: 25px;
   color: red;
   cursor: pointer;
   transition: var(--transition);
}

.modal__close i:hover{
    transform: rotate(360deg);
}
</style>