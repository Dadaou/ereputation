<template>
	
	<div class="main__container" v-if="exist">
  <div class="container mx-auto advantage__qrc_content">
    <div class="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
      <div class="flex flex-col lg:flex-row justify-center items-center lg:space-x-8">
        <div class="adv-details mb-8 lg:mb-0">
          <h3 class="text-xl font-semibold mb-4" v-if="advantages">{{ advantages.adv_name }} <br>{{ advantages.establishment_name }}</h3>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 info-table">
              <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Advantage Attribute
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody v-if="advantages">
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Customer
                  </th>
                  <td class="px-6 py-4">
                    {{ advantages.contact_firstname }}  {{ advantages.contact_lastname }}
                  </td>
                </tr>
                <!-- <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Category
                  </th>
                  <td class="px-6 py-4">
                    {{ advantages.adv_category }}
                  </td>
                </tr> -->
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Code
                  </th>
                  <td class="px-6 py-4">
                    {{ advantages.code }}
                  </td>
                </tr>
                 <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Expires
                  </th>
                  <td class="px-6 py-4">
                    {{  moment(advantages.expired_at).format("DDMMM, YYYY") }}
                  </td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700" v-if="valid">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Validated at 
                  </th>
                  <td class="px-6 py-4">
                    {{  moment(advantages.validated_at).format("DDMMM, YYYY") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button v-if="!valid" id="cpnBtn2" class="btn-copy mt-6" @click="submit">Validate <i class="uil uil-check"></i></button>
    </div>
  </div>
</div>


<EstablishmentNotFound v-else/>
</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount } from 'vue'
import { useUserStore } from "@Stores/user.js"
import { useRoute } from "vue-router"
import services from '@Services/services.js'
import moment from 'moment';
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const showSpinner = ref(false)
const code = ref('')
const route = useRoute()
const advantages = ref(null)
const userStore = useUserStore()
const valid = ref(true)

const submit = ()=>{
	const data = {
	  "validatedAt": moment().format('YYYY-MM-DD'),
    "confirm": true,
	}
	showSpinner.value = true
	if(advantages.value){
		services.patchRecord('advantage_contacts', advantages.value.id, data, response=>{
				console.log(response)
				if(response.status == 200){
					ElMessage({
		                message: `Advantage ${advantages.value.adv_name} validates to ${advantages.value.contact_firstname} ${advantages.value.contact_lastname}`,
		                type: 'success',
		            });
		            code.value = ''
					showSpinner.value = false
					valid.value = true
					advantages.value.validated_at = moment().format('YYYY-MM-DD');
				}
		    })
	}
  localStorage.setItem('isSellerAuthenticated', 'true');
}

onBeforeMount(async () => {
    if (userStore.authenticated == null) services.setToken(import.meta.env.VITE_APP_TOKEN);
   
  
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantagecontacts/list?tag=${route.params.discountTag}`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            advantages.value = response.data[0];
            valid.value = advantages.value.validated_at == null?false:true
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>

<style scoped>
.info-table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 1rem;
}

.info-table th,
.info-table td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.info-table tr {
  background-color: white;
  color: black;
}

/* Responsive Flex Container */
@media screen and (max-width: 1024px) {
  .adv-details, .qr__code {
    text-align: center;
  }

  .adv-details {
    width: 100%;
  }
}


/*.bg-gradient-to-br {
  background: linear-gradient(45deg, #f75842, #f96a57); 
}
*/
.btn-copy,
.btn-download, .btn-copy2 {
    border: 1px solid #fff;
    background-color: #fff;
    color: #6B46C1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.btn-copy2, .btn-copy:hover,
.btn-download:hover {
    background-color: #6B46C1;
    color: #fff;
    border-color: #6B46C1;
}

.btn-download {
    margin-top: 8px;
}

.advantage__qrc_content {
    padding: 20px;
    border-radius: 10px;
    margin-top: 2rem;
}

.qrcode {
    padding: 10px;
   /* border: 1px solid #ddd;*/
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}

.qr__code {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}

</style>