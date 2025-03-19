<template>
  <div class="security__header border__bottom">
    <button @click="add"
      class="inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
      Staff <i class="uil uil-plus"></i>
    </button>
    <div class="search">
      <el-input v-model="search" size="small" placeholder="Type to search" />
    </div>
  </div>
  <div class="mt-2 table__container">
    <el-table :data="filterTableData">
      <el-table-column width="100">
        <template #default="scope">
          <img :src="scope.row.url_source" alt="Establishment Image" class="establishment-image" />
        </template>
      </el-table-column>
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;">
        <template #default="scope">
          <router-link class="establishment_name" :to="{ name: 'Establishment', params: { id: scope.row.establishment_tag, tag: route.params.tag } }">
            {{ scope.row.establishment_name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Name" style="width: 20%; min-width: 300px;">
        <template #default="scope">
          {{ `${scope.row.firstname} ${scope.row.lastname}` }}
        </template>
      </el-table-column>
      <el-table-column label="Gender" prop="gender" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Reviews" prop="reviews" style="width: 20%; min-width: 300px;">
        <template #default="scope">
          <div class="reviews-link">
            <el-tooltip :content="'Reviews ' + scope.row.firstname + scope.row.lastname" placement="top">
              <a
                :href="`/customer/${tag}/establishment/${scope.row.establishment_tag}/services/staff/${scope.row.tag}/reviews`">{{
                  scope.row.reviews }}</a>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Department" prop="department" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Section" prop="section" style="width: 20%; min-width: 300px;" />

      <el-table-column style="width: 15%; min-width: 200px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="redirectToQRCode(scope.row.tag, scope.row.establishment_tag)">
            <i class="uil uil-print"></i>
          </el-button>
          <el-tooltip :content="`Click to enter ${scope.row.firstname} ${scope.row.lastname}'s feedback formulary`"
            placement="top">
            <a :href="scope.row.link" target="_blank" class="el-button el-button--small"><i
                class="uil uil-external-link-alt"></i></a>
          </el-tooltip>
          <el-button size="small" @click="copyLink(scope.row.link)"><i class='fa fa-copy'></i></el-button>
          <el-button size="small" @click="showQRCode(scope.row)"><i class="uil uil-qrcode-scan"></i></el-button>
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
  <QrCodeModalComponent v-if="staff"
    :qrcodeValue="`${baseurl}/public/${tag}/establishment/${staff.establishment_tag}/staffs/${staff.tag}/feedback`"
    :showModal="showModal" :filename="`${staff.firstname} ${staff.lastname}-feedback-link`" @close="showModal = false"
    :customer="tag" :establishment="staff.establishment_tag" type="staff" />
</template>

<script setup>
import { computed, ref, inject, defineAsyncComponent } from 'vue';
import moment from 'moment';
import { useStaffStore } from "@Stores/staff.js";
import services from '@Services/services.js';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElTable, ElTableColumn, ElPopconfirm, ElButton, ElInput, ElTooltip } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/popconfirm/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

const QrCodeModalComponent = defineAsyncComponent(() =>
  import('@Components/utils/QrCodeModalComponent.vue')
)

const router = useRouter()
const route = useRoute()
const baseurl = window.location.origin;
const showModal = ref(false);
const staffStore = useStaffStore();
const staff = ref(null);
const staffs = inject('staffs');
const tag = inject('tag');
const emit = defineEmits('showStaffList');


let tableData = computed(() => {
  let data = [];
  staffs.value.forEach(staff_item => {
    staff_item['period'] = staff_item.dateto != null ? `${moment(staff_item.datefrom).format('YYYY MMM DD')} to ${moment(staff_item.dateto).format('YYYY MMM DD')}` : `${moment(staff_item.datefrom).format('YYYY MMM DD')} to -`;
    data.push(staff_item);
  })
  return data;
});
const search = ref('')

const filterTableData = computed(() => {
  let filterdata = tableData.value;

  filterdata = filterdata.map((value) => {
    value.link = `${baseurl}/public/${tag.value}/establishment/${value.establishment_tag}/staffs/${value.tag}/feedback?preview=true`
    return value
  })

  filterdata = tableData.value.filter(
    (data) =>
      !search.value ||
      data.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
      data.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
      data.department.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  )
  return filterdata
})

const closeView = () => {
  emit('showStaffList', false);
}

const add = () => {
  closeView()
  //router.push({ name: 'Parameters', params: { tab: 'staffs', sub_tab: 'staffs_form' } });
}

const handleEdit = (index, staff) => {
  staffStore.setStaff(staff);
  closeView();
  //router.push({ name: 'Parameters', params: { tab: 'staffs', sub_tab: 'staffs_form' } });
}

const showQRCode = (value) => {
  staff.value = value;
  showModal.value = true;
};

const reloadData = (staff) => {
  let data = [];
  staffs.value.forEach(staff_item => {
    if (staff_item.id !== staff.id) data.push(staff_item);
  })
  staffs.value = data;
}


const handleDelete = async (index, staff) => {
  await staffStore.removeStaff(staff.id, (response) => {
    if (response.status == 204) {
      reloadData(staff);
      ElMessage({
        message: `Staff removed successfully.`,
        type: 'success',
      });
    }
  })
};

const redirectToQRCode = async (tag, establishment_tag) => {
  const link = `/customer/${route.params.tag}/establishment/${establishment_tag}/qr_code_document_preview?section=staffs&tag=${tag}`;
  router.push(link);
}

const copyLink = (link) => {
    navigator.clipboard.writeText(link)
        .then(() => {
            ElMessage.success("Link successfully copied!");
        })
        .catch(() => {
            ElMessage.error("Failed to copy the link.");
        });
};

</script>
<style scoped>
.establishment-info {
  display: flex;
  align-items: center;
}

.establishment_name {
  cursor: pointer;
  font-weight: 500;
}

.establishment_img {
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
  color: red;
}

button i.uil-edit {
  color: var(--color-danger);
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

/* Appliquez une largeur de 100% aux éléments parents */
.security__header {
  width: 100%;
}

.table__container {
  /* overflow-x: scroll; */
  width: 85%;
}

@media screen and (max-width: 768px) {
  /*.table__container {
    width: 75%;
  }*/
}

/* Définissez une largeur maximale pour l'en-tête sur les grands écrans */
@media screen and (min-width: 800px) {
  .security__header {
    max-width: 1000px;
    /* Largeur maximale pour les grands écrans */
  }

  .table__container {
    width: 100%;
  }
}

.search {
  display: none;
}

@media screen and (max-width: 468px) {
  .search {
    display: inline;
    max-width: 220px;
    margin-right: 70px;
  }

  .searchtab {
    display: none;
  }

  .el-table--fit {
    font-size: 11px !important;
  }
}
</style>