<template>
	<div class="flex items-center md:order-2" ref="menuContainer">
		<button type="button" @click="toggleDropdown" class="flex mr-3" id="user-menu-button" aria-expanded="false"
			data-dropdown-placement="bottom">
			<span class="sr-only">Open user menu</span>
			<div class="relative w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
				<span class="font-medium initial" id="userinitial">{{ user.initial }}</span>
			</div>
		</button>
		<!-- Dropdown menu -->
		<transition name="fade" enter-active-class="animate__animated animate__fadeInRight"
			leave-active-class="animate__animated animate__fadeOutRight">
			<div v-if="showDropdown" id="user-dropdown">
				<div class="px-4 py-3">
					<span class="block text-sm text-gray-900 dark:text-white">{{ user.name }}</span>
					<span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ user.email }}</span>
				</div>
				<ul class="py-2" aria-labelledby="user-menu-button">
					<li @click="closeDropdown" v-if="customer">
						<RouterLink :to="`/customer/${customer.tag}/account/personal_details`"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<i class="uil uil-user-square"></i>
							Profile
						</RouterLink>
					</li>
					<li @click="closeDropdown" v-if="customer">
						<RouterLink :to="`/customer/${customer.tag}/account/my_qrcodes`"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<i class="uil-qrcode-scan"></i>
							My QrCOde
						</RouterLink>
					</li>
					<li @click="closeDropdown" v-if="customer" class="masquer">
						<RouterLink :to="`/customer/${customer.tag}/account/statistique`"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<i class="uil-analytics"></i>
							Analytics
						</RouterLink>
					</li>
					<li @click="closeDropdown" v-if="customer">
						<RouterLink :to="`/customer/${customer.tag}/account/contact`"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<i class="uil uil-envelope"></i>
							Contacts
						</RouterLink>
					</li>
					<li @click="closeDropdown" v-if="customer">
						<RouterLink :to="`/customer/${customer.tag}/account/parameters`"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<i class="uil uil-setting"></i>
							Parameters
						</RouterLink>
					</li>
					<li @click="closeDropdown">
						<RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							@click="$emit('signOut')">
							<i class="uil uil-signout"></i>
							Sign out
						</RouterLink>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { useUserStore } from "@Stores/user.js";
import { ref, onMounted, onUnmounted } from 'vue';
const userStore = useUserStore();
const props = defineProps({
	user: {
		type: Object,
		required: true,	
	},
	customer: {
		required: true,
	}
});

const emits = defineEmits(['signOut'])

const showDropdown = ref(false);
const menuContainer = ref(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const handleClickOutside = (event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
#user-dropdown {
  position: absolute;
  top: 3.9rem;
  right: 1rem;
  background: var(--color-white);
  z-index: 12;
  border-radius: 1rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity:  0;
}

.initial{
	color: rgb(253, 254, 255);
}
.initial_scroll{
  color:  var(--color-bgp);
}
.animate__animated.animate__fadeInRight {
  --animate-duration: 0.5s;
}

.animate__animated.animate__fadeOutRight {
  --animate-duration: 1s;
}
.masquer{
	display: none ; 
}
</style>
