import { defineStore } from 'pinia'
import { ref } from 'vue'
import services from '@Services/services.js'
// import moment from 'moment'

export const useChartsStore = defineStore(
  'charts',
  () => {
    const byDays = ref({})
    const byWeeks = ref({})
    const byMonths = ref({})
    const byQuarters = ref({})
    const bySemesters = ref({})

    const fetchData = async (tags, type, from, to, platform, next) => {
      let apiBase = `/charts/comparaison`
      let apiParams = `tags=${tags}&type=${type}`
      if (from !== 'Invalid Date' && to !== 'Invalid Date') {
        apiParams += `&from=${from}&to=${to}`
      }

      if (platform && platform != 'global') {
        apiParams += `&platform=${platform}`
      }

      const api = apiBase + '?' + apiParams
      await services.get_Record(api, (response) => {
        if (response && response.status == 200) {
          next(response)
        }
      })
    }

    const loadData = async (tag, type, from, to, platform, formatedDates = true) => {
      let fFrom = from
      let fTo = to

      if (!formatedDates) {
        const tFrom = from.split('/')
        const tTo = to.split('/')
        fFrom = `${tFrom[2]}-${tFrom[1]}-${tFrom[0]}`
        fTo = `${tTo[2]}-${tTo[1]}-${tTo[0]}`
      }

      let result = []

      await fetchData(tag.join(','), type.toLowerCase(), fFrom, fTo, platform, (response) => {
        let data = response.data.data
        if (data.length) {
          let items = data.length
          Object.keys(data[0].data).forEach((key) => {
            let tmp = { name: key }
            for (let i = 0; i < items; i++) {
              tmp[data[i].name] = data[i].data[key]
            }
            result.push(tmp)
          })
        }
      })

      return result
    }


    const fetchDataCompetitor = async (tags, type, from, to, platform, next) => {
      let apiBase = `/analysis/competitors`
      let apiParams = `tag=${tags}&type=${type}`
      if (from !== 'Invalid Date' && to !== 'Invalid Date') {
        apiParams += `&from=${from}&to=${to}`
      }

      if (platform && platform != 'global') {
        apiParams += `&platform=${platform}`
      }

      const api = apiBase + '?' + apiParams
      await services.get_Record(api, (response) => {
        if (response && response.status == 200) {
          next(response)
        }
      })
    }

    const loadDataCompetitor = async (tag, type, from, to, platform, formatedDates = true) => {
      let fFrom = from
      let fTo = to

      if (!formatedDates) {
        const tFrom = from.split('/')
        const tTo = to.split('/')
        fFrom = `${tFrom[2]}-${tFrom[1]}-${tFrom[0]}`
        fTo = `${tTo[2]}-${tTo[1]}-${tTo[0]}`
      }

      let result = []

      await fetchDataCompetitor(tag, type.toLowerCase(), fFrom, fTo, platform, (response) => {
        let data = response.data.data
        if (data.length) {
          let items = data.length
          Object.keys(data[0].data).forEach((key) => {
            let tmp = { name: key }
            for (let i = 0; i < items; i++) {
              tmp[data[i].name] = data[i].data[key]
            }
            result.push(tmp)
          })
        }
      })

      return result
    }

    return {
      byDays,
      byWeeks,
      byMonths,
      byQuarters,
      bySemesters,
      // updateData,
      // checkData,
      fetchData,
      loadData,
      fetchDataCompetitor,
      loadDataCompetitor
    }
  }
  // {
  //   persist: true
  // }
)
