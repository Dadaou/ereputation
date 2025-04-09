<template>
  <div class="container">
      <button @click="showExport = true" :style="{width: exportBtnWidth}">
        <i class="uil uil-file-download"></i>
        Export
      </button>
    <div :style="{display: 'flex', width: InputSearchWidth}">
      <el-input v-model="search" size="small" placeholder="Type to search" />
    </div>
  </div>
  <div class="overflow-x-auto table-container" >
    <el-table :data="filteredData"  style="width: 100%;">

      <el-table-column label="Name" fixed :min-width="130">
      	<template #default="scope">
      		{{ scope.row.firstname }} {{ scope.row.lastname }}
        </template>
      </el-table-column>

      <el-table-column label="Email" prop="email" class="contain_tab"/>
      <el-table-column label="Establishment" prop="establishment_name" class="contain_tab"/>
      <el-table-column label="Optout" class="contain_tab" align="center">
        <template #default="scope">
            <i v-if="scope.row.optout" class="uil uil-ban mr-1" style="color:var(--color-danger2); font-size: 20px; text-align: center;"></i>
            <span v-else>_</span> 
        </template>
      </el-table-column>
      <el-table-column label="Created at">
        <template #default="scope">
          {{ formatCreatedAt(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Updated at" width="120">
        <template #default="scope">
            {{ formatUpdatedAt(scope.row.updated_at)}}
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
import { ref, reactive, watch, onBeforeMount, computed, provide, onUpdated, defineAsyncComponent,watchEffect } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)

const contactLoading = ref(false);
const route = useRoute();
const customer = route.params.tag;
const { width } = useWindowSize();

// Format date to YYYY/MM/DD
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY-MM-DD');
};

const formatUpdatedAt = (updatedAt) => {
  return updatedAt ? moment(updatedAt).format('YYYY-MM-DD'): '';
};
const query = ref('');
const search = ref('');

const contacts = ref([]);

const showExport = ref(false);
const downloaded = ref(false);


const InputSearchWidth = computed(() => {

  if(width.value < 768) {
    return route.name === 'LeadgenContact' ? `${100}%` : `${88}%`
  }
  return `${200}px`;
});

const exportBtnWidth = computed(() => {
  if(width.value < 768) {
    return route.name === 'LeadgenContact' ? `${100}%` : `${88}%`
  }
  return `${100}px`;
})

const exportData = (type, filename) => {
  csvXlsx.exportContact(type, filename, query.value,
    ['Id', 'Name', 'Gender', 'Email', 'Establishment', 'Date']);
  downloaded.value = true;
};

const filteredData = computed (() => {
  let filteredData = contacts.value;
  filteredData = filteredData.filter((data) => {
    return !search.value || 
      (data.lastname && data.lastname.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.email && data.email.toLowerCase().includes(search.value.toLowerCase())) || 
      (data.created_at && data.created_at.toLowerCase().includes(search.value.toLowerCase())) || 
      (data.updated_at && data.updated_at.toLowerCase().includes(search.value.toLowerCase()))
      ;
  });

  // Trier les données par date de création (de la plus récente à la plus ancienne)
  return filteredData.sort((a, b) => {
     moment(b.created_at).valueOf() - moment(a.created_at).valueOf();
  });

  if (contacts.value.length > 0 ) {
     // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      contactLoading.value = false;
  }
  else {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    contactLoading.value = true;
  }
  filterTableData = filteredData;
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
    flex-direction: column;
  }
  .input_search {
    display: inline;
    margin-right: 7rem;
  }
  .el-table--fit {
    font-size: 11px !important;
  }

  .table-description p {
    font-size: 12px;
  }
}
@media screen and (max-width: 468px) {
  .input_search {
    display: inline;
    margin-right: 3.2rem;
    
  }
  .el-table--fit {
    font-size: 11px !important;
  }

  .table-description p {
    font-size: 12px;
  }

  .table-container {
    margin-top: 8px;
  }
}
.contain_tab {
  background-color: red !important;
}
</style>