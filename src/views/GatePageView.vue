<template>
	<div class="main__container">
	    <div>
	        <div class="filters mb-5">
	            <el-select v-model="type" size="large">
	                <el-option v-for="(item, index) in categories" :key="index" :label="item.label"
	                            :value="item.value"/>
	            </el-select>
	        </div>
	        <ul class="links">
	            <li v-for="(link, index) in filteredLinks" :key="index">
	                <a :href="link.value" target="_blank">{{ link.name }}</a>
	            </li>
	        </ul>
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

const route = useRoute();
const establishmentTag = route.params.id;

const links = ref([
    { name: "Lien 1", category: "menus", value: "https://example.com/link1" },
    { name: "Lien 2", category: "infos", value: "https://example.com/link2" },
    { name: "Lien 3", category: "reviews", value: "https://example.com/link3" },
    { name: "Lien 4", category: "offers", value: "https://example.com/link4" }
]);

const categories = [
 {label: "Menus", value: "menus"},
 {label: "Infos", value: "infos"},
 {label: "Reviews", value: "reviews"},
 {label: "Offers", value: "offers"},
 {label: "Others", value: "others"}
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
</script>
<style scoped>

.main__container > div{
	width: 50%;
	margin: 5rem auto;
}

.links li {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
 }
 a {
    text-decoration: none;
    color: #007bff;
 }
 
.links li:hover {
    background-color: #e0e0e0;
 }	
</style>