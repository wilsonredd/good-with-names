<template>
  <div class="add">
    <h1>Add New Friend</h1>
    <div class="form" v-if="loggedIn">
      <input v-model="friendName" placeholder="Friend Name">
      <p></p>
      <div class="file-upload">
        <input type="file" name="photo" @change="fileChanged">
        <button @click="addFriend">Add Friend</button>
      </div>
    </div>
    <p class="error" v-if="!loggedIn">Please Log In So You Can Add Friends</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      friendName: "",
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
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.put('/api/friend/' + this.$root.$data.user._id, {
          name: this.friendName,
          path: r1.data.path
        });
        console.log(r2.data)
      } catch (error) {
        console.log(error);
      }
    },
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