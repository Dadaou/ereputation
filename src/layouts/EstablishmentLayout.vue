<template>
    <NavbarComponent></NavbarComponent>
    <div class="main__container" v-if="appStore.isExist">
        <HeadComponent :page="appStore.currentPage"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="appStore.breadcrumbs" :tag="customerTag"/>
        </div>
        <div class="app__container">
            <router-view></router-view>
        </div>
    </div>
    <EstablishmentNotFound v-else />
    <FooterComponent></FooterComponent>
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
import { defineAsyncComponent, inject } from 'vue'

import HeadComponent from '@Components/layouts/HeadComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';

const FooterComponent = defineAsyncComponent(() =>
    import('@Components/layouts/FooterComponent.vue')
)
const NavbarComponent = defineAsyncComponent(() =>
    import('@Components/layouts/NavbarTempComponent.vue')
)
const EstablishmentNotFound = defineAsyncComponent(() =>
    import("@Views/EstablishmentNotFound.vue")
)

const appStore = useAppStore();
const customerTag = inject('tag');

</script>

<style>
.dashboard_mobile{
    display: flex;
    justify-content: space-between;
    padding: 5px;
    border: 1px solid var(--color-primary);
    color: white !important;
    border-radius: 5px
}

.dashboard_mobile >div{
    padding: 7px 5px;
}

.app__container {
    margin-top: 5rem;
    min-height:calc(90dvh - 140px);
    width: var(--container-width-lg);
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
}

.left__side {
    width: calc(100% - 400px);
    padding: 50px 5px;
}

.left__side .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    
}

.right__side {
    width: 400px;
    padding: 50px 0px;
}

.main__container,
.left__side {
    overflow-x: hidden;
}

.establishment {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
}

.establishment__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
}

.establishment__info_tablet {
    margin-top: 50px;
}

.establishment__info i,
.establishment__info_tablet i {
    color: var(--color-danger);
    margin-right: 5px;
}

.establishment__info label,
.establishment__info_tablet label {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.establishment__info_tablet div {
    display: flex;
}


.society__name {
    margin: 5px 0;
    display: flex;
}

.society__location {
    display: flex;
}

.society__location span {
    display: block;
    flex-basis: 225px;
    line-height: 1.2;
}

.tablet_mobile__head,
.tablet_mobile__filter {
    display: none;
}

.community__feedback {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    height: 125px;
    padding: 15px;
    margin: 15px auto;
    width: 100%;
}
.community__feedback .title {
    font-size: 15px;
    font-weight: 600;
}

.community__feedback h2 {
    font-size: 14px;
    font-weight: 500;
}

.app__title {
    font-weight: 800;
    color: var(--color-danger);
}

.app__title h1 {
    font-size: 20px;
    transition: var(--transition);
}

.app__title h2 {
    font-size: 18px;
    transition: var(--transition);
}

.no-comment {
  margin-top: 10px;
  color: #888; 
  font-style: italic; 
}   

.right__side .establishment .establishment__img {
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right__side .establishment__img img {
    width: 100%;
    height: auto !important;
    max-height: 100%;
}

.right__side .establishment__info{
    margin-bottom: 15px;
}

.right__side .date__filter{
    margin-top: 10px;
}

.mobile__filter__btn button {
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 5px 6px;
    flex-basis: 100%;
}

.isactive,
.mobile__filter__btn button:hover {
    background-color: var(--color-primary);
    color: white !important;
}

.mobile__filter__btn {
    display: none !important;
}

@media screen and (min-width: 1439px) and (max-width: 2559px) {
    .left__side {
        width: 73.5%;
    }
}

@media screen and (max-width:1440px) {
    .left__side {
        width: 70%;
    }

    .right__side {
        width: 325px;
    }
}

@media screen and (max-width:1024px) {
    .app__container {
        width: var(--container-width-md);
    }

    .right__side {
        width: 275px;
    }
}

@media screen and (max-width: 975px) {
    .app__container {
        flex-direction: column-reverse;
        width: 96% !important;
        justify-content: center;
        align-items: center;
    }

    .left__side {
        width: inherit !important;
    }

    .right__side {
        display: none !important;
    }

    .tablet_mobile__head {
        display: flex;
        justify-content: space-between;
        margin: auto;
        margin-top: 50px;
        width: inherit;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border: 1px solid var(--light-color-bg2);
        border-radius: 5px;
        padding: 15px;
        font-size: 14px;
    }

    .tablet_mobile__head label {
        font-size: 17px !important;
    }

    .tablet_mobile__head span {
        font-weight: 500;
        color: var(--color-bg2);
    }

    .tablet_mobile__filter {
        display: flex;
        width: inherit;
        align-items: center;
        gap: 0.5rem;
        padding: 5px 15px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 5px;
    }

    .tablet_mobile__filter > * {
        flex-basis: 200px;
    }

    .photo {
        flex-basis: 250px;
    }

    .photo div {
        height: 100%;
    }

    .photo img {
        height: 200px;
        width: 100%;
    }
}

@media screen and (max-width:800px) {
    .tablet_mobile__head {
        font-size: 13px !important;
    }

    .tablet_mobile__head label {
        font-size: 15px !important;
    }

    .tablet_mobile__filter {
        gap: 0.25rem;
    }

    .photo {
        flex-basis: 225px !important;
    }
}

@media screen and (max-width:675px) {
    .tablet_mobile__head {
        font-size: 12px !important;
        padding: 10px;
    }

    .tablet {
        display: none !important;
    }

    .mobile__filter__btn {
        display: flex !important;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 10px;
    }

    .photo {
        flex-basis: 210px !important;
    }

    .tablet_mobile__head label {
        font-size: 14px !important;
    }
}

@media screen and (max-width:625px) {
    .tablet_mobile__filter {
        flex-direction: column;
        padding: 5px 0px !important;
    }

    .tablet_mobile__filter > * {
        flex-basis: inherit !important;
        justify-content: center !important;
    }

    .date__picker {
        margin: 5px 0 10px !important;
    }
    .padlist{
        padding:0 7px !important;
    }
}

@media screen and (max-width:500px) {
    .tablet_mobile__head {
        flex-direction: column-reverse;
        gap: 1rem;
    }

    .photo {
        flex-basis: 150px !important;
        height: 100px !important;
    }
}

@media screen and (max-width:475px) {
    .app__container {
        overflow-x: hidden;
    }
}

.containerChart {
    width: 100%;
    overflow-x: auto;
}

.legend-container .title {
    font-size: 13px;
    font-weight: 500;
}

.containerBody,
.containerBody2 {
    height: 200px;
}

.legend-container {
    padding: 1em;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 14px;
    justify-content: center;
}

.badge {
    /* border-radius: 4.5px;*/
    padding: 0;
    width: 25px;
    height: 10px;
    display: inline-block;
    margin-right: 3px;
}

.no__staff {
    display: flex !important;
    align-items: center !important;
}

* {
    transition: var(--transition);
}

.include {
    cursor: pointer;
}

.include a {
    color: var(--color-primary);
}

.not__include a {
    color: var(--light-color-bg2);
}

.include .star__barre {
    background: var(--color-warning);
}

.not__include .star__barre {
    background: var(--color-warning2);
}

.include span {
    color: var(--color-bg2);
}

.not__include span {
    color: rgb(165, 165, 165);
}

.temp__p {
    font-size: 14px;
    color: var(--color-bg1);
    font-weight: 500;
}

.temp__p a:hover {
    background-color: var(--color-danger);
    color: white;
}

.temp__p a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
}

.reviews__content p {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-bg1);
}

