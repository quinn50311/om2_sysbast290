import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import X2js from 'x2js';
Vue.prototype.$x2js = new X2js();

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVueTreeview from "bootstrap-vue-treeview";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVueTreeview);
Vue.use(PerfectScrollbar);

Vue.component('Loading', Loading);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
