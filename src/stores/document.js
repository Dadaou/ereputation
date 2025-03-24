import { defineStore } from 'pinia'
import services from '@Services/services.js'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documents: [],
    entity: 'document',
    document: null,
    action: null
  }),
  actions: {
    async updateDocument(document, id, next) {
      await services.putRecord(this.entity, id, document, (response) => {
        next(response)
      })
    },

    async fetchOne(id, next) {
      try {
        await services.getRecord(this.entity, id, (response) => {
          next(response)
        })
      } catch (error) {
        console.error(error)
      }
    },

    setDocument(data) {
      this.document = data
    },

    resetDocument() {
      this.document = null
    },

    getDocument() {
      return this.document
    },

    setAction(action) {
      this.action = action
    },

    getAction() {
      return this.action
    }
  }
})
