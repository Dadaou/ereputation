import { defineStore } from 'pinia'
import { ref } from 'vue'
import moment from 'moment'
import services from '@Services/services.js'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const breadcrumbs = ref(null)
  const currentPage = ref('')
  const isExist = ref(true)
  const account = ref(null)
  const start_date = ref(moment().subtract(30, 'days').format('YYYY-M-DD'))
  const end_date = ref(moment().format('YYYY-M-DD'))
  const customerLogo = ref(null)
  const mustRefresh = ref(false)

  const setBreadcrumbs = (values) => {
    breadcrumbs.value = values
  }

  const setCurrentPage = (value) => {
    currentPage.value = value
  }

  const setIsExist = (value) => {
    isExist.value = value
  }

  const IsValueOkay = (value) =>
    value == '' || value == 'Global' || value == 0 || value == null || value == undefined
      ? false
      : true

  const setDatesValue = (startDate, endDate) => {
    start_date.value = IsValueOkay(startDate)
      ? moment(startDate).format('YYYY-M-DD')
      : moment().subtract(30, 'days').format('YYYY-M-DD')
    end_date.value = IsValueOkay(endDate)
      ? moment(endDate).format('YYYY-M-DD')
      : moment().format('YYYY-M-DD')
  }

  const setCustomerLogo = async (tag) => {
    const response = await new Promise((resolve) => {
      services.get_Record(`customer/logo?tag=${tag}`, (response) => {
        resolve(response)
      })
    })

    console.log(response)
    if ((response.status = 200)) {
      customerLogo.value = response.data
    }
  }

  const getCustomerLogo = async (tag) => {
    console.log(!customerLogo.value)
    if (!customerLogo.value) await setCustomerLogo(tag)
    return customerLogo.value
  }

  const setAccount = (value) => {
    account.value = value
  }

  return {
    start_date,
    end_date,
    isLoading,
    breadcrumbs,
    customerLogo,
    isExist,
    currentPage,
    account,
    mustRefresh,
    setBreadcrumbs,
    setCurrentPage,
    setIsExist,
    setAccount,
    setDatesValue,
    setCustomerLogo,
    getCustomerLogo
  }
})
