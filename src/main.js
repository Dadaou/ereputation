import '@Assets/main.css'
import 'vuesalize/dist/vuesalize.css'

import { createApp , ref} from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import Vuesalize from 'vuesalize'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import services from '@Services/services.js'
import 'animate.css'

import App from './App.vue'
import router from './router'
import {i18n} from './i18n'

var lg = localStorage.getItem("langue")
if(lg ==null)
    localStorage.setItem("langue","EN")

localStorage.setItem("api_url",import.meta.env.VITE_APP_URL)
const app = createApp(App)
const head = createHead()
const baseurl = ref(window.location.origin)
app.provide('tag', '');
app.provide('app_url', baseurl)
export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(head)
app.use(router)
app.use(Vuesalize)
app.use(i18n)
services.setURL(import.meta.env.VITE_APP_API_URL)

app.mount('#app')
