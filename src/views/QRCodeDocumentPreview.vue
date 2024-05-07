<template>
  <div class="document_preview">
    <div class="filter">
      <div>
        <div class="template__filter">
          <div class="text-sm title">Choose a template</div>
          <el-select v-model="template" filterable placeholder="choose template" size="large">
            <el-option v-for="(item, index) in templates" :key="index" :label="item.name" :value="item" />
          </el-select>
          <button class="btn downloads mt-2" @click="generatePdf">PDF Download</button>
        </div> <br>
        <form class="my-form" @submit.prevent="submit">
          <label for="textGreeting" class="text-sm title">Text Greeting:</label>
          <input type="text" id="textGreeting" v-model="textGreeting">

          <label for="textClosing" class="text-sm title">Text Closing:</label>
          <input type="text" id="textClosing" v-model="textClosing">

          <label for="text1" class="text-sm title">Text 1:</label>
          <input type="text" id="text1" v-model="text1">

          <label for="text2" class="text-sm title">Text 2:</label>
          <input type="text" id="text2" v-model="text2">

          <label for="text3" class="text-sm title">Text 3:</label>
          <input type="text" id="text3" v-model="text3">

          <button class="btn downloads mt-2" @click="updatePreview">Preview</button><br><br>
          <button class="btn btn-secondary" type="submit">Update</button>

        </form>
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

        <div
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-200/10 to-transparent">
        </div>
      </div>
    </div>
  </div>
  <Teleport to="#qrcodeContainer" v-if="coreText">
    <qrcode-vue id="qrcode" style="margin-inline: auto;" :value="qrStore.qrcodeValue" :size="150" level="L"
      render-as="svg" />
  </Teleport>
</template>

<script setup>
import { onBeforeMount, watch, ref, Teleport, nextTick } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useQrStore } from "@Stores/qrtemplate.js";
import { useRoute } from "vue-router";
import jsPDF from 'jspdf';
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';
import QRCode from 'qrcode';
import DOMPurify from 'dompurify';
// import he from 'he';
import { ElOption, ElSelect } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';

const appStore = useAppStore();
appStore.setCurrentPage({
  title1: "",
  title2: "Doc Preview",
  icon: "uil-qrcode-scan"
});
const route = useRoute();
const doc = new jsPDF({
  orientation: 'portrait',
  format: 'a5',
});
const qrStore = useQrStore();
const htmlContainer = ref(null);
const template = ref(null);

const templates = ref([]);
const coreText = ref(null);
const filename = ref('preview')

const textGreeting = ref('');
const textClosing = ref('');
const text1 = ref('');
const text2 = ref('');
const text3 = ref('');
const core = ref('');

// const previewData = async () => {
//   // try {
//   //   const response = await axios.get('https://api-dev.nexties.fr/api/customer/qrtemplates');
//   //   const data = response.data;

//   //   // Assigner les données aux champs du formulaire
//   //   textGreeting.value = data.textGreeting;
//   //   textClosing.value = data.textClosing;
//   //   text1.value = data.text1;
//   //   text2.value = data.text2;
//   //   text3.value = data.text3;
//   // } catch (error) {
//   //   console.error('Erreur lors de la récupération des données:', error);
//   // }
// };
// const submit = async () => {
//   try {
//     // Récupérer les valeurs des champs du formulaire
//     const formData = {
//       textGreeting: textGreeting.value,
//       textClosing: textClosing.value,
//       text1: text1.value,
//       text2: text2.value,
//       text3: text3.value
//     };

//     // Effectuer une requête HTTP POST vers votre API avec les données du formulaire
//     const response = await axios.post('https://api-dev.nexties.fr/api/customer/qrtemplates', formData);

//     // Vérifier si la requête a réussi
//     if (response.status === 200) {
//       // Traiter la réponse de l'API en fonction de votre logique métier
//       console.log('Form updated successfully!');
//     } else {
//       // Gérer les erreurs en cas de réponse non attendue
//       console.error('Error updating form:', response.data);
//     }
//   } catch (error) {
//     // Gérer les erreurs en cas d'échec de la requête
//     console.error('Error updating form:', error);
//   }
// };

// const generatePdf = () => {
//   generateQRCode();
//   addContentToPdf();
//   doc.save(`${filename.value}.pdf`);
// };

const removeHtmlTags = (str) => {
  if (str) {
    return str.replace(/<[^>]*>/g, '');
  }
  return str
}

// const findDifference = (text1, text2) => {
//   text1 = text1.split(' ');
//   text2 = text2.split(' ');

//   let difference = '';
//   for (let i = 0; i < Math.min(text1.length, text2.length); i++) {
//     if (text1[i] !== text2[i]) {
//       difference = text2.slice(i, i + 3).join(' ');
//       break;
//     }
//   }
//   return difference;
// }

