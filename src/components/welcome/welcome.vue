<template>
  <div id="welcome">
    <h1>This is a demo of vue authentication based on firebase auth restful api.</h1>
    <p>By signing up via email, the app sends an api to firebase auth, and firebase auth sends back
       a pair of token/localId (expires in 3600s), at same time the app stores user's info to database. 
       The pair of token/localId are stored on local browser so that auto-login can be acchieved.
       For more info about firebase auth rest api, visit <strong><a href="https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password">here</a></strong> 
    </p>
    <div class="cta" v-if="!auth">
      <router-link to="/signup">Sign Up</router-link>
      <router-link to="/signin">Sign In</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      }
    }
  }
</script>

<style scoped>
  #welcome {
    width: 80%;
    margin: auto;
  }

  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }

  .cta {
    width: 300px;
    margin: auto;
    text-align: center;
  }

  .cta a {
    margin: 10px;
    text-decoration: none;
    display: inline-block;
    border: 1px solid #521751;
    border-radius: 3px;
    width: 100px;
    padding: 10px;
    box-sizing: border-box;
    color: #521751;
  }

  .cta a:hover,
  .cta a:active {
    background-color: #521751;
    color: white;
  }
</style>