.reviews__content a {
    color: var(--color-danger);
    border-bottom: 1px solid var(--color-danger);
    cursor: pointer;
    font-size: inherit;
}

.reviews__content a:hover {
    background-color: var(--color-danger);
    color: white;
}

.reviews__pagination {
    display: flex;
    justify-content: flex-end;
}

.rating__customers {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    margin: 15px auto;
}

.reviews__star {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    width:100%;
}

.date__filter .title {
    font-weight: 600;
}

.filter__content .title {
    font-weight: 500;
}

.filter__content {
    border: 1px solid var(--light-color-bg2);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.rating__customers .title {
    font-size: 15px;
    font-weight: 600;
    margin-left: 15px;
    margin-top: 15px;
}

.reviews__content1 .review span {
    font-size: 12px;
    margin: auto;
}

.legend {
    margin: 15px auto;
}

.comment {
    overflow: hidden;
    text-align: justify;
}

#competitors__dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#website__dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition);
}

#dropdownDivider {
    position: absolute;
}

#dropdownDivider li {
    cursor: pointer;
    padding: 5px 10px;
    margin: auto;
    transform: var(--transition);
}

#dropdownDivider li:hover {
    background-color: var(--color-danger);
    color: var(--color-white);
}

.dashboard__content {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 50px auto;
}

.counter {
    flex-grow: 1;
}

.dashboard__content,
.chart__content,
.reviews__content {
    margin-top: 20px;
}

.rating {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-warning);
}

.rating__statistics {
    display: none;
    margin-bottom: 15px;
    transition: var(--transition);
}

.filter__container {
    display: none;
    transition: var(--transition);
}

.see__more {
    cursor: pointer;
}

.ptable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.ptable th {
    background-color: #678bb1;
    color: white;
}

.ptable th,
.ptable td {
    border: 1px solid #ddd;
    padding: 8px;
}

.ptable tr:nth-child(even) {
    background-color: #f2f2f2;
}

.ptable tr:hover {
    background-color: #ddd;
}

.ptable td:nth-child(3) {
    font-weight: bold;
}

.ptable td:nth-child(5) {
    color: #df6145;
}

.date__picker {
    width: 100% !important;
    margin: 0px 2px !important;
}

@media screen and (max-width: 975px) {

    .dashboard__content,
    .dashboard {
        display: none !important;
    }
}

@media screen and (max-width:800px) {

    .ptable th,
    .ptable td {
        padding: 4px;
    }

    .ptable th {
        font-size: 12px;
    }

    .ptable td {
        font-size: 14px;
    }
}

@media screen and (max-width:500px) {

    .ptable th {
        font-size: 10px;
    }

    .ptable td {
        font-size: 12px;
    }
}

@media screen and (max-width:625px) {

    .date__picker {
        margin: 5px 0 10px !important;
    }
}

@media screen and (max-width:1287px) {
    .counter {
        gap: 2rem !important;
    }
}

.head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
</style>
