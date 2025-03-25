<template>
    <div class="security__header border__bottom my-10">
        <!--  <div class="security__edit">
                <h4><i class="uil uil-calender"></i> Advantage</h4>
                <p>Complete the following information to add an advantage.</p>
            </div> -->
    </div>
    <div class="advantage_container" :style="{ width: advantageContainerWidth}">
        <div class="form-container">
            <form @submit.prevent="submit" class="mt-4 px-2 h-full">
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="countries"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Establishment
                            <span>*</span></label>
                        <el-select v-model="establishment" placeholder="Choose establishment" size="large">
                            <el-option v-for="item in userStore.user.customer.establishments" :key="item.id"
                                :label="item.name" :value="`/api/establishments/${item.id},${item.name}`" />
                        </el-select>
                    </div>
                    <div>
                        <label for="category"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category
                            <span>*</span></label>
                        <!-- <input type="text" id="category" v-model="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2"> -->
                        <el-select v-model="category" placeholder="Select category" size="large">
                            <el-option v-for="category in categoriesOptions" :key="category.value"
                                :label="category.label" :value="category.value" />
                        </el-select>
                    </div>
                </div>

                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="scope" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scope
                            <span></span></label>
                        <el-select v-model="scope" placeholder="Select scope" size="large">
                            <el-option v-for="scope in scopeOptions" :key="scope.value" :label="scope.label"
                                :value="scope.value" />
                        </el-select>
                    </div>
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name
                            <span>*</span></label>
                        <input type="text" id="name" v-model="advantageName"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>

                </div>
                <div class="grid gap-6 mb-6 md:grid-cols-4">
                        <div>
                            <label for="amount"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount
                                <span></span></label>
                            <input type="number" id="amount" v-model="amount"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                        <div>
                            <label for="currency" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Currency<span></span>
                            </label>

                            <el-input
                                v-model="currency"
                                size="large"
                            />
                        </div>
                        <!--<div>
                              <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Code
                                <Tooltip text="Use your own discount code recognized by your system"/>
                               </label>
                              <input type="text" id="code" v-model="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                          </div>-->
                        <div>
                            <label for="metric"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Metric
                                <span></span></label>
                            <el-select v-model="metric" placeholder="Select metric" size="large" >
                                <el-option v-for="metric in metrics" :key="metric" :label="metric" :value="metric" />
                            </el-select>
                        </div>
                    <!--<div>
                            <label for="metric" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Metric <span></span></label>
                            <el-select v-model="metric" placeholder="Select metric" size="large">
                                <el-option
                                v-for="metric in metrics"
                                :key="metric"
                                :label="metric"
                                :value="metric"
                                />
                            </el-select>
                        </div>-->
                    <div>
                        <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Code
                            <Tooltip text="Use your own discount code recognized by your system" />
                        </label>
                        <input type="text" id="code" v-model="code"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2">
                    </div>


                </div>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="validity"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity
                                <Tooltip text="Validity period after coupon creation (in number of days)" />
                            </label>
                            <input type="number" id="validity" v-model="validity"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                        <div>
                            <label for="limit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Limit
                                <Tooltip text="Offer limited to x units" />
                            </label>
                            <input type="number" id="limit" v-model="advantageLimit"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                        </div>
                    </div>
                     <div>
                            <label for="limit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Order
                           
                            </label>
                            <input type="number" id="positioning" v-model="positioning"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full p-2" min="0">
                    </div>
                    <div>
                        <label for="last_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expires on
                            <span></span></label>
                        <el-date-picker v-model="expiredAt" :size="'large'" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Date from
                            <!-- <span>*</span> -->
                            <Tooltip text="To use before the [date]" />
                        </label>
                        <el-date-picker v-model="dateFrom" :size="'large'" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Date to
                            <!-- <span>*</span> -->
                            <Tooltip text="To use after the [date]" />
                        </label>
                        <el-date-picker v-model="dateTo" :size="'large'" />
                    </div>
                </div>


                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="message"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
                        <textarea v-model="website" id="message" rows="4"
                            class="block p-2.5 w-50 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                      </textarea>
                    </div>

                     <div>
                        <label for="section" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Section</label>
                        <el-select id="section" v-model="section" placeholder="" size="large">
                            <el-option v-for="item in sections" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                </div>



                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label for="message"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        
                            
                      <QuillEditor 
                        style="height: 200px;" 
                        theme="snow"
                        :toolbar="toolbarOptions"
                        ref="description"
                        :content="html"
                        content-type="html"
                        @text-change="handleDescriptionChange"
                      />
                      
                    </div>
                    <div>
                        <label for="message"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo</label>
                        <div class="md:order-2" >
                            <div class="image-selector border-gray-300" @dragover.prevent="onDragOver"
                                @drop.prevent="onDrop" @click="selectImg">
                                <div v-if="previewImage" class="image-preview">
                                    <img :src="previewImage" alt="Preview Image" class="uploading-image" />
                                    <div class="img-hover">
                                        <i class="uil uil-image-edit"></i>
                                    </div>
                                </div>
                                <i v-else class="uil uil-image-plus"></i>
                                <input id="imgInput" name="file" type="file" @change="updateImage" style="display:none">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="py-5 border-t border-b dark:border-gray-600 btn-class">
                    <button type="submit"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                            v-if="showSpinner">Loading ...</span>
                        <span v-show="!showSpinner"><i class="uil uil-save"></i> {{ type }} advantage</span>
                    </button>
                    <button @click.stop="(e) => resetForm(e)"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800">
                        <span><i class="uil uil-times"></i> Clear </span>
                    </button>
                </div>
            </form>
        </div>
        <div class="template-container">
            <AdvantageTemplate @select="(advantage) => selectAdvantage(advantage)" />
        </div>
    </div>
