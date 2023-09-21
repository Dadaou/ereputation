import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import services from '@Services/index.js';
import axios from 'axios';
import moment from 'moment';
import Particles from "vue3-particles";
import VueDatePicker from '@vuepic/vue-datepicker';
import ElementPlus from 'element-plus';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'
import Vuesalize from 'vuesalize';
import 'moment/dist/locale/en-ca';

/**
 * CSS FILES
 */
import '@Assets/css/main.css';
import '@iconscout/unicons/css/line.css';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vuesalize/dist/vuesalize.css';

import App from './App.vue';

services.setURL(import.meta.env.VITE_APP_API_URL);
moment.locale('en-ca');

const app = createApp(App);

localforage.setDriver(localforage.INDEXEDDB);

const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate)
const installPersistedStatePlugin = createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          return localforage.getItem(key)
        },
        setItem: async (key, value) => {
          return localforage.setItem(key, JSON.stringify(value))
        },
        removeItem: async (key) => {
          return localforage.removeItem(key)
        },
      },
})
pinia.use((context) => installPersistedStatePlugin(context))

app.use(pinia)
   .use(router, axios)
   .use(Particles)
   .use(Vuesalize)
   .component('VueDatePicker', VueDatePicker)
   .use(ElementPlus)
   .mount('#app');
    