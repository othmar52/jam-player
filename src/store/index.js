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
    },
    currentTrack: {
      sessionIndex: '',
      trackIndex: ''
    },
    permaPlayer: {
      track: {},
      positionPercent: 0,
      positionSecond: 0,
      playing: false,
      stemStates: {}
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
    },
    loadPlayerTrack: function (context, trackData) {
      Vue.set(context.state, 'currentTrack', trackData)
      const newPermaPlayer = {
        track: this.state.stemSessions[trackData.sessionIndex].tracks[trackData.trackIndex],
        positionPercent: 0,
        positionSecond: 0,
        playing: false,
        stemStates: {}
      }
      newPermaPlayer.track.stems.forEach(function (stem, index) {
        // console.log(stem.title, index)
        newPermaPlayer.stemStates[`s${index}`] = {
          isMuted: false,
          isSoloed: false,
          isIsolated: false,
          volLevel: stem.volume
        }
      })
      Vue.set(context.state, 'permaPlayer', newPermaPlayer)

      /*
      this.state.currentTrack = trackData
      this.state.permaPlayer = {
        track: this.state.stemSessions[trackData.sessionIndex].tracks[trackData.trackIndex],
        positionPercent: 0,
        positionSecond: 0,
        playing: false,
        stemStates: {}
      }
      this.dispatch('setInitialStemStates')
      */
    },
    setInitialStemStates: function (context) {
      console.log('setInitialStemStates')
      context.state.permaPlayer.track.stems.forEach(function (stem, index) {
        // console.log(stem.title, index)
        context.state.permaPlayer.stemStates[`s${index}`] = {
          isMuted: false,
          isSoloed: false,
          isIsolated: false,
          volLevel: stem.volume
        }
      })
    },
    togglePermaPlayingState: function (context) {
      context.state.permaPlayer.playing = !context.state.permaPlayer.playing
    }
  },
  getters: {
    getStats: state => state.stats,
    getAllSessions: state => state.stemSessions,
    getSessionByIndex: (state) => (sessionIndex) => { return state.stemSessions[sessionIndex] },
    getCurrentTrack: state => state.permaPlayer,
    getTrackByIndex: (state) => (sessionIndex, trackIndex) => { return state.stemSessions[sessionIndex].tracks[trackIndex] }
  },
  modules: {
  }
})
