import { createApp } from 'vue'
import App from './App.vue'
import highlight from './components/index'

import './assets/main.css'
const app = createApp(App)
app.use(highlight)
app.mount('#app')
