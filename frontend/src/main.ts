import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import './index.css';
import router from '@/router';
import queryOptions from '@/query';

const app = createApp(App);
app.use(VueQueryPlugin, queryOptions);
app.use(router);

app.mount('#app');
