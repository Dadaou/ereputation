<template>
    <div class="head__container" v-if="isSearch == false && page">
        <i v-if="page.icon" class="uil" :class="page.icon"></i>
        <div v-if="page.title1 || page.title2" class="head__title">{{ page.title1 }} <b>{{ page.title2 }}</b></div>
    </div>
    <div class="container head__container" v-else
        :style="isSearch ? { 'backgroundColor': '#f75842', 'height': '9rem' } : {}">
        <slot name="content"></slot>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const props = defineProps({
    page: {
        type: Object,
        required: false,
        default: {
            title1: '',
            title2: '',
            icon: '',
        }
    },
    isSearch: {
        type: Boolean,
        required: false,
        default: false,
    }
});
const route = useRoute();
</script>

<style scoped>
.head__container {
    background-color: rgb(245, 245, 245);
    width: 100% !important;
    height: 5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.head__container i {
    font-size: 40px;
    color: var(--color-danger);
    position: relative;
    top: 8px;
}

.head__container div {
    color: var(--color-bg2);
    font-size: 18px;
    position: relative;
    top: -6px;
}

.head__title {
    padding-top: 1px;
    text-align: center;
}

.uil {
    margin-top: -12px;
}

@media screen and (max-width:1024px) {
    /*.head__container{
        position: absolute;
        top:5rem;
    }*/

    .head__container div {
        font-size: 20px;
    }
}

@media screen and (max-width:900px) {
    .head__container div {
        font-size: 18px;
    }
}

/* Media Queries (Phone) */
@media screen and (max-width:650px) {
    .head__container div {
        font-size: 15px;
    }
}
</style>