<template>
  <div class="security__header border__bottom">
  </div>
  <el-input v-model="search" size="small" placeholder="Type to search" class="search" />
  <div class="mt-5 erep_table table__container">
    <el-table :data="filterTableData" class="responsive-table" :row-class-name="rowClassName" style="width: 100%">
      <el-table-column label="Name" fixed prop="name" width="188" />
      <el-table-column label="Establishment" prop="establishment_name" width="200" />
      <el-table-column label="Amount" prop="amount" align="center" width="100" />
      <el-table-column label="Category" prop="category" width="150" />
      <el-table-column label="Code" prop="code" width="100" />
      <el-table-column label="Metric" prop="metric" width="100" />
      <el-table-column label="Scope" prop="scope" width="100" />
      <el-table-column label="Validity" prop="validity" align="center" width="100" />
      <el-table-column label="Limit" prop="advantageLimit" align="center" width="100" />
      <el-table-column label="Received" prop="received" align="center" width="100" />
      <el-table-column label="Used" prop="used" align="center" width="100" />
      <el-table-column label="Expired At" width="150">
        <template #default="scope">
          {{ scope.row.expired_at ? moment(scope.row.expired_at).format('YYYY-MM-DD') : '' }}
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

      <el-table-column label="Operations" width="200">

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
  </div>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput, ElTooltip } from 'element-plus';
import services from '@Services/services.js';
import moment from 'moment';
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(['edit', 'setEnable', 'setDisable']);
const advantages = inject('advantages');
const search = ref('');
const { width } = useWindowSize();
const tableWidth = computed(() => {
  return width.value > 800 ? `width: ${100}%` : `width: ${100}%`;
});
const route = useRoute();
const router = useRouter();

const filterTableData = computed(() => {
  let filteredData = advantages.value;
  filteredData = filteredData.filter((data) => {
    return !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.metric && data.metric.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.scope && data.scope.toLowerCase().includes(search.value.toLowerCase()))

  })
  return filteredData
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
const rowClassName = ({ row }) => {
  if (!row.enable) {
    return 'red-background';
  } else if (row.limit_atteinte) {
    return 'orange-background';
  }
  return '';
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
  background-color: rgb(221, 122, 113) !important;
}

:deep(.el-table__row.orange-background .el-table-fixed-column--left),
:deep(.el-table__row.orange-background) {
  color: black;
  background-color: rgb(212, 139, 65) !important;
}

/* 
::v-deep .el-table__row.red-background .el-table-fixed-column--left:hover,
::v-deep .el-table__row.red-background:hover,
::v-deep .el-table__row.orange-background .el-table-fixed-column--left:hover,
::v-deep .el-table__row.orange-background:hover {
  color: black;
}

::v-deep .el-table__row.red-background .el-table-fixed-column--left:hover,
::v-deep .el-table__row.red-background:hover {
  background-color: rgb(221, 122, 113) !important;
}

::v-deep .el-table__row.orange-background .el-table-fixed-column--left:hover,
::v-deep .el-table__row.orange-background:hover {
  background-color: rgb(212, 139, 65) !important;
} */


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

@media screen and (max-width: 468px) {
  .search {
    display: flex;
    max-width: 220px;
    float: right;
  }

  .el-table--fit {
    font-size: 11px !important;
  }
}
</style>