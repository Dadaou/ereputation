<template>
  <div class="relative overflow-x-auto" style="margin-top: 15px;">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
        <tr v-for="contact in contacts" :key="contact.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
</template>

<script setup>
import moment from 'moment';
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useRoute, useRouter } from "vue-router"; // Import manquant
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

const route = useRoute();
const customer = route.params.tag;
const formatCreatedAt = (createdAt) => {
  return moment(createdAt).format('YYYY/MM/DD');
};

const contacts = ref([]);
onBeforeMount(async () => {
  try {
    const response = await new Promise((resolve, reject) => {
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