import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.prototype.$axios = axios
import 'common/stylus/index.styl'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

// require('./mock')

/* import vueg from 'vueg'
import 'vueg/css/transition-min.css'
const options={
  duration: '0.3',
  forwardAnim: 'fadeInRight',
  backAnim: 'fadeInLeft',
}
Vue.use(vueg, router,options)

import {UrlSearch} from 'api/util'
let Request = new UrlSearch()
Vue.prototype.$Request = Request */

import {
    Tab,
    Tabs,
    List,
    Overlay,
    Checkbox,
    CheckboxGroup,
    Picker,
    Popup,
    Switch,
    PullRefresh,
    RadioGroup,
    Radio,
    Swipe,
    SwipeItem,
    NavBar,
    Rate,
    Uploader,
    Icon,
    Toast,
    Dialog,
    Image,
    Loading,
    Step, Steps,
    ImagePreview,
    Field 
} from 'vant'

Vue.use(Tab)
    .use(Tabs)
    .use(List)
    .use(Overlay)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Picker)
    .use(Popup)
    .use(Switch)
    .use(PullRefresh)
    .use(RadioGroup)
    .use(Radio)
    .use(Swipe)
    .use(SwipeItem)
    .use(NavBar)
    .use(Rate)
    .use(Uploader)
    .use(Icon)
    .use(Toast)
    .use(Dialog)
    .use(Image)
    .use(Loading)
    .use(Step).use(Steps)
    .use(ImagePreview)
    .use(Field)

import VueWechatTitle from 'vue-wechat-title'

Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
