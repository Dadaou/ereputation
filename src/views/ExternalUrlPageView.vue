<template>
    <div class="app__loader" :style="loaderStyle">
        <SpinnerComponent :size="'large'" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';

const SpinnerComponent = defineAsyncComponent(() =>
    import('@Components/utils/SpinnerComponent.vue')
)

const externalUrl = ref('');
const id = ref('');

const initFingerprint = async () => {

    try {
        if (window.FingerprintApp && window.FingerprintApp.default && typeof window.FingerprintApp.default.main === 'function') {
            await window.FingerprintApp.default.main()
        }
    } catch (error) {
        console.error('Erreur:', error)
    }

    finally {
        if (externalUrl.value) {
            window.location.href = externalUrl.value;
        }
    }
}

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