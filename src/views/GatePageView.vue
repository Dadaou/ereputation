<template>
	<div class="main__container">
	    <div>
			<div class="filters mb-5 ml-2">
					<h4 v-for="(item, index) in categories" :key="index" @click="updateType(item.value)"
					:class="{ 'active': type === item.value }">
						<Icon :icon="item.icon" class="mr-1"/> {{ item.label }}
					</h4>
			</div>


			<div class="links">
				<div v-for="(link, index) in filteredLinks" :key="index">
					<a :href="link.value" target="_blank" >
						<div class="item-name">
							{{ link.name }}
						</div>
					</a>
				</div>
			</div>
			
	    </div>
	</div>
</template>
<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';

const route = useRoute();
const establishmentTag = route.params.id;

const links = ref([
    { name: "Lien 1", category: "menus", value: "https://example.com/link1" },
    { name: "Lien 2", category: "infos", value: "https://example.com/link2" },
    { name: "Lien 3", category: "reviews", value: "https://example.com/link3" },
    { name: "Lien 4", category: "offers", value: "https://example.com/link4" }
]);

const categories = [
 {label: "Menus", value: "menus", icon: "uim:th-large"},
 {label: "Infos", value: "infos", icon: "uil:info-circle"},
 {label: "Reviews", value: "reviews", icon: "uil:star"},
 {label: "Offers", value: "offers", icon: "bi:tags"},
 {label: "Others", value: "others", icon: "gravity-ui:circle-question"}
];

const type = ref("reviews");

const filteredLinks = computed(()=>{
 let data = links.value;
 if(type.value) data = data.filter(link=>{
 	if(type.value === 'others'){
 		return link.category === null
 	}

 	return link.category === type.value
 })

 return data;
});

const loadLinks = async(tag)=>{
	const uri = `/get/settings/category?tag=${tag}`
	const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    });

	console.log(response)
    if(response.status == 200) {
      links.value = response.data.links;
    }
};

onBeforeMount(async()=>{
	await loadLinks(establishmentTag)
});

const updateType = (value) => {
    type.value = value;
};
</script>
<style scoped>

.main__container > div{
	width: 50%;
	margin: 5rem auto;
}

.filters {
	display: flex;
}

h4 {
	display: flex;
	align-items: center;
	padding: .25rem;
	margin: .25rem;
	border-radius: 0.25rem;
	background-color: #0000000a;
	cursor: pointer;
	color: var(--color-bgp);
}

h4.active:hover,
h4.active {
     background-color: var(--color-bgp);
	 color: white;
}

.links {
    padding: .25rem;
	max-height: 300px;
	overflow-y: scroll;
 }

 .links::-webkit-scrollbar-track {
	background-color: white;
 }

 .links::-webkit-scrollbar-thumb {
	background-color: var(--color-bgp); 
 }

 a {
    text-decoration: none;
    color: black;
 }
 
 a .item-name {
	background-color: #0000000a;
	padding: .25rem;
	margin: .55rem;
	border-radius: .25rem;
 }

 h4:hover, 
 a .item-name:hover {
	background-color: rgba(128, 128, 128, 0.348);
	color: var(--color-bgp);
	transform: scale(1.01);
 }

 @media (max-width: 768px) {
	.main__container > div{
		width: 100%;
		margin: 1rem auto;
		flex-wrap: wrap;
	}
	h4 {
		font-size: 12px;
		margin: .07rem;
	}
}
</style>