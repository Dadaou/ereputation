<template>
    <div>
        Coming soon ...
    </div>
</template>
<script setup>
import { onMounted } from 'vue'
import services from '@Services/services.js'
import { useRoute } from "vue-router";


const route = useRoute();
const tag = route.params.id;

const loadAisummary = async (tag) => {
    const api = `customer/establishment/summaries?tag=${tag}`;
    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response);
        });
    });
    if (response.status == 200) {
        if (response.data) {
            console.log(response.data)
        }
    }
}

onMounted(async () => {
    if (tag) {
        await loadAisummary(tag);
    } else {
        console.error("Tag not found!");
    }
});
</script>