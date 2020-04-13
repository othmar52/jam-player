<template>
  <div id="app" class="page">
    <header class="page__header">
      <h1 class="page__title">
        <span class="view">
          <span class="view__highlight">Al</span>lsessions
        </span>
        <span class="page__additional">Stromwerk</span>
      </h1>

      <nav class="page__navigation menu">
        <ul class="menu__list">
          <li class="menu__item">
            <router-link to="/" class="menu__link">Dashboard</router-link>
          </li>
          <li class="menu__item">
            <a href="#" class="menu__link" @click="loadRandomTrack">Random</a>
          </li>
          <li class="menu__item">
            <router-link to="/sessions" class="menu__link">Sessions</router-link>
          </li>
          <li class="menu__item">
            <router-link to="/about" class="menu__link">About</router-link>
          </li>
          <li class="menu__item">
            <router-link to="/pics" class="menu__link">Pics</router-link>
          </li>
          <li class="menu__item menu__item--logo">
            <router-link to="/" class="menu__link logo">
              <span class="logo__icon">
                  <!-- TODO: wtf - how to simply scale this shit with preserveAspectRatio ??? -->
                  <svg width="40" height="40" style="position: relative; top: -9px; left: -9px;" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(-9.000000,17.000000) scale(0.032,-0.032)" stroke="none">
                          <path class="path__logo" style="stroke:none;" fill="#60d4ff" d="m898 408 l32 -5 0 -125 c0 -115 -1 -125 -17 -118 -35 14 -140 17 -176 6 -51 -17 -122 -84 -141 -133 -22 -54 -13 -109 25 -153 41 -46 76 -58 158 -53 82 4 135 35 186 107 l30 43 5 198 5 198 74 -49 c79 -52 179 -89 241 -89 46 0 59 -24 36 -68 -18 -34 -76 -87 -105 -97 -18 -5 -21 -14 -21 -69 0 -163 -92 -306 -243 -377 -119 -55 -240 -58 -370 -9 -75 28 -173 118 -215 197 -128 240 13 529 291 599 49 12 125 11 205 -3z"></path>
                      </g>
                  </svg>
              </span>
              <span class="logo__label">jam</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>
    <PermaPlayer />
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import PermaPlayer from '@/components/Player/PermaPlayer.vue'

export default {
  name: 'Home',
  components: {
    PermaPlayer
  },
  computed: {
    ...mapGetters([
      'getStats',
      'getAllSessions'
    ]),
    stats () {
      return this.getStats
    }
  },
  methods: {
    loadRandomTrack () {
      // todo store a shuffeled list in vuex to avoid same route issue and better randomisation
      const allSessionKeys = Object.keys(this.getAllSessions)
      const randomSession = this.getAllSessions[allSessionKeys[allSessionKeys.length * Math.random() << 0]]
      const allTrackKeys = Object.keys(randomSession.tracks)
      const randomTrack = randomSession.tracks[allTrackKeys[allTrackKeys.length * Math.random() << 0]]
      const randomTrackRoute = {
        name: 'TrackShow',
        params: {
          sessionIndex: randomSession.index,
          trackIndex: randomTrack.trackLetter
        }
      }
      console.log(randomTrackRoute)
      this.$router.push(randomTrackRoute)
      return
      // load into permaplayer and force play
      this.$store.dispatch( // eslint-disable-line no-unreachable
        'loadPlayerTrack',
        randomTrackRoute.params
      )
      this.$store.dispatch('forcePermaPlay')
      this.$router.push(randomTrackRoute)
    }
  },
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'JAM player'
    }
  }
}
</script>

<style lang="scss">

@import '~source-sans-pro/source-sans-pro.css';
@import "@/scss/main.scss";

</style>
