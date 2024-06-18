<template>
  <div class="document_preview">
    <div class="filter">
      <div>
        <div class="template__filter">
          <div class="text-sm title"> Choose a template </div>
          <el-select v-model="templateId" filterable placeholder="choose template" size="large">
            <el-option v-for="(item, index) in templates" :key="index" :label="item.name" :value="item.id"
              @click="changeValue(item)" />
          </el-select>
          <button v-if="template" class="btn downloads mt-2" @click="generatePdf">PDF Download</button>
        </div> <br>
        <form v-if="template && editable" class="my-form" @submit.prevent="submit">
          <label for="textGreeting" class="text-sm title">Text Greeting:</label>
          <input type="text" id="textGreeting" v-model="textGreeting">

          <label for="textClosing" class="text-sm title">Text Closing:</label>
          <input type="text" id="textClosing" v-model="textClosing">

          <label for="text1" class="text-sm title">Text 1:</label>
          <textarea name="text1" rows="3" cols="30" v-model="text1"></textarea>

          <label for="text2" class="text-sm title">Text 2:</label>
          <textarea name="text2" rows="3" cols="30" v-model="text2"></textarea>

          <label for="text3" class="text-sm title">Text 3:</label>
          <textarea name="text3" rows="3" cols="30" v-model="text3"></textarea>
          <button class="btn btn-secondary mt-1" type="submit">Update</button>

        </form>
      </div>
    </div>
    <div v-if="template" id="preview" style="font-family: Arial, sans-serif;">

      <div id="core" v-html="core"></div>
    </div>
    <div v-else>
      Choose a template to preview and download.
    </div>

  </div>
</template>

<script setup>
import { onBeforeMount, watch, ref } from 'vue';
import { useAppStore } from "@Stores/app.js";
import { useQrStore } from "@Stores/qrtemplate.js";
import { useRoute } from "vue-router";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import services from '@Services/services.js';
import { ElOption, ElSelect, ElMessage } from 'element-plus';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/select/style/css';
import html2canvas from 'html2canvas';
import { h } from 'vue'

const appStore = useAppStore();
appStore.setCurrentPage({
  title1: "",
  title2: "Doc Preview",
  icon: "uil-qrcode-scan"
});
const route = useRoute();
const doc = new jsPDF({
  orientation: 'portrait',
  format: 'a5'
});
const qrStore = useQrStore();
const template = ref(null);
const editable = ref(false);

const templates = ref([]);
const filename = ref('preview')

const textGreeting = ref('');
const textClosing = ref('');
const text1 = ref('');
const text2 = ref('');
const text3 = ref('');
const core = ref('');
const templateId = ref(null);
const establishment = ref(null);


const submit = async () => {
  try {
    updateTemplate();
  } catch (error) {
    console.error('Error updating form:', error);
  }
};

const generatePdf = async () => {
  await addContentToPdf();
  doc.save(`${filename.value}.pdf`);
};

const addContentToPdf = async () => {
  const body = document.getElementsByClassName("content");
  if (body.length) {

    let content = body[0];
    let canvas = await html2canvas(content, { scale: 4, useCORS: true });
    const imageData = canvas.toDataURL('image/jpeg', 1.0);
    const aspectRatio = canvas.width / canvas.height;
    const adjustedHeight = 0 || 130 / aspectRatio;
    doc.addImage(imageData, 'PNG', 10, 10, 130, adjustedHeight, undefined, 'SLOW');
  }
}

const changeValue = (item) => {
  template.value = item
  editable.value = item.establishment_tag == route.params.id
}

const customer = route.params.tag;
const updateTemplate = () => {
  services.patchRecord('customer/qrtemplates/', template.value.id, {
    text1: text1.value,
    text2: text2.value,
    text3: text3.value,
    textGreeting: textGreeting.value,
    textClosing: textClosing.value,
    customer: customer,
  }, (response) => {
    if (response.status == 200) {
      template.value = response.data;
      templates.value[templates.value.findIndex(el => el.id === template.value.id)] = response.data;
      ElMessage({
        message: h('p', null, [
          h('h4', { style: "color: var(--el-color-primary); font-weight: bold;" }, 'Information:'),
          h('span', { style: "font-size: 13px;" }, "Your template has been successfully updated!"),
        ]),
      })
    }
  })
}

