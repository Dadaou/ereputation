<template>
	<div v-if="userStore.customer">
		<div v-if="!dataLoading">
	        <div class="client__container__head" v-if="establishments.length > 0">
	           Welcome, <b>{{ userStore.customer.name }}</b>! Your establishments are listed below. <span>({{ establishments.length }} found)</span>
	        </div>
	        <div class="client__container__head" v-else>
	           Welcome , <b>{{ userStore.customer.name }}</b>! No companies found yet.
	        </div>
	    </div>
	    <div v-else>
	        <div class="client__container__head">
	            Welcome, <b>{{ userStore.customer.name }}</b>! Your establishments are listed below. <span>({{ establishments.length }} found)</span>
	        </div>
	    </div>
	    <div class="society__list mt-5" v-if="establishments.length > 0">
	        <suspense>
	            <establishments-list-component :establishments="establishments" :tag='customerTag'/>
	            <template #fallback>
	                <establishment-list-loaded-component :nb="3" />
	            </template>
	        </suspense>
	    </div>
	</div>
	<div v-else>
		We're sorry, but we couldn't find the customer associated with the provided tag. Please double-check the tag and try again. If you continue to experience issues, please contact our support team for assistance.
	</div>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, defineAsyncComponent, inject, computed } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useUserStore } from "@Stores/user.js";
import { useCompanyStore } from "@Stores/company.js";
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import EstablishmentListLoadedComponent from '@Components/utils/EstablishmentListLoadedComponent.vue';
import { useRouter, useRoute } from "vue-router";
import services from '@Services/services.js';


const EstablishmentsListComponent = defineAsyncComponent(() =>
    import('@Components/utils/EstablishmentsListComponent.vue')
)

const userStore = useUserStore();
const appStore = useAppStore();
const companiesStore = useCompanyStore();
const establishments = ref([]);
const dataLoading = ref(true);
const router = useRouter();
const customerTag = inject('tag');
const customer = ref(null)

const loadCustomer = async(partner)=>{
	appStore.isLoading = true
	const response = await new Promise((resolve) => {
        services.get_Record(`partner/customer?id=${partner}`, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
    	response.data.forEach(item=>{
    		if(item.tag == customerTag.value){
	    		userStore.customer = {
	    			name: item.name,
				  	address: `${item.zipcode} ${item.city}`,
				  	country: item.country,
				  	tag: item.tag
	    		}
    		}
    	})
        appStore.isLoading = false
    }
};

onBeforeMount(async () => {
    appStore.isLoading = true;
    dataLoading.value = true;

    if(userStore.user.roles.includes("ROLE_PARTNER") && userStore.user.partner && userStore.customer.tag !== customerTag.value){
    	userStore.customer = null
    	await loadCustomer(userStore.user.partner.id)
    }
});

onMounted(async()=>{
	if (userStore.user) {
        companiesStore.getEstablishments(customerTag.value).then((data) => {
            establishments.value = data;
            if(userStore.user.customer){
                userStore.user.customer['establishments'] = establishments.value;
                userStore.customer = userStore.user.customer
            }
            dataLoading.value = false
        })
    } else appStore.isLoading = false;
});
</script>
<style scoped>
.establishment__link label,
.establishment__link {
    cursor: pointer !important;
}

.first {
    border-right: 2px solid var(--light-color-bg1)
}

/*.client__container {
    position: relative;
    top: 1rem;
    height: inherit;
    display: flex;
    gap: 1rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}*/

.search__icon i {
    font-size: 30px;
    color: var(--color-danger);
}

.search__icon .line {
    font-size: 30px;
    background-color: var(--color-bg2);
    height: 2px;
    width: 40px;
}

.client__container__head {
    font-size: 19px;
    color: var(--color-bg2);
    transform: var(--transition);
}

.client__container__head div,
.client__container__head span {
    font-size: 15px;
    font-weight: bold;
}

.society__list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-self: center;
    transform: var(--transition)
}

.list__actions button:hover {
    background-color: var(--color-primary);
}

/*@media screen and (max-width:1163px) {
    .client__container {
        width: 55% !important;
    }
}

@media screen and (max-width:1163px) {
    .client__container {
        width: 60% !important;
    }
}

@media screen and (max-width:964px) {
    .client__container {
        width: 65% !important;
    }
}

@media screen and (max-width:884px) {
    .client__container {
        width: 70% !important;
    }

    .client__container__head {
        font-size: 18px;
    }
}

@media screen and (max-width:779px) {
    .client__container {
        width: 80% !important;
    }

    .client__container__head {
        font-size: 16px;
    }
}

@media screen and (max-width:670px) {
    .client__container {
        width: var(--container-width-md) !important;
    }
}

@media screen and (max-width:600px) {
    .client__container__head {
        font-size: 15px;
    }
}*/
</style>