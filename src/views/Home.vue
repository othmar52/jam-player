<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>total tracks {{ stats.totalTracks }}</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...mapGetters([
      'getStats'
    ]),
    stats () {
      return this.getStats
    }
  }
}
</script>