</template>


<script setup>
import moment from 'moment';
import { useRoute, useRouter } from "vue-router";
import { ref, inject, computed, watch, onBeforeMount, defineAsyncComponent, defineEmits, onMounted } from 'vue';
import services from '@Services/services.js';
import { useWindowSize } from '@vueuse/core';
import { useUserStore } from "@Stores/user.js";
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ElMessage, ElOption, ElSelect, ElDatePicker, ElTooltip, ElInput } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/date-picker/style/css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

const QrCodeModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/QrCodeModalComponent.vue')
)

const AdvantageTemplate = defineAsyncComponent(() =>
    import('@Components/advantage/AdvantageTemplateComponent.vue')
)

const Tooltip = defineAsyncComponent(() =>
    import('@Components/utils/QuestionMarkTooltipComponent.vue')
)

const scopeOptions = ref([
    { label: 'individual', value: 'individual' },
    { label: 'bill', value: 'bill' },
]);

const categoriesOptions = ref([
    { label: 'Discount', value: 'Discount' },
    { label: 'Gift', value: 'Gift' },
    { label: 'Free', value: 'Free' },
    { label: 'Lottery', value: 'Lottery' },
]);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],      
  ['link'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],   
                     

  //[{ 'size': ['small', false, 'large', 'huge'] }],  
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],

  [{ 'color': [] }, { 'background': [] }],          

                                     
]


const sections = ref(['','MENUS', 'REVIEWS', 'OFFERS', 'INFOS', 'FOLLOW US'])
const section = ref('')
const website = ref('')
const userStore = useUserStore();
const { width } = useWindowSize();
const route = useRoute();
const showSpinner = ref(false);
const emit = defineEmits();
const dateFrom = ref(null);
const dateTo = ref(null);
const expiredAt = ref(null);
const category = ref('');
const advantageName = ref('');
const establishment = ref("");
const code = ref('');
const amount = ref(null);
const currency = ref('');
const metric = ref('');
const scope = ref(null);
const validity = ref(null);
const advantageLimit = ref(null);
const positioning = ref(null);

const type = ref('add');
const advantage_to_update = inject('advantage_to_update');

const advantages = inject('advantages');
const activeAdvantageTab = inject('advantage_activeTab');
const metrics = ref(['Percent', 'Amount'])

const imageInputHover = ref(false);
const imgHasChanged = ref(false);
const previewImage = ref(null);

const description = ref('')
const descriptionContent = ref('')

const onDragOver = (event) => {
    imageInputHover.value = true;
};

const handleDescriptionChange = () => {
    descriptionContent.value = description.value.getContents()
}

const advantageContainerWidth = computed(() => {

    console.clear()
    console.log(route.name)

    if(width.value < 850) {
        return route.name === 'LeadgenAdvantage' ? `${100}%` : `${89}%`
    }

    return `${100}%`
});

const onDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (isImageFile(file)) {
            updateImageFromFile(file);
            document.getElementById('imgInput').files = event.dataTransfer.files;
            imgHasChanged.value = true;
        } else {
            showErrorMessage("Veuillez télécharger un fichier image valide.");
        }
    }
};

const isImageFile = (file) => {
    return ['image/png', 'image/jpeg', 'image/gif'].includes(file.type);
};

const updateImageFromFile = (file) => {
    if (isImageFile(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            previewImage.value = e.target.result;
            const event = new Event('change', { bubbles: true });
            document.getElementById('imgInput').dispatchEvent(event);
        };
    } else {
        showErrorMessage("Veuillez télécharger un fichier image valide.");
    }
};

const updateImage = (e) => {
    const image = e.target.files[0];
    if (isImageFile(image)) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            previewImage.value = e.target.result;
        };
        imgHasChanged.value = true;
    } else {
        showErrorMessage("Please upload a valid image file.");
    }
};

const showErrorMessage = (message) => {
    ElMessage({
        message: message,
        type: 'error',
    });
};

const selectImg = () => {
    document.getElementById('imgInput').click();
}

watch(advantage_to_update, () => {

    if (advantage_to_update.value != null) {
        dateFrom.value = advantage_to_update.value["date_from"];
        dateTo.value = advantage_to_update.value["date_to"];
        expiredAt.value = advantage_to_update.value["expired_at"];
        category.value = advantage_to_update.value["category"];
        code.value = advantage_to_update.value["code"];
        metric.value = advantage_to_update.value["metric"];
        scope.value = advantage_to_update.value["scope"];
        validity.value = advantage_to_update.value["validity"];
        amount.value = advantage_to_update.value["amount"];
        currency.value = advantage_to_update.value["currency"];
        advantageName.value = advantage_to_update.value["name"];
        establishment.value = `/api/establishments/${advantage_to_update.value['establishment_id']},${advantage_to_update.value['establishment_name']}`
        advantageLimit.value = advantage_to_update.value["advantageLimit"];
         positioning.value = advantage_to_update.value["positioning"];
        advantage_to_update.value["description"] !== null && description.value.setContents(advantage_to_update.value["description"]);
        section.value = advantage_to_update.value["section"];
        website.value = advantage_to_update.value["website"];
        type.value = 'edit';

        if (advantage_to_update.value.logo) {
            previewImage.value = advantage_to_update.value.logo;
        } else {
            previewImage.value = null;
        }
    }
})

const resetForm = (e = null) => {
    if(e) e.preventDefault();

    dateFrom.value = null;
    dateTo.value = null;
    expiredAt.value = null;
    description.value.setContents('');
    category.value = '';
    code.value = '';
    advantageName.value = '';
    amount.value = '';
    currency.value = '';
    metric.value = '';
    scope.value = '';
    validity.value = '';
    advantageLimit.value = '';
    positioning.value = '';
    section.value = '';
    website.value = '';
    establishment.value = "";
    imgHasChanged.value = false;
    previewImage.value = null;
    type.value = 'add';
}

