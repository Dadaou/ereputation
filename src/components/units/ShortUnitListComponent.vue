<template>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Name" prop="name" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Code" prop="code" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Category" prop="category" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" />
      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button> -->
          <el-button size="small" @click="showQRCode(scope.row)"><i class="uil uil-qrcode-scan"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ModalComponent :showModal="showModal" @close="showModal = false" :width="modalWidth">
    <template #content>
      <div class="modal__header">
        <div class="modal__title">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            <i class="uil uil-qrcode-scan"></i> QR Code
          </h3>
        </div>
        <div class="modal__close">
          <i class="uil uil-times-circle" @click="showModal = false"></i>
        </div>
      </div>

      <div v-if="downloaded == false" class="establishment__review__qrcode">
        <p class="mb-5">
          Download this QR code to link your client to the feedback page
        </p>
        <div id="qrcode__container mt-5" ref="qrcode">
          <!-- <vue-qrious class="qr__code"
            :value="`${baseurl}/public/${tag}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`"
            size="5000" @change="onDataUrlChange" />-->
          <qrcode-vue style="margin: 48px auto" id="qrcode"
            :value="`${baseurl}/public/${tag}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`"
            :size="250" level="L" render-as="svg" />
        </div>

      </div>
      <div v-else class="establishment__review__qrcode">
        <p class="mb-5">
          Your download is successfully complete!
        </p>
      </div>
      <div class="mt-5 download__qr_btn">
        <button v-if="downloaded == false" class="btn__light_secondary" @click="downloadQrcode">
          <i class="uil uil-download-alt"></i> Download
        </button>
        <button v-else class="btn__light_secondary" @click="showModal = false, downloaded = false">
          close
        </button>
      </div>

    </template>
  </ModalComponent>
</template>
<script setup>
import { computed, ref, inject } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';
import QrcodeVue from 'qrcode.vue'
import ModalComponent from '@Components/utils/ModalComponent.vue';
import { useWindowSize } from '@vueuse/core';

// const emit = defineEmits(['edit']);
const units = inject('units')
const search = ref('');
const showModal = ref(false);
const tag = inject('tag');

const baseurl = window.location.origin;

const { width } = useWindowSize()
const modalWidth = computed(() => {
  let windowSize = 1500;
  let gap = (windowSize - width.value) / 19;
  return gap + 45;
});

// const base64Image = ref(null);
const qrcode = ref(null);
const downloaded = ref(false);
const unit = ref(null);

const showQRCode = (value) => {
  unit.value = value;
  showModal.value = true;
}

// const onDataUrlChange = (dataUrl) => {
//   console.log(dataUrl);
//   base64Image.value = dataUrl;
// };

const downloadQrcode = () => {
  const filename = `${unit.value.category}-${unit.value.name}-feedback-link`;
  services.downloadSVGQrcode(filename, 'qrcode');
  downloaded.value = true;
}

const filterTableData = computed(() => {
  let filterdata = units.value;
  filterdata = units.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.category.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

</script>
<style scoped>
button {
  border: none;
  cursor: pointer;
  font-size: 15px;
}

button i.uil-trash-alt {
  color: var(--color-danger) !important;
}

button i.uil-edit {
  color: var(--color-primary) !important;
}

.security__header {
  display: flex;
  justify-content: space-between;
}

.security__header h4 {
  color: var(--color-bg2);
  font-size: 19px;
  font-weight: bold;
}

.security__header p {
  font-size: 15px;
  margin: 8px 0;
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

.establishment__review__qrcode p {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-bg2);
}

.download__qr_btn {
  display: flex;
  justify-content: center;
}

.download__qr_btn button {
  flex-basis: 50%;
}

.qr__code {
  width: 35% !important;
  padding: 50px auto !important;
  margin: auto;
}

.modal__close i:hover {
  transform: rotate(360deg);
}

/* Appliquez une largeur de 100% aux éléments parents */
c .security__header {
  width: 100%;
}

.table__container {
  /* overflow-x: scroll; */
  width: 85%;
}

/* Définissez une largeur maximale pour l'en-tête sur les grands écrans */
@media screen and (min-width: 800px) {
  .security__header {
    max-width: 1000px;
    /* Largeur maximale pour les grands écrans */
  }

  .table__container {
    width: 100%;
  }
}
</style>