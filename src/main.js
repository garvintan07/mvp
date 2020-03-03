import Vue from 'vue'
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue'
import App from './App.vue'


Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(ModalPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
