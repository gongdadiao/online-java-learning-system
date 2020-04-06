import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    res_url:null,
    res_info:null,
    qiniuUrl:'http://q852a0qij.bkt.clouddn.com/'
  },
  mutations: {

  },
  actions: {

  },
  getters
})
