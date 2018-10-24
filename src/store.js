import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from './router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user:null,
    email:null,
    signed_up:false,
    wrong_pw:false
  },
  mutations: {
    authUser(state,authData){
      state.idToken = authData.token,
      state.userId = authData.userId
      state.email = authData.email
    },
    storeUser(state,user){
      state.user = user
    },
    clearAuthData(state){
      state.userId=null,
      state.idToken=null
    }
  },
  actions: {
    setLogoutTimer({commit},expirationTime){
      setTimeout(()=>{
        commit('clearAuthData')
      },expirationTime*1000)
    },
    signup({commit,dispatch,state},authData){
      axios.post('/signupNewUser?key=AIzaSyCFO-jtb0GIJWHWiBqpgpzn9VkUnIWpsq0',{
        email:authData.email,
        password:authData.password,
        returnSecureToken : true
      })
      .then(res=>{
        console.log(res)
        commit('authUser',{
          token: res.data.idToken,
          userId: res.data.localId,
          email: res.data.email
        })
        const now = new Date()
        const expirationDate = new Date(now.getTime() + res.data.expiresIn*1000)
        localStorage.setItem('token',res.data.idToken)
        localStorage.setItem('userId',res.data.localId)
        localStorage.setItem('expirationDate',expirationDate)
        localStorage.setItem('email',res.data.email)
        dispatch('setLogoutTimer',res.data.expiresIn)
        dispatch('storeUser',authData)
          // .then(res=>console.log(res))
          .catch(err=>console.log(err))
        // router.replace('./dashboard')
        state.signed_up = true
      })
      .catch(err=>console.log(err))
    },
    login({commit,dispatch,state},authData){
      axios.post('verifyPassword?key=AIzaSyCFO-jtb0GIJWHWiBqpgpzn9VkUnIWpsq0',{
        email:authData.email,
        password: authData.password,
        returnSecureToken : true
      }) 
      .then(res=>{
        console.log(res)
        state.wrong_pw = false
        const now = new Date()
        const expirationDate = new Date(now.getTime() + res.data.expiresIn*1000)
        localStorage.setItem('token',res.data.idToken)
        localStorage.setItem('userId',res.data.localId)
        localStorage.setItem('expirationDate',expirationDate)
        localStorage.setItem('email',res.data.email)
        commit('authUser',{
          token: res.data.idToken,
          userId: res.data.localId,
          email: res.data.email
        })
        dispatch('setLogoutTimer',res.data.expiresIn)
        router.replace('./dashboard')
      })
      .catch(err=>{
        console.log(err)
        state.wrong_pw = true
      })
    },
    tryAutoLogin({commit,dispatch}){
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('email')
      if(!token){
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if(expirationDate<=now){
        return
      }
      commit('authUser', { token:token, userId:userId, email:email} )
      dispatch('fetchUser')
    },
    logout({commit,state}){
      state.signed_up=false
      commit('clearAuthData')
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      localStorage.removeItem('expirationDate')
      router.replace('./signin')
    },
    storeUser({commit,state},userData){
      if(!state.idToken){
        return
      }
      globalAxios.post('/users.json' + "?auth="+state.idToken,userData)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    },
    fetchUser({commit,state}){
      if(!state.idToken){
        return
      }
      globalAxios.get('/users.json' + "?auth="+state.idToken)
      .then(res => {
          const data = res.data
          const users = []
          for( let key in data){
            const user = data[key]
            user.id = key
            users.push(user)
          }
          const current_user = users.find( element => state.email==element.email )
          commit('storeUser',current_user)
        }
      )
    }
  },
  getters: {
    user(state){
      return state.user
    },
    isAuthenticated(state){
      return state.idToken!=null
    },
    signed_up(state){
      return state.signed_up
    },
    wrong_pw(state){
      return state.wrong_pw
    }
  }
})