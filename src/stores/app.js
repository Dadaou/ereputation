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

  // Create a function for getting a variable value
  const getCssVariable = (item) => {
    const r = document.querySelector(':root')
    // Get the styles (properties and values) for the root
    var rs = getComputedStyle(r)
    // Alert the value of the --blue variable
    console.log('The value of' + item + ' is: ' + rs.getPropertyValue(item))
  }

  // Create a function for setting a variable value
  const setCssVariable = (item, value) => {
    const r = document.querySelector(':root')
    getCssVariable(item)
    // Set the value of variable --blue to another value (in this case "lightblue")
    r.style.setProperty(item, value)
    getCssVariable(item)
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
