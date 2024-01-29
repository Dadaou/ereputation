<template>
  <div class="subscription__container">
    <div class="subscription-page-header">
      <div class="container" style="padding-inline: 16px;">
        <a :href="'/'" class="flex items-center">
          <span class="self-center text-xl font-bold whitespace-nowrap dark:text-white"
            style="color: var(--color-danger)">eReputation</span>
        </a>
        <RouterLink :to="`/`" class="relative p-2 login-link">
          <span class="font-bolder"> Sign In</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
</script>
<style>
.subscription__container {
  width: 100%;
}

.subscription-page-header {
  width: 100vw;
  height: 5rem;
  position: fixed;
  top: 0;
  z-index: 11;
  color: var(--color-white);
  background: rgb(66, 72, 144);
  background: linear-gradient(180deg, rgba(216, 217, 226, 1) 0%, white 100%);
  border-bottom: 1px solid rgba(66, 72, 144, .1);
}

.subscription-page-header .container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.subscription-page-header .login-link {
  color: #111;
  font-weight: 600;
}

.subscription-page-header .login-link:hover {
  text-decoration: underline;
}
</style>