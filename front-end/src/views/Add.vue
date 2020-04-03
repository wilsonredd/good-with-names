<template>
  <div class="add">
    <h1>Add New Friend</h1>
    <div class="form" v-if="loggedIn && addingFriend">
        <div class="input">
            <p>Name:</p>
            <input v-model="friendName" placeholder="John Smith">
        </div>
        <div class="input">
            <p>Age:</p>
            <input v-model="friendAge" placeholder="26">
        </div>
        <div class="input">
            <p>Interest/Hobbie:</p>
            <input v-model="friendInterest" placeholder="Fly Fishing">
        </div>
        <div class="input">
            <p>Where Did You Meet Them:</p>
            <input v-model="friendWhere" placeholder="Bus Stop">
        </div>
        <div class="input">
            <p>Defining Physical Feature:</p>
            <input v-model="friendPhysical" placeholder="Mohawk Hair Cut">
        </div>
        <div class="file-upload">
            <p>Upload A Photo of Him/Her:</p>
            <input type="file" name="photo" @change="fileChanged">
        </div>
        <button type="button" class="addFriendButton" @click="addFriend">Add Friend</button>
    </div>
    <p @click="toggleForm" v-if="!addingFriend">Friend Added! Click here to add another.</p>
    <p class="error" v-if="!loggedIn">Please Log In So You Can Add Friends</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Add',
  data() {
    return {
      friendName: "",
      friendAge: "",
      friendInterest: "",
      friendWhere: "",
      friendPhysical: "",
      addingFriend: true,
      file: null,
    }
  },
  computed: {
    loggedIn() {
      return this.$root.$data.loggedIn;
    }
  },
  created() {
    
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async addFriend() {
      try {
        let path = "";
        if(this.file !== null) {
            const formData = new FormData();
            formData.append('photo', this.file, this.file.name);
            let r1 = await axios.post('/api/photos', formData);
            path = r1.data.path
        }
        let r2 = await axios.put('/api/friend/' + this.$root.$data.user._id, {
          name: this.friendName,
          age: this.friendAge,
          interest: this.friendInterest,
          where: this.friendWhere,
          physical: this.friendPhysical,
          path: path
        });
        console.log(r2);
        this.friendName = "";
        this.friendAge = "";
        this.friendInterest = "";
        this.friendWhere = "";
        this.friendPhysical = "";
        this.addingFriend = false;
        this.file = null;
      } catch (error) {
        console.log(error);
      }
    },
    toggleForm() {
      this.addingFriend = !this.addingFriend;
    }
  }
}
</script>

<style scoped>
    .add {
        min-height: 75vh;
    }
    .error {
        margin: 50px 0px 75vh 0px;
        padding: 0px 5px 0px 5px;
        text-align: center;
        color: #FF0000;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .input {
        display: flex;
        flex-direction: column;
        margin: 5px;
        width: 250px;
    }

    .file-upload {
        display: flex;
        flex-direction: column;
        margin: 5px;
        width: 250px;
    }

    .file-upload>p {
        text-align: left;
    }

    .input>p{
        text-align: left;
    }

    .addFriendButton {
        margin: 5px;
    }
</style>