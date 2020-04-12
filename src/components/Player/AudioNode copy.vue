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
    <div
      v-if="stemIndex === 0"
      ref="dbmeter" class="dbmeter">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AudioNode',
  props: {
    source: String,
    stemIndex: Number,
    playOrPause: String
  },
  data () {
    return {
      options: {
        borderSize: 2,
        fontSize: 0,
        backgroundColor: '#020724',
        tickColor: '#ddd',
        gradient: [
          '#d31555 4%',
          '#6a7c69 45%',
          '#37af73 100%'
        ],
        dbRange: 48,
        dbTickSize: 6,
        maskTransition: '0.1s'
      },
      tickWidth: 0,
      elementWidth: 0,
      elementHeight: 0,
      meterHeight: 0,
      meterWidth: 0,

      meterTop: 0,
      vertical: true,
      channelCount: 1,
      channelMasks: [],
      channelPeaks: [],
      maskSizes: [],

      meterElement: null
    }
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
    // peakmeter methods

    getBaseLog (x, y) {
      return Math.log(y) / Math.log(x)
    },

    dbFromFloat (floatVal) {
      return this.getBaseLog(10, floatVal) * 20
    },

    setOptions (userOptions) {
      for (var k in userOptions) {
        if (Object.prototype.hasOwnProperty.call(userOptions, k)) {
          this.options[k] = userOptions[k]
        }
      }
      this.tickWidth = this.options.fontSize * 2.0
      this.meterTop = this.options.fontSize * 1.5 + this.options.borderSize
    },

    createMeterNode (sourceNode, audioCtx) {
      var meterNode = audioCtx.createScriptProcessor(2048, sourceNode.channelCount, sourceNode.channelCount)
      sourceNode.connect(meterNode)
      meterNode.connect(audioCtx.destination)
      return meterNode
    },

    createContainerDiv (parent) {
      this.meterElement = document.createElement('div')
      Object.assign(
        this.meterElement.style,
        {
          position: 'relative',
          width: this.elementWidth + 'px',
          height: this.elementHeight + 'px',
          backgroundColor: this.options.backgroundColor
        }
      )
      parent.appendChild(this.meterElement)
      return this.meterElement
    },

    createMeter (domElement, meterNode, optionsOverrides) {
      this.setOptions(optionsOverrides)
      this.elementWidth = domElement.clientWidth
      this.elementHeight = domElement.clientHeight
      this.createContainerDiv(domElement)
      if (this.elementWidth > this.elementHeight) {
        this.vertical = false
      }
      this.meterHeight = this.elementHeight - this.meterTop - this.options.borderSize
      this.meterWidth = this.elementWidth - this.tickWidth - this.options.borderSize
      this.createRainbow()
      this.channelCount = meterNode.channelCount
      var channelWidth = this.meterWidth / this.channelCount
      if (!this.vertical) {
        this.channelWidth = this.meterHeight / this.channelCount
      }
      var channelLeft = this.tickWidth
      if (!this.vertical) {
        channelLeft = this.meterTop
      }
      for (var i = 0; i < this.channelCount; i++) {
        this.createChannelMask(
          this.options.borderSize,
          channelLeft,
          false
        )
        this.channelMasks[i] = this.createChannelMask(
          channelWidth,
          channelLeft,
          this.options.maskTransition
        )
        this.channelPeaks[i] = 0.0
        channelLeft += channelWidth
        this.maskSizes[i] = 0
      }
      meterNode.onaudioprocess = this.updateMeter.bind(this)
      this.meterElement.addEventListener('click', function () {
        for (var i = 0; i < this.channelCount; i++) {
          this.channelPeaks[i] = 0.0
        }
      }, false)
      this.paintMeter()
    },

    createRainbow () {
      var rainbow = document.createElement('div')
      this.meterElement.appendChild(rainbow)
      var styles = {
        width: this.meterWidth + 'px',
        height: this.meterHeight + 'px',
        position: 'absolute',
        top: this.meterTop + 'px',
        left: this.options.borderSize + 'px',
        backgroundImage: 'linear-gradient(to left, ' + this.options.gradient.join(', ') + ')'
      }

      if (this.vertical) {
        styles.left = this.tickWidth + 'px'
        styles.backgroundImage = 'linear-gradient(to bottom, ' + this.options.gradient.join(', ') + ')'
      }
      Object.assign(rainbow.style, styles)
      return rainbow
    },

    createChannelMask (width, left, transition) {
      var channelMask = document.createElement('div')
      this.meterElement.appendChild(channelMask)
      var styles = {
        position: 'absolute',
        backgroundColor: this.options.backgroundColor,
        width: this.meterWidth + 'px',
        height: width + 'px',
        top: left + 'px',
        right: this.options.fontSize * 2 + 'px'
      }
      if (this.vertical) {
        styles.width = width + 'px'
        styles.height = this.meterHeight + 'px'
        styles.top = this.meterTop + 'px'
        styles.left = left + 'px'
        delete styles.right
      }
      if (transition) {
        styles.transition = ((this.vertical) ? 'height' : 'width') + ' ' + this.options.maskTransition
      }
      Object.assign(channelMask.style, styles)
      return channelMask
    },

    maskSize (floatVal) {
      var meterDimension = this.vertical ? this.meterHeight : this.meterWidth
      if (floatVal === 0.0) {
        return meterDimension
      }
      var d = this.options.dbRange * -1
      var returnVal = Math.floor(this.dbFromFloat(floatVal) * meterDimension / d)
      if (returnVal > meterDimension) {
        return meterDimension
      }
      return returnVal
    },

    updateMeter (audioProcessingEvent) {
      var inputBuffer = audioProcessingEvent.inputBuffer
      var i
      var channelData = []
      var channelMaxes = []
      for (i = 0; i < this.channelCount; i++) {
        channelData[i] = inputBuffer.getChannelData(i)
        channelMaxes[i] = 0.0
      }
      for (var sample = 0; sample < inputBuffer.length; sample++) {
        for (i = 0; i < this.channelCount; i++) {
          if (Math.abs(channelData[i][sample]) > channelMaxes[i]) {
            channelMaxes[i] = Math.abs(channelData[i][sample])
          }
        }
      }
      for (i = 0; i < this.channelCount; i++) {
        this.maskSizes[i] = this.maskSize(channelMaxes[i], this.meterHeight)
        if (channelMaxes[i] <= this.channelPeaks[i]) {
          continue
        }
        this.channelPeaks[i] = channelMaxes[i]
      }
    },

    paintMeter () {
      var axis = (this.vertical) ? 'height' : 'width'
      for (var i = 0; i < this.channelCount; i++) {
        this.channelMasks[i].style[axis] = this.maskSizes[i] + 'px'
      }
      // console.log(this.maskSizes)
      window.requestAnimationFrame(this.paintMeter.bind(this))
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

    if (this.stemIndex > 0) {
      return
    }
    console.log('creating meter...')
    // only needed for volume-meter which seems to be not possible via file protocol
    // if(document.location.protocol !== 'file:' || document.location.hash === '#forceMeter') {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // }

    this.$refs.audio.crossOrigin = 'anonymous'
    const sourceNode = window.audioCtx.createMediaElementSource(this.$refs.audio)
    sourceNode.connect(window.audioCtx.destination)
    const meterNode = this.createMeterNode(sourceNode, window.audioCtx)
    this.createMeter(this.$refs.dbmeter, meterNode, {})
  }
}
</script>

<style lang="scss">
.audio__node {
  position: absolute;
  visibility: hidden;

  .dbmeter {
    position: absolute;
    width: 100px;
    height: 200px;
    border: 1px solid red;
    top: 10px;

    width: 100px;
    height: 100px;
    border: 1px solid red;
    background-color: black;
    top: -100px;
    z-index: 200;
    visibility: visible;
  }
}
</style>
