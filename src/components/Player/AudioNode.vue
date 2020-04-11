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
