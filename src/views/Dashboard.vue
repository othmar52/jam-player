<template>
  <div class="dashboard">
    <!--h1>DASHBOARD total tracks {{ stats.totalTracks }}</h1-->
    <div class="page__loader">
      <Loader :percent="percent" />
      <h1>jam</h1>
      <h3>
        Experimental prototype<br />Don't expect anything to work<br /><br />
        <span class="small">In case you encounter any bugs press reload [F5]</span>
      </h3>
      <div class="msg__error"></div>
      <div class="msg__success"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import Loader from '@/components/Svg/Loader.vue'

export default {
  name: 'Home',
  components: {
    Loader
  },
  computed: {
    ...mapGetters([
      'getStats'
    ]),
    stats () {
      return this.getStats
    },
    percent () {
      return this.stats.loadedPercent
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  width: 100%;
  .page__loader {
    margin-top: 0;
  }
}

</style>
