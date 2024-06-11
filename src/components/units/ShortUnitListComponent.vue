<template>
  <div class="security__header border__bottom">
    <button @click="add"
      class="inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
      Service <i class="uil uil-plus"></i>
    </button>
    <div class="search">
      <el-input v-model="search" size="small" placeholder="Type to search" />
    </div>
  </div>
  <div class="mt-5 table__container">
    <el-table :data="filterTableData">
      <el-table-column width="100">
        <template #default="scope">
          <img class="establishment_img" :src="scope.row.media">
        </template>
      </el-table-column>
      <el-table-column label="Establishment" prop="establishment_name" style="width: 20%; min-width: 300px;">
        <template #default="scope">

        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" style="width: 15%; min-width: 300px;" />
      <el-table-column label="Code" prop="code" style="width: 20%; min-width: 300px;" />
      <el-table-column label="Category" prop="category" width="117" />
      <el-table-column style="width: 20%; min-width: 300px;" align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" class="searchtab" />
        </template>
        <template #default="scope">
          <div class="action-buttons">
            <el-tooltip :content="`Click to enter ${scope.row.name}'s feedback formulary`" placement="top">
              <a :href="scope.row.link" target="_blank" class="el-button el-button--small"><i
                  class="uil uil-external-link-alt"></i></a>
            </el-tooltip>
            <el-button size="small" @click="showQRCode(scope.row)"><i class="uil uil-qrcode-scan"></i></el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i
                class="uil uil-edit"></i></el-button>
            <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.$index, scope.row)">
              <template #reference>
                <el-button size="small"><i class="uil uil-trash-alt"></i></el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <QrCodeModalComponent v-if="unit"
    :qrcodeValue="`${baseurl}/public/${tag}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`"
    :showModal="showModal" :filename="`${unit.category}-${unit.name}-feedback-link`" @close="showModal = false"
    :customer="tag" :establishment="unit.establishment_competitor_tag" type="services" />
</template>

<script setup>
import { computed, ref, inject, defineAsyncComponent } from 'vue';
import { ElTable, ElPopconfirm, ElTableColumn, ElButton, ElInput, ElTooltip, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from "@Stores/user.js";
import { useAppStore } from "@Stores/app.js";
import { useStaffStore } from "@Stores/staff.js";
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/table/style/css';
import 'element-plus/es/components/table-column/style/css';
import 'element-plus/es/components/popconfirm/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/input/style/css';
import services from '@Services/services.js';

const QrCodeModalComponent = defineAsyncComponent(() =>
  import('@Components/utils/QrCodeModalComponent.vue')
)

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const units = inject('units');
const search = ref('');
const showModal = ref(false);
const tag = inject('tag');
const baseurl = window.location.origin;
const unit = ref(null);
const staffStore = useStaffStore();

const establishments = computed(() => {
  return userStore.user.customer.establishments.map(establishment => ({
    id: establishment.id,
    name: establishment.name,
    address1: establishment.address1,
    address2: establishment.address2,
    zipcode: establishment.zipcode,
    city: establishment.city,
    country: establishment.country,
    region: establishment.region,
    category: establishment.category,
    rank: establishment.rank,
    disable: establishment.disable,
    positionning: establishment.positionning,
    competitor_tag: establishment.competitor_tag,
    locality_id: establishment.locality_id,
    locality_name: establishment.locality_name,
    locality_gps: establishment.locality_gps,
    media: establishment.url_source || '',
    link: `${baseurl}/public/${tag.value}/establishment/${establishment.competitor_tag}/units`
  }));
});

const getEstablishmentImage = (establishmentName) => {
  const establishment = establishments.value.find(est => est.name === establishmentName);
  return establishment ? establishment.media : '';
};

const showQRCode = (value) => {
  unit.value = value;
  showModal.value = true;
};

const add = () => {
  router.push({ name: 'Parameters', params: { tab: 'services', sub_tab: 'services_form' } });
};

const filterTableData = computed(() => {
  let filterdata = units.value.map((unit) => {
    unit.media = getEstablishmentImage(unit.establishment_name);
    unit.link = `${baseurl}/public/${tag.value}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`;
    return unit;
  });

  filterdata = filterdata.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.category.toLowerCase().includes(search.value.toLowerCase()) ||
      data.establishment_name.toLowerCase().includes(search.value.toLowerCase())
  );
  return filterdata;
});

const reloadData = (unit) => {
  units.value = units.value.filter(item => item.id !== unit.id);
};

const handleDelete = async (index, unit) => {
  const response = await services.deleteRecord('units', unit['id']);
  if (response.status == 204) {
    reloadData(unit);
    ElMessage({
      message: `Unit removed successfully.`,
      type: 'success',
    });
  }
};

const handleEdit = (index, unit) => {
  staffStore.setUnit(unit);
  router.push({ name: 'Parameters', params: { tab: 'services', sub_tab: 'services_form' } });
};
</script>

<style scoped>
.establishment_name {
  cursor: pointer;
  font-weight: 500;
}

img.establishment_img {
  height: 50px;
  object-fit: cover;
  width: 100%;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;

}

.el-table th {
  text-align: center;
}

.el-table td {
  text-align: center;
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

.modal__header {
  display: flex;
  justify-content: space-between;
}

.modal__header div {
  align-self: center;
}

.modal__close i {
  float: right;
  font-size: 25px;
  color: red;
  cursor: pointer;
  transition: var(--transition);
}

.establishment__review__qrcode p {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-bg2);
}

.download__qr_btn {
  display: flex;
  justify-content: center;
}

.download__qr_btn button {
  flex-basis: 50%;
}

.qr__code {
  width: 35% !important;
  padding: 50px auto !important;
  margin: auto;
}

.modal__close i:hover {
  transform: rotate(360deg);
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
  .table__container {
    width: 70%;
  }

  .vertical-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
    margin-right: 100px;
  }

  .searchtab {
    display: none;
  }

  .el-table--fit {
    font-size: 11px !important;
  }
}
</style>