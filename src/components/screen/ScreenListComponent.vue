<template>
  <div class="security__header border__bottom">
  </div>
  <el-input v-model="search" size="small" placeholder="Type to search" class="search" />
  <div class="mt-5 erep_table table__container">
    <el-table :data="filterTableData" class="responsive-table" :row-class-name="rowClassName" style="width: 100%">
      <el-table-column label="Name" fixed prop="name" width="188" />
      <el-table-column label="Establishment" prop="establishment_name" width="190" />
      <el-table-column label="Screen Template" prop="screentemplate_name" width="190" />
      <el-table-column label="Advantages" prop="advantage_names" width="190" />

      <el-table-column label="Actions" width="230">

        <template #default="scope">
          <el-tooltip placement="top">
            <template #content> See this screen </template>
            <el-button size="small" @click="handleSee(scope.$index, scope.row)"><i
                class="uil uil-presentation"></i></el-button>
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content> Add Advantages of this screen </template>
            <el-button size="small" @click="showModal = true,screen_id = scope.row"><i class="uil uil-plus-circle"></i></el-button>
          </el-tooltip>
        
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
    <ScreenAdvantageModalComponent 
      :screen="screen_id"
      :advantages="advantages"
      :showModal="showModal" @close="showModal = false"
       />
</template>



<script setup>
import { computed, ref, inject,defineAsyncComponent,onBeforeMount } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput,ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';


const ScreenAdvantageModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/ScreenAdvantageModalComponent.vue')
)

const showModal = ref(false);

const emit = defineEmits(['edit']);

const screens = inject('screens')

const advantages = inject('advantages');
const screen_id = ref(null);


let tableData = computed(() => {
  let data = [];
  screens.value.forEach(screen_item => {
  let advantage_name = '';

    screen_item.advantages.forEach(adv => {
      if (advantage_name != '') {
        advantage_name = `${advantage_name}, ${adv.adv_name}`;
        } else {
          advantage_name = `${adv.adv_name}`;
        }
        
    });

    screen_item.advantage_names = advantage_name
    data.push(screen_item);
  })

  return data;
});

const search = ref('')
const filterTableData = computed(() => {
  let filterdata = tableData.value;
  filterdata = tableData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.screentemplate_name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

const reloadData = (screen) => {
  let data = [];
  screens.value.forEach(screen_item => {
    if (screen_item.id !== screen.id) data.push(screen_item);
  })
  screens.value = data;
}

const handleEdit = (index, screen) => {

  emit('edit', screen);
}

const handleDelete = async (index, screen) => {

    const response = await new Promise((resolve) => {
          services.deleteRecord('screens', screen.id, (response) => {
            resolve(response);
            
          });
        });

      if (response.status == 204) {
        reloadData(screen);
        ElMessage({
          message: `Screen removed successfully.`,
          type: 'success',
        });
      }

}





</script>
<style scoped>

  .uil-plus-circle{
    color: var(--color-primary);
  }
  .enabled-button {
    color: #74d474;
  
  }

  .expired-date {
  color: red;
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



.table__container {
  overflow-x: auto;
}

.responsive-table .el-table__header-wrapper,
.responsive-table .el-table__body-wrapper {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}

:deep(.el-table__row.red-background .el-table-fixed-column--left),
:deep(.el-table__row.red-background) {
  color: black;
  background-color: rgb(255, 216, 216) !important;
}

:deep(.el-table__row.orange-background .el-table-fixed-column--left),
:deep(.el-table__row.orange-background) {
  color: black;
  background-color: rgb(255, 226, 193) !important;
}

:deep(.el-table__row.red-background.hover-row),
:deep(.el-table__row.red-background.hover-row .el-table__cell) {
  background-color: rgb(252, 164, 157) !important;
}

:deep(.el-table__row.orange-background.hover-row),
:deep(.el-table__row.orange-background.hover-row .el-table__cell) {
  background-color: rgb(247, 183, 120) !important;
}

@media screen and (max-width: 800px) {
  .table__container {
    width: 96%;

  }

  .responsive-table .el-table__header-wrapper,
  .responsive-table .el-table__body-wrapper {
    width: 100%;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .el-table-column {
    min-width: 100px;
  }
}

.search {
  display: flex;
  max-width: 150px;
  float: right;
}

@media screen and (max-width: 768px) {
  .search {
    display: flex;
    max-width: 220px;
    float: right;
  }

  .el-table--fit {
    font-size: 11px !important;
  }

  .table__container {
    width: 95%;

  }
}
</style>