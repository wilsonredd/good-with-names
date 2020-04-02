<template>
  <div class="home">
    <div class="login" v-if="!loggedIn">
      <h1>Welcome</h1>
      <input class="nameInput" v-model="name" placeholder="Full Name">
      <p class="error">{{error}}</p>
      <button @click="login">Log In</button>
      <button @click="signUp">Sign Up</button>
    </div>
    <div class="friendList" v-if="loggedIn">
      <h1>Your Friends</h1>
      <p class="noFriends" v-if="friendList.length === 0">You have no friends added yet. Please add friends.</p>
      <div class="friend" v-for="friend in friendList" v-bind:key="friend._id">
        <p>{{friend.name}}</p>
      </div>
      <button class="logoutButton" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      name: "",
      error: "",
      friendList: [],
    }
  },
  computed: {
    loggedIn() {
      return this.$root.$data.loggedIn;
    }
  },
  created() {
    
  },
  async mounted() {
    if (this.$root.$data.user !== null){
      let r1 = await axios.get('/api/friends/' + this.$root.$data.user._id);
      this.friendList = r1.data;
    }
  },
  methods: {
    async login() {
      if(this.name.length !== 0) {
        console.log(this.name);
        let r1 = await axios.get('/api/login', {
          params: {
            name: this.name
          }
        });
        if (r1.data !== "") {
          this.$root.$data.user = r1.data;
          this.$root.$data.loggedIn = true;
          this.error = "";
        }
        else {
          this.error = "This user does not exist, yet.";
        }
      }
    },
    async signUp() {
      if(this.name.length !== 0) {
        let r1 = await axios.post('/api/signup', {
          name: this.name
        });
        if (r1.data !== "") {
          this.$root.$data.user = r1.data;
          this.$root.$data.loggedIn = true;
          this.error = "";
        }
        else {
          this.error = "This user does not exist, yet.";
        }
      }
    },
    logout() {
      this.name = "";
      this.$root.$data.loggedIn = false;
      this.error = "";
      this.$root.$data.user = null;
      this.friendList = [];
    }
  }
}
</script>

<style scoped>
  .home {
    min-height: 100vh;
  }
  button {
    width: 100px;
    margin: 5px;
  }
  .error {
    text-align: center;
    color: #FF0000;
    margin: 5px;
  }

  .login h1 {
    margin-bottom: 15px;
  }

  h2 {
    font-weight: bold;
    font-size: 1.25em;
    text-align: center;
    text-decoration: none;
    color: #2c3e50;
  }
  
  .noFriends {
    margin-top: 50px;
    padding: 0px 5px 0px 5px;
    text-align: center;
  }

  .logoutButton {
    margin-top: 50px;
  }
</style>