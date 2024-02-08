import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const breadcrumbs = ref(null)
  const currentPage = ref('')
  const isExist = ref(true)
  const account = ref(null)

  const setBreadcrumbs = (values) => {
    breadcrumbs.value = values
  }

  const setCurrentPage = (value) => {
    currentPage.value = value
  }

  const setIsExist = (value) => {
    isExist.value = value
  }

  const setAccount = (value) => {
    account.value = value
  }

  return {
    isLoading,
    breadcrumbs,
    isExist,
    currentPage,
    account,
    setBreadcrumbs,
    setCurrentPage,
    setIsExist,
    setAccount
  }
})
