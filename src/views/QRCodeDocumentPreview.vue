<template>
  <div id="preview" style="font-family: Arial, sans-serif;">
    <p>Dear Customer,</p>
    <p>At Nexties, we value your feedback as it helps us enhance your experience. We invite you to share your thoughts by scanning the QR code below.</p>
    <p>As a token of our appreciation, you'll unlock exclusive benefits and surprises upon completing the feedback. Your input is crucial in shaping the future of our services.</p>
    <qrcode-vue id="qrcode"
    value="https://example.com/feedback"
    :size="150" level="L" render-as="svg" />
    <p>Thank you for being a valued part of our community. Together, let's make Nexties even better!</p>
  </div>
  <div id="qrCodeContainer"></div>
  <button @click="generatePdf">Télécharger en PDF</button>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useRoute } from "vue-router";
import jsPDF from 'jspdf';
import QrcodeVue from 'qrcode.vue';
import QRCode from 'qrcode';

const appStore = useAppStore();
const route = useRoute();
const doc = new jsPDF({
    orientation: 'portrait',
    format: 'a5',
});

const generatePdf = () => {
  addContentToPdf();
  doc.save('preview.pdf');
};

const addContentToPdf = () => {
 const content = `
    Dear Customer,\n\n
    At Nexties, we value your feedback as it helps us enhance your experience. We invite you to share your thoughts by scanning the QR code below.\n\n
    As a token of our appreciation, you'll unlock exclusive benefits and surprises upon completing the feedback. Your input is crucial in shaping the future of our services.\n\n
 `;

 const text2 = `Thank you for being a valued part of our community. Together, let's make Nexties even better!\n`
 doc.setFontSize(10);
 const maxWidth = 140; 
 const lines = doc.splitTextToSize(content, maxWidth);

 let y = 25;
 for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], 6, y); 
    y += 4; 
 }
 generateQRCode();
 const lines2 = doc.splitTextToSize(text2, maxWidth)
 y +=35
 for (let i = 0; i < lines2.length; i++) {
    doc.text(lines2[i], 6, y); 
    y += 3;
 }
};


const generateQRCode = () => {
  const qrCodeData = 'https://example.com/feedback'; // Example URL for feedback
  QRCode.toCanvas(document.getElementById('qrCodeContainer'), qrCodeData, { width: 100, height: 100 }, (error, canvas) => {
    if (!error) {
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 50, 60, 50, 50);
    } else {
      console.error('QR Code generation error:', error);
    }
  });
};

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
   generateQRCode();
});
</script>
<style scoped>
#preview{
	margin: auto;
	margin-top: 3rem;
  width: 50%;
}

#qrcode{
  margin: auto;
}

#preview p{
  padding: 15px 0;
}
</style>

