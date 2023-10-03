import '@Assets/main.css'
import 'vuesalize/dist/vuesalize.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vuesalize from 'vuesalize'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import services from '@Services/services.js'

import App from './App.vue'
import router from './router'



const app = createApp(App)
services.setURL(import.meta.env.VITE_APP_API_URL)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Vuesalize)

app.mount('#app')
