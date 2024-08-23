import { defineStore } from 'pinia'
import services from '@Services/services.js'

export const useScreenStore = defineStore('advantage', {
  state: () => ({
    screens: []
  }),

})
