import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'
import vuetify from './plugins/vuetify';
import VueTyperPlugin from 'vue-typer'
import store from './store'
import './registerServiceWorker'

const firebaseConfig = {
  apiKey: "AIzaSyDJRR4KY6LTPcusqoD37d7VAqkNkiSXnQA",
  authDomain: "pure-244320.firebaseapp.com",
  databaseURL: "https://pure-244320.firebaseio.com",
  projectId: "pure-244320",
  storageBucket: "pure-244320.appspot.com",
  messagingSenderId: "593217935798",
  appId: "1:593217935798:web:64af8d73bd04cbc7c38917",
  measurementId: "G-KSRMJ6Z7PL"
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false
Vue.use(VueTyperPlugin)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
