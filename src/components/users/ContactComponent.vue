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
              Created At
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
                {{ formatCreatedAt(contact.created_at) }}           
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
  import { ref, onBeforeMount } from 'vue';
  import services from '@Services/services.js';
  import moment from 'moment';

  const formatCreatedAt = (createdAt) => {
  // Utilisez moment pour formater la date, ou utilisez une autre méthode si vous préférez
  return moment(createdAt).format('YYYY/MM/DD');
};
  const contacts = ref([]);
  
  onBeforeMount(async () => {
    try {
      const response = await new Promise((resolve, reject) => {
        services.get_Record(`contacts`, (response) => {
          resolve(response);
        });
      });
  
      if (response.status === 200) {
        contacts.value = response.data['hydra:member'];
        console.log('Contacts:', contacts.value);
      } else {
        console.error('Error fetching contacts:', response);
      }
    } catch (error) {
      console.error('Error in onBeforeMount:', error);
      // Gérez les erreurs ici
    }
  });
  </script>
  