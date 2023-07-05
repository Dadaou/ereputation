import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import services from '@Services/index.js';
import axios from 'axios';
import moment from 'moment';
import Particles from "vue3-particles";;
import VueDatePicker from '@vuepic/vue-datepicker';
import Vuesalize from 'vuesalize';
import 'moment/dist/locale/fr';

/**
 * CSS FILES
 */
import '@Assets/css/main.css';
import '@iconscout/unicons/css/line.css';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vuesalize/dist/vuesalize.css';

import App from './App.vue';

services.setURL(import.meta.env.VITE_APP_API_URL);
moment.locale('fr');

const app = createApp(App);
app.config.globalProperties.$nlp_api = import.meta.env.VITE_NLP_API_URL;
app.config.globalProperties.$moment=moment;

const pinia = createPinia();
pinia.use(({ store })=>{
    store.$nlp_api = app.config.globalProperties.$nlp_api;
});

app.use(pinia)
   .use(router, axios)
   .use(Particles)
   .use(Vuesalize)
   .component('VueDatePicker', VueDatePicker)
   .mount('#app');
    