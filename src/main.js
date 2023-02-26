import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'

import './assets/all.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

import {
  Form, Field, ErrorMessage, defineRule, configure
} from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { date, currency } from './methods/filters'

import $httpMessageState from '@/methods/pushMessageState' // 註冊 function (response, title = '更新')方法

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
// 設定預設語系
setLocale('zh_TW')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueAxios, axios)
app.use(router)
app.use(LoadingPlugin)

// 全域註冊 $filters
app.config.globalProperties.$filters = {
  date,
  currency
}
// 全域註冊 $httpMessageState
app.config.globalProperties.$httpMessageState = $httpMessageState

app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)
app.mount('#app')
