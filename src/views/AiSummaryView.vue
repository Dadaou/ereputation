<template>
    <div v-if="summaries.length > 0">
        <div v-for="summary in summaries" :key="summary.id" class="summary-card">
            <h2 v-if="summary.created_at">Summary on  {{ moment(summary.created_at).format('D MMMM YYYY') }} - {{ summary.establishment_name }}</h2>
            <h2 v-else>Summary - {{ summary.establishment_name }}</h2>
            <p v-html="formatOverview(summary.overview)"></p>
        </div>
    </div>
    <div v-else>
        Loading summary...
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import services from '@Services/services.js';
import { useRoute } from "vue-router";
import moment from 'moment';

const route = useRoute();
const tag = route.params.id;
const summaries = ref([]);



const loadAisummary = async (tag) => {
    const api = `customer/establishment/summaries?tag=${tag}`;
    try {
        const response = await new Promise((resolve) => {
            services.get_Record(api, (response) => {
                resolve(response);
            });
        });
        if (response.status === 200 && response.data) {
            summaries.value = response.data;
        } else {
            console.error('Error fetching summaries:', response);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const formatOverview = (overview) => {
    return overview.replace(/\n/g, "<br>");
};

onMounted(async () => {
    if (tag) {
        await loadAisummary(tag);
    } else {
        console.error("Tag not found!");
    }
});
</script>

<style scoped>
.summary-card h2 {
    font-weight: bold;
    margin-bottom: 1.5rem;
}
.summary-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
}
</style>
