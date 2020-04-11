
export const helpersMixin = {
  methods: {
    formatTime (second) {
      const hhmmss = new Date(second * 1000).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    },
    toMinutes (seconds) {
      return parseInt(seconds / 60)
    },
    formatSessionNumber (inputString) {
      if (!inputString) {
        return ''
      }
      return inputString.replace('session', '').replace(/^0+/, '')
    }
  }
}
