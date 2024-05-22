import { defineStore } from 'pinia'
import services from '@Services/services.js'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    entity: 'reviews'
  }),
  actions: {
    async createReview(review, next) {
      await services.createRecord('review/feedback', review, (response) => {
        next(response)
      })
    },

    async updateReview(id, review, next) {
      await services.patchRecord(this.entity, id, review, (response) => {
        next(response)
      })
    },

    async updatePost(id, post, next) {
      await services.patchRecord('social_posts', id, post, (response) => {
        next(response)
      })
    },

    async updateReviewCategory(id, type, old, current, ishashtag, next) {
      let api = '/modify/classification'

      //comment if comment, review if review and post if hashtag
      let parameters = ishashtag
        ? `type=${type}&post=${id}&current_category=${current}`
        : `type=${type}&review=${id}&current_category=${current}`

      parameters =
        type == 'add'
          ? `${parameters}&old_category`
          : old !== ''
          ? `${parameters}&old_category=${old}`
          : `${parameters}&old_category=${null}`

      api = `${api}?${parameters}`

      const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
          resolve(response)
        })
      })
      next(response)
    },

    isBeforeTargetDate(expiredDate) {
      var currentDate = new Date()
      var targetDate = new Date(expiredDate)
      return currentDate < targetDate
    },

    getRandomValue(n) {
      return Math.floor(Math.random() * n)
    },

    async getRandomAdvantage(tag, id) {
      const response = await new Promise((resolve) => {
        services.get_Record(`customer/establishments/advantages?tag=${tag}`, (response) => {
          resolve(response)
        })
      })

      if (response.status === 200) {
        let allAdvantages = response.data

        if (allAdvantages.length > 0) {
          allAdvantages = allAdvantages.filter(
            (adv) =>
              adv.establishment_tag == id &&
              adv.enable == true &&
              this.isBeforeTargetDate(adv.expired_at)
          )
          return allAdvantages[this.getRandomValue(allAdvantages.length)]
        }
      }

      return null
    }
  }
})
