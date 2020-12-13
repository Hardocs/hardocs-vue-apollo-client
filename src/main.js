import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import CKEditor from '@ckeditor/ckeditor5-vue';
import './assets/styles/index.css';
// import JsonEditor from '@hardocs-project/vue-json-edit'
import JsonEditor from '@hardocs-project/tangram-json-editor'
import '@hardocs-project/tangram-json-editor/lib/lib/index.esm.css'
import vueShortkey from 'vue-shortkey'

Vue.config.productionTip = false;

Vue.use(CKEditor);

Vue.use(JsonEditor);
Vue.use(vueShortkey)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  // apolloProvider,
  render: (h) => h(App)
}).$mount('#app');
