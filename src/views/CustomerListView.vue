<template>
	 <div v-if="!dataLoading">
        <div class="client__container__head" v-if="customers.length > 0">
           Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, all customers related to you are listed bellow. <span>({{ customers.length }} found)</span>
        </div>
        <div class="client__container__head" v-else>
           Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, no customer associated with you.
        </div>
    </div>
    <div v-else>
        <div class="client__container__head">
            Welcome <b>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</b>, your establishments are listed bellow.
        </div>
    </div>
    <div class="customer-list" v-if="customers.length > 0">
    	<customerComponent v-for="customer in customers" :key="customer.name" :customer="customer"/>
       <!--  <suspense>
            <establishments-list-component :establishments="establishments" />
            <template #fallback>
                <establishment-list-loaded-component :nb="3" />
            </template>
        </suspense> -->
    </div>
</template>
<script setup>
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { useUserStore } from "@Stores/user.js";
import services from '@Services/services.js';
import { useAppStore } from "@Stores/app.js";

const customerComponent = defineAsyncComponent(() =>
    import('@Components/utils/CustomerComponent.vue')
)
const userStore = useUserStore();
const appStore = useAppStore();
const customers = ref([]);
const dataLoading = ref(false);

const loadCustomer = async(partner)=>{
	appStore.isLoading = true
	const response = await new Promise((resolve) => {
        services.get_Record(`partner/customer?id=${partner}`, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
    	response.data.forEach(item=>{
    		customers.value.push({
    			name: item.name,
			  	address: `${item.zipcode} ${item.city}`,
			  	country: item.country,
			  	tag: item.tag
    		})
    	})
        appStore.isLoading = false
    }
};

onBeforeMount(async()=>{
	const partner= userStore.user.partner
	if(partner){
		await loadCustomer(partner.id);
	}
});

</script>
<style scoped>
.customer-list{
	display: flex;
	flex-wrap: wrap;
}

.customer-list > div {
  flex: 1 0 50%;
  margin: 15px;
  box-sizing: border-box;
}
</style>