const addContentToPdf = () => {
  const greeting = removeHtmlTags(template.value.text_greeting);
  const paragraph1 = removeHtmlTags(template.value.text1);
  const paragraph2 = removeHtmlTags(template.value.text2);
  const paragraph3 = removeHtmlTags(template.value.text3);
  const closing = removeHtmlTags(template.value.text_closing);
  const core = removeHtmlTags(template.value.core)

  let content = `
    ${greeting}\n\n
    ${paragraph1}\n\n
    ${paragraph2}\n\n
    ${paragraph3}\n\n
    ${core}\n\n
    ${closing}
 `;

  //this part is to get the name of the establishment by comparing the core inner html by its template
  // let textTemplate = `
  //   ${greeting}
  //   ${paragraph1}
  //   ${paragraph2}
  //   ${paragraph3}`;

  // textTemplate = textTemplate.replace(/\s+/g, ' ').trim();
  // let textToCompare = removeHtmlTags(coreText.value);
  // textToCompare = textToCompare.replace(/\s+/g, ' ').trim();
  // let diff = findDifference(textTemplate, textToCompare)
  // diff = diff.split(',')

  // if (diff.length > 0) {
  //   content = content.replace("{{establishment}}", diff[0])
  //   filename.value = `${diff[0]} QrCode preview`
  // }
  //end here

  // const text = `${paragraph3}\n`
  doc.setFontSize(10);
  const maxWidth = 140;
  const lines = doc.splitTextToSize(content, maxWidth);

  let y = 25;
  for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], 6, y);
    y += 4;
  }
  // const lines2 = doc.splitTextToSize(text, maxWidth)
  // y += 30
  // for (let i = 0; i < lines2.length; i++) {
  //   doc.text(lines2[i], 6, y);
  //   y += 3;
  // }
};

const generateQRCode = () => {
  const qrCodeData = qrStore.qrcodeValue;
  // console.log(qrStore.qrcodeValue)
  QRCode.toCanvas(document.getElementById('qrcodeContainer'), qrCodeData, { width: 100, height: 100 }, (error, canvas) => {
    if (!error) {
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 55, 65, 35, 35);
    } else {
      console.error('QR Code generation error:', error);
    }
  });
};

const updatePreview = async () => {

  let content = `
    <p>${textGreeting.value}</p><br>
    <p>${text1.value}</p>
    <p>${text2.value}</p><br>
    <img src="qrcodeimg.jpeg"><br>
    <p>${text3.value}</p>
    <p>${textClosing.value}</p>
 `;

  console.log(content);

  content = content.replace(/<img src="qrcodeimg.jpeg".*?>/g, '<div id="qrcodeContainer" style="margin: 25px; margin-inline: auto;"></div>');
  coreText.value = DOMPurify.sanitize(content);
  // generateQRCode();
  await nextTick();

}

onBeforeMount(async () => {
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
  templates.value = await qrStore.getTemplates(route.params.tag, route.params.id);

  if (templates.value.length > 0) {
    template.value = templates.value[0];
  }

});

watch(template, () => {
  if (template.value) {
    textGreeting.value = removeHtmlTags(template.value.text_greeting);
    textClosing.value = removeHtmlTags(template.value.text_closing);
    text1.value = removeHtmlTags(template.value.text1);
    text2.value = removeHtmlTags(template.value.text2);
    text3.value = removeHtmlTags(template.value.text3);
    updatePreview();
  }

})
</script>
<style scoped>
/*.content img#logo{
  height: 50px;
  margin: auto;
}*/


#qrcodeContainer {
  width: 100% !important;
}

.document_preview {
  min-height: calc(90dvh - 140px);
  margin: 0 auto;
  margin-top: 5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.filter {
  flex-basis: 400px;
}

#preview>div {
  margin: auto;
  width: 70%;
  text-align: justify;
}

.skeleton {
  width: 1000px !important;
}

#qrcode {
  margin: auto;
}

#preview p {
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

  #preview>div {
    width: 100%;
    text-align: left;
  }

  #qrcode {
    margin: 1rem auto;
  }

  #preview p {
    padding: 10px 0;
  }

  .skeleton {
    width: 700px !important;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .document_preview {
    gap: 0.5rem;
  }

  .skeleton {
    width: 800px !important;
  }

  .filter {
    flex-basis: 50%;
  }

  #preview>div {
    width: 100%;
  }

  #qrcode {
    margin: 1rem auto;
  }

  #preview p {
    padding: 12px 0;
  }
}

.my-form {
  max-width: 200px;
  /* Ajustez cette valeur selon vos préférences */
  margin: 0 auto;
  /* Centrer horizontalement */
}

/* Styles supplémentaires pour le formulaire */
.my-form label {
  display: block;
  margin-bottom: 1rem;
  /* Ajoutez une marge inférieure de 2rem */
  font-size: 1rem;
  /* Taille de police */
  font-weight: 500;
  /* Épaisseur de police */
  color: #333;
  /* Couleur du texte */
}

.my-form input {
  width: 100%;
  margin-bottom: 1rem;
  /* Ajoutez une marge inférieure de 2rem */
  font-size: 1rem;
  /* Taille de police */
  font-weight: 500;
  /* Épaisseur de police */
  color: #333;
  /* Couleur du texte */
  padding: 0.5rem 1rem;
  /* Ajoutez un remplissage pour le texte d'entrée */
  border: 1px solid #ccc;
  /* Ajoutez une bordure */
  border-radius: 0.25rem;
  /* Ajoutez un rayon de bordure */
}

.my-form button {
  width: 100%;
  font-size: 1rem;
  /* Taille de police */
  background-color: #0873DE;
  color: white;
  padding: 0.35rem 0.25rem;
  /* Ajoutez un remplissage pour le texte d'entrée */
  border: 100%px solid #ccc;
  /* Ajoutez une bordure */
  border-radius: 0.25rem;
  /* Ajoutez un rayon de bordure */
}
</style>
