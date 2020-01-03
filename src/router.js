import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 解决 vue-router 异常报错 NavigationDuplicated 问题*/
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', //可为 history,hash
  //base: process.env.BASE_URL,
  // base: '/h5/',
  routes: [
    {
      // 一键登录
      path: '/',
      name: 'address',
      component: () => import('pages/address/add1.vue'),
      meta: { title: '一键登录' }
    },
  ]
})
