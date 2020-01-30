import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueTyperPlugin from 'vue-typer'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VueTyperPlugin)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
