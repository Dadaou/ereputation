<template>
  <div class="mt-5 table__container">
    <div class="table-description" style="margin-bottom: 16px;">
      <p>The partnerships for which you have made a request</p>
    </div>
    <el-table :data="filterTableDataSent">
      <el-table-column label="Advantage" prop="advantage_name" style="width: 15%; min-width: 200px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 30%; min-width: 400px;" />
      <el-table-column label="Partnership" prop="partnership_name" style="width: 30%; min-width: 4%;" />
      <el-table-column label="Limit" prop="limit" align="center" style="width: 10%; min-width: 100px;" />
      <el-table-column label="Expired at" prop="expired_at" style="width: 15%; min-width: 150px;">
        <template #default="scope">
          <span v-if="scope.row.expired_at" style="text-transform: uppercase;">
            {{ moment(scope.row.expired_at).format('YYYY-MM-DD') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="State" prop="state" align="center" style="width: 10%; min-width: 200px;">
        <template #default="scope">
          <span style="text-transform: uppercase; font-size: 12px;">{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <el-input v-model="searchSent" size="small" placeholder="Type to search" />
        </template>
      </el-table-column>
    </el-table>
    <div class="table-description" style="margin-block: 32px 16px;">
      <p>Partnerships sent to you by others</p>
    </div>
    <el-table :data="filterTableDataReceived">
      <el-table-column label="Advantage" prop="advantage_name" style="width: 15%; min-width: 200px;" />
      <el-table-column label="Establishment" prop="establishment_name" style="width: 30%; min-width: 400px;" />
      <el-table-column label="Partnership" prop="partnership_name" style="width: 30%; min-width: 4%;" />
      <el-table-column label="Limit" prop="limit" align="center" style="width: 10%; min-width: 100px;" />
      <el-table-column label="Expired at" prop="expired_at" style="width: 15%; min-width: 150px;">
        <template #default="scope">
          <span v-if="scope.row.expired_at" style="text-transform: uppercase;">
            {{ moment(scope.row.expired_at).format('YYYY-MM-DD') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="State" prop="state" align="center" style="width: 10%; min-width: 200px;">
        <template #default="scope">
          <span style="text-transform: uppercase; font-size: 12px;">{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="searchReceived" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-popconfirm title="Are you sure to accept this request?" @confirm="handleAccept(scope.$index, scope.row)">
            <template #reference>
              <el-button v-if="scope.row.state == 'pending'"><i class="uil uil-check-circle mr-1"
                  style="color:var(--color-success); font-size: 16px;"></i><span
                  style="color:var(--color-success); font-size:10px;">Accept</span></el-button>
            </template>
          </el-popconfirm>
          <!-- <el-popconfirm title="Are you sure to refuse this request?" @confirm="handleRefuse(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm> -->
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { computed, ref, inject } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import services from '@Services/services.js';
// import { useUserStore } from "@Stores/user.js";
import moment from "moment";
// const categories = inject('categories');

const searchSent = ref('')
const searchReceived = ref('')
const emit = defineEmits(['update']);
// const userStore = useUserStore()
const partnerships = inject('partnerships')

const filterTableDataSent = computed(() => {
  let filterdata = partnerships.value['sent'];
  filterdata = filterdata.filter(
    (data) =>
      !searchSent.value ||
      data.advantage_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
      data.partnership_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
      data.state.toLowerCase().includes(searchSent.value.toLowerCase())
  )
  return filterdata
})

const filterTableDataReceived = computed(() => {
  let filterdata = partnerships.value['received'];
  filterdata = filterdata.filter(
    (data) =>
      !searchReceived.value ||
      data.advantage_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
      data.partnership_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
      data.state.toLowerCase().includes(searchReceived.value.toLowerCase())
  )
  return filterdata
})

const handleAccept = async (index, partnership) => {
  const response = await new Promise((resolve) => {
    services.patchRecord('partnerships', partnership['id'], {
      "state": "valid",
      "enable": true,
      "approvedDate": moment().format("YYYY-MM-DD")
    }, (response) => {
      resolve(response);
    });
  });
  if (response.status == 204) {
    emit('update');
    ElMessage({
      message: `Request accepted successfully.`,
      type: 'success',
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

.table-description p {
  font-size: 14px;
  color: grey;
  font-weight: 500;
}
</style>