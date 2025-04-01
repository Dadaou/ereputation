<template>
    <div class="flex flex-col items-center justify-center h-full min-h-[300px] w-full gap-6">
        <SpinnerComponent v-if="downloading == true" size="extra-large" color="yellow" />
        <i v-if="downloading == false" class="uil uil-check-circle text-4xl lg:text-6xl text-green-600"></i>
        <h1 v-if="downloading == true" class="black">Downloading...</h1>
        <h1 v-if="downloading == false" class="black">Download successful</h1>
    </div> <!-- Contenu vide -->
</template>
<script setup>
import { onMounted, ref, defineAsyncComponent } from 'vue'
import services from '@Services/services.js'
import { useRoute } from 'vue-router'

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const route = useRoute()

const downloading = ref(null);

const downloadBase64File = (base64DataUrl, filename) => {
    // Créer l'URL data

    // Créer et configurer le lien
    const link = document.createElement('a')
    link.href = base64DataUrl
    link.download = filename

    // Ajouter au DOM et déclencher le téléchargement
    document.body.appendChild(link)
    link.click()

    // Nettoyage + Redirection
    window.URL.revokeObjectURL(base64DataUrl)
    document.body.removeChild(link)
}

const generateFingerprint = async () => {
    const text = navigator.userAgent + navigator.language + screen.width + screen.height + Date.now();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fingerprint = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

    return fingerprint;
}

const isMobile = () => {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

const postVisitor = async () => {

    let current_date = new Date();
    current_date.setHours(current_date.getHours() + 2);
    const visitedAt = current_date.toISOString();
    let fingerprint_code = null;
    await generateFingerprint().then(fp => { fingerprint_code = fp; });

    let data_visitor = {
        "browser": "",
        "fingerprint": fingerprint_code,
        "code": fingerprint_code,
        "device": isMobile() ? 'Mobile' : 'Desktop',
        "language": navigator.languages ? JSON.stringify(navigator.languages) : JSON.stringify([navigator.language]),
        "os": navigator.userAgent.includes('Win') ? 'Win32' : 'Linux armv81',
        "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        "url": decodeURIComponent(window.location.href),
        "userAgent": navigator.userAgent,
        "visitedAt": visitedAt
    }

    const response = await new Promise((resolve) => {
        services.createRecord('fingerprint/publish-visitor', JSON.stringify(data_visitor), (response) => {
            resolve(response);
        }, true, true);
    });

    if (response.status == 201 || response.status == 200) {
        // visitorId.value = response.data.id;
        console.log(response)
    }

}

const initFingerprint = async (_filename) => {

    downloading.value = true

    const runWithTimeout = async (asyncFunction, timeout) => {

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {

                reject(new Error('Temps d’attente dépassé'))
            }, timeout)
        );

        const result = await Promise.race([asyncFunction(), timeoutPromise]);

        return result;
    }

    try {

        const response = await new Promise((resolve) => {
            services.get_Record(`public/get/document/${decodeURIComponent(_filename)}`, (response) => {
                resolve(response)
            }, true)
        })

        if (response.status === 200 && response.data && response.data.document_base64) {

            const { base64_with_mime, document_url, no_tracking } = response.data

            if (no_tracking == null || no_tracking == false) {
                await runWithTimeout(() => postVisitor(), 5000);
            }

            const filename = document_url.split('/').pop()

            downloadBase64File(base64_with_mime, filename)

        } else {
            console.error('Erreur: ', response)
        }

    } catch (error) {

        console.log('Erreur postVisitor : ', error);
    } finally {
        downloading.value = false
        setTimeout(() => window.close(), 3000)
    }
}

onMounted(async () => {
    if (route.query && route.query.q) {

        await initFingerprint(route.query.q)

    }
})

</script>