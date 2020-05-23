<template>
  <div class="dbmeter">
    <div class="dbmeter__channel">
      <div class="dbmeter__mask" :style="`height: ${maskSizeLeft}%;`"></div>
    </div>
    <div class="dbmeter__channel">
      <div class="dbmeter__mask" :style="`height: ${maskSizeRight}%;`"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DbMeter',
  props: {
    stemIndex: Number,
    isNowPlaying: Boolean
  },
  computed: {
    ...mapGetters([
      'getDbMeterValuesByIndex'
    ]),
    maskSizeLeft () {
      return this.maskSizeFor('left')
    },
    maskSizeRight () {
      return this.maskSizeFor('right')
    }
  },
  methods: {
    maskSizeFor (channel) {
      if (this.isNowPlaying === false) {
        return 100
      }
      const maskSizes = this.$store.getters.getDbMeterValuesByIndex(this.stemIndex)
      if (typeof maskSizes === 'undefined') {
        return 100
      }
      return maskSizes[channel]
    }
  }
}
</script>

<style lang="scss">
.dbmeter {
  display: flex;
  background-color: #020724;
  .dbmeter__channel {
    position: relative;
    height: 100%;
    background-image: linear-gradient(to bottom, #d31555 4%, #6a7c69 45%, #37af73 100%);
    width: 48%;
    margin: 1px;
  }
  .dbmeter__mask {
    position: absolute;
    width: 100%;
    background-color: #020724;
    transition: height 0.1s;
  }
}
</style>
