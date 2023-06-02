import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import services from '@Services/index.js';
import axios from 'axios'
import moment from 'moment';
import Particles from "vue3-particles";
import VueGoogleCharts from 'vue-google-charts'
import VueDatePicker from '@vuepic/vue-datepicker';
import 'moment/dist/locale/fr';


/**
 * CSS FILES
 */
import '@Assets/css/main.css'
import '@iconscout/unicons/css/line.css'
import '@vuepic/vue-datepicker/dist/main.css'


import App from './App.vue'

// services.setURL('https://api-dev.nexties.fr')
services.setURL('https://api-dev.nexties.fr')
// axios.defaults.baseURL = 'https://api-dev.nexties.fr/api/';
moment.locale('fr');

createApp(App)
    .use(createPinia())
    .use(router, axios)
    .use(Particles)
    .use(VueGoogleCharts)
    .component('VueDatePicker', VueDatePicker)
    .mount('#app')
    