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

  const getCssVariable = (item) => {
    const r = document.querySelector(':root')
    const rs = getComputedStyle(r)
    console.log('The value of' + item + ' is: ' + rs.getPropertyValue(item))
  }

  const setCssVariable = (item, value) => {
    const r = document.querySelector(':root')
    r.style.setProperty(item, value)
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
    setAccount,
    setCssVariable,
    getCssVariable
  }
})
