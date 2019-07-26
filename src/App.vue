<template>
  <div id="app">
    <call-camera></call-camera>
  </div>
     
   
    
    
</template>

<script>
import CallCamera from './components/CallCamera'


export default {
  name: 'app',
  components: {
    CallCamera
  },
  methods:{
    openNew(){
      console.log(this.$router)
    }
  },
  mounted(){
    
  }
}
</script>

<style>
#app ,html,body{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* overflow: hidden; */
  width: 100%;
  height: 100%;
  
}
*{
  margin: 0;
  padding: 0;
}
</style>
