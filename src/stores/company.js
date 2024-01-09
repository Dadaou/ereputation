import { defineStore } from 'pinia'
import services from '@Services/services.js'
// import moment from 'moment'
import { useAppStore } from '@Stores/app.js'
import { useUserStore } from '@Stores/user.js'
import { ref } from 'vue'

export const useCompanyStore = defineStore('company', () => {
  const establishments = ref(null)
  const establishment = ref(null)
  const appStore = useAppStore()

  const fetchCustomerEstablishments = async () => {
    const userStore = useUserStore()

    if (userStore.user.customer !== null) {
      const response = await new Promise((resolve) => {
        services.get_Record(
          `/customer/${userStore.user.customer.tag}/establishments/all`,
          (response) => {
            resolve(response)
          }
        )
      })

      if (response.status == 200) {
        establishments.value = {}
        response.data.forEach((item) => {
          establishments.value[item.competitor_tag] = item
        })
        return true
      } else {
        return true
      }
    } else {
      establishments.value = {}
      return true
    }
  }

  const getEstablishment = async (tag) => {
    if (!establishments.value || !(tag in establishments.value)) {
      await fetchCustomerEstablishments()
    }

    if (!(tag in establishments.value)) {
      return false
    }

    return establishments.value[tag]
  }

  const getEstablishments = async () => {
    // if (!establishments.value) {
    //   await fetchCustomerEstablishments()
    // }
    await fetchCustomerEstablishments()
    appStore.isLoading = false
    return Object.values(establishments.value)
  }

  const formatRating = (rating) => {
    rating = rating.includes('/') ? rating.slice(0, -2) : rating
    rating = rating.includes('/') ? rating.slice(0, -1) : rating
    rating = rating.includes(',') ? rating.replace(',', '.') : rating
    return Number(rating)
  }
  const generateLegend = (data, colors) => {
    let legend = []
    var index = 0
    if (data.length) {
      Object.keys(data[0]).forEach((k) => {
        if (k != 'name') {
          legend.push({
            name: k,
            color: colors[index]
          })
          index++
        }
      })
    }

    return legend
  }

  const generateLegendV2 = (data, colors) => {
    let legend = []

    var index = 0

    data.forEach((element) => {
      legend.push({
        name: element,
        color: colors[index]
      })
      if (index >= data.length - 1) index = 0
      index++
    })
    return legend
  }

  return {
    establishments,
    establishment,
    fetchCustomerEstablishments,
    getEstablishment,
    getEstablishments,
    formatRating,
    generateLegendV2,
    generateLegend
  }
})
