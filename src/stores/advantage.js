import { defineStore } from 'pinia'
import services from '@Services/services.js'

export const useAdvantageStore = defineStore('advantage', {
  state: () => ({
    advantages: [],
    entity: 'advantages'
  }),
  actions: {
    async addAdvantage(advantage, next) {
      await services.createRecord(this.entity, advantage, (response) => {
        return next(response)
      })
    },
    async removeAdvantage(id, next) {
      await services.deleteRecord(this.entity, id, (response) => {
        next(response)
      })
    },
    async updateAdvantage(event, id, next) {
      await services.patchRecord(this.entity, id, staff, (response) => {
        next(response)
      })
    },
    async getAdvantageAvailable(establishment, isPublic = false) {
      let data = []
      const response = await new Promise((resolve) => {
        services.get_Record(
          `public/customer/establishment/advantages?tag=${establishment}`,
          (response) => {
            resolve(response)
          },
          isPublic
        )
      })

      const isDateNotExpired = (noteDate) => {
        if (noteDate) {
          const parsedNoteDate = new Date(noteDate)
          const currentDate = new Date()
          return parsedNoteDate > currentDate
        }
        return true
      }

      if (response.status === 200) {
        data = response.data.filter((i) => {
          return (
            isDateNotExpired(i.expired_at) &&
            i.enable == true
          )
        })
      }
      return data
    }
  }
})
