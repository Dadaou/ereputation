<template>
  <div class="security__header border__bottom">
    <!--  <div class="security__edit">
      <h4><i class="uil uil-calender"></i> Event List</h4>
    </div> -->
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Name" prop="name" style="width: 15%; min-width: 200px;" />
      <el-table-column label="Category" prop="category" style="width: 10%; min-width: 200px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Date" prop="date" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Operations" style="width: 25%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
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
import { computed, ref, inject, watch } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useEventStore } from "@Stores/event.js";
import { useCompanyStore } from "@Stores/company.js";
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

const emit = defineEmits(['edit']);
const userStore = useUserStore();
const eventStore = useEventStore();
const companiesStore = useCompanyStore();
const tableData = inject('events');
const { width, height } = useWindowSize();



const getEstablishmentsName = (data) => {
  let establishments = userStore.user.customer != null ? companiesStore.establishments : [];
  let names = '';
  data.forEach(item => {
    establishments.forEach(establishment => {
      if (item.id == establishment.id) {

        if (names != '') {
          names = `${names}, ${establishment.name}`;
        } else {
          names = `${names} ${establishment.name}`;
        }
      }
    })
  })
  return names;
}

const getURI = (data, entity, dataset) => {
  let uris = [];
  data.forEach(item => {
    dataset.forEach(item_data => {
      if (item.id == item_data.id) {
        const uri = `/api/${entity}/${item.id}`;
        const exists = uris.some(item => item === uri);
        if (exists == false) uris.push(uri);
      }
    })
  })

  return uris;
}

const search = ref('')

const filterTableData = computed(() => {
  let filteredData = tableData.value;
  filteredData = filteredData.filter((data) => {
    return !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase()))
  })
  return filteredData;
})

const reloadData = (event) => {
  let data = [];
  tableData.value.forEach(event_item => {
    if (event_item.id !== event.id) data.push(event_item);
  })
  tableData.value = data;
}
const handleEdit = (index, event) => {
  emit('edit', event);
}
const handleDelete = async (index, event) => {
  await eventStore.removeEvent(event.id, (response) => {
    if (response.status == 204) {
      reloadData(event);
      ElMessage({
        message: `Event removed successfully.`,
        type: 'success',
      });
    }
  })
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

.table__container {
  /* overflow-x: scroll; */
  width: 85%;
}

@media screen and (min-width: 800px) {

  .table__container {
    width: 100%;
  }
}
</style>