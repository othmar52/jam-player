export const waveFormMixin = {
  data: function () {
    return {
      wavPeaks: [],
      waveformSettings: {
        waveColor: '#FF9C01',
        barWidth: 1,
        barGap: 0.2,
        mirrored: 1,
        colors: {
          orange: '#FF9C01',
          green: 'rgb(59,187,47)',
          red: '#FF5050',
          blue: '#5487F4',
          yellow: '#EFFE4B',
          pink: '#F8289E',
          cyan: '#00E5E5',
          violet: '#9932CC',
          /* @see https://www.donaufischer.com/java/farbnamen.htm */
          lawngreen: '#7CFC00',
          darkgoldenrod: '#B8860B',
          grey: '#808080',
          teal: '#008080',
          firebrick: '#B22222',
          darkorange: '#FF8C00',
          darkblue: '#00008B',
          dodgerblue: '#1E90FF'
        }
      }
    }
  },
  methods: {
    /* stolen from https://github.com/othmar52/temp-jam/blob/master/jamSplitter/webStemPlayer/data/stemplayer/js/stemplayer.js */
    /* TODO refacture */
    drawWaveform (targetElement, peakData, color) {
      targetElement.innerHTML = ''
      this.waveformSettings.canvas = document.createElement('canvas')
      this.waveformSettings.context = this.waveformSettings.canvas.getContext('2d')
      this.waveformSettings.canvas.width = targetElement.offsetWidth
      this.waveformSettings.canvas.height = targetElement.offsetHeight
      this.waveformSettings.waveColor = color
      const len = Math.floor(peakData.length / this.waveformSettings.canvas.width)
      let maxVal = this.getMaxVal(peakData)
      if (maxVal === 0) {
        // draw at least a one pixel line for 100% silence files
        maxVal = 1
      }
      for (let j = 0; j < this.waveformSettings.canvas.width; j += this.waveformSettings.barWidth) {
        this.drawBar(
          j,
          (this.bufferMeasure(Math.floor(j * (peakData.length / this.waveformSettings.canvas.width)), len, peakData) * maxVal / 10) *
              (this.waveformSettings.canvas.height / maxVal) +
              1
        )
      }
      targetElement.appendChild(this.waveformSettings.canvas)
    },
    getMaxVal (inputArray) {
      let max = 0
      for (let i = 0; i < inputArray.length; i++) {
        max = (inputArray[i] > max) ? inputArray[i] : max
      }
      return max
    },
    bufferMeasure (position, length, data) {
      let sum = 0.0
      for (let i = position; i <= (position + length) - 1; i++) {
        sum += Math.pow(data[i], 2)
      }
      return Math.sqrt(sum / data.length)
    },
    drawBar (i, h) {
      this.waveformSettings.context.fillStyle = this.waveformSettings.waveColor
      let w = this.waveformSettings.barWidth
      if (this.waveformSettings.barGap !== 0) {
        w *= Math.abs(1 - this.waveformSettings.barGap)
      }
      const x = i + (w / 2)
      let y = this.waveformSettings.canvas.height - h
      if (this.waveformSettings.mirrored === 1) {
        y /= 2
      }
      this.waveformSettings.context.fillRect(x, y, w, h)
    },
    triggerDrawWaveForm () {
      this.drawWaveform(
        this.$refs.waveform,
        this.stem.peaks,
        this.waveformSettings.colors[this.stem.color]
      )
    }
  },
  mounted () {
    this.triggerDrawWaveForm()
  },
  updated () {
    this.triggerDrawWaveForm()
  }
}
