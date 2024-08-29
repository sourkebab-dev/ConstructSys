import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import auth, { key } from './store/auth';
import list, { key as listKey } from './store/list';
import errorNotify from './directives/error-notify';
import notification, { key as notifkey } from './store/notification';
import authMiddleware from './router/middleware';

const app = createApp(App)

app.use(list, listKey);
app.use(auth, key);
app.use(notification, notifkey);
app.use(router);
app.directive('error-notify', errorNotify)

authMiddleware(router);

app.mount('#app')
