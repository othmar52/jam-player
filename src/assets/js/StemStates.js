import Vue from 'vue'
const StemStates = store => {
  store.subscribe(mutation => {
    const stateBefore = store.state.permaPlayer.stemStates
    if (mutation.type === 'requestToggleMute') {
      handleRequestToggleMute(mutation.payload, stateBefore)
    }
    if (mutation.type === 'requestVolumeChange') {
      handleRequestVolumeChange(
        mutation.payload.stemIndex,
        mutation.payload.value,
        stateBefore
      )
    }
    if (mutation.type === 'requestToggleSolo') {
      handleRequestToggleSolo(mutation.payload, stateBefore)
    }
    if (mutation.type === 'requestBoostStart') {
      handleRequestBoostStart(mutation.payload, stateBefore)
    }
    if (mutation.type === 'requestBoostEnd') {
      handleRequestBoostEnd(stateBefore)
    }
    if (mutation.type === 'requestUnsoloAll') {
      handleRequestUnsoloAll(stateBefore)
    }
    if (mutation.type === 'requestUnmuteAll') {
      handleRequestUnmuteAll(stateBefore)
    }
  })

  function handleRequestVolumeChange (stemIndex, value, stateBefore) {
    if (stateBefore[`s${stemIndex}`].volLevelInternal === value) {
      return
    }
    stateBefore[`s${stemIndex}`].volLevelInternal = value
    setAllStates(stateBefore)
  }

  function handleRequestToggleMute (stemIndex, stateBefore) {
    stateBefore[`s${stemIndex}`].isMutedInternal = !stateBefore[`s${stemIndex}`].isMutedInternal
    setAllStates(stateBefore)
  }

  function handleRequestToggleSolo (stemIndex, stateBefore) {
    const oldSoloState = stateBefore[`s${stemIndex}`].isSoloedInternal
    if (store.state.settings.soloMode === 'single') {
      stateBefore = modifyPropertyForAll(
        stateBefore,
        'isSoloedInternal',
        false
      )
    }
    stateBefore[`s${stemIndex}`].isSoloedInternal = !oldSoloState
    setAllStates(stateBefore)
  }

  function handleRequestBoostStart (stemIndex, stateBefore) {
    stateBefore = modifyPropertyForAll(
      stateBefore,
      'isBoostedInternal',
      false
    )
    stateBefore[`s${stemIndex}`].isBoostedInternal = true
    setAllStates(stateBefore)
  }

  function handleRequestBoostEnd (stateBefore) {
    stateBefore = modifyPropertyForAll(
      stateBefore,
      'isBoostedInternal',
      false
    )
    setAllStates(stateBefore)
  }

  function handleRequestUnsoloAll (stateBefore) {
    stateBefore = modifyPropertyForAll(
      stateBefore,
      'isSoloedInternal',
      false
    )
    setAllStates(stateBefore)
  }

  function handleRequestUnmuteAll (stateBefore) {
    stateBefore = modifyPropertyForAll(
      stateBefore,
      'isMutedInternal',
      false
    )
    setAllStates(stateBefore)
  }

  function modifyPropertyForAll (stemStates, propName, propValue) {
    for (const stemIndex in stemStates) {
      stemStates[stemIndex][propName] = propValue
    }
    return stemStates
  }

  function setAllStates (newStemStates) {
    Vue.set(store.state.permaPlayer, 'anyTrackBoosted', false)
    Vue.set(store.state.permaPlayer, 'anyTrackSoloed', false)
    Vue.set(store.state.permaPlayer, 'anyTrackMuted', false)
    for (const stemIndex in newStemStates) {
      // set defaults
      newStemStates[stemIndex].isMutedGui = false
      newStemStates[stemIndex].isSoloedGui = false
      newStemStates[stemIndex].isInactiveTrackGui = false
      newStemStates[stemIndex].volLevel = newStemStates[stemIndex].volLevelInternal
      newStemStates[stemIndex].isMutedAudio = false

      if (newStemStates[stemIndex].isBoostedInternal === true) {
        Vue.set(store.state.permaPlayer, 'anyTrackBoosted', true)
      }
      if (newStemStates[stemIndex].isSoloedInternal === true) {
        Vue.set(store.state.permaPlayer, 'anyTrackSoloed', true)
      }
      if (newStemStates[stemIndex].isMutedInternal === true) {
        Vue.set(store.state.permaPlayer, 'anyTrackMuted', true)
      }
    }

    // highest priority: boost
    if (store.state.permaPlayer.anyTrackBoosted === true) {
      for (const stemIndex in newStemStates) {
        if (newStemStates[stemIndex].isBoostedInternal === true) {
          newStemStates[stemIndex].volLevel = 1
          continue
        }
        newStemStates[stemIndex].volLevel = 0.2
        newStemStates[stemIndex].isInactiveTrackGui = true
      }
      Vue.set(store.state.permaPlayer, 'stemStates', newStemStates)
      return
    }

    // 2nd priority: solo
    if (store.state.permaPlayer.anyTrackSoloed === true) {
      for (const stemIndex in newStemStates) {
        if (newStemStates[stemIndex].isSoloedInternal === true) {
          newStemStates[stemIndex].isSoloedGui = true
          continue
        }
        newStemStates[stemIndex].isMutedAudio = true
        newStemStates[stemIndex].isInactiveTrackGui = true
      }
      Vue.set(store.state.permaPlayer, 'stemStates', newStemStates)
      return
    }

    // 3rd priority: mute
    if (store.state.permaPlayer.anyTrackMuted === true) {
      for (const stemIndex in newStemStates) {
        if (newStemStates[stemIndex].isMutedInternal === true) {
          newStemStates[stemIndex].isMutedAudio = true
          newStemStates[stemIndex].isInactiveTrackGui = true
          newStemStates[stemIndex].isMutedGui = true
        }
      }
    }

    Vue.set(store.state.permaPlayer, 'stemStates', newStemStates)
  }
}

export default StemStates
