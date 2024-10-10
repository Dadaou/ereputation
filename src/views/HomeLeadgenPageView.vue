<template>
    <div class="main__container">
        <div class="container client__container ">
            <div class="header">
                <div class="header_navigation">
                </div>
                <div class="toggle-switch" :class="{ 'active': isActiveLeadgen }">
                    <div class="toggle-option" @click="handleToggleErep">E-Rep</div>
                    <div class="toggle-line"></div>
                    <div class="toggle-option" :class="{ 'selected': isActiveLeadgen }" @click="handleToggleLeadgen">
                        Lead-Gen
                    </div>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const customerTag = inject('tag');
const isActiveLeadgen = ref(true);

const handleToggleErep = () => {
    router.push({ name: 'EstablishmentList', params: { tag: customerTag.value } })
        .catch(err => console.error(err));

}

const handleToggleLeadgen = () => {
    router.push({ name: 'LeadgenView', params: { tag: customerTag.value } })
        .catch(err => console.error(err));
}
</script>
<style scoped>
.main__container {
    margin-top: 20px;
}

.client__container {
    position: relative;
    top: 5rem;
    display: flex;
    gap: 1rem;
    width: 100%;
    flex-direction: column;
    margin-bottom: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
}

.header_navigation {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 10px;
    border-radius: 5px;
    gap: 15px;
}

.toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-switch {
    display: flex;
    background-color: #f0f0f0;
    border-radius: 20px;
    overflow: hidden;
    width: 130px;
    height: 40px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.382);
    border: solid 1px var(--light-color-bg2);
}

.toggle-option {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    transition: color 0.3s;
}

.toggle-line {
    background-color: rgba(128, 128, 128, 0.049);
    width: 1px;
    height: 40px;
}

.toggle-option.selected {
    color: #fff;
}

.toggle-switch.active .toggle-option.selected {
    color: white;
    font-weight: bold;
    background-color: var(--light-color-bg2);
}

.toggle-switch .toggle-option {
    background-color: #fff;
}

@media screen and (min-width: 1024px) {
    .client__container {
        width: 80% !important;
    }
}

@media screen and (max-width: 1024px) {
    .client__container {
        width: 90% !important;
    }
}

@media screen and (max-width: 768px) {
    .client__container {
        width: 96% !important;
    }
}

@media screen and (max-width: 568px) {
    .toggle-switch {
        width: 100px !important;
    }

    .toggle-option {
        font-size: 8px;
    }
}
</style>
