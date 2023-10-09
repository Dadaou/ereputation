import { defineStore } from 'pinia'
import services from '@Services/services.js'
import { ref } from 'vue'
import moment from 'moment'

export const useSocialStore = defineStore('social', () => {
  const entity = ref('social')
  const trendsByEstablishment = ref({})
  const histogramByDate = {}
  const globalStats = ref({})

  const fetchEstablishmentTrends = async (id, next) => {
    await services.get_Record(`social/establishment/${id}/trend`, (response) => {
      if (response && response.status == 200) {
        const tmp = { ...trendsByEstablishment.value }
        tmp[`${id}`] = response.data
        trendsByEstablishment.value = tmp
        next(response)
      }
    })
  }

  const fetchHistogramDate = async (id, endDate, next) => {
    const startDate = `${new Date().getFullYear()}-01-01`
    console.log('fetch histogram ...')
    await services.get_Record(
      `social/establishment/${id}/${startDate}/${endDate}/histogram`,
      (response) => {
        if (response && response.status == 200) {
          const tmp = histogramByDate[`${id}`]
            ? { ...histogramByDate[`${id}`], ...response.data }
            : { ...response.data }
          histogramByDate[`${id}`] = tmp
          next(response)
        }
      }
    )
  }

  const fetchGlobalStats = async (id, value, type, next) => {
    console.log('fetch stats ...')
    if (type == 'monthly') {
      await services.get_Record(
        `social/establishment/${id}/monthly/non/${value}/statistique`,
        (response) => {
          if (response && response.status == 200) {
            const tmp = { ...globalStats.value }
            tmp[`${id}`] = tmp[`${id}`] || { monthly: {} }
            tmp[`${id}`]['monthly'][`${value}`] = response.data
            globalStats.value = { ...tmp }
            console.log(globalStats)
            next(response)
          }
        }
      )
    }
    if (type == 'weekly') {
      await services.get_Record(
        `social/establishment/${id}/weekly/non/${value}/statistique`,
        (response) => {
          if (response && response.status == 200) {
            const tmp = { ...globalStats.value }
            tmp[`${id}`] = tmp[`${id}`] || { weekly: {} }
            tmp[`${id}`]['weekly'][`${value}`] = response.data
            globalStats.value = { ...tmp }
            console.log(globalStats)
            next(response)
          }
        }
      )
    }
  }

  const getHistogram = async (id, date) => {
    const bDate = moment(date).format('YYYY-MM-DD')
    if (histogramByDate[`${id}`] && histogramByDate[`${id}`][`${bDate}`]) {
      return histogramByDate[`${id}`][`${bDate}`]
    } else {
      await fetchHistogramDate(id, bDate)
      if (histogramByDate[`${id}`] && histogramByDate[`${id}`][`${bDate}`]) {
        return histogramByDate[`${id}`][`${bDate}`]
      } else {
        return null
      }
    }
  }

  const getGlobalStats = async (id, type, value) => {
    let tmp = globalStats.value
    if (tmp[`${id}`] && tmp[`${id}`][`${type}`] && tmp[`${id}`][`${type}`][`${value}`]) {
      return tmp[`${id}`][`${type}`][`${value}`]
    } else {
      await fetchGlobalStats(id, value, type)
      tmp = globalStats.value
      if (tmp[`${id}`] && tmp[`${id}`][`${type}`] && tmp[`${id}`][`${type}`][`${value}`]) {
        return tmp[`${id}`][`${type}`][`${value}`]
      } else {
        return null
      }
    }
  }

  return {
    entity,
    trendsByEstablishment,
    histogramByDate,
    globalStats,
    fetchEstablishmentTrends,
    fetchHistogramDate,
    getHistogram,
    fetchGlobalStats,
    getGlobalStats
  }
})
