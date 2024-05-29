<template>
    <div class="main__container">
        <div class="container mx-auto">
            <div
                class="validation__qrc_content w-full max-w-md mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-5 px-4 md:px-8 lg:px-16 xl:px-20 rounded-lg shadow-md relative">
                <h3 class="text-xl font-semibold mb-4">🔍 Validate the coupon</h3>
                <div class="w-full flex flex-col items-center space-y-4 mb-6">
                    <label for="couponCode" class="text-white">Enter Coupon Code:</label>
                    <input v-model="couponCode" id="couponCode" type="text" placeholder="Coupon Code"
                        class="input-field form-input mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
                    <button @click="submit" type="submit"
                        :class="['btn btn__light2', showSpinner == true ? 'isLoaded' : '']">
                        <SpinnerComponent v-if="showSpinner == true" :color="'red'" />
                        <span v-else>Submit</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount } from 'vue';
import services from '@Services/services.js';
import { useRouter } from "vue-router"
import { useUserStore } from "@Stores/user.js";
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const couponCode = ref('');
const showSpinner = ref(false);
const userStore = useUserStore();
const router = useRouter();

const submit = async () => {
    showSpinner.value = true;
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`public/customer/establishments/advantagecontacts/list?code=${couponCode.value}`, (response) => {
                resolve(response);
            }, true);
        });

        if (response.status === 200) {
            const discount = response.data[0]
            showSpinner.value = false;
            router.push({
                name: 'DiscountQRCodeValidation',
                params: {
                    etab: discount.establishment_tag,
                    discountTag: discount.tag
                },
            });
        } else {
            ElMessage({
                message: `Advantage contacts not found.`,
                type: 'warning',
            });
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
};
</script>

<style scoped>
.validation__qrc_content {
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    margin-top: 2rem;
}

.input-field {
    border: 1px solid #fff;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    color: black;
}

.btn-validate {
    background-color: #4caf50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.btn-validate:hover {
    background-color: #45a049;
}

input {
    caret-color: var(--color-primary) !important;
}
</style>
