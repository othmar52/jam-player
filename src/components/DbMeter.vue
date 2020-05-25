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
export default {
  name: 'DbMeter',
  props: {
    stemIndex: Number,
    isNowPlaying: Boolean
  },
  data () {
    return {
      maskSizeLeft: 100,
      maskSizeRight: 100
    }
  },
  mounted () {
    const that = this
    document.querySelector('#permaplayer').addEventListener(
      `dbmeter${this.stemIndex}`,
      function (event) {
        if (that.isNowPlaying === false) {
          that.maskSizeLeft = 100
          that.maskSizeRight = 100
          return
        }
        that.maskSizeLeft = event.detail[0]
        that.maskSizeRight = event.detail[1]
      },
      false
    )
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
