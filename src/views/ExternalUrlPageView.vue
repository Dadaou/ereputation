<template>
    <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const externalUrl = ref('');
const id = ref('');

onMounted(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const extractedUrl = urlParams.get('url');
    
    if (extractedUrl) {
        externalUrl.value = extractedUrl;
    } else {
        console.error("URL not found.");
    }

    const pathParts = url.pathname.split('/');
    id.value = pathParts[pathParts.indexOf('external-url') + 1];

    if (externalUrl.value) {
        window.location.href = externalUrl.value;
    }
});
</script>
