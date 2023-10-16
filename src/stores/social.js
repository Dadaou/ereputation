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

  const setGlobalStats = (id, type, data) => {
    if (globalStats.value) {
      if (globalStats.value[id]) {
        const newData = data[id][type]
        if (globalStats.value[id][type]) {
          const initialData = globalStats.value[id][type]
          globalStats.value[id][type] = { ...initialData, ...newData }
        } else {
          globalStats.value[id][type] = { ...newData }
        }
      } else {
        const newData = data[id]
        globalStats.value[id] = { ...newData }
      }
    } else {
      const newData = data
      globalStats.value = { ...newData }
    }
  }

  const fetchGlobalStats = async (id, period, type, next) => {
    console.log('fetch stats ...')
    if (type == 'monthly') {
      await services.get_Record(
        `social/establishment/${id}/monthly/${period}/new_statistique`,
        (response) => {
          if (response && response.status == 200) {
            setGlobalStats(id, type, response.data)
            next(response)
          }
        }
      )
    }
    if (type == 'weekly') {
      await services.get_Record(
        `social/establishment/${id}/weekly/${period}/new_statistique`,
        (response) => {
          if (response && response.status == 200) {
            setGlobalStats(id, type, response.data)
            next(response)
          }
        }
      )
    }
    if (type == 'yearly') {
      await services.get_Record(
        `social/establishment/${id}/yearly/${period}/new_statistique`,
        (response) => {
          if (response && response.status == 200) {
            setGlobalStats(id, type, response.data)
            next(response)
          }
        }
      )
    }
  }

  const getHistogram = async (id, date) => {
    const bDate = moment(date).format('YYYY-MM-DD')
    console.log(bDate)
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

  const getGlobalStats = async (id, type, period) => {
    let tmp = globalStats.value
    if (tmp[`${id}`] && tmp[`${id}`][`${type}`] && tmp[`${id}`][`${type}`][`${period}`]) {
      return tmp[`${id}`][`${type}`][`${period}`]
    } else {
      await fetchGlobalStats(id, period, type)
      tmp = globalStats.value
      if (tmp[`${id}`] && tmp[`${id}`][`${type}`] && tmp[`${id}`][`${type}`][`${period}`]) {
        return tmp[`${id}`][`${type}`][`${period}`]
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
