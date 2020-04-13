<template>
  <div class="audio__node">
    <audio
      v-if="stemIndex === 0"
      ref="audio"
      @durationchange='onDurationChangeListener'
      @timeupdate='onTimeUpdateListener'
      @ended='onEndedListener'>
      <source type="audio/mpeg" :src="source">
    </audio>
    <audio
      v-else
      ref="audio">
      <source type="audio/mpeg" :src="source">
    </audio>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dbMeterSourceMixin } from '@/assets/js/dbMeterSourceMixin.js'
export default {
  name: 'AudioNode',
  mixins: [
    dbMeterSourceMixin
  ],
  props: {
    source: String,
    stemIndex: Number,
    playOrPause: String
  },
  computed: {
    ...mapGetters([
      'getStemStateByIndex'
    ]),
    volValue () {
      return this.getStemStateByIndex(this.stemIndex).volLevel
    },
    mutedAudio () {
      return this.getStemStateByIndex(this.stemIndex).isMutedAudio
    }
  },
  methods: {
    play () {
      this.$refs.audio.play()
    },
    pause () {
      this.$refs.audio.pause()
    },
    seekTo (targetSecond) {
      this.$refs.audio.currentTime = targetSecond
    },
    onDurationChangeListener (event) {
      this.$store.commit('playerDurationUpdate', event.target.duration)
    },
    onTimeUpdateListener (event) {
      this.$store.commit('playerTimeUpdate', event.target.currentTime)
    },
    onEndedListener () {
      this.$store.commit('playerTrackEnded')
    },
    getCurrentTime () {
      return this.$refs.audio.currentTime
    }
  },
  watch: {
    playOrPause (newValue) {
      this[newValue]()
    },
    volValue (newValue) {
      this.$refs.audio.volume = newValue
    },
    mutedAudio (newValue) {
      this.$refs.audio.muted = newValue
    }
  },
  mounted () {
    this[this.playOrPause]()
    // TODO: check mixup with http & file protocol...
    // this.$refs.audio.setAttribute('crossorigin', 'anonymous');
    this.initMeter(this.$refs.audio)
  }
}
</script>

<style lang="scss">
.audio__node {
  position: absolute;
  visibility: hidden;
}
</style>
