<template>
    <div class="main__container" v-if="exist">
        <div class="container mx-auto advantage__qrc_content">
            <div
                class="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
                <h5 class="text-xl font-semibold mb-4">{{ $t("coupon.coupon_expirer") }}</h5>

                <br>
                <h3 class="text-xl font-semibold mb-4 mt-4" v-if="advantages">{{ advantages.adv_name }} <br>{{
                    advantages.establishment_name }}</h3>

                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6">
                </div>
                <div class="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6">
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import services from '@Services/services.js';

import 'element-plus/es/components/date-picker/style/css';


let exist = ref(true);
const route = useRoute();
const advantages = ref(null)

onBeforeMount(async () => {
    appStore.header = false;

    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`public/customer/establishments/advantagecontacts/list?tag=${route.params.discountTag}`, (response) => {
                resolve(response);
            }, true);
        });

        if (response.status === 200) {
            advantages.value = response.data[0];
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:2', error);
    }
});
</script>

<style scoped>
.head__container {
    background-color: transparent !important;
}

.bg-gradient-to-br {
    background: linear-gradient(45deg, #f75842, #f96a57);
}

.btn-copy,
.btn-download,
.btn-copy2 {
    border: 1px solid #fff;
    background-color: #fff;
    color: #6B46C1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.btn-copy2,
.btn-copy:hover,
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

img {
    height: 50px;
    object-fit: cover;
    width: 100%;
}

#qrcode__container {
    padding: 5px;
}

img.qr__code {
    width: 200px;
    height: 200px;
    border: 1px solid #ddd;
    padding: 25px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 20px;
}
</style>