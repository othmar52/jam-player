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
    track: Object,
    session: Object
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
      if (typeof this.session !== 'undefined') {
        this.fromSession()
        return
      }
      if (typeof this.track === 'undefined') {
        return
      }
      if (typeof this.track.stems === 'undefined') {
        return
      }
      this.fromTrack()
    },
    fromTrack () {
      for (const stem of this.track.stems) {
        this.processed.push({ title: stem.title, color: stem.color })
      }
    },
    fromSession () {
      const helperUnique = {}
      for (const track of Object.entries(this.session.tracks)) {
        for (const stem of track[1].stems) {
          helperUnique[`${stem.color}-${stem.title}`] = { title: stem.title, color: stem.color }
        }
      }
      for (const item of Object.entries(helperUnique)) {
        this.processed.push(item[1])
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
.stem__title {
  white-space: nowrap;
}
</style>
