<template>
  <div class="app-ctn">
    <Topnav />
    <router-view />
  </div>
</template>

<script setup>
import Topnav from "./components/Topnav.vue";
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.app-ctn {
  height: 100%;
  width: 100%;
}
</style>