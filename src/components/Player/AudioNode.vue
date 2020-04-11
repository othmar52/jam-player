<template>
  <div class="audio__node">
    <audio
      v-if="stemIndex === 0"
      crossorigin="anonymous"
      ref="audio"
      @durationchange='onDurationChangeListener'
      @timeupdate='onTimeUpdateListener'
      @ended='onEndedListener'>
      <source type="audio/mpeg" :src="source">
    </audio>
    <audio
      v-else
      crossorigin="anonymous"
      ref="audio">
      <source type="audio/mpeg" :src="source">
    </audio>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AudioNode',
  data () {
    return {
      // playOrPause: 'pause'
    }
  },
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
      // console.log('onDurationChangeListener', event)
      this.$store.commit('playerDurationUpdate', event.target.duration)
    },
    onTimeUpdateListener (event) {
      // console.log('onTimeUpdateListener', event.target.currentTime)
      this.$store.commit('playerTimeUpdate', event.target.currentTime)
    },
    onEndedListener (e) {
      console.log('TODO: onEndedListener', e)
    }
  },
  watch: {
    playOrPause (newValue) {
      this[newValue]()
    },
    volValue (newValue) {
      // console.log('AudioNode watcher volValue: ', newValue)
      this.$refs.audio.volume = newValue
    },
    mutedAudio (newValue) {
      // console.log('AudioNode watcher mutedAudio: ', newValue)
      this.$refs.audio.muted = newValue
    }
  },
  mounted () {
    this[this.playOrPause]()
  }
}
</script>

<style lang="scss">
.audio__node {
  position: absolute;
  visibility: hidden;
}
</style>
