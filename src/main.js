import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n.js';
import VueToastr from 'vue-toastr'
import {makeServer} from "./server"

Vue.config.productionTip = false

makeServer();
Vue.use(VueToastr);
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')