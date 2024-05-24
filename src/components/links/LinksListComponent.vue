<template>
  <div class="security__header border__bottom">
    <!--  <div class="security__edit">
      <h4><i class="uil uil-calender"></i> Event List</h4>
    </div> -->
  </div>
  <div class="mt-5 erep_table table__container">
    <el-table :data="filterTableData">
      <el-table-column label="Establishment" prop="establishment_name" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Source" prop="source" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Category" prop="category" style="width: 10%; min-width: 200px;" />
      <el-table-column label="Url" prop="url" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Gate" prop="section" style="width: 25%; min-width: 200px;" />
      <!-- <el-table-column label="Caption" prop="caption" style="width: 25%; min-width: 200px;" />
      <el-table-column label="Section" prop="section" style="width: 25%; min-width: 200px;" /> -->
      <el-table-column label="Operations" style="width: 25%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <a :href="scope.row.url" target="_blank"><i class="uil uil-external-link-alt"></i></a>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
            </template>
          </el-popconfirm>
          <el-button size="small" @click="handleEdit(scope.row)"><i class="uil uil-edit"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { computed, ref, inject, watch } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useWindowSize } from '@vueuse/core';
import { useEventStore } from "@Stores/event.js";
import { useCompanyStore } from "@Stores/company.js";
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput } from 'element-plus';
import services from '@Services/services.js';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

const emit = defineEmits(['reload', 'edit']);
const tableData = inject('links');
const search = ref('')
const filterTableData = computed(() => {
  let filteredData = tableData.value;
  filteredData = filteredData.filter((data) => {
    if(data.section == 'REVIEWS' || data.section == 'FOLLOW US'){
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
    establishment: `/api/establishments/${data.establishment_id}`
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
</style>