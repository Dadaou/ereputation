import { defineStore } from 'pinia'
import services from '@Services/services.js'
import moment from 'moment'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    establishments: [],
    establishment: null,
    company: { reviews: [] },
    _establishments: [],
    entity: 'establishments',
    reviews: [],
    nb: 0
  }),
  actions: {
    formatRating(rating) {
      rating = rating.includes('/') ? rating.slice(0, -2) : rating
      rating = rating.includes('/') ? rating.slice(0, -1) : rating
      rating = rating.includes(',') ? rating.replace(',', '.') : rating
      return Number(rating)
    },
    generateLegend(data, colors) {
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
      // let legend = []
      //

      // data.forEach((element) => {
      //   legend.push({
      //     name: element.name,
      //     color: colors[index]
      //   })
      //   if (index >= data.length) index = 0
      //   index++
      // })
      // return legend
      return []
    },
    generateLegendAsync(data, colors) {
      let legend = []
      var index = 0

      data.forEach((element) => {
        legend.push({
          name: element.name,
          color: colors[index]
        })
        if (index >= data.length) index = 0
        index++
      })
      return Promise.resolve(legend)
    },
    generateLegendV2(data, colors) {
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
    },
  }
  // persist: true,
})
