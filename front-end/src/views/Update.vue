<template>
  <div class="add">
    <h1>Update Your Information</h1>
    <p class="error" v-if="!loggedIn">Please Log In So You Can Update Your Info</p>
  </div>
</template>

<script>
// import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
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