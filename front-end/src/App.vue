<template>
  <div id="app">
    <div id="nav">
      <div class="brand">
        <img class="logo" alt="Faces logo" src="/images/logo.jpg">
        <h1>Good With Names</h1>
      </div>
      <div class="links">
        <router-link to="/">Home</router-link> |
        <router-link to="/add">Add Friend</router-link> |
        <router-link to="/update">Update My Info</router-link>
      </div>
    </div>
    <router-view/>
    <div id="footer">
      <a href="https://github.com/wilsonredd/good-with-names" target="_blank">https://github.com/wilsonredd/good-with-names</a>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  padding: 0px 5px 0px 5px;
}

.logo {
  height: 100px;
}

#nav {
  display: flex;
  flex-direction: column;
  padding: 30px 10px 30px 10px;
}

.brand h1 {
  margin: 10px;
}

.links a {
  font-weight: bold;
  font-size: 1.25em;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
}

.links a.router-link-exact-active {
  color: #42b983;
}

#footer {
  height: 50px;
}

#footer a {
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
}

@media only screen and (min-width: 1024px) {
  #nav {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .brand h1 {
    margin: 5px 10px 10px 10px;
  }
}

</style>
