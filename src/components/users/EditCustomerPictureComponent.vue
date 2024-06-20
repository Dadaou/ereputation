<template>
    <form id="editForm" @submit.prevent="upload">
        <div class="md:order-2">
            <div class="image-selector border-gray-300" :class="!previewImage && 'hover'" @click="selectImg"
                @mouseover="imageInputHover = true" @mouseleave="imageInputHover = false">
                <img v-if="previewImage" :src="previewImage" class="uploading-image" />
                <i v-else class="uil uil-image-plus"></i>
                <div v-if="imageInputHover && previewImage" class="img-hover">
                    <i class="uil uil-image-edit"></i>
                </div>
            </div>
            <input id="logoInput" name="file" type="file" @change=updateImage style="display:none">
        </div>
        <div
            class="flex flex-wrap gap-3 items-center justify-between px-3 py-2 border-t border-b dark:border-gray-600 mt-5">
            <button @click="resetForm"
                class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800">
                Cancel
            </button>
            <button type="submit"
                class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Upload
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from "@Stores/user.js";
import services from '@Services/services.js';
import { formatDate } from '@vueuse/core';

const userStore = useUserStore();
const previewImage = ref(null);
const imageInputHover = ref(false);
const imgHasChanged = ref(false);

const updateImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
        previewImage.value = e.target.result;
    };
    imgHasChanged.value = true;
};

const selectImg = () => {
    document.getElementById('logoInput').click();
};


const upload = async () => {
    if (!imgHasChanged.value || !previewImage.value) {
        ElMessage.error('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    

    formData.append('file', previewImage.value);
    formData.append('tag', userStore.customer.tag);

    try {
        const response = await new Promise((resolve) => {
            services.post_Record('/customer/update_logo', formData, (response) => {
            resolve(response)
        },);
    });
        if (response.status === 200) {
            previewImage.value = response.data.logoUrl;
            ElMessage.success('Logo updated successfully!');
        } else {
            ElMessage.error(response.data.message || 'An error occurred while uploading the logo.');
        }
    } catch (error) {
        ElMessage.error('An error occurred while uploading the logo.');
        console.error(error);
    }
};

const resetForm = () => {
    previewImage.value = null;
    imgHasChanged.value = false;
};
</script>

<style scoped>
.image-selector {
    width: 175px;
    height: 175px;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    margin: auto;
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