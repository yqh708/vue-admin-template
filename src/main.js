import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import { getRequest, postRequest} from './utils/request'


import SvgIcon from '@/components/SvgIcon/index.vue'// svg组件
Vue.component('svg-icon', SvgIcon)
import '@/components/SvgIcon/index.js'


Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
