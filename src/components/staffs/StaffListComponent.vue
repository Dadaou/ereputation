<template>
  <div class="security__header border__bottom">
  </div>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Period" prop="period" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Name" style="width: 20%; min-width: 300px;">
        <template #default="scope">
          {{ `${scope.row.firstname} ${scope.row.lastname}` }}
        </template>
      </el-table-column>
      <el-table-column label="Gender" prop="gender" style="width: 10%; min-width: 300px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Department" prop="department" style="width: 20%; min-width: 300px;" />
       <el-table-column label="Section" prop="section" style="200" />

      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm>

          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, ref, defineAsyncComponent, inject } from 'vue';
import moment from 'moment';
import { useStaffStore } from "@Stores/staff.js";
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

const emit = defineEmits(['edit']);
const staffStore = useStaffStore();
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

const reloadData = (staff) => {
  let data = [];
  staffs.value.forEach(staff_item => {
    if (staff_item.id !== staff.id) data.push(staff_item);
  })
  staffs.value = data;
}

const handleEdit = (index, staff) => {
  emit('edit', staff);
}

const handleDelete = async (index, staff) => {
  await staffStore.removeStaff(staff.id, (response) => {
    if (response.status == 204) {
      reloadData(staff);
      ElMessage({
        message: `Staff removed successfully.`,
        type: 'success',
      });
    }
  })
}

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
  color: red !important;
}

button i.uil-edit {
  color: var(--color-danger) !important;
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