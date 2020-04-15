
/*
 * Many thanks to Evan Sonderegger
 * https://github.com/esonderegger/web-audio-peak-meter
 */
export const dbMeterSourceMixin = {
  data () {
    return {
      dbRange: 48,
      channelCount: 1,
      maskSizes: [100, 100],
      lastCommittedMaskSizes: [0, 0]
    }
  },
  methods: {
    initMeter (audioDomNode) {
      if (typeof window.audioCtx === 'undefined') {
        // not possible without audioContext created in 'main.js'
        return
      }

      audioDomNode.crossOrigin = 'anonymous'
      const sourceNode = window.audioCtx.createMediaElementSource(audioDomNode)
      sourceNode.connect(window.audioCtx.destination)
      const meterNode = this.createMeterNode(sourceNode, window.audioCtx)
      this.createMeter(meterNode)
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
        this.maskSizes[i] = this.maskSize(channelMaxes[i])
      }
      this.commitToStore()
    },

    createMeterNode (sourceNode, audioCtx) {
      var meterNode = audioCtx.createScriptProcessor(2048, sourceNode.channelCount, sourceNode.channelCount)
      sourceNode.connect(meterNode)
      meterNode.connect(audioCtx.destination)
      return meterNode
    },

    createMeter (meterNode) {
      this.channelCount = meterNode.channelCount
      meterNode.onaudioprocess = this.updateMeter.bind(this)
    },

    maskSize (floatVal) {
      var max = 100
      if (floatVal === 0.0) {
        return max
      }
      var d = this.dbRange * -1
      var returnVal = Math.floor(this.dbFromFloat(floatVal) * max / d)
      if (returnVal > max) {
        return max
      }
      return returnVal
    },

    commitToStore () {
      if (this.maskSizes[0] === this.lastCommittedMaskSizes[0] &&
          this.maskSizes[1] === this.lastCommittedMaskSizes[1]) {
        // do not commit in case the values hasn't changed
        return
      }
      this.$store.commit(
        'retrieveDbMeterValues',
        {
          stemIndex: this.stemIndex,
          maskSizes: this.maskSizes
        }
      )
      this.lastCommittedMaskSizes = [
        this.maskSizes[0],
        this.maskSizes[1]
      ]
    },

    getBaseLog (x, y) {
      return Math.log(y) / Math.log(x)
    },

    dbFromFloat (floatVal) {
      return this.getBaseLog(10, floatVal) * 20
    }
  }
}
