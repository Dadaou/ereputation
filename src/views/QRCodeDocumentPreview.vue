<template>
  <div class="document_preview">
    <div class="filter">
      <div>
         <div class="template__filter">
                <div class="text-sm title">Choose a template</div>
                <el-select v-model="template" filterable placeholder="select template" size="large">
                    <el-option v-for="(item, index) in templates" :key="index" :label="item.name"
                        :value="item"/>
                </el-select>
                <button class="btn downloads mt-2" @click="generatePdf">Télécharger en PDF</button>
        </div>
      </div>
    </div>
    <div id="preview" style="font-family: Arial, sans-serif;">
      <div v-if="template">
          <p v-html="template.text_greeting" ref="text_greeting"></p>
          <p v-html="template.text1" ref="text1"></p>
          <p v-html="template.text2" ref="text2"></p>
          <qrcode-vue id="qrcode"
          :value="qrStore.qrcodeValue"
          :size="150" level="L" render-as="svg" />
          <p v-html="template.text3" ref="text3"></p>
      </div>
    </div>
  </div>
  <div id="qrCodeContainer"></div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useQrStore } from "@Stores/qrtemplate.js";
import { useRoute } from "vue-router";
import jsPDF from 'jspdf';
import QrcodeVue from 'qrcode.vue';
import QRCode from 'qrcode';
import { ElOption, ElSelect, ElTooltip } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';

const appStore = useAppStore();
const route = useRoute();
const doc = new jsPDF({
    orientation: 'portrait',
    format: 'a5',
});
const qrStore = useQrStore();
const template =ref(null)
const text_greeting = ref(null)
const text1 = ref(null)
const text2 = ref(null)
const text3 = ref(null)

const templates = ref([])

const generatePdf = () => {
  generateQRCode();
  addContentToPdf();
  doc.save('preview.pdf');
};

const addContentToPdf = () => {

 const greeting = text_greeting.value;
 const paragraph1 = text1.value;
 const paragraph2 = text2.value;
 const paragraph3 = text3.value;

 const content = `
    ${greeting.textContent.trim()}\n\n
    ${paragraph1.textContent.trim()}\n\n
    ${paragraph2.textContent.trim()}\n\n
 `;

 const text = `${paragraph3.textContent.trim()}\n`
 doc.setFontSize(10);
 const maxWidth = 140; 
 const lines = doc.splitTextToSize(content, maxWidth);

 let y = 25;
 for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], 6, y); 
    y += 4; 
 }
 const lines2 = doc.splitTextToSize(text, maxWidth)
 y +=35
 for (let i = 0; i < lines2.length; i++) {
    doc.text(lines2[i], 6, y); 
    y += 3;
 }
};

const generateQRCode = () => {
  const qrCodeData = qrStore.qrcodeValue; 
  console.log(qrStore.qrcodeValue)
  QRCode.toCanvas(document.getElementById('qrCodeContainer'), qrCodeData, { width: 100, height: 100 }, (error, canvas) => {
    if (!error) {
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 50, 60, 50, 50);
    } else {
      console.error('QR Code generation error:', error);
    }
  });
};

onBeforeMount(async()=>{
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
        title: "Document preview",
        path: `${route.path}`,
        isCurrent: true
     }
   ])
    generateQRCode();
   templates.value = await qrStore.getTemplates(route.params.tag, route.params.id);
   if(templates.value.length>0) template.value = templates.value[0]
   console.log(templates.value)
});
</script>
<style scoped>
.document_preview{
  min-height:calc(90dvh - 140px);
 /* width: var(--container-width-lg);*/
  margin: 0 auto;
  margin-top: 5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.filter{
  flex-basis: 400px;
  /*border: 1px solid black;*/
}


#preview >div{
	margin: auto;
  width: 70%;
  text-align: justify;
}

#qrcode{
  margin: auto;
}

#preview p{
  padding: 15px 0;
}

.btn.downloads {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border-radius: 5px;
    padding: 5px;
}
</style>

