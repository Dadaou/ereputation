<template>
  <div class="search">
    <el-input v-model="search" size="small" placeholder="Type to search" />
  </div>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Category" prop="category" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" />
      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab"/>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm>
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
const categories = inject('categories');
const search = ref('')

const filterTableData = computed(() => {
  let filterdata = categories.value;
  filterdata = categories.value.filter(
    (data) =>
      !search.value ||
      data.category.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

const handleEdit = (index, category) => {
  emit('edit', category);
};

const reloadData = (category) => {
  let data = [];
  categories.value.forEach(item => {
    if (item.id !== category.id) data.push(item);
  })
  categories.value = data;
}

const handleDelete = async (index, category) => {
  const response = await new Promise((resolve) => {
    services.deleteRecord('categories', category['id'], (response) => {
      resolve(response);
    });
  });

  if (response.status == 204) {
    reloadData(category);
    ElMessage({
      message: `category removed successfully.`,
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

.search{
    display: none;
}

.searchtab { 
  max-width: 150px;
}

@media screen and (max-width: 468px) { 
    .search {
        display: flex;
        max-width: 220px;
        float: right;
    }
    .searchtab{
        display: none;
    }
    .el-table--fit {
            font-size: 11px !important;
    }
}
</style>