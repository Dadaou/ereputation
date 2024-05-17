<template>
  <button class="btn" @click="showExport = true">
    <i class="uil uil-file-download"></i>
    Export
  </button>
  <div class="overflow-x-auto">
    <table class="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            First Name
          </th>
          <th scope="col" class="px-6 py-3">
            Last Name
          </th>
          <th scope="col" class="px-6 py-3">
            Gender
          </th>
          <th scope="col" class="px-6 py-3">
            Email
          </th>
          <th scope="col" class="px-6 py-3">
            Establishment
          </th>
        </tr>
      </thead>
      <tbody v-if="contacts.length > 0">
        <tr v-for="contact in contacts" :key="contact.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ contact.firstname }}
          </td>
          <td class="px-6 py-4">
            {{ contact.lastname }}
          </td>
          <td class="px-6 py-4">
            {{ contact.gender }}
          </td>
          <td class="px-6 py-4">
            {{ contact.email }}
          </td>
          <td class="px-6 py-4">
            {{ contact.establishment_name }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="no__contacts">
          <td colspan="4">
            <div style="text-align: center;">
              <span>No contacts</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ExportcsvexcelComponent :showModal="showExport" :downloaded="downloaded"
    @close="showExport = false, downloaded = false" @submit="(data) => exportData(data.type, 'contacts')" />
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import csvXlsx from '@Services/csvXlsx.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { useCompanyStore } from "@Stores/company.js";
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
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY/MM/DD');
};
const query = ref('');

const contacts = ref([]);

const showExport = ref(false);
const downloaded = ref(false);
const exportData = (type, filename) => {
  csvXlsx.exportContact(type, filename, query.value,
    ['Id', 'Name', 'Gender', 'Email', 'Establishment', 'Date']);
  downloaded.value = true;
}


onBeforeMount(async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      query.value = `customer/establishments/contacts?tag=${customer}`;

      services.get_Record(`customer/establishments/contacts?tag=${customer}`, (response) => {
        resolve(response);
        console.log(response);
      });
    });

    if (response.status === 200) {
      contacts.value = response.data;
      console.log('Contacts:', contacts.value);
      console.log(contacts.value);
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
</style>