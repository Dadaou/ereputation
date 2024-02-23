import { defineStore } from 'pinia'
import { ref } from 'vue'
import moment from 'moment'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const breadcrumbs = ref(null)
  const currentPage = ref('')
  const isExist = ref(true)
  const account = ref(null)
  const start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'))
  const end_date = ref(moment().format('YYYY-M-DD'))

  const setBreadcrumbs = (values) => {
    breadcrumbs.value = values
  }

  const setCurrentPage = (value) => {
    currentPage.value = value
  }

  const setIsExist = (value) => {
    isExist.value = value
  }

  const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

  const setDatesValue = (startDate, endDate) =>{
    start_date.value = IsValueOkay(startDate)?moment(startDate).format('YYYY-M-DD'):moment().subtract(30, 'days').format('YYYY-M-DD');
    end_date.value = IsValueOkay(endDate)?moment(endDate).format('YYYY-M-DD'):moment().format('YYYY-M-DD');
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
    start_date,
    end_date,
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
    getCssVariable,
    setDatesValue
  }
})
