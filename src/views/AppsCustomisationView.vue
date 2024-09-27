<template>
    <div class="main__container">
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="container client__container">
            <div>
                <form id="themeForm" @submit.prevent="submit" @keydown.enter.prevent="submit" class="mt-4 px-2 h-full">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div class="md:order-1">
                            <div class="image-selector border-gray-300" :class="!previewImage && 'hover'"
                                @click="selectImg" @mouseover="imageInputHover = true"
                                @mouseleave="imageInputHover = false">
                                <img v-if="previewImage" :src="previewImage" class="uploading-image" />
                                <i v-else class="uil uil-image-plus"></i>
                                <div v-if="imageInputHover && previewImage" class="img-hover">
                                    <i class="uil uil-image-edit"></i>
                                </div>
                            </div>
                            <input id="imgLogo" name="file" type="file" @change=updateImage style="display:none">
                        </div>
                        <div class="md:order-2">
                            <div class="mb-6">
                                <label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">Back
                                    color</label>
                                <ColorPicker :value="data.back_color" :predefineColors="predefineColors"
                                    @sync="(color) => updateData(color, 'back_color')" />
                            </div>
                            <div class="mb-6">
                                <label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">Font
                                    color</label>
                                <ColorPicker :value="data.font_color" :predefineColors="predefineColors"
                                    @sync="(color) => updateData(color, 'font_color')" />
                            </div>
                            <div>
                                <label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">Title
                                    color</label>
                                <ColorPicker :value="data.title_color" :predefineColors="predefineColors"
                                    @sync="(color) => updateData(color, 'title_color')" />
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex flex-wrap gap-3 items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600">
                        <button type="submit"
                            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                            <SpinnerComponent :show-spinner="showSpinner" :color="'gray'" /> <span
                                v-if="showSpinner">Loading
                                ...</span>
                            <span v-show="!showSpinner">Update</span>
                        </button>
                        <button @click="resetForm"
                            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800">
                            <span><i class="uil uil-times"></i> Clear </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import SpinnerComponent from '@Components/utils/SpinnerComponent.vue';
import { ref, computed, defineAsyncComponent, onBeforeMount, watch } from 'vue';
import services from '@Services/services.js';
import { useUserStore } from "@Stores/user.js";
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import { useRoute } from 'vue-router';

const page = ref({
    title1: "",
    title2: "Theme",
    icon: "uil-swatchbook",
});
const route = useRoute();
const breadcrumbData = [
    {
        title: "Theme",
        path: `${route.path}`,
        isCurrent: true,
    },
];
const previewImage = ref(null);
const imageInputHover = ref(false);
const imgHasChanged = ref(false);
const data = ref({});
const type = ref('Add');
const showSpinner = ref(false);
const predefineColors = computed(() => {
    let colors = []
    for (let key in data.value) {
        if (key != 'name' && key != 'logo' && key != 'partner') colors.push(data.value[key])
    }
    return colors;
})
const userStore = useUserStore();

const ColorPicker = defineAsyncComponent(
    () => import("@Components/utils/ColorPickerComponent.vue")
);

const resetForm = () => {
    data.value = {};
    previewImage.value = null;
    type.value = 'Add';
}

const updateImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
        previewImage.value = e.target.result;
        data.value['logo'] = previewImage.value
    };
    imgHasChanged.value = true;
};

const selectImg = () => {
    document.getElementById('imgLogo').click();
}

const updateData = (value, key) => {
    data.value[key] = value;
}

watch(data, () => {
    if (data.value !== null) {
        previewImage.value = data.value.logo
    }
})

const IsValueOkay = (value) => (value == '' || value == 0 || value == null || value == undefined) ? false : true;

const loadTheme = async (partner) => {
    let apiBase = 'partner/get/infos/by/id';
    let apiParams = `partner=${partner}`;

    const api = apiBase + '?' + apiParams;

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        const { id, ...theme } = response.data
        data.value = {
            partner: id,
            ...theme
        }
    }
};

const saveTheme = async (data) => {
    let api = 'partner/edit/infos/by/id';
    showSpinner.value = true

    const response = await new Promise((resolve) => {
        services.postFormData(api, data, (response) => {
            resolve(response)
        });
    });

    if (response.status == 200) {
        showSpinner.value = false
    }
};

const submit = async () => {
    const form = document.querySelector('#themeForm');
    const formData = new FormData(form);

    if (data.value) {
        formData.append('partner', data.value.partner);
        formData.append('backcolor', data.value.back_color);
        formData.append('titlecolor', data.value.title_color);
        formData.append('fontcolor', data.value.font_color);

        for (const [key, value] of formData.entries()) {
            if (key === 'file') formData.append('logo', value);
        }
    }

    await saveTheme(formData);

};

onBeforeMount(async () => {
    if (userStore.user.partner) {
        await loadTheme(userStore.user.partner.id)
    }
});
</script>
<style scoped>
.container {
    margin-top: 5em;
}

form {
    height: 750px !important;
}

form button {
    width: 100%;
}

button.isLoaded {
    display: flex;
    justify-content: center;
    align-items: center;
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

.image-selector {
    width: 100%;
    height: 250px;
    border-radius: 8px;
    border-width: 2px;
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

.client__container {
    position: relative;
    top: 1rem;
    height: inherit;
    display: flex;
    gap: 1rem;
    width: var(--container-width-lg);
    flex-direction: column;
    margin-bottom: 20px;
}


@media screen and (max-width:1024px) {
    .client__container {
        width: var(--container-width-md);
    }
}

@media screen and (max-width:975px) {
    .client__container {
        width: 96% !important;
    }
}

/* @media screen and (max-width:1163px) {
    .client__container {
        width: 60% !important;
    }
} */

/* @media screen and (max-width:964px) {
    .client__container {
        width: 65% !important;
    }
} */

/* @media screen and (max-width:884px) {
    .client__container {
        width: 70% !important;
    }
} */

/* @media screen and (max-width:779px) {
    .client__container {
        width: 80% !important;
    }
} */

/* @media screen and (max-width:670px) {
    .client__container {
        width: var(--container-width-md) !important;
    }
} */

@media screen and (min-width: 480px) {

    form button {
        width: 12rem !important;
    }
}
</style>