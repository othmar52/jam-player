import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.config.productionTip = false

// TODO: separate to another file???
Object.size = function (obj) {
  let size = 0
  let key
  for (key in obj) {
    // @see: https://eslint.org/docs/rules/no-prototype-builtins
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      size++
    }
  }
  return size
}

// display hint how to activate the dbMeter stuff
if (document.location.protocol === 'file:' && document.location.hash.indexOf('forceMeter') === -1) {
  store.commit('setShowDbMeterHint')
}

// pretty dbMeter/volumeMeter feature for audio tracks needs audioContext
// but file:// protocol does not support audioContext for security reasons
//   we can force it via URL to give it a try
//   ATTENTION: file:// protocol requires flag "chromium --disable-web-security" for displaying dbMeter
if (document.location.protocol !== 'file:' || document.location.hash.indexOf('forceMeter') > -1) {
  window.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  document.location.hash = ''
}

// due to the requirement of supporting file:// protocol we can't
// perform an ajax call. but we can load a script during runtime by creating a DOM node...
const jsNode = document.createElement('script')
jsNode.setAttribute('src', './data/tracklist.js')
// jsNode.setAttribute('src', './data/tracklist-full.js')
document.head.appendChild(jsNode)

// helper vars
let loadAttempts = 0
let initApp = false

window.tracklist = []
window.stemSessions = {}

window.initialDataLoadInterval = window.setInterval(
  function () {
    // continue loop until we reach max tries or we get tracklist from external file...
    if (loadAttempts > 3 || window.tracklist.length > 0) {
      initApp = true
    }
    loadAttempts++
    if (initApp === false) {
      return
    }

    // destroy the interval and init Vue app
    clearInterval(window.initialDataLoadInterval)
    window.initialDataLoadInterval = undefined
    jsNode.parentNode.removeChild(jsNode)

    try {
      // pass loaded sessionConfig (or undefined) to the store
      store.commit('retrieveTracklist', window.tracklist) // eslint-disable-line no-undef
    } catch (e) {
      // don't wory about missing config as app will handle missing config
    }

    // init App
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  },
  10
)
