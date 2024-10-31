<template>
    <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
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


    if (!route.query.preview) {
        try {
            if (window.FingerprintApp && window.FingerprintApp.default && typeof window.FingerprintApp.default.main === 'function') {
                window.FingerprintApp.default.main();
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'exécution de Fingerprint :", error);
        }
    }

    if (externalUrl.value) {
        window.location.href = externalUrl.value;
    }
});
</script>
