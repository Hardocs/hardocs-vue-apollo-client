import Vue from 'vue';
import Vuex from 'vuex';
import * as docs from '@/store/docs';
import * as metadata from '@/store/metadata'


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    docs,
    metadata
  },
  state: {},
  mutations: {},
  actions: {},
  getters:{}
});
