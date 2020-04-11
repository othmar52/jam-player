import Vue from 'vue'
import Vuex from 'vuex'
import DataLoader from '../assets/js/DataLoader'
import PathPrefixer from '../assets/js/PathPrefixer'
import StemStates from '../assets/js/StemStates'

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
      duration: 0,
      positionPercent: 0,
      positionSecond: 0,
      playing: false,
      requestSeek: false,
      stemStates: {}
    },
    settings: {
      soloMode: 'single' // use 'multi' for having multiple stems soloed simultaneously
    }
  },
  mutations: {
    // @see src/assets/js/DataLoader.js
    retrieveTracklist: function () { },

    // @see src/assets/js/PathPrefixer.js
    retrieveSessionProperties (state, payload) { },
    retrieveTrackproperties (state, payload) { },

    // @see src/assets/js/StemStates.js
    requestVolumeChange (state, payload) { },
    requestToggleMute (state, payload) { },
    requestToggleSolo (state, payload) { },
    requestBoostStart (state, payload) { },
    requestBoostEnd (state) { },
    requestUnmuteAll (state) { },
    requestUnsoloAll (state) { },

    addSession (state, payload) {
      if (typeof state.stemSessions[payload.index] !== 'undefined') {
        // already added
        return
      }
      payload.duration = 0
      payload.trackCount = 0
      Vue.set(state.stemSessions, payload.index, payload)
      state.stats.totalSessions++
    },
    addTrack (state, payload) {
      Vue.set(state.stemSessions[payload.session].tracks, payload.trackLetter, payload)
      state.stemSessions[payload.session].duration += payload.duration
      state.stemSessions[payload.session].trackCount++
      state.stats.totalTracks++
      state.stats.totalDuration += payload.duration
      state.stats.totalByteSize += payload.byteSize
    },
    playerTimeUpdate (state, second) {
      // console.log('mutation:playerTimeUpdate', second)
      state.permaPlayer.positionSecond = second
      state.permaPlayer.positionPercent = second / (state.permaPlayer.duration / 100)
    },
    playerDurationUpdate (state, second) {
      state.permaPlayer.duration = second
    },
    requestSeek (state, percent) {
      Vue.set(state.permaPlayer, 'requestSeek', percent * (state.permaPlayer.duration / 100))
    },
    requestSeekFinished (state) {
      Vue.set(state.permaPlayer, 'requestSeek', false)
    },
    togglePermaPlayingStateMut: function (state) {
      state.permaPlayer.playing = !state.permaPlayer.playing
    }
  },
  plugins: [
    DataLoader,
    PathPrefixer,
    StemStates
  ],
  actions: {
    setTracklistData: function (context, tracklistData) {
      this.state.treeStructure = tracklistData
      // console.log('setTracklistData ', tracklistData)
    },
    loadPlayerTrack: function (context, trackData) {
      this.state.currentTrack = trackData
      this.state.permaPlayer = {
        track: this.state.stemSessions[trackData.sessionIndex].tracks[trackData.trackIndex],
        duration: 0,
        positionPercent: 0,
        positionSecond: 0,
        playing: false,
        stemStates: {}
      }
      this.dispatch('setInitialStemStates')
      this.dispatch('forcePermaPlay')
    },
    setInitialStemStates: function (context) {
      const newStemStates = {}
      context.state.permaPlayer.track.stems.forEach(function (stem, index) {
        newStemStates[`s${index}`] = {
          // internal states defined by the user within the gui
          isMutedInternal: false,
          isSoloedInternal: false,
          isBoostedInternal: false,
          volLevelInternal: stem.volume,

          // thoses reflect the visual button states (probably different than internal states) and stem track state
          isMutedGui: false,
          isSoloedGui: false,
          isInactiveTrackGui: false,

          // those are the real values which gets applied in the audio player
          isMutedAudio: false,
          volLevel: stem.volume
        }
      })
      Vue.set(context.state.permaPlayer, 'stemStates', newStemStates)
    },
    // setUpdatedStemStates: function (context, payload) {
    //   Vue.set(context.state.permaPlayer, 'stemStates', payload)
    // },
    togglePermaPlayingState: function (context) {
      context.state.permaPlayer.playing = !context.state.permaPlayer.playing
    },
    forcePermaPlay: function (context) {
      context.state.permaPlayer.playing = true
    }
  },
  getters: {
    getStats: state => state.stats,
    getAllSessions: state => state.stemSessions,
    getSessionByIndex: (state) => (sessionIndex) => { return state.stemSessions[sessionIndex] },
    getStemStateByIndex: (state) => (stemIndex) => { return state.permaPlayer.stemStates[`s${stemIndex}`] },
    getCurrentTrack: state => state.permaPlayer,
    getLoadedTrackInfo: state => state.currentTrack,
    getCurrentProgressPercent: state => state.permaPlayer.positionPercent,
    getCurrentProgressSecond: state => state.permaPlayer.positionSecond,
    getDurationSecond: state => state.permaPlayer.duration,
    getRequestSeek: state => state.permaPlayer.requestSeek,
    getIsPlaying: state => state.permaPlayer.playing,
    getTrackByIndex: (state) => (sessionIndex, trackIndex) => { return state.stemSessions[sessionIndex].tracks[trackIndex] }
  },
  modules: {
  }
})
