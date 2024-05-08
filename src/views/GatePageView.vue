<template>
    <div v-if="exist" class="feedback__form">
        <div class="tablet_mobile__head">
            <div class="establishment__info">
                <h1 class="society__name">{{ establishment.name }}</h1>
                <div class="society__category">
                    <i
                        :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                    <span class="ml-2">{{ establishment.category }}</span>
                </div>
                <div class="society__country" v-if="establishment.country != null">
                    <i class="uil uil-map"></i>
                    <span class="ml-2">{{ establishment.country }}</span>
                </div>
                <div class="society__location">
                    <i class="uil uil-location-point"></i>
                    <span class="ml-2">{{ establishment.city }}</span>
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
        <div class="feedback">
            <div class="grid gap-0 my-6 md:grid-cols-4 grid-cols-2">
                <GateMenuComponent v-for="item in categories" :item="item" :key="item.title" @select="openMenu(item)" />
            </div>
        </div>
    </div>
    <EstablishmentNotFound v-else />

    <!--         

                    <div class="society__category">
                        <i
                            :class="['uil', establishment.category == 'Restaurant' ? 'uil-restaurant' : '', establishment.category == 'Hotel' ? 'uil-bed-double' : '', establishment.category == 'Residence' ? 'uil-home' : '']"></i>
                        <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.category
                            }}</span>
                    </div>

                    <div class="society__country" v-if="establishment.country != null">
                        <i class="uil uil-map"></i>
                        <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.country
                            }}</span>
                    </div>

                    <div class="society__location">
                        <i class="uil uil-location-point"></i>
                        <span class="ml-2" style="font-family: 'Arial'; font-size: 16px;">{{ establishment.city
                            }}</span>
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
                    <Icon :icon="item.icon" class="mr-1" style="font-size: 18px;" /> {{ item.label }}
                </h4>
            </div>

            <div v-if="type === 'reviews'">
                <div class="review-content" @click="toggleList" :title="appStore.account.brand || ''">
                    <div v-if="appStore.account && appStore.account.logo" class="logo">
                        <img :src="appStore.account.logo">
                    </div>
                    <h4 class="mr-5">{{appStore.account.name}}</h4>
                </div>
                <div v-if="showList" class="card-container">
                    <div class="card-item">
                        <h4><i class="uil uil-link mr-1"></i>Establishment review</h4>
                        <div class="card-item-list">
                            <div v-for="(link, index) in filteredLinks" :key="index">
                                <div v-if="link.source === 'establishment'">
                                    <a :href="link.value" target="_blank">
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
                                    <a :href="link.value" target="_blank">
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
                                    <a :href="link.value" target="_blank">
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

            <div v-if="type !== 'reviews'" class="links">
				<div v-for="(link, index) in filteredLinks" :key="index">
					<a :href="link.value" target="_blank" >
						<div class="item-name">
							{{ link.name }}
						</div>
					</a>
				</div>
			</div> -->
</template>
<script setup>
import { ref, computed, onBeforeMount, defineAsyncComponent } from 'vue';
import { ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import { useAppStore } from "@Stores/app.js"
import GateMenuComponent from '@Components/utils/GateMenuComponent.vue';

const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

let exist = ref(true);
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

const categories = ref([
    { id: 1, label: "Menus", active: true, icon: "uim:th-large" },
    { id: 2, label: "Follow us", active: false, icon: "uil:info-circle" },
    { id: 3, label: "Reviews", active: false, icon: "uil:star" },
    { id: 4, label: "Offers", active: false, icon: "bi:tags" }
]);

const type = ref("menus");

const openMenu = (item) => {
    console.log(item)
    categories.value = categories.value.map(v => {
        if (v.id == item.id) {
            v.active = true
            return v
        } else {
            v.active = false
            return v
        }
    })
}

const filteredLinks = computed(() => {
    let data = links.value;

    return data;
});

const loadLinks = async (tag) => {
    const uri = `/get/settings/category?tag=${tag}`
    const response = await new Promise((resolve) => {
        services.get_Record(uri, (response) => {
            resolve(response);
        });
    });

    console.log(response)
    if (response.status == 200) {
        links.value = response.data.links;
    }
};

onBeforeMount(async () => {

    // await loadLinks(establishmentTag);
    services.setToken(import.meta.env.VITE_APP_TOKEN);
    await services.get_Record(`establishment/${route.params.id}/media`, (response) => {
        if (response.status == 200) {
            establishment.value = response['data'];
            media.value = response['data'].url_source == null ? [] : response['data'].url_source;
            appStore.setCurrentCustomer({
                name: establishment.value['name'],
                logo: "https://api-dev.nexties.fr/uploads/mv-663b378e246a1.png",
                description: establishment.value['city']
            });
        }
    });
});

const updateType = (value) => {
    type.value = value;
};
</script>
<style scoped></style>