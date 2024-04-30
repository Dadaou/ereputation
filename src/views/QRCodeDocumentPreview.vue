<template>
  <div class="document_preview">
    <div class="filter">
      <div>
         <div class="template__filter">
                <div class="text-sm title">Choose a template</div>
                <el-select v-model="template" filterable placeholder="choose template" size="large">
                    <el-option v-for="(item, index) in templates" :key="index" :label="item.name"
                        :value="item"/>
                </el-select>
                <button class="btn downloads mt-2" @click="generatePdf">PDF Download</button>
        </div>
      </div>
    </div>
    <div id="preview" style="font-family: Arial, sans-serif;">
      <div v-if="template">
         <div ref="htmlContainer" v-html="coreText"></div>
      </div>
      <div v-else class="space-y-5 rounded-2xl bg-white/5 p-4 relative skeleton">
           <div class="h-24 rounded-lg bg-gray-200 animate-pulse"></div>
           <div class="space-y-3">
              <div class="h-3 w-3/5 rounded-lg bg-gray-200 animate-pulse"></div>
              <div class="h-3 w-4/5 rounded-lg bg-gray-200 animate-pulse"></div>
              <div class="h-3 w-2/5 rounded-lg bg-gray-200 animate-pulse"></div>
           </div>
           
           <div class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-200/10 to-transparent"></div>
      </div>
    </div>
  </div>
  <Teleport to="#qrcodeContainer" v-if="coreText">
    <qrcode-vue id="qrcode" style="margin-inline: auto;" :value="qrStore.qrcodeValue" :size="150" level="L" render-as="svg" />
  </Teleport>
  <div id="qrCodeContainer"></div>
</template>

<script setup>
import { onBeforeMount, ref, onMounted, createApp, Teleport } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useQrStore } from "@Stores/qrtemplate.js";
import { useRoute } from "vue-router";
import jsPDF from 'jspdf';
import QrcodeVue from 'qrcode.vue';
import QRCode from 'qrcode';
import DOMPurify from 'dompurify';
import he from 'he';
import { ElOption, ElSelect, ElTooltip } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import html2canvas from 'html2canvas';

const appStore = useAppStore();
const route = useRoute();
const doc = new jsPDF({
    orientation: 'portrait',
    format: 'a5',
});
const qrStore = useQrStore();
const htmlContainer = ref(null);
const template =ref(null);

const templates = ref([]);
const coreText = ref(null);
const filename = ref('preview')

const generatePdf = () => {
  generateQRCode();
  addContentToPdf();
  doc.save(`${filename.value}.pdf`);
};

const removeHtmlTags = (str)=> {
  return str.replace(/<[^>]*>/g, ''); 
}

const findDifference = (text1, text2)=> {
  text1 = text1.split(' ');
  text2 = text2.split(' ');

  let difference = '';
  for (let i = 0; i < Math.min(text1.length, text2.length); i++) {
    if (text1[i] !== text2[i]) {
      difference = text2.slice(i, i + 3).join(' ');
      break;
    }
  }
  return difference;
}

const addContentToPdf = () => {
 const greeting = removeHtmlTags(template.value.text_greeting);
 const paragraph1 = removeHtmlTags(template.value.text1);
 const paragraph2 = removeHtmlTags(template.value.text2);
 const paragraph3 = removeHtmlTags(template.value.text3);

 let content = `
    ${greeting}\n\n
    ${paragraph1}\n\n
    ${paragraph2}\n\n
 `;

 //this part is to get the name of the establishment by comparing the core inner html by its template
 let textTemplate = `
    ${greeting}
    ${paragraph1}
    ${paragraph2}
    ${paragraph3}`;

 textTemplate = textTemplate.replace(/\s+/g, ' ').trim();
 let textToCompare = removeHtmlTags(coreText.value); 
 textToCompare = textToCompare.replace(/\s+/g, ' ').trim();
 let diff = findDifference(textTemplate, textToCompare)
 diff = diff.split(',')

 if(diff.length>0) {
  content = content.replace("{{establishment}}", diff[0])
  filename.value = `${diff[0]} QrCode preview`
 }
 //end here

 const text = `${paragraph3}\n`
 doc.setFontSize(10);
 const maxWidth = 140; 
 const lines = doc.splitTextToSize(content, maxWidth);

 let y = 25;
 for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], 6, y); 
    y += 4; 
 }
 const lines2 = doc.splitTextToSize(text, maxWidth)
 y +=30
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
      doc.addImage(imageData, 'PNG', 55, 65, 35, 35);
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
   generateQRCode()
   templates.value = await qrStore.getTemplates(route.params.tag, route.params.id);
  
   if(templates.value.length>0){
    template.value = templates.value[0]
    let decodedHTML = he.decode(template.value.core);
    const config = {
        ALLOWED_TAGS: ['p', 'span', 'br', 'img'], 
        ADD_ATTR: ['style', 'width', 'height', 'alt']
    };
    
    decodedHTML = decodedHTML.replace(/<img.*?>/g, '<div id="qrcodeContainer" style="margin: 25px; margin-inline: auto;"></div>');
    coreText.value = DOMPurify.sanitize(decodedHTML);
   } 
});
</script>
<style scoped>
.document_preview{
  min-height:calc(90dvh - 140px);
  margin: 0 auto;
  margin-top: 5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.filter{
  flex-basis: 400px;
}


#preview >div{
	margin: auto;
  width: 70%;
  text-align: justify;
}

.skeleton{
  width: 1000px !important;
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

@media only screen and (max-width: 768px) {
  .document_preview {
    flex-direction: column; 
  }

  .filter {
    flex-basis: 100%; 
    margin-bottom: 1rem; 
  }

  #preview > div {
    width: 100%;
    text-align: left; 
  }

  #qrcode {
    margin: 1rem auto;
  }

  #preview p {
    padding: 10px 0;
  }

  .skeleton{
    width: 700px !important;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .document_preview {
    gap: 0.5rem;
  }

  .skeleton{
    width: 800px !important;
  }

  .filter {
    flex-basis: 50%; 
  }

  #preview > div {
    width: 100%; 
  }

  #qrcode {
    margin: 1rem auto; 
  }

  #preview p {
    padding: 12px 0;
  }
}

</style>