const submit = async () => {
    const formData = new FormData();
    const establishmentPath = establishment.value.split(",")[0];
    const establishmentId = establishmentPath.split("/").pop();

    const selectedEstablishment = userStore.user.customer.establishments.find(
        (item) => item.id === parseInt(establishmentId, 10)
    );

    category.value != "" ? formData.append("category", category.value != "" ? category.value : null) : null;
    code.value != "" ? formData.append("code", code.value != "" ? code.value : null) : null;
    advantageName.value != "" ? formData.append("name", advantageName.value != "" ? advantageName.value : null) : null;
    amount.value != null  ? formData.append("amount", amount.value != null ? parseFloat(amount.value) : null) : null;
    currency.value != "" ? formData.append("currency", currency.value != "" ? currency.value : null) : null;
    metric.value != "" ? formData.append("metric", metric.value != "" ? metric.value : null) : null;
    formData.append("enable", true);
    formData.append("establishment", selectedEstablishment?.competitor_tag || "");
    scope.value != null ? formData.append("scope", scope.value != null ? scope.value : null) : null;
    validity.value != null && validity.value != "" ? formData.append("validity", validity.value != null && validity.value != "" ? parseInt(validity.value) : null) : null;
    formData.append("description", descriptionContent.value)
    expiredAt.value != null ? formData.append("expiredAt", expiredAt.value != null ? moment(expiredAt.value).format('YYYY-MM-DD') : null) : null;
    advantageLimit.value != null ? formData.append("advantageLimit", advantageLimit.value != null ? advantageLimit.value : null) : null;
    positioning.value != null ? formData.append("positioning", positioning.value != null ? positioning.value : null) : null;
    dateFrom.value != null ? formData.append("dateFrom", dateFrom.value != null ? moment(dateFrom.value).format('YYYY-MM-DD') : null) : null;
    dateTo.value != null ? formData.append("dateTo", dateTo.value != null ? moment(dateTo.value).format('YYYY-MM-DD') : null) : null;
    section.value != "" ? formData.append("section", section.value != "" ? section.value : null) : null;
    website.value != "" ? formData.append("website", website.value != "" ? website.value : null) : null;

    if (type.value === 'edit' && advantage_to_update.value !== null) {
        const advantageId = advantage_to_update.value.id;
        formData.append("id", advantageId);
    }

    const imageInput = document.getElementById('imgInput');
    if (imageInput.files.length > 0) {
        formData.append("file", imageInput.files[0]);
    }

    const handleResponse = (response) => {

        if (response && (response.status === 201 || response.status === 200)) {
            ElMessage({
                message: `Advantage ${type.value === 'add' ? 'added' : 'updated'} successfully.`,
                type: 'success',
            });
            emit('advantage-updated');
            resetForm();
        } else {
            ElMessage.error(`Failed to ${type.value === 'add' ? 'add' : 'update'} advantage.`);
        }
        showSpinner.value = false;
    };

    showSpinner.value = true;
    services.postFormData('advantage/front_post', formData, handleResponse);
};

const selectAdvantage = (advantage) => {
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    dateFrom.value = advantage.From ? new Date(advantage.From) : advantage.From;
    dateTo.value = advantage.To ? new Date(advantage.To) : advantage.To;
    expiredAt.value = advantage.Expired_at ? new Date(advantage.Expired_at) : advantage.Expired_at;
    description.value.setContents(advantage.description);
    category.value = capitalize(advantage.Category);
    code.value = null;
    advantageName.value = advantage.Name;
    amount.value = advantage.Amount;
    currency.value = advantage.Currency;
    metric.value = advantage.Metric;
    scope.value = advantage.Scope;
    validity.value = advantage.Validity;
    advantageLimit.value = advantage.Limit;
    positioning.value = advantage.positioning;
    const companies = userStore.user.customer.establishments
    establishment.value = companies.length > 0 ? `/api/establishments/${companies[0].id},${companies[0].name}` : "";
};

onBeforeMount(() => {
    const establishments = userStore.user?.customer?.establishments;
    if (establishments?.length > 0) {
        establishment.value = `/api/establishments/${establishments[0].id},${establishments[0].name}`;
    }
})

</script>

<style scoped>
.advantage_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
}

.form-container {
    flex: 3;
}

.btn-class {
    display: flex;
    justify-content: space-between;
}

.template-container {
    flex: 1;
}

@media (max-width: 850px) {
    .advantage_container {
        flex-direction: column-reverse;
    }
    .px-2 {
        padding-left: 5px;
    }
}

@media (max-width: 768px) {
    .form-container {
        width: auto;
    }

    .btn-class {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
    }

    form {
        margin: 0 0;
    }
}

form button {
    width: 9rem !important;
}

.security__header {
    display: flex;
    justify-content: space-between;
}

.security__header h4 {
    color: var(--color-bg2);
    font-size: 19px;
    font-weight: bold;
}

.security__header p {
    font-size: 15px;
    margin: 8px 0;
}

input,
select {
    border-radius: 4px !important;
    background-color: white;
}

label {
    font-weight: 500 !important;
    font-size: 14px !important;
    color: var(--color-bg2) !important;
}

label span {
    color: red;
}

input {
    caret-color: var(--light-color-bg2);
}

.demo-tabs {
    /* min-height: inherit !important; */
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}


.image-selector {
    width: 100%;
    height: 270px;
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.image-selector.hover:hover {
    background: rgba(245, 245, 250, .4);
}

.image-selector * {
    font-size: 64px;
    color: var(--color-bg2)
}

.img-hover {
    width: 100%;
    height: 100%;
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(245, 245, 250, .4);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>