<template>
  <div class="mt-5 table__container">
     <div class="table-description" style="margin-bottom: 16px;">
      <p></p>
      <div>
        <el-input v-model="search" size="small" placeholder="Type to search" class="input_searchs"/>
      </div>
    </div>
    <el-table :data="filterTableData" class="responsive-table">
      <el-table-column label="Name" prop="name" align="center" style="width: 5%; min-width: 200px;" />
      <el-table-column label="Establishment" prop="establishment_name" align="center" style="width: 5%; min-width: 400px;" />
      <el-table-column label="Screen Template" prop="screentemplate_name" align="center" style="width: 10%; min-width: 4%;" />
      <el-table-column label="Advantages" prop="advantage_names" align="center" style="width: 20%; min-width: 100px;" />


      <el-table-column label="Actions" style="width: 20%; min-width: 200px;text-align: center;" align="right">
  

       
          <template #default="scope">
          
            <el-tooltip placement="top">
              <template #content> See this screen </template>
              <el-button style="margin-left: 2px;" size="small" @click="handleSee(scope.$index, scope.row)"><i
                  class="uil uil-presentation"></i></el-button>
            </el-tooltip>
            <el-tooltip placement="top">
              <template #content> Add Advantages of this screen </template>
              <el-button style="margin-left: 2px;" size="small" @click="showModal = true,screen_id = scope.row"><i class="uil uil-plus-circle"></i></el-button>
            </el-tooltip>
          
            <el-button style="margin-left: 2px;" size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button>
            <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
              <template #reference>
                <el-button style="margin-left: 2px;" size="small"><i class="uil uil-trash-alt"></i></el-button>
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
      class="responsive-modal"
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
.table-description {
  display: flex;
  justify-content: space-between;
}

.table-description p {
  font-size: 14px;
  color: grey;
  font-weight: 500;
}

.responsive-table {
  width: 100%
}

.responsive-modal {
  width: 100%
}

@media screen and (max-width: 768px) {
  .responsive-table {
    width: 85%;
  }
  .input_searchs,
  .input_search {
    display: inline;
    margin-right: 7rem; 
  }
}

@media screen and (max-width: 468px) {
  .input_search {
    display: inline;
    margin-right: 3.5rem; 
  }

  .input_searchs {
    display: inline;
    margin-right: 9rem; 
  }

  .el-table--fit {
    font-size: 11px !important;
  }

  .table-description p {
    font-size: 12px;
  }
}

@media screen and (max-width: 768px) {
  .responsive-modal {
    width: 50%;
    height: 20%;
    overflow-y: scroll;
  }

}
</style>