<template>
  <!--  <button class="btn" @click="showExport = true">
          <i class="uil uil-file-download"></i>
          Export
    </button> -->
  <div class="overflow-x-auto">
    <table class="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Establishment
          </th>
          <th scope="col" class="px-6 py-3">
            Advantage name
          </th>
          <th scope="col" class="px-6 py-3">
            Code
          </th>
          <th scope="col" class="px-6 py-3">
            Amount
          </th>
          <th scope="col" class="px-6 py-3">
            Validated at
          </th>
          <th scope="col" class="px-6 py-3">
            Expired at
          </th>
          <th scope="col" class="px-6 py-3">
            Confirm
          </th>
        </tr>
      </thead>
      <tbody v-if="discountData.length > 0">
        <tr v-for="discount in discountData" :key="discount.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ discount.establishment_name }}
          </td>
          <td class="px-6 py-4">
            {{ discount.adv_name }}
          </td>
          <td class="px-6 py-4">
            {{ discount.code }}
          </td>
          <td class="px-6 py-4">
            {{ discount.adv_amount }}
          </td>
          <td class="px-6 py-4" v-if="discount.validated_at">
            {{ moment(discount.validated_at).format('YYYY-MM-DD') }}
          </td>
           <td class="px-6 py-4" v-else>
            -
          </td>
          <td class="px-6 py-4">
            {{ moment(discount.expired_at).format('YYYY-MM-DD') }}
          </td>
          <td class="px-6 py-4 text-center">
            <span v-if="discount.confirm" @click="handleCancel(discount.id)" class="has-hover"><i
                class="uil uil-check-square"></i></span>

            <span v-else @click="handleConfirm(discount.id)" class="has-hover"><i class="uil uil-square"
                style="color: #777; font-size: 20px;"></i></span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="no__contacts">
          <td colspan="4">
            <div style="text-align: center;">
              <span>No Discount coupons available</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
    @close="showExport = false, downloaded = false"  @submit="(data) => exportData(data.type, 'contacts')"/> -->
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import csvXlsx from '@Services/csvXlsx.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import DropdownComponent from '@Components/utils/DropdownComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import StaffItemComponent from '@Components/staffs/StaffItemComponent.vue';
import { useWindowSize } from '@vueuse/core';
import {
  ref,
  reactive,
  watch,
  onBeforeMount,
  computed,
  provide,
  onUpdated,
  defineAsyncComponent
} from 'vue';

const ExportcsvexcelComponent = defineAsyncComponent(() =>
  import('@Components/utils/ExportcsvexcelComponent.vue')
)

const route = useRoute();
const customer = route.params.tag;
// const formatCreatedAt = (createdAt) => {
//   return moment(createdAt).format('YYYY/MM/DD');
// };
// const query = ref('');

// const contacts = ref([]);

// const showExport = ref(false);
// const downloaded = ref(false);
// const exportData = (type, filename) => {
//   csvXlsx.exportContact(type, filename, query.value,
//     ['Id','Name', 'Gender', 'Email', 'Establishment', 'Date']);
//   downloaded.value = true;
// }

const discountData = ref([])

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
    const response = await new Promise((resolve, reject) => {
      // query.value = `customer/establishments/advantagecontacts?tag=${customer}`;

      services.get_Record(`customer/establishments/advantagecontacts?tag=${customer}`, (response) => {
        resolve(response);
        console.log(response);
      });
    });

    if (response.status === 200) {
      discountData.value = response.data;
      console.log(response.data)

    } else {
      console.error('Error fetching contacts:', response);
    }
  } catch (error) {
    console.error('Error in onBeforeMount:', error);
  }
});
</script>
<style scoped>
button i {
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
}

.has-hover:hover {
  cursor: pointer;
}
</style>