<template>
    <div>
        <MyQrcode />
    </div>

</template>
<script setup>
import MyQrcode from './MyQRCodesPageView.vue';
</script>
<style scoped>
@media screen and (max-width: 750px) {
    .user__main__container {
        min-width: 118% !important;
    }
}
</style>