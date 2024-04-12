<template>
  <div class="security__header border__bottom">
    <!-- <div class="security__edit">
      <h4><i class="uil uil-calender"></i> Advantage List</h4>
    </div> -->
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="Name" fixed prop="name" width="200"/>
      <el-table-column label="Establishment" prop="establishment_name" width="200"/>
      <el-table-column label="Amount" prop="amount" align="center" width="100"/>
      <el-table-column label="Category" prop="category" width="150"/>
      <el-table-column label="Code" prop="code" width="100"/>
      <el-table-column label="Metric" prop="metric" width="100"/>
      <el-table-column label="Scope" prop="scope" width="100"/>
      <el-table-column label="Validity" prop="validity" align="center" width="100"/>
      <el-table-column label="Limit" prop="advantageLimit" align="center" width="100"/>
      <el-table-column label="Expired At" width="150">
         <template #default="scope">
                  {{scope.row.expired_at?moment(scope.row.expired_at).format('YYYY-MM-DD'):''}}
         </template>
      </el-table-column>
      <el-table-column label="Enable" align="center" width="100">
        <template #default="scope">
          <el-button v-if="scope.row.enable" size="small" @click="handleDisable(scope.$index, scope.row)"><i
              class="uil uil-check-square" style="color: #777; font-size: 15px;"></i></el-button>

          <el-button v-else size="small" @click="handleEnable(scope.$index, scope.row)"><i class="uil uil-square"
              style="color: #777; font-size: 15px;"></i></el-button>
        </template>
      </el-table-column>

      <el-table-column label="Operations" fixed="right" width="150">

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
import { computed, ref, inject} from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import services from '@Services/services.js';
import moment from 'moment';
import { useWindowSize } from '@vueuse/core';

const emit = defineEmits(['edit', 'setEnable', 'setDisable']);
const advantages = inject('advantages');
const search = ref('');
const { width } = useWindowSize();
const tableWidth= computed(()=>{
    return width.value>800?`width: ${100}%`:`width: ${100}%`;
});

const filterTableData = computed(() =>{
  let filteredData = advantages.value;
  console.log(search.value)
  console.log(filteredData)
  filteredData = filteredData.filter((data)=>{
        return !search.value || 
        data.name.toLowerCase().includes(search.value.toLowerCase()) || 
        (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.metric && data.metric.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.scope && data.scope.toLowerCase().includes(search.value.toLowerCase()))

    })
  console.log(filteredData)
  return filteredData
});

const reloadData = (advantageToRemove) => {
  // Filtrer la liste d'avantages pour exclure celui qui doit être supprimé
  advantages.value = advantages.value.filter((item) => item.id !== advantageToRemove.id);
};

const handleEdit = (index, advantages) => {
  console.log(advantages)
  emit('edit', advantages);
};

const handleEnable = (index, advantages) => {
  emit('setEnable', advantages.id);
};

const handleDisable = (index, advantages) => {
  emit('setDisable', advantages.id);
};

const handleDelete = async (index, advantages) => {
  console.log('Handle Delete Called');
  try {
    await services.deleteRecord('advantages', advantages.id, (response) => {
      console.log(response);
      if (response.status === 204) {
        reloadData(advantages);
        ElMessage({
          message: `Advantage removed successfully.`,
          type: 'success',
        });
      }
    });
  } catch (error) {
    console.error('Error deleting advantage:', error);
    ElMessage({
      message: `Error deleting advantage.`,
      type: 'error',
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

@media screen and (max-width: 800px) {
  .table__container{
    width: 87%;
  }
}
</style>
  