<template>
	<ModalComponent :showModal="showModal" @close="close" :width="modalWidth">
    <template #content>
      <div class="modal__header">
        <div class="modal__title">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            <i class="uil uil-qrcode-scan"></i> QR Code
          </h3>
        </div>
        <div class="modal__close">
          <i class="uil uil-times-circle" @click="close"></i>
        </div>
      </div>

      <div v-if="downloaded == false" class="establishment__review__qrcode">
        <p class="mb-5">
          Download this QR code to link your client to the feedback page
        </p>
        <div id="qrcode__container mt-5" ref="qrcode">
          <qrcode-vue id="qrcode"
            :value="qrcodeValue"
            :size="250" level="L" render-as="svg" />
        </div>

      </div>
      <div v-else class="establishment__review__qrcode">
        <p class="mb-5">
          Your download is successfully complete!
        </p>
      </div>
      <div class="mt-5 download__qr_btn">
        <button v-if="downloaded == false" class="btn__light_secondary" @click="downloadQrcode('jpeg')">
          <i class="uil uil-download-alt"></i> JPEG
        </button>
        <button v-if="downloaded == false" class="btn__light_secondary" @click="downloadQrcode('svg')">
          <i class="uil uil-download-alt"></i> SVG
        </button>
        <button v-if="downloaded == false" class="btn__light_secondary" @click="print">
          <i class="uil uil-download-alt"></i> Print A5
        </button>
        <button v-else class="btn__light_secondary" @click="close">
          close
        </button>
      </div>

    </template>
  </ModalComponent>
</template>
<script setup>
import { computed, ref, inject } from 'vue';
import ModalComponent from '@Components/utils/ModalComponent.vue';
import QrcodeVue from 'qrcode.vue';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
	qrcodeValue: {
		type: String,
		default: "erep app"
	},
	filename: {
		type: String,
		default: "qrcode"
	},
	showModal: {
		type: Boolean,
		default: false
	}
});

const emits = defineEmits(['close'])
const close = ()=>{
	emits('close')
	downloaded.value = false
}

const { width } = useWindowSize()
const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 19;
  return gap + 45;
});

const show = computed(()=> props.showModal)

const base64Image = ref(null);
const qrcode = ref(null);
const downloaded = ref(false);

const downloadQrcode = (type) => {
	if(type == 'svg'){
		services.downloadSVGQrcode(props.filename, 'qrcode');
	}else{
		services.downloadJPEGQrcode(props.filename, 'qrcode', 500, 500);
	}
  downloaded.value = true;
};

const print = ()=>{
	console.log('print');
	downloaded.value = true;
};
	
</script>
<style scoped>

#qrcode{
	margin: auto;
}

.modal__header {
  display: flex;
  justify-content: space-between;
}

.modal__header div {
  align-self: center;
}

.modal__close i {
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.modal__close i:hover {
    transform: rotate(360deg);
}

.establishment__review__qrcode p {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-bg2);
}
	
</style>
