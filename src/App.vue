<template>
  <div id="app" class="inset-0 w-screen h-screen">
    <div id="container" class="w-full h-full flex flex-row">
      <div id="container-sidebar" class="flex-none">
        <Sidebar />
      </div>
      <div id="conatiner-main" class="flex-1">
        <div id="subconatiner" class="flex flex-col w-full h-full">
          <div id="subconatiner-header" class="flex-none">
            <Header />
          </div>
          <div id="subcontainer-content" class="flex-1 w-full h-full">
            <Element />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Element from './components/Element.vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Element,
    Sidebar,
    Header
  },
  mounted() {
  }
}
</script>

<style>
#app {  
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: gray;
}

html {
    margin: 0;
    min-height: 100%;
}

body {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>
