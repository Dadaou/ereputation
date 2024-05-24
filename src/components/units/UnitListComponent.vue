<template>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Name" prop="name" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Code" prop="code" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Category" prop="category" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Section" prop="section" style="width: 20%; min-width: 300px;" />
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
import { computed, ref, inject } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';

const emit = defineEmits(['edit']);
const units = inject('units')
const search = ref('');

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

const handleEdit = (index, unit) => {
  emit('edit', unit);
};

const reloadData = (unit) => {
  let data = [];
  units.value.forEach(item => {
    if (item.id !== unit.id) data.push(item);
  })
  units.value = data;
}

const handleDelete = async (index, unit) => {
  const response = await new Promise((resolve) => {
    services.deleteRecord('units', unit['id'], (response) => {
      resolve(response);
    });
  });

  if (response.status == 204) {
    reloadData(unit);
    ElMessage({
      message: `Unit removed successfully.`,
      type: 'success',
    });
  }
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

.table__container {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .table__container {
    width: 85%;
  }
}
</style>