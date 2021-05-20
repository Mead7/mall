import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 1. 安装插件
Vue.use(Vuex)

// 创建 Store 对象 和 挂载到 Vue 实例上
export default new Vuex.Store({
  state: {
    cartList: []
  },
  // mutations 唯一的作用就是修改 state 当中的状态   并且其中的每一个方法完成的任务尽量单一
  mutations,
  actions,
  getters,
  modules: {
  }
})
