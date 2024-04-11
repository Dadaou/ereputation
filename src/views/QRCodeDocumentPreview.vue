<template>
<div class="container preview">
	<!-- <vue3-simple-html2pdf
    ref="vue3SimpleHtml2pdf"
    :options="pdfOptions"
    :filename="exportFilename"
  > -->
    <div class="main-content">
      Dear Customer,

			At Nexties, we value your feedback as it helps us enhance your experience. We invite you to share your thoughts by scanning the QR code below.

			As a token of our appreciation, you'll unlock exclusive benefits and surprises upon completing the feedback. Your input is crucial in shaping the future of our services.

			Thank you for being a valued part of our community. Together, let's make Nexties even better!
    </div>
  <!-- </vue3-simple-html2pdf>

  <button @click="download">Download pdf</button> -->
</div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const route = useRoute();
const vue3SimpleHtml2pdf = ref(null)
const pdfOptions = {
    margin: 15,
      image: {
        type: "jpeg",
        quality: 1,
    },
    html2canvas: { scale: 3 },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "p",
    },
}
// const exportFilename =  "my-custom-file.pdf",
const download = ()=> {
   // vue3SimpleHtml2pdf.download();
}

onBeforeMount(()=>{
  appStore.setCurrentPage({
    title1: "",
    title2: "Doc Preview",
    icon: "uil-qrcode-scan"
  });

  appStore.setBreadcrumbs([
     {
        title: "establishment",
        path: `/customer/${route.params.tag}/establishment/${route.params.id}`,
        isCurrent: false,
     },
     {
        title: "Analysis",
        path: `${route.path}`,
        isCurrent: true
     }
   ])
});
</script>
<style scoped>
.preview{
	margin-top: 5rem; 
}

	
</style>