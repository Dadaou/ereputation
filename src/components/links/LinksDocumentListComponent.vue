<template>
  <div class="security__header border__bottom">

  </div>
  <div class="search">
    <el-input v-model="search" size="small" placeholder="Type to search" />
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table v-if="linksLoading == false" :data="filterTableData">
      <el-table-column label="Establishment" prop="establishment_name" style="width: 25%; min-width: 200px;" />

      <el-table-column label="Caption" style="width: 25%; min-width: 200px;">
        <template #default="scope">
          <div>
            <span>{{ scope.row.caption }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Link" style="width: 10%; min-width: 200px;">
        <template #default="scope">
          <div>
            <span>{{ scope.row.document_url }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Operations" style="width: 25%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
        </template>
        <template #default="scope">

          <a :href="scope.row.document_url" target="_blank"><i class="uil uil-external-link-alt"></i></a>
          <el-button size="small" @click="handleEdit(scope.row)"><i class="uil uil-edit"></i></el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div v-else role="status"
      class="space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 mb-5"
      v-for="index in 2" :key="index">
      <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
      <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
      <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
      <div class="w-full h-5 bg-gray-200 rounded-2 dark:bg-gray-700 mb-1"></div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, inject } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import services from '@Services/services.js';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['deleteData', 'edit']);
//const Data = inject('links');
const search = ref('')
const linksLoading = ref(false);
const activeUrlTabName = inject('parametersUrlsConf')

const props = defineProps({
  tableData: {
    type: Array,
    default: []
  },
});

const filterTableData = computed(() => {

  let filteredData = [];

  filteredData = props.tableData.filter((data) => {
    return (
      !search.value ||
      (data.caption && data.caption.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase()))
    );
  });
  return filteredData;
});

const handleDelete = async (index, link) => {
  try {
    const response = await new Promise((resolve, reject) => {
      services.deleteRecord('customer/settings/delete/document', link.id, (response) => {
        resolve(response);
      });
    });

    if (response.status == 200 || response.status == 204) {
      ElMessage({
        message: `Links deleted successfully`,
        type: 'success',
      })

      emit('deleteData', link.id)
    }
  } catch (error) {
    console.log(error)
  }
};

const handleEdit = async (data) => {

  localStorage.removeItem('showForms')

  const payload = {
    id: data.id,
    establishment: data.establishment_tag,
    document_url: data.document_url,
    caption: data.caption
  }

  setTimeout(function () {
    emit('edit', payload)
  }, 250);
};

</script>

<style scoped>
button,
a {
  border: none;
  cursor: pointer;
  font-size: 15px;
}

a {
  margin: 0 10px;
}

button i.uil-trash-alt {
  color: red !important;
}

button i.uil-edit {
  color: var(--color-danger) !important;
}

.table__container {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .table__container {
    width: 85%;
  }
}

.search {
  display: none;
}

@media screen and (max-width: 468px) {
  .search {
    display: flex;
    max-width: 220px;
    float: right;
  }

  .searchtab {
    display: none;
  }

  .el-table--fit {
    font-size: 11px !important;
  }
}
</style>