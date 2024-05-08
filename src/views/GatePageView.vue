<template>
	<div class="main__container">
	    <div>
            <div class="tablet_mobile__head">
    <div class="establishment__info">
        <h1 class="society__name" style="font-family: 'Script MT Bold'; font-size: 40px; font-weight: bold;">{{ establishment.name }}</h1>

        <div class="society__category">
            <i :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
            <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.category }}</span>
        </div>

        <div class="society__country" v-if="establishment.country != null">
            <i class="uil uil-map"></i>
            <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.country }}</span>
        </div>
        
        <div class="society__location">
            <i class="uil uil-location-point"></i>
            <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.city }}</span>
        </div>
        
                </div>
				<div class="photo">
                    <div v-if="establishment.url_source !== null" class="establishment__img">
                        <img :src="establishment.url_source" alt="" />
                    </div>
                    
                    <div v-else role="status"
                        class="flex items-center justify-center max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
			</div>

			<div class="filters mb-5 mt-5">
					<h4 v-for="(item, index) in categories" :key="index" @click="updateType(item.value)"
					:class="{ 'active': type === item.value }">
						<Icon :icon="item.icon" class="mr-1" style="font-size: 18px;"/> {{ item.label }}
					</h4>
			</div>
		
            <div  v-if="type === 'reviews'">
                <div class="review-content" @click="toggleList" :title="appStore.account.brand || ''">
                    <div v-if="appStore.account && appStore.account.logo" class="logo">
                        <img :src="appStore.account.logo">
                    </div>
                    <!-- <h4 class="mr-5">{{appStore.account.name}}</h4> -->
                </div>
                <div v-if="showList" class="card-container">
                    <div class="card-item">
                        <h4><i class="uil uil-link mr-1"></i>Establishment review</h4>
                        <div class="card-item-list">
                            <div v-for="(link, index) in filteredLinks" :key="index">
                                <div v-if="link.source === 'establishment'">
                                    <a :href="link.value" target="_blank" >
                                        <div class="item-name">
                                            {{ link.name }}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-item">
                        <h4><i class="uil uil-chat-bubble-user mr-1"></i>Staff review</h4> 
                        <div class="card-item-list">
                            <div v-for="(link, index) in filteredLinks" :key="index">
                                <div v-if="link.source === 'staff'">
                                    <a :href="link.value" target="_blank" >
                                        <div class="item-name">
                                            {{ link.name }}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-item">
                        <h4><i class="uil uil-clipboard-notes mr-1"></i>Service review</h4>
                        <div class="card-item-list">
                            <div v-for="(link, index) in filteredLinks" :key="index">
                                <div v-if="link.source === 'unit'">
                                    <a :href="link.value" target="_blank" >
                                        <div class="item-name">
                                            {{ link.name }}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			<!-- <div v-if="type !== 'reviews'" class="links">
				<div v-for="(link, index) in filteredLinks" :key="index">
					<a :href="link.value" target="_blank" >
						<div class="item-name">
							{{ link.name }}
						</div>
					</a>
				</div>
			</div> -->
			
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
import { useAppStore } from "@Stores/app.js"

const route = useRoute();
const establishmentTag = route.params.id;
const establishment = ref({});
const appStore = useAppStore();
const showList = ref(false);
let media = [];

const toggleList = () => {
  showList.value = !showList.value; 
};

const links = ref([
    { name: "Lien 1", category: "menus", value: "https://example.com/link1" },
    { name: "Lien 2", category: "Follow us", value: "https://example.com/link2" },
    { name: "Lien 3", category: "reviews", value: "https://example.com/link3" },
    { name: "Lien 4", category: "offers", value: "https://example.com/link4" }
]);

const categories = [
 {label: "Menus", value: "menus", icon: "uim:th-large"},
 {label: "Follow us", value: "Follow us", icon: "uil:info-circle"},
 {label: "Reviews", value: "reviews", icon: "uil:star"},
 {label: "Offers", value: "offers", icon: "bi:tags"}
];

const type = ref("menus");

const filteredLinks = computed(()=>{
 let data = links.value;

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
    await loadLinks(establishmentTag);
	services.setToken(import.meta.env.VITE_APP_TOKEN);
    await services.get_Record(`establishment/${route.params.id}/media`, (response) => {
        if (response.status == 200) {
            establishment.value = response['data'];
            media.value = response['data'].url_source == null ? [] : response['data'].url_source;
        }
    });
});

const updateType = (value) => {
    type.value = value;
};
</script>
<style scoped>

.main__container > div{
	width: 50%;
	margin: auto;
    padding: 10px;
}

.filters {
	display: flex;
}

.filters h4 {
	display: flex;
	align-items: center;
	padding: .5rem;
	margin: .25rem;
	border-radius: 025rem;
	background-color: #0000000a;
	cursor: pointer;
	color: var(--color-bgp);
}

.filters h4.active:hover,
.filters h4.active {
     background-color: var(--color-bgp);
	 color: white;
}

.links {
    padding: 25rem;
	max-height: 100px;
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
	padding: .55rem;
	margin: .55rem;
	border-radius: .55rem;
 }

 .filters h4:hover, 
 a .item-name:hover {
	background-color: rgba(128, 128, 128, 0.348);
	color: var(--color-bgp);
	transform: scale(1.01);
 }
 
.tablet_mobile__head {
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 100%;
    border-radius: 5px;
    font-size: 14px;
    border: 1px solid var(--light-color-bg2);
    padding: 5px;
}

.tablet_mobile__head img {
    height: 125px !important;
    display: flex;
}

.review-content {
    cursor:pointer;
    color: var(--color-bgp);
    display: flex;
    border-radius: 2.5rem;
    align-items: center;
    background-color: var(--light-color-bg2);
    margin-bottom: 1rem;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
}

.review-content:hover {
    background-color: color-mix(in srgb, var(--color-primary) 25%, white);
}

.logo {
    display:flex;
    height: 50px;
    padding: 8px;
}

.logo img {
    object-fit: cover;
    width: 100px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
}

.card-item {
    flex: 1;
    height: auto;
    border-radius: .25rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-item h4 {
    background-color: color-mix(in srgb, var(--color-primary) 25%, white);
    padding: .5rem;
    border-radius: .5rem .5rem 0 0;
}

.card-item-list {
    max-height: 250px;
	overflow-y: scroll;
}

.card-item-list::-webkit-scrollbar-track {
	background-color: white;
 }

 .card-item-list::-webkit-scrollbar-thumb {
	background-color: grey; 
 }

 @media (max-width: 768px) {
	.main__container > div{
		width: 100%;
		margin: .75rem auto;
		flex-wrap: wrap;
	}
	.filters h4 {
		margin: .07rem;
	}
    .card-container {
        display:block;
    }
    .card-item {
        margin-top: 1rem
    }
}

.society__category {
        margin-top: 1px;
        margin-bottom: 10px; 
        border-bottom: 1px solid #ccc; 
        padding-bottom: 10px; 
    }

   
    .society__country {
        margin-bottom: 10px; 
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px; 
    }

  
    .society__location {
        margin-bottom: 10px; 
        border-bottom: 1px solid #ccc; 
        padding-bottom: 10px; 
    }
    .society__name {
        margin-top: -10px; 
        margin-left: 20px;
    }
    .logo-mv {
    width: auto; 
    height: 120px; 
    }
    .establishment__img {
    width: 100%;  
    height:10%; 
    }
</style>