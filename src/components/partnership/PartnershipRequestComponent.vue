<template>
  <div class="mt-2 table__container">
    <div class="table-description" style="margin-bottom: 16px;">
      <p>Requests for partnerships</p>
      <div>
        <el-input v-model="searchReceived" size="small" placeholder="Type to search" class="input_search" />
      </div>
    </div>

    <el-table :data="filterTableDataReceived" class="responsive-table">
      <el-table-column width="100">
        <template #default="scope">
          <img class="establishment_img" :src="scope.row.establishment_logo" alt="Establishment Logo" />
        </template>
      </el-table-column>
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
          <el-popconfirm v-if="scope.row.state == 'valid'"
            title='Are you sure to change the state of partnership to "PENDING"?'
            @confirm="handleEvent(scope.$index, scope.row, 'state', 'pending')">
            <template #reference>
              <el-button><i class="uil uil-check mr-1"
                  style="color:var(--color-success); font-size: 16px;"></i></el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.state == 'pending'"
            title='Are you sure to change the state of partnership to "VALID"'
            @confirm="handleEvent(scope.$index, scope.row, 'state', 'valid')">
            <template #reference>
              <el-button><i class="uil uil-dna mr-1" style="font-size: 16px;"></i></el-button>
            </template>
          </el-popconfirm>
          <!-- <span style="text-transform: uppercase; font-size: 12px;">{{ scope.row.state }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="Enable" prop="enable" align="center" style="width: 10%; min-width: 200px;">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.enable == false" title='Are you sure you want to "ENABLE" this partnership?'
            @confirm="handleEvent(scope.$index, scope.row, 'enable', true)">
            <template #reference>
              <el-button><i class="uil uil-times mr-1"
                  style="color:var(--color-danger2); font-size: 16px;"></i></el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.enable == true" title='Are you sure you want to "DISABLE" this partnership?'
            @confirm="handleEvent(scope.$index, scope.row, 'enable', false)">
            <template #reference>
              <el-button><i class="uil uil-check mr-1"
                  style="color:var(--color-success); font-size: 16px;"></i></el-button>
            </template>
          </el-popconfirm>
          <!-- <span style="text-transform: uppercase;">
            <i v-if="scope.row.enable" class="uil uil-check mr-1"
              style="color:var(--color-success); font-size: 16px;"></i>
            <i v-else class="uil uil-times mr-1" style="color:var(--color-danger2); font-size: 16px;"></i>
          </span> -->

        </template>
      </el-table-column>
      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <!-- <template #header>
          <el-input v-model="searchReceived" size="small" placeholder="Type to search" class="searchTab"/>
        </template> -->
        <template #default="scope">
          <el-popconfirm v-if="scope.row.state == 'pending' && scope.row.enable == false"
            title="Are you sure to accept this request?" @confirm="handleAccept(scope.$index, scope.row)">
            <template #reference>
              <el-button><i class="uil uil-check mr-1" style="color:var(--color-success); font-size: 16px;"></i><span
                  style="color:var(--color-success); font-size:10px;">Accept</span></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { computed, ref, inject, watchEffect } from 'vue';
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

const datasentLoading = ref(false);
const datareceivedLoading = ref(false);
const searchSent = ref('')
const searchReceived = ref('')
const emit = defineEmits(['update']);
// const userStore = useUserStore()
const partnerships = inject('partnerships')
let filterTableDataSent = ref([]);
let filterTableDataReceived = ref([]);

watchEffect(() => {
  if (partnerships.value && partnerships.value['sent']) {
    let filterdata = partnerships.value['sent'];
    filterdata = filterdata.filter(
      (data) =>
        !searchSent.value ||
        data.advantage_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
        data.partnership_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
        data.establishment_name.toLowerCase().includes(searchSent.value.toLowerCase()) ||
        data.state.toLowerCase().includes(searchSent.value.toLowerCase())
    );

    filterTableDataSent.value = filterdata;
  }
});

watchEffect(() => {
  if (partnerships.value && partnerships.value['received']) {
    let filterdata = partnerships.value['received'];
    filterdata = filterdata.filter(
      (data) =>
        !searchReceived.value ||
        data.advantage_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
        data.partnership_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
        data.establishment_name.toLowerCase().includes(searchReceived.value.toLowerCase()) ||
        data.state.toLowerCase().includes(searchReceived.value.toLowerCase())
    );
    filterTableDataReceived.value = filterdata;
  }
});

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
  if (response.status == 200) {
    emit('update');
    ElMessage({
      message: `Request accepted successfully.`,
      type: 'success',
    });
  }
};

const handleEvent = async (index, partnership, column, value) => {
  let body = {};
  body[`${column}`] = value;

  const response = await new Promise((resolve) => {
    services.patchRecord('partnerships', partnership['id'], body, (response) => {
      resolve(response);
    });
  });
  if (response.status == 200) {
    emit('update');
    ElMessage({
      message: `Modification done.`,
      type: 'success',
    });
  }
};
</script>
<style scoped>
img.establishment_img {
  height: 50px;
  object-fit: cover;
  width: 100%;
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