<template>
    <div class="app__loader" :style="loaderStyle">
        <SpinnerComponent :size="'large'" />
    </div>
</template>

<script setup>
import { ref,onBeforeMount, onMounted, defineAsyncComponent, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const externalUrl = ref('');
const id = ref('');

const initFingerprint = async () => {
    const runWithTimeout = async (asyncFunction, timeout) => {
        // const startTime = Date.now(); // Enregistre le temps de départ
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
                // const elapsedTime = Date.now() - startTime // Calcule le temps écoulé
                // alert(`Temps d'attente dépassé : ${elapsedTime} ms`)
                reject(new Error('Temps d’attente dépassé'))
            }, timeout)
        );

        const result = await Promise.race([asyncFunction(), timeoutPromise]);
        // const elapsedTime = Date.now() - startTime; // Calcule le temps écoulé
        // alert(`Temps d’exécution : ${elapsedTime} ms`);

        return result;
    }

    try {
        if (
            window.FingerprintApp &&
            window.FingerprintApp.default &&
            typeof window.FingerprintApp.default.main === 'function'
        ) {
            await runWithTimeout(() => window.FingerprintApp.default.main(), 5000); // Timeout fixé à 5 secondes
           console.log("visitorId in window: "+window.page);
        }
    } catch (error) {
          setTimeout(() => {
                location.reload();
              }, 1000);
        alert('Erreur:', error.message);
    } finally {
        if (externalUrl.value) {
            window.location.href = externalUrl.value;
        }
    }
}
onBeforeMount( () => {
 localStorage.removeItem("visitId");
});

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

    initFingerprint();
});

const { width } = useWindowSize();

const loaderStyle = ref({
    'width': `${width.value}px`,
});

watch(width, () => {
    loaderStyle.value = {
        'width': `${width.value}px`,
    }
});

</script>
<style scoped>
.app__loader {
    background: white;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    height: 100%;
}
</style>