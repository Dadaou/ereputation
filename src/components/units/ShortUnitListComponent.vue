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
          <el-tooltip :content="`Click to enter ${scope.row.name}'s feedback formulary`" placement="top">
            <a :href="scope.row.link" target="_blank" class="el-button el-button--small"><i
                class="uil uil-external-link-alt"></i></a>
          </el-tooltip>
          <el-button size="small" @click="showQRCode(scope.row)"><i class="uil uil-qrcode-scan"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <QrCodeModalComponent v-if="unit"
    :qrcodeValue="`${baseurl}/public/${tag}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`"
    :showModal="showModal" :filename="`${unit.category}-${unit.name}-feedback-link`" @close="showModal = false"
    :customer="tag" :establishment="unit.establishment_competitor_tag" />
</template>
<script setup>
import { computed, ref, inject, defineAsyncComponent } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElInput, ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';

const QrCodeModalComponent = defineAsyncComponent(() =>
  import('@Components/utils/QrCodeModalComponent.vue')
)

const units = inject('units')
const search = ref('');
const showModal = ref(false);
const tag = inject('tag');

const baseurl = window.location.origin;
const unit = ref(null);

const showQRCode = (value) => {
  unit.value = value;
  showModal.value = true;
}

const filterTableData = computed(() => {
  let filterdata = units.value;

  filterdata = filterdata.map((value) => {
    value.link = `${baseurl}/public/${tag.value}/establishment/${value.establishment_competitor_tag}/units/${value.tag}/feedback`
    return value
  })

  filterdata = units.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.category.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
});

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
.security__header {
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