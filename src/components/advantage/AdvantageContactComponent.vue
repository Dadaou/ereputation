<template>
  <button class="btn" @click="showExport = true">
    <i class="uil uil-file-download"></i>
    Export
  </button>
  <div class="overflow-x-auto">
    <el-table :data="filterTableData" class="responsive-table" style="width: 100%">
      <el-table-column label="Name" width="220">
      	<template #default="scope">
      		{{ scope.row.firstname }} {{ scope.row.lastname }}
        </template>
      </el-table-column>
      <el-table-column label="Gender" prop="gender" width="88"/>
      <el-table-column label="Email" prop="email" width="275"/>
      <el-table-column label="Establishment" prop="establishment_name" width="190"/>
      <el-table-column label="Created_at" width="110">
        <template #default="scope">
          {{ formatCreatedAt(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="128">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
    @close="showExport = false, downloaded = false" @submit="(data) => exportData(data.type, 'contacts')" />
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import csvXlsx from '@Services/csvXlsx.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
import { useWindowSize } from '@vueuse/core';
import { ref, reactive, watch, onBeforeMount, computed, provide, onUpdated, defineAsyncComponent } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)

const route = useRoute();
const customer = route.params.tag;
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY/MM/DD');
};
const query = ref('');
const search = ref('');

const contacts = ref([]);

const showExport = ref(false);
const downloaded = ref(false);
const exportData = (type, filename) => {
  csvXlsx.exportContact(type, filename, query.value,
    ['Id', 'Name', 'Gender', 'Email', 'Establishment', 'Date']);
  downloaded.value = true;
}

const filterTableData = computed(() =>{
  let filteredData = contacts.value;
  filteredData = filteredData.filter((data)=>{
        return !search.value || 
        (data.lastname && data.lastname.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.email && data.email.toLowerCase().includes(search.value.toLowerCase()))
    })
  return filteredData
});

onBeforeMount(async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      query.value = `customer/establishments/contacts?tag=${customer}`;

      services.get_Record(`customer/establishments/contacts?tag=${customer}`, (response) => {
        resolve(response);
      });
    });

    if (response.status === 200) {
      contacts.value = response.data;
    } else {
      console.error('Error fetching contacts:', response);
    }
  } catch (error) {
    console.error('Error in onBeforeMount:', error);
  }
});
</script>
<style scoped>
button i {
  color: var(--color-danger);
}

button {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 10px;
  border-radius: 5px;
  border: 1px solid grey;
  margin-bottom: 10px;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-primary);
  color: white;
}
</style>