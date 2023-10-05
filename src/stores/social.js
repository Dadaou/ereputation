import { defineStore } from 'pinia'
import services from '@Services/services.js'
import { ref } from 'vue'
import moment from 'moment'

export const useSocialStore = defineStore('social', () => {
  const entity = ref('social')
  const trendsByEstablishment = ref({})
  const histogramByDate = {}
  let globalStatsByYear = {}

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

  const fetchGlobalStats = async (id, year, type, next) => {
    console.log('fetch stats ...')
    if (type == 'monthly') {
      await services.get_Record(
        `social/establishment/${id}/monthly/non/${year}/statistique`,
        (response) => {
          if (response && response.status == 200) {
            console.log(response.data)
            const tmp = { ...globalStatsByYear }
            console.log(tmp)
            tmp[`${id}`] = tmp[`${id}`] || {}
            console.log(tmp)
            tmp[`${id}`][`${year}`] = response.data
            console.log(tmp)
            globalStatsByYear = { ...tmp }
            console.log(globalStatsByYear)
            next(response)
          }
        }
      )
    }
    // if (type == "weekly") {
    //   await services.getRecordAction(
    //     "social/establishment",
    //     id,
    //     `weekly/non/${year}/statistique`,
    //     (response) => {
    //       if (response && response.status == 200) {
    //         const tmp = globalStats[`${id}`]
    //           ? { ...globalStats[`${id}`], ...response.data }
    //           : { ...response.data };
    //         globalStats[`${id}`] = tmp;
    //         next(response);
    //       }
    //     }
    //   );
    // }
  }

  const getHistogram = async (id, date) => {
    const fDate = moment(date).format('DD-MM-YYYY')
    const bDate = moment(date).format('YYYY-MM-DD')
    if (histogramByDate[`${id}`] && histogramByDate[`${id}`][`${fDate}`]) {
      return histogramByDate[`${id}`][`${fDate}`]
    } else {
      await fetchHistogramDate(id, bDate)
      if (histogramByDate[`${id}`] && histogramByDate[`${id}`][`${fDate}`]) {
        return histogramByDate[`${id}`][`${fDate}`]
      } else {
        return null
      }
    }
  }

  return {
    entity,
    trendsByEstablishment,
    histogramByDate,
    globalStatsByYear,
    fetchEstablishmentTrends,
    fetchHistogramDate,
    getHistogram,
    fetchGlobalStats
  }
})
