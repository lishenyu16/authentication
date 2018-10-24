<template>
  <div id="signup">
    <div class="signup-form" v-if="!signed_up">
      <form @submit.prevent="onSubmit">
        <div class="input" :class="{invalid: $v.email.$error}">
          <label for="email">Email</label>
          <input
                  type="email"
                  id="email"
                  @blur="$v.email.$touch()"
                  v-model="email">
          <p v-if="!$v.email.email">Please provide a valid email address</p>
        </div>
        <div class="input" :class="{invalid: $v.age.$error}">
          <label for="age">Your Age</label>
          <input
                  type="number"
                  id="age"
                  @blur="$v.age.$touch()"
                  v-model.number="age">
          <p v-if="!$v.age.minVal">You have to be at least {{ $v.age.$params.minVal.min }} </p>
        </div>
        <div class="input">
          <label for="password">Password</label>
          <input
                  type="password"
                  id="password"
                  v-model="password">
        </div>
        <div class="input">
          <label for="confirm-password">Confirm Password</label>
          <input
                  type="password"
                  id="confirm-password"
                  v-model="confirmPassword"
                  :class="{alert:unmatch}"><label for="confirm-password" v-if="unmatch" style="color:red">Unmatch Password</label>
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
                    class="input"
                    v-for="(hobbyInput, index) in hobbyInputs"
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                      v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
            </div>
          </div>
        </div>
        <div class="input inline" :class="{invalid: $v.terms.$invalid}">
          <input 
            type="checkbox" 
            id="terms" 
            @change="$v.terms.$touch()" 
            v-model="terms">
          <label for="terms">Accept Terms of Use</label>
        </div>
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
    <div v-if="signed_up">
      <h2 id='signed_up'>You have successfully signed up!</h2>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { required, email, numeric, minValue} from 'vuelidate/lib/validators'
  export default {
    data () {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false
      }
    },
    validations:{
      email:{
        required,
        email,
        unique: val =>{
          if(val === '') return true
          return axios.get('/users.json?orderBy="email"&equalTo="' + val + '"')
            .then(res=> {
              //check if it returns an empty object which means not exist in db
              return Object.keys(res.data).length===0
            })
        }
      },
      age:{
        numeric,
        minVal: minValue(18)
      },
      terms:{
        required
      }
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        }
        console.log(formData)
        this.$store.dispatch('signup',formData)
      }
    },
    computed: {
      unmatch() {
        return this.password!=this.confirmPassword 
      },
      signed_up(){
        return this.$store.getters.signed_up
      }
    },
  }
</script>

<style scoped>
  .input .alert{
    border: 2px solid red;
  }
  #signed_up{
    text-align: center;
    padding-top: 40px;
    color:rgb(0, 255, 255);
  }
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input.invalid label{
    color: red;
  }

  .input.invalid input{
    border: 1px solid red;
    background-color: rgb(226, 199, 162);
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }

</style>