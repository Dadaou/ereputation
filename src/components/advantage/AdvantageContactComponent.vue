<template>
  <div class="container">
      <button class="btn" @click="showExport = true">
        <i class="uil uil-file-download"></i>
        Export
      </button>
    <div>
      <el-input v-model="search" size="small" placeholder="Type to search" class="input_search"/>
    </div>
  </div>
  <div class="overflow-x-auto">
    <el-table :data="filterTableData" class="responsive-table" style="width: 100%">
      <el-table-column label="Name" width="200">
      	<template #default="scope">
      		{{ scope.row.firstname }} {{ scope.row.lastname }}
        </template>
      </el-table-column>
      <el-table-column label="Gender" prop="gender" width="88"/>
      <el-table-column label="Email" prop="email" width="280"/>
      <el-table-column label="Establishment" prop="establishment_name" width="180"/>
      <el-table-column label="Created_at" width="103">
        <template #default="scope">
          {{ formatCreatedAt(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Update_at" width="103">
        <template #default="scope">
            {{ scope.row.updates_at ? formatUpdatesAt(scope.row.updates_at) : ''}}
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

// Format date to YYYY/MM/DD
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY-MM-DD');
};

const formatUpdatesAt = (updatesAt) => {
  return moment(updatesAt).format('YYYY-MM-DD');
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
};

const filterTableData = computed(() => {
  let filteredData = contacts.value;
  filteredData = filteredData.filter((data) => {
    return !search.value || 
      (data.lastname && data.lastname.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.email && data.email.toLowerCase().includes(search.value.toLowerCase()));
  });

  // Trier les données par date de création (de la plus récente à la plus ancienne)
  filteredData.sort((a, b) => {
    return moment(b.created_at).valueOf() - moment(a.created_at).valueOf();
  });

  return filteredData;
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

.overflow-x-auto {
  overflow-x: 100%;
}

@media screen and (min-width: 1024px) {
  .container {
    max-width: 1024px;
    margin: 0 auto; 
  }
}

.container {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
  }
  
@media screen and (max-width: 768px) {
  .container {
    display: flex;
    justify-content: space-between;
  }
  .input_search {
    display: inline;
    margin-right: 7rem;
  }
}
@media screen and (max-width: 468px) {
  .input_search {
    display: inline;
    margin-right: 3.2rem;
    
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
}
</style>