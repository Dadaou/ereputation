<template>
<div class="main__container" v-if="exist">
    <HeadComponent :page="page"></HeadComponent> 
    <div class="advantage__qrc_content">
        <div class="qrcode">
             <vue-qrious
            class="qr__code"
                :value="`${baseurl}/customer/${route.params.tag}/establishment/${route.params.tag}/advantagecontact/${route.params.discountTag}/enable`"
                @change="onDataUrlChange"
            />
        </div>
        <div class="adv__info">
            <h2>{{ advantages.adv_name }}</h2>
            <table v-if="advantages">
                 <tr>
                    <th>Establishment</th>
                    <td>{{ advantages.establishment_name }}</td>
                </tr>
                <tr>
                    <th>Amount</th>
                    <td>{{ advantages.adv_amount }}</td>
                </tr>
               <!--  <tr>
                    <th>Category</th>
                    <td>{{ advantages.adv_category }}</td>
                </tr> -->
                <tr>
                    <th>Scope</th>
                    <td>{{ advantages.adv_scope }}</td>
                </tr>
                <tr>
                    <th>Code</th>
                    <td>{{ advantages.code }}</td>
                </tr>
                <tr>
                    <th>Expires At</th>
                    <td>
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400">
                                <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                                </svg>
                                {{ moment(advantages.expired_at).format('YYYY/MM/DD') }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>Customer Name</th>
                    <td>{{ advantages.contact_firstname }} {{ advantages.contact_lastname }}</td>
                </tr>
            </table>
           <button @click="downloadQrcode">
                <i class="uil uil-download-alt"></i>
                QR Code
            </button>
        </div>
    </div>
</div>
<EstablishmentNotFound v-else/>
</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount } from 'vue';
import VueQrious from 'vue-qrious';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js";
import { useRoute } from "vue-router";
import services from '@Services/services.js';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import 'element-plus/es/components/date-picker/style/css';

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const page=ref({
	title1: "",
    title2: "Discount QR Code",
    icon: "uil-qrcode-scan",
});

const route = useRoute();
const baseurl = window.location.origin
const base64Image = ref(null)
const qrcode = ref(null)
const advantage = ref({
   amount: "15",
   category: "test",
   code: "XYZ18",
   establishment_name: "Canyon Southwest Cafe",
   establishment_tag: "659c080d0c54d",
   expired_at: "2024-02-29 00:00:00",
   name: "advantage 1", 
   scope: "individual",
})

const advantages = ref(null)

const userStore = useUserStore();

const downloadQrcode = ()=>{
    let link = document.createElement('a');
    link.download = `${advantages.value.adv_name}-${advantages.value.contact_firstname}-discount-link.jpeg`;
    link.href = base64Image.value;
    link.click();
    downloaded.value = true;
}

const onDataUrlChange = (dataUrl) =>{
      base64Image.value = dataUrl;
};

onBeforeMount(async () => {
    if (userStore.authenticated == null) services.setToken(import.meta.env.VITE_APP_TOKEN);
   
  
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantagecontacts/${route.params.discountTag}`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            advantages.value = response.data[0];
            console.log(advantages.value)
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>

<style scoped>
.advantage__qrc_content {
    display: flex;
    flex-direction: column;
   /* align-items: center;*/
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
  /*  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);*/
   /* margin: 20px;*/
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

.adv__info {
    text-align: center;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
   /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);*/
    overflow-x: auto;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/*.adv__info:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}*/

.adv__info h2 {
    /*color: #4a4a4a;*/
    color: #007bff;
    margin-bottom: 15px;
    font-size: 1.2em;
    font-weight: 600;
    text-transform: uppercase;
}

.adv__info table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-family: 'Arial', sans-serif;
}

.adv__info th, .adv__info td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
}

.adv__info th {
    font-weight: bold;
    background-color: #f0f0f0;
    color: #333;
}

.adv__info td span {
    font-weight: normal;
    color: #555;
}

.adv__info button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    font-weight: 500;
    border-radius: 5px;
    cursor: pointer;
    font-size: 15px;
    margin-top: 20px;
    transition: background-color 0.3s, transform 0.2s;
}

.adv__info button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

/* Media queries */
@media (min-width: 768px) {
    .advantage__qrc_content {
        flex-direction: row;
    }

    .qrcode {
        margin-bottom: 0;
        margin-right: 20px;
    }

    .adv__info {
        text-align: left;
        max-width: 400px;
    }
}

@media (max-width: 768px) {
    .adv__info table {
        width: auto;
    }
}
</style>