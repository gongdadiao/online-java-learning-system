// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

import VueAliplayerV2 from '../packages';
Vue.use(VueAliplayerV2);


// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
//-------------七牛云------------------------------
Vue.use(qiniu)
import * as qiniu from 'qiniu-js'

import './assets/stylus/index.styl'
import './assets/theme/index.styl'


new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
