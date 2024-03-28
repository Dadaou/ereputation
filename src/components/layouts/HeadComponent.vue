<template>
    <div class="head__container" v-if="isSearch == false">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 35 35" v-if="route.name=='Sales'">
                <g transform="scale(0.8 1)">
                  <g transform="scale(0.4 0.35) translate(52 -9)">
                    <path fill="currentColor" fill-rule="evenodd"
                      d="M26 8a2 2 0 1 0-4 0v2a8 8 0 1 0 0 16v8a4.002 4.002 0 0 1-3.773-2.666a2 2 0 0 0-3.771 1.332A8.003 8.003 0 0 0 22 38v2a2 2 0 1 0 4 0v-2a8 8 0 1 0 0-16v-8a4.002 4.002 0 0 1 3.773 2.666a2 2 0 0 0 3.771-1.332A8.003 8.003 0 0 0 26 10zm-4 6a4 4 0 0 0 0 8zm4 12v8a4 4 0 0 0 0-8"
                      clip-rule="evenodd" />
                  </g>
                  <g transform="translate(0 0)">
                    <path fill="none" stroke="currentColor" stroke-width="2"
                      d="m1 16l7-7l5 5L23 4M0 22h23.999M16 4h7v7" />
                  </g>
                </g>
        </svg> -->
        <i class="uil" :class="page.icon"></i>
        <div class="head__title">{{ page.title1 }} <b>{{ page.title2 }}</b></div>
    </div>
    <div class="container head__container" v-else :style="isSearch ? { 'backgroundColor': '#f75842', 'height': '9rem' } : {}">
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
    height: 7.5em;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.head__container i, .head__container svg {
    font-size: 40px;
    color: var(--color-danger);
    position: relative;
    top: 8px;
}

.head__container div {
    color: var(--color-bg2);
    font-size: 18px;
    position: relative;
    top: -7px;
}

.head__title {
    padding-top: 15px;
    text-align: center;
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