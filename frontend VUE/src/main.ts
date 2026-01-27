import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import components from './components';
import "./main.css"

const pinia = createPinia();

const app = createApp(App)
components.forEach(element => {
    if (element.name){
        app.component(element.name, element)
    }
});

app.use(pinia)
app.mount('#app')
