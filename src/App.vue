<template>
  <div id="app" class="page">
    <nav class="page__navigation menu">
      <ul class="menu__list">
        <li class="menu__item">
          <SearchField :min-input="1" />
        <li class="menu__item">
          <router-link to="/" class="menu__link">Dashboard</router-link>
        </li>
        <li class="menu__item">
          <router-link :to="getNextRandomTrackRoute" class="menu__link" v-on:click.native="forcePlay">Random</router-link>
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
        <li class="menu__item" v-if="stats.showDbMeterHint">
          <router-link to="/dbmeterhint" class="menu__link"><strong>README</strong></router-link>
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
            <span class="logo__bandname view__highlight">Stromwerk</span> <span class="logo__label">jam</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <main class="content">
      <router-view />
    </main>
    <PermaPlayer />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import PermaPlayer from '@/components/Player/PermaPlayer.vue'
import SearchField from '@/components/Search/Field.vue'
import { faviconMixin } from '@/assets/js/faviconMixin.js'

export default {
  name: 'Home',
  components: {
    PermaPlayer,
    SearchField
  },
  mixins: [
    faviconMixin
  ],
  computed: {
    ...mapGetters([
      'getStats',
      'getAllSessions',
      'getNextRandomTrackRoute'
    ]),
    stats () {
      return this.getStats
    }
  },
  methods: {
    forcePlay () {
      this.$store.dispatch(
        'loadPlayerTrack',
        this.getNextRandomTrackRoute.params
      )
    }
  },
  mounted () {
    this.drawFavicon()
  },
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'JAM player'
    }
  }
}
</script>

<style lang="scss">

@import '~source-sans-pro/source-sans-3.css';
@import "@/scss/main.scss";

.page__header {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 44px;
  margin-bottom: 60px;
  &>* {
    display: inline-block;
    margin-top: auto;
    margin-right: 30px;
  }
  &>span {
    color: $darktext;
  }
  h1 {
    text-transform: uppercase;
    font-size: 46px;
    a:hover {
      text-decoration: underline;
    }
  }
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  transition: height 0.5s ease;
}

.has__permaplayer {
  .content {
    height: calc(100% - #{$permaPlayerHeight});
  }
}
</style>
