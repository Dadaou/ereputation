<template>
  <div class="mt-2 table__container">
    <div class="table-description" style="margin-bottom: 16px;">
      <p></p>
      <div>
        <el-input v-model="search" size="small" placeholder="Type to search" class="input_searchs" />
      </div>
    </div>
    <el-table :data="filterTableData" class="responsive-table">
      <el-table-column label="Name" align="center" style="width: 20%; min-width: 800px;">
        <template #default="scope">

          <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
            {{ scope.row.name }}
          </span>
          <el-button size="small" v-if="scope.row.other_customer != null" style="cursor:default; !default;important;">
            <Icon icon="lucide:handshake"
              style=" color: var(--color-danger) !important; display: flex; align-items: center;" />
          </el-button>

        </template>
      </el-table-column>

      <el-table-column label="Establishment" align="center" style="width: 20%; min-width: 800px;">
        <template #default="scope">
          <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
            {{ scope.row.establishment_name }}
          </span>

        </template>
      </el-table-column>


      <!-- <el-table-column class="td" label="Establishment" prop="establishment_name" align="center" style="width: 5%; min-width: 400px;" /> -->
      <el-table-column class="td" label="Amount" prop="amount" align="center" style="width: 10%; min-width: 4%;" />
      <el-table-column class="td" label="Category" prop="category" align="center"
        style="width: 20%; min-width: 100px;" />
      <el-table-column class="td" label="Code" prop="code" align="center" style="width: 5%; min-width: 200px;">
        <template #default="scope">
          <span v-if="scope.row.code" class="custom-badge">
            {{ scope.row.code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column class="td" label="Limit" prop="advantageLimit" align="center"
        style="width: 5%; min-width: 400px;" />
      <el-table-column class="td" label="Received" prop="received" align="center" style="width: 10%; min-width: 4%;" />
      <el-table-column class="td" label="Used" prop="used" align="center" style="width: 20%; min-width: 100px;" />
      <el-table-column class="td" label="Section" prop="section" align="center" style="width: 20%; min-width: 800px;" />
      <el-table-column class="td" label="Website" prop="website" align="center" style="width: 20%; min-width: 800px;" />
      <el-table-column class="td" label="Expired At" align="center" style="width: 5%; min-width: 200px;">
        <template #default="scope">
          <span :class="{ 'expired-date': isExpired(scope.row.expired_at) }">
            {{ scope.row.expired_at ? moment(scope.row.expired_at).format('YYYY-MM-DD') : '' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column class="td" label="Enable" align="center" style="width: 5%; min-width: 400px;">
        <template #default="scope">
          <el-button :class="{ 'enabled-button': scope.row.enable }" size="small"
            @click="scope.row.enable ? handleDisable(scope.$index, scope.row) : handleEnable(scope.$index, scope.row)">
            <i :class="scope.row.enable ? 'uil uil-check-square' : 'uil uil-square'">
            </i>
          </el-button>
        </template>
      </el-table-column>


      <el-table-column label="Actions" style="width: 20%; min-width: 200px;text-align: center;" align="right">



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
import { computed, ref, inject, watchEffect } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput, ElTooltip } from 'element-plus';
import services from '@Services/services.js';
import moment from 'moment';
import { useWindowSize } from '@vueuse/core';
import { useRoute, useRouter } from "vue-router";
import { Icon } from '@iconify/vue';


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

const filterTableData = computed(() => {
  return advantages.value.filter(data => {
    return (
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.metric && data.metric.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.scope && data.scope.toLowerCase().includes(search.value.toLowerCase()))
    );
  });
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
.td {

  word-wrap: break-word !important;
  word-break: break-word !important;
  white-space: normal !important;
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

.custom-badge {
  display: inline-block;
  background-color: var(--color-danger);
  /* Vert */
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 12px;
  /* Coins arrondis */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  /* Ombre légère */
  text-align: center;
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
</style>