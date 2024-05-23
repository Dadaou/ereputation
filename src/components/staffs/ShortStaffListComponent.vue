<template>
  <div class="security__header border__bottom">
    <!-- <div class="security__edit">
      <h4><i class="uil uil-users-alt"></i> Staff List</h4>
    </div> -->
  </div>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Name" style="width: 20%; min-width: 300px;">
        <template #default="scope">
          {{ `${scope.row.firstname} ${scope.row.lastname}` }}
        </template>
      </el-table-column>
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Department" prop="department" style="width: 20%; min-width: 300px;" />

      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-tooltip :content="`Click to enter ${scope.row.firstname} ${scope.row.lastname}'s feedback formulary`"
            placement="top">
            <a :href="scope.row.link" target="_blank" class="el-button el-button--small"><i
                class="uil uil-external-link-alt"></i></a>
          </el-tooltip>
          <el-button size="small" @click="showQRCode(scope.row)"><i class="uil uil-qrcode-scan"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <QrCodeModalComponent v-if="staff"
    :qrcodeValue="`${baseurl}/public/${tag}/establishment/${staff.establishment_tag}/staffs/${staff.tag}/feedback`"
    :showModal="showModal" :filename="`${staff.firstname} ${staff.lastname}-feedback-link`" @close="showModal = false"
    :customer="tag" :establishment="staff.establishment_tag" />
</template>

<script setup>
import { computed, ref, inject, defineAsyncComponent } from 'vue';
import moment from 'moment';
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

const baseurl = window.location.origin;
const showModal = ref(false);
const staff = ref(null);
const staffs = inject('staffs')
const tag = inject('tag');

let tableData = computed(() => {
  let data = [];
  staffs.value.forEach(staff_item => {
    staff_item['period'] = staff_item.dateto != null ? `${moment(staff_item.datefrom).format('YYYY MMM DD')} to ${moment(staff_item.dateto).format('YYYY MMM DD')}` : `${moment(staff_item.datefrom).format('YYYY MMM DD')} to -`;
    data.push(staff_item);
  })
  return data;
});
const search = ref('')

const filterTableData = computed(() => {
  let filterdata = tableData.value;

  filterdata = filterdata.map((value) => {
    value.link = `${baseurl}/public/${tag.value}/establishment/${value.establishment_tag}/staffs/${value.tag}/feedback`
    return value
  })

  filterdata = tableData.value.filter(
    (data) =>
      !search.value ||
      data.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
      data.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
      data.department.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

const showQRCode = (value) => {
  staff.value = value;
  showModal.value = true;
};

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