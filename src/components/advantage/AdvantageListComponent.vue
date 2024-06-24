<template>
  <div class="security__header border__bottom">
  </div>
  <el-input v-model="search" size="small" placeholder="Type to search" class="search" />
  <div class="mt-5 erep_table table__container">
    <el-table v-if="advantageLoading == false" :data="filterTableData" class="responsive-table" :row-class-name="rowClassName" style="width: 100%">
      <el-table-column label="Name" fixed prop="name" width="188" />
      <el-table-column label="Establishment" prop="establishment_name" width="190" />
      <el-table-column label="Amount" prop="amount" align="center" width="100" />
      <el-table-column label="Category" prop="category" width="120" />
      <el-table-column label="Code" prop="code" width="85" />
  <!--   <el-table-column label="Metric" prop="metric" width="100" />
      <el-table-column label="Scope" prop="scope" width="100" />
       <el-table-column label="Validity" prop="validity" align="center" width="100" /> -->
      <el-table-column label="Limit" prop="advantageLimit" align="center" width="70" />
      <el-table-column label="Received" prop="received" align="center" width="90" />
      <el-table-column label="Used" prop="used" align="center" width="80" />
      <el-table-column label="Expired At" width="110">
        <template #default="scope">
          <span :class="{'expired-date': isExpired(scope.row.expired_at)}">
      {{ scope.row.expired_at ? moment(scope.row.expired_at).format('YYYY-MM-DD') : '' }}
         </span>
        </template>
      </el-table-column>
      <el-table-column label="Enable" align="center" width="80">
        <template #default="scope">
         <el-button 
          :class="{'enabled-button': scope.row.enable}" 
          size="small" 
          @click="scope.row.enable ? handleDisable(scope.$index, scope.row) : handleEnable(scope.$index, scope.row)">
         <i 
          :class="scope.row.enable ? 'uil uil-check-square' : 'uil uil-square'" 
          >
         </i>
        </el-button>
      </template>
      </el-table-column>

      <el-table-column label="Actions" width="200">

        <template #default="scope">
          <el-tooltip placement="top">
            <template #content> Boost this advantage </template>
            <el-button size="small" @click="handleBoost(scope.$index, scope.row)"><i
                class="uil uil-presentation"></i></el-button>
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
    <div v-else role="status" class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5" v-for="index in 2" :key="index">
          <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
          <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
          <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
          <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, inject, watchEffect } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput, ElTooltip } from 'element-plus';
import services from '@Services/services.js';
import moment from 'moment';
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from "vue-router";

const advantageLoading = ref(false);
const emit = defineEmits(['edit', 'setEnable', 'setDisable']);
const advantages = inject('advantages');
const search = ref('');
const { width } = useWindowSize();
const tableWidth = computed(() => {
  return width.value > 800 ? `width: ${100}%` : `width: ${100}%`;
});
const route = useRoute();
const router = useRouter();

let filterTableData = [];

watchEffect(()  => {
  let filteredData = advantages.value;

  filteredData = filteredData.filter((data) => {
    return !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.metric && data.metric.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.scope && data.scope.toLowerCase().includes(search.value.toLowerCase()))
  })
 
  if (advantages.value.length > 0 ) {
     // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      advantageLoading.value = false;
  }
  else {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    advantageLoading.value = true;
  }

  // eslint-disable-next-line no-const-assign
  filterTableData = filteredData; 
});

const reloadData = (advantageToRemove) => {
  advantages.value = advantages.value.filter((item) => item.id !== advantageToRemove.id);
};

const handleEdit = (index, advantages) => {
  emit('edit', advantages);
};

const handleBoost = (index, advantages) => {
  const link = router.resolve(`/customer/${route.params.tag}/establishment/${advantages.establishment_tag}/boost?q=${advantages.id}`);
  window.open(link.href, '_blank');
};

const handleEnable = (index, advantages) => {
  emit('setEnable', advantages.id);
};

const handleDisable = (index, advantages) => {
  emit('setDisable', advantages.id);
};

const handleDelete = async (index, advantages) => {
  try {
    await services.deleteRecord('advantages', advantages.id, (response) => {
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
/*const rowClassName = ({ row }) => {
  if (!row.enable) {
    return 'red-background';
  } else if (row.limit_atteinte || row.advantage_limit <= row.received || moment(row.expired_at) <= moment()) {
    return 'orange-background';
  }
  return '';
};*/
const isExpired = (date) => {
  return moment(date).isSameOrBefore(moment(), 'day');
};
</script>

<style scoped>
  .enabled-button {
    color: #008000;
    background-color: rgb(213, 255, 208);
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