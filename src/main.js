import Vue from 'vue'
import App from './App'
import router from './router'

import config from '@/config/antd.js'
import ele from '@/config/element.js'
Vue.use(ele)
Vue.use(config)

Vue.config.productionTip = false
import store from '@/store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
