<template>
  <div>
    <img v-if="logoSrc" :src="logoSrc" :alt="`${name} logo`" class="gate__logoSrc" />
    <p v-else>Logo not found</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import logos from '@/assets/images/logo/logos';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const logoSrc = computed(() => logos[props.name] || null);
</script>

<style scoped>
.gate__logoSrc {
  height: 70%;
  margin-bottom: 8px;
  border-radius: 6px;
  box-shadow: -1px -2px 2px 0 rgba(97, 94, 94, 0.2);
}
</style>