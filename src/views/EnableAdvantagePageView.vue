<template>
<div class="main__container" v-if="exist">
    <HeadComponent :page="page"></HeadComponent> 
    <div class="discount__interface">
	    <!-- Form for entering the discount code -->
	    <form id="competitorForm" @submit.prevent="submit" @keydown.enter.prevent="submit" class="feedback__form">
	    	<!-- Display section for discount details -->
	        <div class="discount__details">
	            <h2 class="details-title">Advantage Details</h2>
	            <div v-if="discountDetails">
	                <p><strong><i class="uil uil-bill"></i></strong> {{ discountDetails.adv_name }}</p>
	                <p><strong><i class="uil uil-user"></i></strong> {{ discountDetails.contact_firstname }} {{ discountDetails.contact_lastname }}</p>
	                <!-- Additional details as required -->
	            </div>
	            <div v-else>
	                <p>No details available. Please enter a code.</p>
	            </div>
	        </div>
	        <div class="form-section">
	            <label for="code" class="form-label">Enter the code <span>*</span></label>
	            <input type="text" id="code" name="code" v-model="code"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
	        </div>
	        <div class="form-submit">
	            <button type="submit"
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                    <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span v-if="showSpinner">Loading
                        ...</span>
                    <span v-show="!showSpinner"><i class="uil uil-save"></i> Submit</span>
                </button>
	        </div>
	    </form>
	</div>
</div>
<EstablishmentNotFound v-else/>
</template>

<script setup>
import { ref, defineAsyncComponent, onBeforeMount } from 'vue'
import HeadComponent from '@Components/layouts/HeadComponent.vue'
import { useUserStore } from "@Stores/user.js"
import { useRoute } from "vue-router"
import services from '@Services/services.js'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

let exist = ref(true);
const EstablishmentNotFound = defineAsyncComponent(()=>
    import("@Views/EstablishmentNotFound.vue")
)

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const page=ref({
	title1: "",
    title2: "Discount",
    icon: "uil uil-bill",
})

const showSpinner = ref(false)
const code = ref('')
const route = useRoute()
const discountDetails = ref(null)
const userStore = useUserStore()

const submit = ()=>{
	const data = {
	  "expiredAt": moment().format('YYYY-MM-DD'),
	}
	showSpinner.value = true
	if(code.value == '4321'){
		if(discountDetails.value){
		services.patchRecord('advantage_contacts', discountDetails.value.id, data, response=>{
				console.log(response)
				if(response.status == 200){
					ElMessage({
		                message: `Advantage ${discountDetails.value.adv_name} validates to ${discountDetails.value.contact_firstname} ${discountDetails.value.contact_lastname}`,
		                type: 'success',
		            });
		            code.value = ''
					showSpinner.value = false
				}
		    })
		}
	}else {
		ElMessage.error(`Please, provide the right code`)
		showSpinner.value = false
	}
}

onBeforeMount(async () => {
    if (userStore.authenticated == null) services.setToken(import.meta.env.VITE_APP_TOKEN);
   
  
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(`customer/establishments/advantagecontacts/${route.params.discountTag}`, (response) => {
                resolve(response);
            });
        });

        if (response.status === 200) {
            discountDetails.value = response.data[0];
        } else {
            console.error('Error fetching advantages:', response);
        }
    } catch (error) {
        console.error('Error in onBeforeMount:', error);
    }
});
</script>

<style scoped>
.form-section span{
    color: var(--color-danger);
}

.discount__interface {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    margin-top: 2rem;
}

.feedback__form {
    display: flex;
    flex-direction: column;
}

.form-section, .discount__details, .form-submit {
    margin-bottom: 20px;
}

.form-label {
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 5px;
}

.form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.details-title {
    color: #007bff;
    margin-bottom: 10px;
}

.discount__details p {
    margin-bottom: 10px;
    line-height: 1.5;
    color: #333;
}

.discount__details strong {
    font-weight: bold;
}

.submit-button {
    padding: 10px 15px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #0056b3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .feedback__form {
        flex-direction: column;
    }
}

</style>