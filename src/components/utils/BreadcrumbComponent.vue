<template>
  <nav v-if="data" class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center" @click="backToList">
        <a class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
          <svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z">
            </path>
          </svg>
          Home
        </a>
      </li>
      <li v-for="item in _data" :key="item.title">
        <div v-if="item.isCurrent == false" class="flex items-center" :class="item.isCurrent ? 'current__url' : ''"
          @click="goback(item.path)">
          <svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"></path>
          </svg>
          <a class="ml-1 text-sm font-medium text-gray-700 hover:text-danger-600 md:ml-2 dark:text-gray-400">
            {{ item.title }}
          </a>
        </div>
        <div v-else class="flex items-center" :class="item.isCurrent ? 'current__url' : ''">
          <svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"></path>
          </svg>
          <a class="ml-1 text-sm font-medium text-gray-700 hover:text-danger-600 md:ml-2 dark:text-gray-400">
            {{ item.title }}
          </a>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '@Stores/app.js';
import { computed } from 'vue';

const router = useRouter();
const appStore = useAppStore();
const props = defineProps({
  data: {
    type: Array,
    required: false,
    default: null
  },
  tag: {
    type: String,
    required: true
  }
})

const _data = computed(() => {
  return props.data;
})

const goback = (path) => {
  appStore.isLoading = true;
  setTimeout(() => {
    router.push(path);
  }, 100)
};

const backToList = ()=>{
  router.push({name: 'EstablishmentList', params:{tag: props.tag}})
};
</script>

<style scoped>
.current__url a {
  color: grey;
}

.current__url a:hover {
  color: grey;
}

a {
  transform: var(--transition);
}

a:hover {
  color: var(--color-danger);
  cursor: pointer;
}
</style>