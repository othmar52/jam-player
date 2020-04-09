import Vue from 'vue'
import Vuex from 'vuex'
import DataLoader from '../assets/js/DataLoader'
import PathPrefixer from '../assets/js/PathPrefixer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    treeStructure: [],
    stemSessions: {},
    stats: {
      totalSessions: 0,
      totalTracks: 0,
      totalDuration: 0,
      totalByteSize: 0
    }
  },
  mutations: {
    retrieveTracklist: function () {
      // @see src/assets/js/DataLoader.js
    },
    retrieveSessionProperties (state, payload) {
      // @see src/assets/js/PathPrefixer.js
    },
    retrieveTrackproperties (state, payload) {
      // @see src/assets/js/PathPrefixer.js
    },
    addSession (state, payload) {
      if (typeof state.stemSessions[payload.index] !== 'undefined') {
        // already added
        return
      }
      Vue.set(state.stemSessions, payload.index, payload)
      state.stats.totalSessions++
    },
    addTrack (state, payload) {
      Vue.set(state.stemSessions[payload.session].tracks, payload.trackLetter, payload)
      state.stats.totalTracks++
      state.stats.totalDuration += payload.duration
      state.stats.totalByteSize += payload.byteSize
    }
  },
  plugins: [
    DataLoader,
    PathPrefixer
  ],
  actions: {
    setTracklistData: function (context, tracklistData) {
      this.state.treeStructure = tracklistData
      // console.log('setTracklistData ', tracklistData)
    }
  },
  getters: {
    getStats: state => state.stats
  },
  modules: {
  }
})
