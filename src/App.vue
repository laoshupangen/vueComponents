<template>
  <div id="app">
    <div @click="start">开始</div>
    <call-camera :show.sync="show" v-model="value" ></call-camera>
  </div>
     
   
    
    
</template>

<script>
import CallCamera from './components/CallCamera'


export default {
  name: 'app',
  components: {
    CallCamera
  },
  data(){
    return{
      show:false,
      value:{}
    }
  },
  methods:{
    openNew(){
      console.log(this.$router)
    },
    start(){
      console.log('start')
     this.show = true
    }
  },
  watch:{
    value(n,o){
      console.log(n)
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
