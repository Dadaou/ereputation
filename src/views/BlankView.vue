<template>
    <div class="flex flex-col items-center justify-center min-h-[300px] w-full gap-6">
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
    downloading.value = false;

    setTimeout(() => window.close(), 2000);
}

const download = async (filename) => {

    downloading.value = true

    const response = await new Promise((resolve) => {
        services.get_Record(`customer/get/document/${decodeURIComponent(filename)}`, (response) => {
            resolve(response)
        })
    })

    if (response.status === 200 && response.data && response.data.document_base64) {
        const { base64_with_mime, document_url } = response.data

        const filename = document_url.split('/').pop()

        downloadBase64File(base64_with_mime, filename)

    } else {
        console.error('Erreur: ', response)
    }
}

onMounted(async () => {
    if (route.query && route.query.q) await download(route.query.q)
})

</script>