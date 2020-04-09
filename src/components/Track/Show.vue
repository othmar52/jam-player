<template>
<div class="dont__flex">
<aside class="page__sidebar tracklist">
    <h3 class="tracklist__title">Tracklist Session <span class="session__symbol">#</span><span class="session__nr">104</span></h3>
    <ul class="tracklist__list">

      <li class="tracklist__item tracklist__item--active">
        <a href="#" class="tracklist__link track navigate" data-targetsession="session0104" data-targettype="track" data-targettrack="A">
          <span class="track_letter track__letter-circled">A</span>
          <h4 class="track__title">Barton Bottle</h4>
          <ul class="track__list">
            <li class="track__detail">
              <span class="track__duration">15:01</span><!--
              --><span class="track__unit">m</span>
            </li>
            <li class="track__detail">
              <span class="track__bpm"><span class="bpm">117 BPM</span></span>
            </li>
            <li class="track__detail">
              <button class="rating__star button">★</button>
              <span class="track__rating">0,0</span>
            </li>
          </ul>
        </a>
      </li>
    </ul>
  </aside>

<main class="page__wrapper track track--detail">
    <header class="track__header">
      <button class="track__play play" title="Play/pause Track „Barton Bottle“">
        <SvgPlayPause />
      </button>
      <h2 class="track__title">{{ track.title }} <span @click="loadTrack(trackIndex)">X</span></h2>
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
        <button class="tool__action tool__action--solo button">Unsolo All</button>
      </li>
      <li class="tool__item">
        <button class="tool__action tool__action--mute button">Unmute All</button>
      </li>
      <li class="tool__item">
        <button class="tool__action tool__action--save button">Save Settings</button>
      </li>
    </ul>
    <ul class="track__lines">
      <PlayerStemLine v-for="(stem, idx) in track.stems" v-bind:key="idx" v-bind:stem="stem" v-bind:stemIndex="idx" />
    </ul>
  </main>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerStemLine from '@/components/Player/Stem/Line.vue'
import SvgPlayPause from '@/components/Svg/PlayPause.vue'
export default {
  name: 'TrackShow',
  components: {
    SvgPlayPause,
    PlayerStemLine
  },
  data () {
    return {
      session: ''
    }
  },
  computed: {
    ...mapGetters([
      'getSessionByIndex',
      'getTrackByIndex'
    ]),
    sessionIndex () {
      return this.$route.params.sessionIndex
    },
    trackIndex () {
      return this.$route.params.trackIndex
    },
    sessionTracks () {
      if (!this.session) {
        return []
      }
      return this.session.tracks
    },
    track () {
      return this.getTrackByIndex(this.sessionIndex, this.trackIndex)
    }
  },
  mounted () {
    this.session = this.getSessionByIndex(this.sessionIndex)
  },
  methods: {
    loadTrack (trackIndex) {
      this.$store.dispatch(
        'loadPlayerTrack',
        {
          sessionIndex: this.sessionIndex,
          trackIndex: trackIndex
        }
      )
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

    }
  }
}
</script>

<style lang="scss">
.dont__flex {
  display: contents;
}
</style>