const generateCore = async () => {
  let tmp = template.value.core
  tmp = tmp.replace('{{textgreeting}}', textGreeting.value);
  tmp = tmp.replace('{{text1}}', text1.value);
  tmp = tmp.replace('{{text2}}', text2.value);
  tmp = tmp.replace('{{text3}}', text3.value);
  tmp = tmp.replace('{{textclosing}}', textClosing.value);
  const qrData = qrStore.qrcodeValue; // Data you want to encode
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const qrCanvas = await QRCode.toCanvas(canvas, qrData, { width: 500, errorCorrectionLevel: 'H' });
  const qrCodeDataURL = qrCanvas.toDataURL('image/png', 1.0); // Convert to base64
  tmp = tmp.replace('{{qrcodeimg}}', `<img src="${qrCodeDataURL}" style="width: 100%;">`)

  try {
    const response = await fetch(template.value.logo)
    if (!response.ok) {
      throw new Error('image not found')
    }
    const blob = await response.blob()
    const reader = new FileReader()
    reader.onloadend = () => {
      tmp = tmp.replace('{{logo}}', `<img src="${reader.result}" style="width: 100%;">`);
      core.value = tmp;
    }
    reader.readAsDataURL(blob)
  } catch (error) {
    console.error('Error encoding image:', error)
  }

  // tmp = tmp.replace('{{logo}}', `<img src="data:image/png;base64,${template.value.logo_base64}" style="width: 100%;">`);
  // core.value = tmp;
}

onBeforeMount(async () => {

  const response = await new Promise((resolve) => {
    services.get_Record(`/establishment/info?tag=${route.params.id}`, (response) => {
      resolve(response)
    });
  });

  if (response.status == 200) {
    establishment.value = response.data.length && response.data[0]
  }

  appStore.setCurrentPage({
    title1: "",
    title2: establishment.value ? establishment.value.name : "Doc Preview",
    icon: "uil-qrcode-scan"
  });

  let section = route.query.section
  if (section)
    section = section.charAt(0).toUpperCase() + section.slice(1)

  appStore.setBreadcrumbs([
    {
      title: section,
      path: `/customer/${route.params.tag}/account/my_qrcodes`,
      isCurrent: false
    },
    {
      title: "Document preview",
      path: `${route.path}`,
      isCurrent: true
    }
  ])
  const res = await qrStore.getTemplates(route.params.tag, route.params.id)
  if (res.length > 0) {
    templates.value = res.filter((item) => item.category == route.query.section && (item.establishment_tag == null || item.establishment_tag == route.params.id));
    template.value = templates.value[0]
    templateId.value = template.value.id
  }

});

watch([text1, text2, textGreeting, textClosing, text3], () => {
  generateCore();
})

watch(template, () => {
  if (template.value) {
    textGreeting.value = template.value.text_greeting;
    textClosing.value = template.value.text_closing;
    text1.value = template.value.text1;
    text2.value = template.value.text2;
    text3.value = template.value.text3;
    editable.value = template.value.establishment_tag == route.params.id
    generateCore();
  }

});
</script>
<style>
#preview {
  margin-top: -24px;
}


#qrcodeContainer {
  width: 100% !important;
}

.document_preview {
  min-height: calc(90dvh - 140px);
  margin: 0;
  margin-top: 5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: flex-start;
  width: 100%;
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
  width: 500px !important;
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

body {
  padding: 0px !important;

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
  max-width: 100%;
  /* Ajustez cette valeur selon vos préférences */
  margin: 0 auto;
  /* Centrer horizontalement */
}

.my-form input,
.my-form textarea {
  width: 100%;
  margin-bottom: 1rem;
  /* Ajoutez une marge inférieure de 2rem */
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
  caret-color: var(--color-primary);
  font-family: 'Montserrat', sans-serif;
  font-size: 14px !important;
}

.my-form button {
  width: 100%;
  font-size: 1rem;
  /* Taille de police */
  background-color: #2F74E0;
  color: white;
  padding: 0.35rem 0.25rem;
  /* Ajoutez un remplissage pour le texte d'entrée */
  border: 100%px solid #ccc;
  /* Ajoutez une bordure */
  border-radius: 0.25rem;
  /* Ajoutez un rayon de bordure */
}
</style>
