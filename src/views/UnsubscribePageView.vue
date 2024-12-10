<template>

        <div class="container" :class="{ 'hover': isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">

            <div v-show="show" style="display: flex; justify-content: center; align-items: center; flex-direction: column; ">

                <div>
                    <p>{{ $t("unsubscribe.confirmation_text") }}</p>
                </div>

                <div>
                    <el-button class= "validateBtn" :loading="loading" @click.stop="unsubscribe">{{ $t("login.confirm") }}</el-button>
                </div>

            </div>

            <div v-show="!show">

                <p>{{ $t("unsubscribe.after_submit_text1") }}</p>
                <p>{{ $t("unsubscribe.after_submit_text2") }}</p>

            </div>
        </div>
</template>


<script setup>
import { ref, onBeforeMount } from 'vue'
import { useAppStore } from "@Stores/app.js";
import { ElButton, ElMessage } from 'element-plus'
import services from '@Services/services.js'
import { useRoute } from 'vue-router';


const appStore = useAppStore()
const route = useRoute()
const loading = ref(false)
const show = ref(true)
const isHovered = ref(false)

const unsubscribe = async (e) => {
    e.preventDefault()
    await processUnsubscribe()
}

const processUnsubscribe = async() => {
 
    const establishmentTag = route?.params?.tag_establishment
    const contactTag = route?.params?.tag_contact

    try {

        loading.value = true

        const response = await new Promise((resolve) => {

            services.post_Record(`/public/${establishmentTag}/${contactTag}/unsubscribe`, {}, (response) => {
                resolve(response)
            }, true, false)
        })

        if (response.status == 201) {
            show.value = !show.value
        }

        else {
            showError()
        }
    }

    catch (e) {
        showError()
    }

    finally {
        loading.value = false
    }
}

const showError = () => {
    ElMessage({
        message: 'An error has occurred',
        type: 'warning',
    });
}


onBeforeMount(async ()=>{
    appStore.header = false;
 });

</script>

<style scoped>

.container {
  position: relative;
  background: white;
  padding: 2.5rem;
  border-radius: 14px;
  box-shadow: 5px 4px 6px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  min-width: 500px;
  max-width: 400px;
  margin-top: 15%;
}


p {
    word-wrap: break-word;
    text-align: justify;
    line-height: 1.5;
}

.validateBtn {
    color: var(--color-white);
    background-color: var(--color-bgp);
    margin-top: 15px;
}

@media screen and (max-width: 800px) {
    .container {
        min-width: 300px;
    }
}

</style>