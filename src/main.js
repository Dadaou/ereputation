import '@Assets/main.css'
import 'vuesalize/dist/vuesalize.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vuesalize from 'vuesalize'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import services from '@Services/services.js'

import App from './App.vue'
import router from './router'
import {i18n} from './i18n'

var lg = localStorage.getItem("langue")
if(lg ==null)
    localStorage.setItem("langue","EN")

const app = createApp(App)
app.provide('tag', '');
export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Vuesalize)
app.use(i18n)
services.setURL(import.meta.env.VITE_APP_API_URL)

app.mount('#app')
