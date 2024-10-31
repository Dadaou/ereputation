<template>
  <div class="security__header border__bottom">

  </div>
  <div class="search">
    <el-input v-model="search" size="small" placeholder="Type to search" />
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table v-if="linksLoading == false" :data="filterTableData">
      <el-table-column label="Establishment" prop="establishment_name" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Source" prop="source" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Category" prop="category" style="width: 10%; min-width: 200px;" />
      <el-table-column label="Url" prop="url_trunked" style="width: 25%; min-width: 200px;" />

      <el-table-column label="Gate" prop="section" style="width: 25%; min-width: 200px;"></el-table-column>
      <el-table-column label="Operations" style="width: 25%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
        </template>
        <template #default="scope">
          <a :href="scope.row.url" target="_blank"><i class="uil uil-external-link-alt"></i></a>
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
const emit = defineEmits(['reload', 'edit']);
const tableData = inject('links');
const search = ref('')
const linksLoading = ref(false);

const filterTableData = computed(() => {
  let filteredData = [];
  tableData.value.forEach((_val) => {
    _val.url_trunked = _val.url.length > 20 ? _val.url.substring(0, 20) + '...' : _val.url;
    filteredData.push(_val);
  })
  filteredData = filteredData.filter((data) => {

    if (data.section == 'INFOS' || data.section == 'OFFERS' || data.section == 'MENUS' || data.section == 'REVIEWS' || data.section == 'FOLLOW US' || data.section == '' || data.section == null) {
      return (
        !search.value ||
        (data.source && data.source.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.category && data.category.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.section && data.section.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase()))
      );
    }
  });
  return filteredData;
});

const providers = inject('providers');

const getURIbyName = (id) => {
  let data = providers.value
  data = data.filter(item => item.id == id)
  if (data.length > 0) return `${data[0].uri}${data[0].url}`
  return ''
}

const reloadData = (id) => {
  tableData.value = tableData.value.filter((data) => {
    return data.id != id;
  })
}

const urlPattern = (urlTemplate) => {
  let regexPattern = urlTemplate.replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  regexPattern = regexPattern.replace(/{value1}/g, '(.+)');
  return new RegExp('^' + regexPattern);
}

const getValueUrl = (url, urlTemplate) => {
  const pattern = urlPattern(urlTemplate);
  const matches = url.match(pattern);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return '';
}

const handleDelete = async (index, link) => {
  try {
    const response = await new Promise((resolve, reject) => {
      services.patchRecord('settings', link.id, { enable: false }, (response) => {
        resolve(response);
      });
    });

    if (response.status == 200) {
      ElMessage({
        message: `Links deleted successfully`,
        type: 'success',
      })
      reloadData(link.id)
    }
  } catch (error) {
    console.log(error)
  }
};

const handleEdit = async (data) => {
  let provider = providers.value.filter(item => item.id == data.idprovider)[0];
  const payload = {
    category: data.category,
    link: (data.category == 'Hashtag') ? getValueUrl(data.url, provider.url) : data.url,
    provider: getURIbyName(data.idprovider),
    id: data.id,
    establishment: `/api/establishments/${data.establishment_id}`,
    section: data.section,
    caption: data.caption,
    logo: data.logo,
    document_url: data.document_url
  }
  const sub_tab = payload.category && payload.category.trim() !== '' ? 'urls_form' : 'urls_gate_form';

  router.push({
    name: route.name,
    params: {
      ...route.params,
      tab: 'urls',
      sub_tab: sub_tab
    }
  });
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