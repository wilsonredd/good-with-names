<template>
  <div class="home">
    <div class="login" v-if="!loggedIn">
      <h1>Welcome</h1>
      <p class="intro">
          Good With Names is a web application to help you keep track of everyone
          you meet, so you can easily remember their name next time you see them.
      </p>

      <p class="get-started">
          To begin, sign up or login with your name.
      </p>
      <input class="nameInput" v-model="name" placeholder="Full Name">
      <p class="error">{{error}}</p>
      <button @click="login">Log In</button>
      <button @click="signUp">Sign Up</button>
    </div>
    <div class="friendList" v-if="loggedIn">
      <h1>Your Friends</h1>
      <p class="noFriends" v-if="friendList.length === 0">You have no friends added yet. Please add friends.</p>
      <div class="friend" v-for="friend in friendList" v-bind:key="friend._id">
        <img class="friend-image" :src="friend.path" alt="">
        <h2>{{friend.name}}</h2>
        <p>Age: {{friend.age}}</p>
        <p>Interest: {{friend.interest}}</p>
        <p>Where I Met Them: {{friend.where}}</p>
        <p>Physical Quality: {{friend.definingPhysicalFeature}}</p>
        <p class="delete-friend" @click="deleteFriend(friend._id)">Remove Friend</p>
        <br>
      </div>
      <button class="logoutButton" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Home',
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
            this.updateFriendsList();
        }
    },
    methods: {
        printName(id, name) {
            console.log(id + " " + name);
        },
        async login() {
            if(this.name.length !== 0) {
                console.log(this.name);
                let r1 = await axios.get('/api/login', {
                    params: {
                        name: this.name
                    }
                });
                if (r1.data !== "") {
                    console.log(r1.data);
                    this.$root.$data.user = r1.data;
                    this.updateFriendsList();
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
                    this.updateFriendsList();
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
        },
        async deleteFriend(id) {
            try {
                console.log(id);
                await axios.delete('/api/friend/' + this.$root.$data.user._id + "/" + id);
                this.updateFriendsList();
            } catch (error) {
                console.log(error);
            }
        },
        async updateFriendsList() {
            let r1 = await axios.get('/api/friends/' + this.$root.$data.user._id);
            console.log(r1.data);
            this.friendList = r1.data;
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

  .intro {
    padding: 10px;
  }

  .get-started {
    padding: 10px;
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

  .friend p:last-of-type{
      margin-top: 20px;
  }

  .friend-image {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 250px;
  }
  
  .noFriends {
    margin-top: 50px;
    padding: 0px 5px 0px 5px;
    text-align: center;
  }

  .delete-friend:hover {
      color: #FF0000;
  }

  .logoutButton {
    margin-top: 50px;
  }

@media only screen and (min-width: 1024px) {
    .login {
        margin-right: 25%;
        margin-left: 25%;
    }
}
</style>