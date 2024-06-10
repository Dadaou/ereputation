<template>
    <div class="unit__list" v-if="units.length > 0">
        <div class="unit__card" v-for="unit in units" :key="unit">
            <div class="unit__qrcode">
                <div class="unit_info">
                    <ul>
                        <li>
                            <span class="label name">{{ unit.name }}</span>
                        </li>
                        <li>
                            <!-- <span class="label">Code: {{unit.code}}</span> -->
                            <!-- <RouterLink :to="{
                                name: 'UnitReview',
                                params: {
                                    tag: tag,
                                    id: unit.establishment_competitor_tag,
                                    unit: unit.tag
                                }
                            }" class="btn reviews" @click="selectedUnit = unit">
                                Reviews
                            </RouterLink> -->
                        </li>
                    </ul>
                    <RouterLink :to="{
                        name: 'UnitReview',
                        params: {
                            tag: tag,
                            id: unit.establishment_competitor_tag,
                            unit: unit.tag
                        }
                    }" class="btn reviews" @click="selectedUnit = unit">
                        Reviews
                    </RouterLink>
                </div>
                <div>
                    <div id="qrcode__container mt-5" ref="qrcode">
                        <el-tooltip content="Click me to download The unit QRCode" placement="top">
                            <vue-qrious class="qr__code" @click="showModal = true, selectedUnit = unit"
                                :value="`${baseurl}/public/${tag}/establishment/${unit.establishment_competitor_tag}/units/${unit.tag}/feedback`"
                                @change="onDataUrlChange" />
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="units.length == 0">No units</div>
    <QrCodeModalComponent v-if="selectedUnit"
        :qrcodeValue="`${baseurl}/public/${tag}/establishment/${selectedUnit.establishment_competitor_tag}/units/${selectedUnit.tag}/feedback`"
        :showModal="showModal" :filename="`${selectedUnit.name}-feedback-link`" @close="showModal = false" :customer="tag"
        :establishment="selectedUnit.establishment_competitor_tag" type="Services" />
</template>
<script setup>
import { ref, inject, computed, defineAsyncComponent } from 'vue';
import moment from 'moment';
import VueQrious from 'vue-qrious';
import { useWindowSize } from '@vueuse/core';
import services from '@Services/services.js';
import { ElTooltip } from 'element-plus';
import { useRoute } from "vue-router";

const props = defineProps({
    category: {
        type: String,
        required: true
    },
    units: {
        type: Array,
        required: true
    }
});

const tag = inject('tag')

const QrCodeModalComponent = defineAsyncComponent(() =>
    import('@Components/utils/QrCodeModalComponent.vue')
)

const baseurl = window.location.origin;
const base64Image = ref(null);
const qrcode = ref(null);
const onDataUrlChange = (dataUrl) => {
    base64Image.value = dataUrl;
}
const { width } = useWindowSize()
const showModal = ref(false);
const downloaded = ref(false);
const selectedUnit = inject('selectedUnit')
const downloadQrcode = (unit) => {
    const filename = `${unit}-feedback-link`;
    services.downloadQrcode(filename, base64Image.value);
    downloaded.value = true;
}

const modalWidth = computed(() => {
    let windowSize = 1500;
    let gap = (windowSize - width.value) / 19;
    return gap + 45;
});

const close = () => {
    showModal.value = false;
    downloaded.value = false;
};
</script>
<style scoped>
.unit_info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

a.reviews {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
}

.unit_info a.reviews {
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.unit_info a:hover {
    transform: scale(0.95);
}

a {
    text-decoration: none;
}

.unit__list {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.unit__card {
    border: 1px solid var(--light-color-bg2);
    padding: 15px;
    flex-basis: 450px;
    /* flex-grow: 1;*/
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 5px;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    margin-bottom: 10px;
    align-content: center;
}

span.rating {
    color: var(--color-danger);
    font-weight: 600;
}

.unit__card h5 {
    color: var(--color-primary);
}

span {
    font-size: 14px;
    color: var(--color-bg2);
    font-weight: 500;
}

span.label {
    color: var(--color-bg1);
    font-size: 14px;
}

span.name {
    color: var(--color-primary);
    font-weight: 800;
}

.qr__code {
    width: 100% !important;
    padding: 10px auto !important;
    cursor: pointer;
}

.qr__code_view {
    width: 40% !important;
    padding: 10px auto !important;
    margin: auto;
}

.modal__header {
    display: flex;
    justify-content: space-between;
}

.modal__header div {
    align-self: center;
}

.modal__close i {
    float: right;
    font-size: 25px;
    color: red;
    cursor: pointer;
    transition: var(--transition);
}

.establishment__review__qrcode p {
    font-size: 14px;
}

.modal__close i:hover {
    transform: rotate(360deg);
}

.download__qr_btn {
    display: flex;
    justify-content: center;
}

.download__qr_btn button {
    flex-basis: 50%;
}

.unit__qrcode {
    display: flex;
    justify-content: space-between;
}
</style>