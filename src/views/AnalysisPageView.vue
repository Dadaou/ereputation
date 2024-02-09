<template>
	
</template>
<script setup>
import { useAppStore } from "@Stores/app.js";
const appStore = useAppStore();
appStore.setCurrentPage({
    title1: "",
    title2: "Analysis",
    icon: "uil-analytics"
});
</script>