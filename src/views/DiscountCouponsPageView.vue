<template>
  <div>
    <el-input v-model="search" size="small" placeholder="Type to search" class="search" />
  </div>
  <div class="overflow-x-auto mt-5">
    <el-table :data="filteredData" class="responsive-table" style="width: 100%">

      <!-- <el-table-column fixed="left" label="Advantage name" prop="adv_name" :width="isMobile ? 130 : 250" /> -->

      <el-table-column label="Advantage" fixed="left" :width="isMobile ? 130 : 250">
        <template #default="scope">

          <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
            {{ scope.row.adv_name }}
          </span>
          <el-button v-if="scope.row.other_customer != null" style="border: none; cursor:default; !default;important;">
            <Icon icon="lucide:handshake"
              style=" color: var(--color-danger) !important; display: flex; align-items: center;" />
          </el-button>

        </template>
      </el-table-column>


      <el-table-column label="Establishment" prop="establishment_name" width="200" />
      <el-table-column label="Customer email" width="250">
        <template #default="scope">
          {{ scope.row.contact_email || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="Discount Code" prop="adv_code" :formatter="(row) => row.adv_code || '-'" align="center"
        width="150" />
      <el-table-column label="Code" prop="code" width="100" />
      <el-table-column label="Amount" prop="adv_amount" width="100">
        <template #default="scope">
          {{ scope.row.adv_amount }} {{ displayMetricOrCurrency(scope.row.adv_amount, scope.row.adv_metric, scope.row.adv_currency) }}
        </template>
      </el-table-column>
      <el-table-column label="Created at" width="120">
        <template #default="scope">
          {{ formatCreatedAt(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Validated at" align="center" width="200">
        <template #default="scope">
          {{ scope.row.validated_at ? moment(scope.row.validated_at).format('YYYY-MM-DD') : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="Expired At" width="200">
        <template #default="scope">
          {{ scope.row.expired_at ? moment(scope.row.expired_at).format('YYYY-MM-DD') : '' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="Confirm" min-width="280">
        <template #default="scope">
          <span v-if="!scope.row.confirm && scope.row.other_customer != null"><i class="uil uil-dna"
              style="color: #777; font-size: 16px;"></i></span>
           <span v-if="scope.row.confirm && scope.row.other_customer != null"><i class="uil uil-check mr-1"
              style="color:var(--color-success); font-size: 16px;"></i></span>
          <span v-if="scope.row.confirm && scope.row.other_customer == null" @click="handleCancel(scope.row.id)"
            class="has-hover"><i class="uil uil-check mr-1"
              style="color:var(--color-success); font-size: 16px;"></i></span>
          <span v-if="!scope.row.confirm && scope.row.other_customer == null" @click="handleConfirm(scope.row.id)"
            class="has-hover"><i class="uil uil-square" style="color: #777; font-size: 15px;"></i></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import moment from 'moment';
import { ElTable, ElTableColumn, ElInput, ElButton } from 'element-plus';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import {
  ref,
  onBeforeMount,
  computed,
  watchEffect,
  onMounted,
  onBeforeUnmount
} from 'vue';

const discountLoading = ref(false);
const route = useRoute();
const customer = route.params.tag;
const search = ref('');
const discountData = ref([])
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY-MM-DD');
};

const compareDatesDesc = (a, b) => {
  const dateA = moment(a.created_at);
  const dateB = moment(b.created_at);
  if (dateA.isBefore(dateB)) return 1;
  if (dateA.isAfter(dateB)) return -1;
  return 0;
};
const filteredData = computed(() => {
  let filtered = discountData.value.filter((data) => {
    return !search.value ||
      (data.adv_name && data.adv_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.code && data.code.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.adv_code && data.adv_code.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.establishment_name && data.establishment_name.toLowerCase().includes(search.value.toLowerCase())) ||
      (data.contact_email && data.contact_email.toLowerCase().includes(search.value.toLowerCase()));
  });

  return filtered.sort(compareDatesDesc);
});

const displayMetricOrCurrency = (amount = null, metric = null, currency = null) => {

  if(amount) {

    if (metric) {

      switch(metric.toLowerCase()) {
        case 'percent':
          return '%';
        default:
          return currency;
      }
    } 
  }
}

const handleConfirm = async (value) => {
  const response = await new Promise((resolve) => {
    services.post_Record(`/customer/establishments/advantagecontacts/${value}/enable`, {}, (response) => {
      resolve(response)
    }, false);
  });
  if (response.status == 200) {
    discountData.value = discountData.value.map((adv) => {
      if (adv.id == value) {
        adv.confirm = true;
      }
      return adv;
    })
  }
};

const handleCancel = async (value) => {
  const response = await new Promise((resolve) => {
    services.post_Record(`/customer/establishments/advantagecontacts/${value}/disable`, {}, (response) => {
      resolve(response)
    }, false);
  });
  if (response.status == 200) {
    discountData.value = discountData.value.map((adv) => {
      if (adv.id == value) {
        adv.confirm = false;
      }
      return adv;
    })
  }
};


onBeforeMount(async () => {
  try {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/establishments/advantagecontacts?tag=${customer}`, (response) => {
        resolve(response);
      });
    });

    if (response.status === 200) {
      const data = response.data
      if(route?.query?.adv_name) {
        discountData.value = data.filter((adv) => adv.adv_name === route.query.adv_name);
      } else {
        discountData.value = data;
      }

    } else {
      console.error('Error fetching contacts:', response);
    }
  } catch (error) {
    console.error('Error in onBeforeMount:', error);
  }
});

const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
<style scoped>
/*button i {
  color: var(--color-danger);
}

button {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 10px;
  border-radius: 5px;
  border: 1px solid grey;
  margin-bottom: 10px;
}

button:hover {
  background-color: var(--color-primary);
  color: white;
}*/

.has-hover:hover {
  cursor: pointer;
}

.search {
  display: flex;
  max-width: 150px;
  float: right;
}

@media screen and (max-width: 768px) {
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