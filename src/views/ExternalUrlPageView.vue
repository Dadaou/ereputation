<template>
    <div class="app__loader" :style="loaderStyle">
        <SpinnerComponent :size="'large'" />
    </div>
</template>

<script setup>
import { ref,onBeforeMount, onMounted, defineAsyncComponent, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import services from '@Services/services.js';

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const externalUrl = ref('');
const id = ref('');
const fingerprint_code = ref(null);
const visitorId = ref(null);


const generateFingerprint=async()=> {
    const text = navigator.userAgent + navigator.language + screen.width + screen.height + Date.now();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fingerprint = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

    return fingerprint;
}

const isMobile=()=> {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

 const postVisitor=async()=>{

         let data_visitor = {
            "browser": "",
            "fingerprint": fingerprint_code.value,
            "code": fingerprint_code.value,
            "device": isMobile()? 'Mobile' : 'Desktop',
            "language": navigator.languages ? JSON.stringify(navigator.languages) : JSON.stringify([navigator.language]),
            "os": navigator.userAgent.includes('Win') ? 'Win32' : 'Linux armv81',
            "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "url":window.location.href,
            "userAgent": navigator.userAgent,
            "visitedAt": new Date()
        }

             const response = await new Promise((resolve) => {
                    services.createRecord('fingerprint/publish-visitor', JSON.stringify(data_visitor), (response) => {
                        resolve(response);
                    },true,true);
                });

                if (response.status == 201 || response.status == 200) {
                    visitorId.value = response.data.id;
                    console.log(response)
                }

    }

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

        await runWithTimeout(() => postVisitor(), 5000); 
        // if (
        //     window.FingerprintApp &&
        //     window.FingerprintApp.default &&
        //     typeof window.FingerprintApp.default.main === 'function'
        // ) {
        //     await runWithTimeout(() => window.FingerprintApp.default.main(), 5000); // Timeout fixé à 5 secondes
        //    console.log("visitorId in window: "+window.page);
        // }
    } catch (error) {
          // setTimeout(() => {
          //       location.reload();
          //     }, 1000);
        alert('Erreur:', error.message);
    } finally {
        if (externalUrl.value) {
            window.location.href = externalUrl.value;
        }
    }
}
onBeforeMount( () => {
    generateFingerprint().then(fp => {fingerprint_code.value=fp;});
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