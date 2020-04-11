<template>
  <div class="dont__flex">
    <aside class="page__sidebar tracklist">
      <h3 class="tracklist__title">Tracklist Session <span class="session__symbol">#</span><span class="session__nr">{{ formatSessionNumber(sessionIndex) }}</span></h3>
      <ul class="tracklist__list">
        <li
          v-for="(sessionTrack, idx) in sessionTracks"
          v-bind:key="`${sessionIndex}${idx}`"
          class="tracklist__item tracklist__item--acti__TODO-SET_ACTIVE__ve">
          <router-link :to="{ name: 'TrackShow', params: { sessionIndex: sessionIndex, trackIndex: idx } }" class="tracklist__link track">
            <span class="track_letter track__letter-circled">{{ idx }}</span>
            <h4 class="track__title">{{ sessionTrack.title }}</h4>
            <ul class="track__list">
              <li class="track__detail">
                <span class="track__duration">{{ formatTime(sessionTrack.duration) }}</span><!--
                --><span class="track__unit">m</span>
              </li>
              <li class="track__detail">
                <span class="track__bpm"><span class="bpm">{{ sessionTrack.bpm }} BPM</span></span>
              </li>
              <li class="track__detail">
                <button class="rating__star button">★</button>
                <span class="track__rating">0,0</span>
              </li>
            </ul>
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="page__wrapper track track--detail">
      <header class="track__header">
        <button class="track__play play" title="Play/pause Track" @click="loadTrack(trackIndex)">
          <SvgPlayPause v-bind:usePath="playOrPauseInverted"/>
        </button>
        <h2 class="track__title">{{ track.title }}</h2>
        <div class="track__detail">
          <span class="track__bpm">117</span>
          <span class="track__unit">bpm</span>
        </div>
        <div class="track__detail track__times" title="click to toggle between relative/absolute time">
          <span class="track__current" id="time__elapsed">00:01</span> /
          <span class="track__duration" id="time__total">15:01</span>
        </div>
        <div class="track__detail track__detail-rating">
          <ul class="rating rating--4-5 rating--has-rated">
            <li class="rating__range">
              <button class="rating__star button">☆<!--★--></button>
            </li>
            <li class="rating__range">
              <button class="rating__star button">☆</button>
            </li>
            <li class="rating__range">
              <button class="rating__star button">☆</button>
            </li>
            <li class="rating__range">
              <button class="rating__star button">☆</button>
            </li>
            <li class="rating__range">
              <button class="rating__star button">☆</button>
            </li>
          </ul>
          <span class="track__rating">
                0,0
          </span>
          <span class="track__rate-cta">Rate now</span>
        </div>
      </header>
      <ul class="track__tools tool tool--all">
        <li class="tool__item">
          <button class="tool__action tool__action--solo button" @click="unsoloAll">Unsolo All</button>
        </li>
        <li class="tool__item">
          <button class="tool__action tool__action--mute button" @click="unmuteAll">Unmute All</button>
        </li>
        <!--li class="tool__item">
          <button class="tool__action tool__action--save button">Save Settings</button>
        </li-->
      </ul>
      <ul class="track__lines">
        <li v-if="!isNowPlaying" class="overlayPlay" @click="loadTrack(trackIndex)">PLAY</li>
        <PlayerStemLine
          v-for="(stem, idx) in track.stems"
          v-bind:key="idx"
          v-bind:stem="stem"
          v-bind:stemIndex="idx"
          v-bind:isNowPlaying="isNowPlaying"
        />
      </ul>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerStemLine from '@/components/Player/Stem/Line.vue'
import SvgPlayPause from '@/components/Svg/PlayPause.vue'
import { helpersMixin } from '@/assets/js/helpersMixin.js'
export default {
  name: 'TrackShow',
  components: {
    SvgPlayPause,
    PlayerStemLine
  },
  mixins: [
    helpersMixin
  ],
  data () {
    return {
      session: ''
    }
  },
  computed: {
    ...mapGetters([
      'getSessionByIndex',
      'getTrackByIndex',
      'getLoadedTrackInfo',
      'getIsPlaying'
    ]),
    sessionIndex () {
      return this.$route.params.sessionIndex
    },
    trackIndex () {
      return this.$route.params.trackIndex
    },
    sessionTracks () {
      if (typeof this.session === 'undefined') {
        return []
      }
      return this.session.tracks
    },
    track () {
      return this.getTrackByIndex(this.sessionIndex, this.trackIndex)
    },
    isNowPlaying () {
      return (
        this.getLoadedTrackInfo.sessionIndex === this.sessionIndex &&
        this.getLoadedTrackInfo.trackIndex === this.trackIndex
      )
    },
    playOrPauseInverted () {
      if (this.isNowPlaying === false) {
        return 'play'
      }
      if (this.getIsPlaying === true) {
        return 'pause'
      }
      return 'play'
    }
  },
  mounted () {
    this.session = this.getSessionByIndex(this.sessionIndex)
  },
  methods: {
    loadTrack (trackIndex) {
      if (this.isNowPlaying === true) {
        // already loaded in permaplayer. toggle play/pause
        this.$store.dispatch('togglePermaPlayingState')
        return
      }
      // load into permaplayer and force play
      this.$store.dispatch(
        'loadPlayerTrack',
        {
          sessionIndex: this.sessionIndex,
          trackIndex: trackIndex
        }
      )
      this.$store.dispatch('forcePermaPlay')
    },
    unsoloAll () {
      if (this.isNowPlaying === false) {
        return
      }
      this.$store.commit('requestUnsoloAll')
    },
    unmuteAll () {
      if (this.isNowPlaying === false) {
        return
      }
      this.$store.commit('requestUnmuteAll')
    }
  },
  watch: {
    '$route.params.sessionIndex': function (x) {
      this.sessionIndex = x
    },
    '$route.params.trackIndex': function (x) {
      this.trackIndex = x
    },
    sessionTracks () {

    },
    isNowPlaying () {

    },
    playOrPauseInverted () {

    }
  }
}
</script>

<style lang="scss">
.dont__flex {
  display: contents;
}
.overlayPlay {
  position: absolute;
  font-weight: 800;
  font-size: 120px;
  z-index: 200;
  width: calc(100% - 700px);
  text-align: center;
  padding: 100px 0;
  opacity: 0.4;
}
.overlayPlay:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
