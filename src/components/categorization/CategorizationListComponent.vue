<template>
  <p style="color:gray; text-align: justify; margin-right: 50px;">You have the option to add your own categories below</p>
  <div class="mt-3 search">
    <el-input v-model="search" size="small" placeholder="Type to search" />
  </div>
  <div class="mt-3 table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Category" prop="category" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;" >
           <template #default="scope">
                  <div class="establishment-link">
            <el-tooltip :content="`Click to enter ${scope.row.establishmentNSame}'s page`" placement="top">
              <span class="establishment_name" @click="redirectToEstablishment(route.params.tag, scope.row.establishment_tag)">
                {{scope.row.establishment_name }}</span>
        
            </el-tooltip>
          </div>
                </template>
            </el-table-column>
      <el-table-column style="width: 15%; min-width: 200px;" align="right">
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
import { useAppStore } from "@Stores/app.js";
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/tooltip/style/css'
import services from '@Services/services.js';
import { useRoute, useRouter } from "vue-router";

const appStore = useAppStore(); 
const emit = defineEmits(['edit']);
const categories = inject('categories');
const search = ref('')
const route = useRoute()
const router = useRouter()

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

const redirectToEstablishment = async(customer, establishment)=>{
    router.push(`/customer/${customer}/establishment/${establishment}`)
}


</script>
<style scoped>
.establishment_name {
  cursor: pointer;
font-weight: 500;
}

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

.search {
   display: flex;
   width: 200px;
   float: right;
}

.searchtab { 
  max-width: 150px;
}

@media screen and (max-width: 468px) { 
    .search {
      width: 88%;
      float: none;
    }
    .searchtab{
        display: none;
    }
    .el-table--fit {
            font-size: 11px !important;
    }
}
</style>