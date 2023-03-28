import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import HelloWorld from '@/components/HelloWorld'
import WaitRoomSocket from '@/components/WaitRoomSocket'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/waitroom',
      name: 'WaitRoomSocket',
      component: WaitRoomSocket
    }
  ]
})
