<template>
  <div class="musician__badges">
    <span
      v-for="(item, idx) in processed"
      v-bind:key="`${idx}${item.title}${item.color}`"
      :class="`stem__title stem__title--${item.color}`">
       <span class="dot"></span> {{ item.title }}</span>
  </div>
</template>

<script>

export default {
  name: 'MusiciansBadges',
  props: {
    track: Object
  },
  data () {
    return {
      processed: []
    }
  },
  created () {
    this.prepareMusiciansArray()
  },
  methods: {
    prepareMusiciansArray () {
      this.processed = []
      if (typeof this.track === 'undefined') {
        return
      }
      if (typeof this.track.stems === 'undefined') {
        return
      }
      for (const stem of this.track.stems) {
        this.processed.push({ title: stem.title, color: stem.color })
      }
    }
  },
  watch: {
    track () {
      this.prepareMusiciansArray()
    }
  }
}
</script>

<style lang="scss">

</style>
