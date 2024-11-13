<template>
  <div class="security__header border__bottom">
    <button @click="add"
      class="inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
      External Url <i class="uil uil-plus"></i>
    </button>
  </div>
  <div class="search">
    <el-input v-model="search" size="small" placeholder="Type to search" />
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table v-if="linksLoading == false" :data="filterTableData">
      <el-table-column label="Establishment" prop="establishment_name" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Caption" prop="caption" style="width: 10%; min-width: 200px;" />
      <el-table-column label="QR code scans" prop="qr_code_count" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Url" prop="url" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Operations" style="width: 25%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
        </template>
        <template #default="scope">
          <a :href="scope.row.url + '?preview=true'" target="_blank">
            <i class="uil uil-external-link-alt"></i>
          </a>
          <el-button size="small" @click="handleClickExternalUrl(scope.row.url, scope.row.establishment_tag)"><i
              class="uil uil-qrcode-scan"></i></el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="uil uil-edit"></i></el-button>
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
  <QrCodeModalComponent :qrcodeValue="scanUrl" :showModal="showModal" @close="showModal = false" />

</template>
<script setup>
import { computed, ref, inject, defineAsyncComponent } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import services from '@Services/services.js';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import { useRoute, useRouter } from 'vue-router'
import { useLinkStore } from "@Stores/link.js";


const QrCodeModalComponent = defineAsyncComponent(() =>
  import('@Components/utils/QrCodeModalComponent.vue')
)

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['reload', 'edit']);
const allLinks = inject('links', ref([]));
const search = ref('');
const linksLoading = ref(false);
const tableData = ref(allLinks.value);
const showModal = ref(false);
const scanUrl = ref('');
const baseurl = window.location.origin;
const linkStore = useLinkStore();

function handleClickExternalUrl(url, establishment_tag) {
  scanUrl.value = `${baseurl}/public/${route.params.tag}/establishment/${establishment_tag}/external?url=${url}`;
  showModal.value = true;
}

const add = () => {
  router.push({ name: 'Parameters', params: { tab: 'urls', sub_tab: 'urls_external_form' } });
};

const filterTableData = computed(() => {
  if (!allLinks.value) return [];
  return allLinks.value.filter((data) => {
    if (data.external_url !== true) {
      return false;
    }

    return (
      ['INFOS', 'OFFERS', 'MENUS', 'REVIEWS', 'FOLLOW US', '', null].includes(data.section) &&
      (
        !search.value ||
        (data.caption && data.caption.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase()))
      )
    );
  });
});

const providers = inject('providers');
const getURIbyName = (id) => {
  let data = providers.value
  data = data.filter(item => item.id == id)
  if (data.length > 0) return `${data[0].uri}${data[0].url}`
  return ''
}
const reloadData = (id) => {
  allLinks.value = allLinks.value.filter((data) => data.id !== id);
  tableData.value = allLinks.value;
};
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


const handleEdit = async (index, link) => {
  linkStore.setLink(link)
  console.log(linkStore.link)
  router.push({
    name: 'Parameters', params: { tab: 'urls', sub_tab: 'urls_external_form' }
  });
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