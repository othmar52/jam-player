import Vue from 'vue'
import Vuex from 'vuex'
import DataLoader from '../assets/js/DataLoader'
import PathPrefixer from '../assets/js/PathPrefixer'
import StemStates from '../assets/js/StemStates'

Vue.use(Vuex)

function * filter (array, condition, maxSize) { // eslint-disable-line no-unused-vars
  if (!maxSize || maxSize > array.length) {
    maxSize = array.length
  }
  let count = 0
  let i = 0
  while (count < maxSize && i < array.length) {
    if (condition(array[i])) {
      yield array[i]
      count++
    }
    i++
  }
}
export default new Vuex.Store({
  state: {
    treeStructure: [],
    stemSessions: {},
    stats: {
      totalTrackConfigs: 0,
      trackLoadAttempts: 0,
      totalSessions: 0,
      totalTracks: 0,
      totalDuration: 0,
      totalByteSize: 0,
      totalPics: 0,
      totalVideos: 0,
      loadedPercent: 0,
      showDbMeterHint: false
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
      anyTrackSoloed: false,
      anyTrackMuted: false,
      anyTrackBoosted: false,
      stemStates: {}
    },
    settings: {
      soloMode: 'single' // use 'multi' for having multiple stems soloed simultaneously
    },
    randomTracks: [],

    // search related stuff
    acData: [],
    inputData: '',
    focusIndex: '',
    inputFocus: false,
    searchIndexWords: [],
    searchIndexResults: []
  },
  mutations: {
    // @see src/assets/js/DataLoader.js
    retrieveTracklist: function () { },
    retrieveTrackCount: function (state, payload) {
      state.stats.totalTrackConfigs = payload
    },
    retrieveLoadAttempt: function (state) {
      state.stats.trackLoadAttempts++
      state.stats.loadedPercent = state.stats.trackLoadAttempts / (state.stats.totalTrackConfigs / 100)
    },

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
      if (window.hostLevel === 'track') {
        // filesystem for pics and videos is missing (only available in parent directory)
        payload.images = []
        payload.videos = []
      }
      payload.duration = 0
      payload.trackCount = 0
      Vue.set(state.stemSessions, payload.index, payload)
      state.stats.totalSessions++
      state.stats.totalPics += payload.images.length
      state.stats.totalVideos += payload.videos.length
    },
    addTrack (state, payload) {
      Vue.set(state.stemSessions[payload.session].tracks, payload.trackLetter, payload)
      state.stemSessions[payload.session].duration += payload.duration
      state.stemSessions[payload.session].trackCount++
      state.stats.totalTracks++
      state.stats.totalDuration += payload.duration
      state.stats.totalByteSize += payload.byteSize

      this.dispatch('addTrackToSearchIndex', payload)

      if (state.stats.totalTracks === 1) {
        // as soon as we have a track feed the randomizer with this single track
        this.dispatch('initRandomTracks')
      }
      if (state.stats.totalTrackConfigs === state.stats.trackLoadAttempts) {
        // as soon as we have all tracks feed the randomizer
        this.dispatch('initRandomTracks')
        this.dispatch('buildMusicianSearchIndex')
      }
    },
    playerTimeUpdate (state, second) {
      // console.log('mutation:playerTimeUpdate', second)
      state.permaPlayer.positionSecond = second
      state.permaPlayer.positionPercent = second / (state.permaPlayer.duration / 100)
    },
    playerDurationUpdate (state, second) {
      state.permaPlayer.duration = second
    },
    setShowDbMeterHint (state) {
      state.stats.showDbMeterHint = true
    },
    playerTrackEnded (state) {
      // TODO: let the user decide to play next track or a random track...
      // for now play a random track...
      this.dispatch(
        'loadPlayerTrack',
        state.randomTracks[0].params
      )
    },
    requestSeek (state, percent) {
      Vue.set(state.permaPlayer, 'requestSeek', percent * (state.permaPlayer.duration / 100))
    },
    requestSeekFinished (state) {
      Vue.set(state.permaPlayer, 'requestSeek', false)
    },
    togglePermaPlayingStateMut: function (state) {
      state.permaPlayer.playing = !state.permaPlayer.playing
    },

    // search stuff begin
    // thanks to https://codepen.io/solov/pen/ZEYRzmN
    CHANGE_ACLIST (state, newList) {
      state.acData = newList
    },
    RESET_ACLIST (state) {
      state.acData = []
    },
    CHANGE_INPUT_DATA (state, text) {
      state.inputData = text
    },
    SET_FOCUS (state, val) {
      state.focusIndex = val
    },
    INCREMENT_DECREMENT_FOCUS (state, val) {
      if (state.focusIndex === '') {
        state.focusIndex = 0
      } else {
        state.focusIndex += val
        if (state.focusIndex < 0) {
          state.focusIndex = 0
        } else if (state.focusIndex > 0 && state.focusIndex > state.acData.length - 1) {
          state.focusIndex = state.acData.length - 1
        }
      }
    },
    RESET_FOCUS (state) {
      state.focusIndex = ''
    },
    CHANGE_INPUT_FOCUS (state, val) {
      state.inputFocus = val
    }
    // search stuff end
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
      this.dispatch('moveTrackToEnd', trackData)
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
    },
    initRandomTracks: function (context) {
      const allTrackRoutes = []
      for (const sessionKey of Object.keys(context.state.stemSessions)) {
        for (const trackKey of Object.keys(context.state.stemSessions[sessionKey].tracks)) {
          allTrackRoutes.push(
            {
              name: 'TrackShow',
              params: {
                sessionIndex: sessionKey,
                trackIndex: trackKey
              }
            }
          )
        }
      }
      // shuffle
      let counter = allTrackRoutes.length
      while (counter > 0) {
        const index = Math.floor(Math.random() * counter)
        counter--
        const temp = allTrackRoutes[counter]
        allTrackRoutes[counter] = allTrackRoutes[index]
        allTrackRoutes[index] = temp
      }
      context.state.randomTracks = allTrackRoutes
    },
    moveTrackToEnd: function (context, trackData) {
      // move track to very end of randomizer
      const newRandomRoutes = []
      for (const route of context.state.randomTracks) {
        if (route.params.sessionIndex !== trackData.sessionIndex) {
          newRandomRoutes.push(route)
          continue
        }
        if (route.params.trackIndex === trackData.trackIndex) {
          continue
        }
        newRandomRoutes.push(route)
      }
      newRandomRoutes.push({
        name: 'TrackShow',
        params: trackData
      })
      Vue.set(context.state, 'randomTracks', newRandomRoutes)
    },

    // search stuff begin
    addTrackToSearchIndex: function (context, track) {
      context.state.searchIndexWords.push(track.title)
      context.state.searchIndexResults.push(
        {
          type: 'track',
          title: track.title,
          sessionCounter: context.state.stemSessions[track.session].counter,
          month: context.state.stemSessions[track.session].month,
          year: context.state.stemSessions[track.session].year,
          trackLetter: track.trackLetter,
          route: {
            name: 'TrackShow',
            params: {
              sessionIndex: track.session,
              trackIndex: track.trackLetter
            }
          }
        }
      )
    },

    buildMusicianSearchIndex: function (context) {
      for (const sessionKey of Object.keys(context.state.stemSessions)) {
        const stemTitles = []
        for (const trackKey of Object.keys(context.state.stemSessions[sessionKey].tracks)) {
          for (const stem of context.state.stemSessions[sessionKey].tracks[trackKey].stems) {
            stemTitles.push(stem.title)
          }
        }
        context.state.searchIndexWords.push(
          `${sessionKey}${stemTitles.filter((v, i, a) => a.indexOf(v) === i)}`
        )
        context.state.searchIndexResults.push(
          {
            type: 'session',
            title: `Session #${context.state.stemSessions[sessionKey].counter}`,
            sessionCounter: context.state.stemSessions[sessionKey].counter,
            month: context.state.stemSessions[sessionKey].month,
            year: context.state.stemSessions[sessionKey].year,
            stemNames: stemTitles.filter((v, i, a) => a.indexOf(v) === i),
            route: {
              name: 'SessionShow',
              params: {
                sessionIndex: sessionKey
              }
            }
          }
        )
      }
    },

    searchData ({ commit }, searchText) {
      // thanks to https://stackoverflow.com/questions/26468557/return-index-value-from-filter-method-javascript#answer-53398853
      var searchResult = this.state.searchIndexWords.map(
        (word, idx) => (word.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
          ? this.state.searchIndexResults[idx]
          : undefined
      ).filter(x => x).slice(0, 20)

      commit('CHANGE_ACLIST', searchResult)
      commit('INCREMENT_DECREMENT_FOCUS', 0)
    },
    optionPicked ({ commit }, pickedText) {
      commit('CHANGE_INPUT_DATA', pickedText)
      commit('RESET_ACLIST')
    },
    resetData ({ commit }) {
      commit('RESET_ACLIST')
    },
    changeInput ({ commit }, text) {
      commit('CHANGE_INPUT_DATA', text)
    },
    focusChange ({ commit }, val) {
      commit('INCREMENT_DECREMENT_FOCUS', val)
    },
    setFocus ({ commit }, val) {
      commit('SET_FOCUS', val)
    },
    inputFocus ({ commit }, val) {
      commit('CHANGE_INPUT_FOCUS', val)
    }
    // search stuff end
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
    getAnyTrackSoloed: state => state.permaPlayer.anyTrackSoloed,
    getAnyTrackMuted: state => state.permaPlayer.anyTrackMuted,
    getIsPlaying: state => state.permaPlayer.playing,
    getNextRandomTrackRoute: state => {
      if (state.randomTracks.length === 0) {
        return { name: 'Dashboard' }
      }
      return state.randomTracks[0]
    },
    getTrackByIndex: (state) => (sessionIndex, trackIndex) => {
      if (typeof state.stemSessions[sessionIndex] === 'undefined') {
        return undefined
      }
      return state.stemSessions[sessionIndex].tracks[trackIndex]
    },
    getSearchTerm: state => state.inputData,
    getPreviousSessionByIndex: (state) => (sessionIndex) => {
      // keep in mind that our session list is reversed! (newest session is the first item)
      let foundCurrent = false
      for (const sessionKey of Object.keys(state.stemSessions)) {
        if (foundCurrent === true) {
          return state.stemSessions[sessionKey]
        }
        if (sessionIndex === sessionKey) {
          foundCurrent = true
          continue
        }
      }
      // obviosly there is no next item. so return the first item
      return state.stemSessions[Object.keys(state.stemSessions)[0]]
    },
    getNextSessionByIndex: (state) => (sessionIndex) => {
      let foundCurrent = false
      for (const sessionKey of Object.keys(state.stemSessions).reverse()) {
        if (foundCurrent === true) {
          return state.stemSessions[sessionKey]
        }
        if (sessionIndex === sessionKey) {
          foundCurrent = true
          continue
        }
      }
      // obviosly there is no next item. so return the first item
      return state.stemSessions[Object.keys(state.stemSessions).reverse()[0]]
    }
  },
  modules: {
  }
})
