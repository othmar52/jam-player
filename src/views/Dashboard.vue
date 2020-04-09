<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>DASHBOARD total tracks {{ stats.totalTracks }}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
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
