<template>
  <audio
    class="player"
    crossorigin="anonymous"
    ref="audio">
    <source type="audio/mpeg" :src="source">
  </audio>
</template>

<script>
export default {
  name: 'AudioNode',
  props: {
    source: String
  },
  methods: {
    play () {
      this.$refs.audio.play()
    },
    pause () {
      this.$refs.audio.pause()
    }
  }
}
</script>
