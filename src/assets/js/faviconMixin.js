/* thanks to https://raw.githubusercontent.com/EvanHahn/canvas-to-favicon/master/canvas-to-favicon.js */

export const faviconMixin = {
  methods: {
    drawFavicon () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const width = 64
      const height = 64
      const black = '#000000'
      const red = '#FF5050'
      const yellow = '#EFFE4B'
      const cyan = '#00E5E5'
      const violet = '#9932CC'
      canvas.setAttribute('width', width + 'px')
      canvas.setAttribute('height', height + 'px')

      // background
      ctx.fillStyle = black
      ctx.fillRect(0, 0, width, height)

      const xFrom = width * 0.1
      const xTo = width * 0.9

      ctx.beginPath()
      ctx.strokeStyle = red
      ctx.lineWidth = width / 8
      ctx.moveTo(xFrom, height * 0.2)
      ctx.lineTo(xTo, height * 0.2)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = yellow
      ctx.moveTo(xFrom, height * 0.4)
      ctx.lineTo(xTo, height * 0.4)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = cyan
      ctx.moveTo(xFrom, height * 0.6)
      ctx.lineTo(xTo, height * 0.6)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = violet
      ctx.moveTo(xFrom, height * 0.8)
      ctx.lineTo(xTo, height * 0.8)
      ctx.stroke()

      // send it to the favicon!
      this.canvasToFavicon(canvas)
    },

    canvasToFavicon (canvas) {
      const head = document.head

      var createIconElement = function () {
        var link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        return link
      }

      var isFirefox = !!navigator.userAgent.match(/firefox/i)

      var iconElement

      if (!iconElement) {
        var existingIcons = document.querySelectorAll('link[rel="icon"]')
        for (var i = 0, len = existingIcons.length; i < len; i++) {
          head.removeChild(existingIcons[i])
        }

        iconElement = createIconElement()
        head.appendChild(iconElement)
      }

      // firefox needs to swap out the old element
      if (isFirefox) {
        var newEl = createIconElement()
        head.replaceChild(newEl, iconElement)
        iconElement = newEl
      }

      iconElement.href = canvas.toDataURL('image/png')
    }

  }
}
