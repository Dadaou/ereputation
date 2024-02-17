<template>
    <div class="app__message">
        <p v-if="userInfo.role !== 'user'">Welcome <b>{{ userInfo.name }}</b>, It seems you are not yet an active {{userInfo.role}}. To proceed further and access our services, kindly get in touch with our admin team.
        They will assist you in finalizing your registration and become a valued {{ userInfo.role }}.</p>
        <p v-else>
        	Welcome <b>{{ userInfo.name }}</b>, you have insufficient permissions to access this ressource. To proceed further and access our services, kindly get in touch with our admin team.
        </p>
        <button class="btn" @click="signOut">Disconnect</button>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useUserStore } from "@Stores/user.js";
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const signOut = () => {
	userStore.signOut();
    userStore.authenticated = false;
    if(userStore.authenticated === false) router.push({ name: "Login" });
};

const userInfo = computed(()=>{
	const user = userStore.user;
	const roles = user.roles;

	if (roles.includes("ROLE_PARTNER")) {
		   if(user.partner){
		   		return {
	           	name: user.partner.name,
	           	role: "partner"
	           }
		   }
    } else if (roles.includes("ROLE_CUSTOMER")) {
    		if(user.customer){
    			return {
	           	name: user.customer.name,
	           	role: "customer"
	           }
    		}
    } else {
           return {
           	name: `${user.firstname} ${user.lastname}`,
           	role: "user"
           }
    }
});
</script>
<style scoped>
.search__icon i {
    font-size: 30px;
    color: var(--color-danger);
}

.app__message p {
    margin: 15px auto;
}

.app__message button {
    border: 1px solid var(--color-danger);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    color: var(--color-danger);
}

.app__message button:hover {
    background-color: var(--color-danger);
    color: white;
}
</style>
