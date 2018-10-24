import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/authentication', component: WelcomePage },
  { path: '/signup', component: SignupPage },
  { path: '/signin', component: SigninPage },
  { path: '/dashboard', component: DashboardPage,
    beforeEnter(to,from,next){     
      // store.state.idToken
      const token = localStorage.getItem('token')
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if(!token){
        console.log("first if here.")
        next('/signin')
      }
      else if(expirationDate<=now){
        console.log("second if else here.")
        next('/signin')
      }
      else{
        next()
      }

      // if(expirationDate<=now){
      //   return
      // }

      // if(store.getters.isAuthenticated){
      //   next()
      // }
      // else{
      //   console.log("is this true? ",store.getters.isAuthenticated)
      //   next('/signin')
      // }
    }
  }
]

export default new VueRouter(
  {
    mode: 'history', 
    routes
  })