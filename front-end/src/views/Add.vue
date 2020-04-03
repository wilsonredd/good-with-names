<template>
  <div class="add">
    <h1>Add New Friend</h1>
    <div class="form" v-if="loggedIn && addingFriend">
            <input v-model="friendName" placeholder="Name">
            <p></p>
            <input v-model="friendAge" placeholder="Age">
            <p></p>
            <input v-model="friendInterest" placeholder="Interest/Hobbie">
            <p></p>
            <input v-model="friendWhere" placeholder="Where Did You Meet Them?">
            <p></p>
            <input v-model="friendPhysical" placeholder="Defining Physical Feature">
            <p></p>
            <div class="file-upload">
                <input type="file" name="photo" @change="fileChanged">
                <button @click="addFriend">Add Friend</button>
            </div>
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
            path = await axios.post('/api/photos', formData);
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
  .error {
    margin: 50px 0px 75vh 0px;
    padding: 0px 5px 0px 5px;
    text-align: center;
    color: #FF0000;
  }
</style>