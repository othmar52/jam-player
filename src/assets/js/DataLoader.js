const DataLoader = store => {
  store.subscribe(mutation => {
    if (mutation.type === 'retrieveTracklist') {
      validate(mutation.payload)
    }
  })

  function validate (treeStructure) {
    store.dispatch('setTracklistData', treeStructure)

    if (checkConfig(treeStructure) === false) {
      console.log('config error')
      // $('.msg__error').innerHTML = '<strong>DAMMIT!</strong><br>configuration error...'
    }
  }

  function countTracks (treeStructure) {
    let count = 0
    for (let i = 0; i < treeStructure.length; i++) {
      for (let ii = 0; ii < treeStructure[i].tracks.length; ii++) {
        count++
      }
    }
    store.commit('retrieveTrackCount', count)
  }

  async function checkConfig (treeStructure) {
    countTracks(treeStructure)
    await loadConfigFilesForTreeLeafs(treeStructure)

    // console.log('no more tries to load script...');
    if (!window.stemSessions) {
      console.log('config error')
      return false
    }
    // in case sessions or tracks had been deleted in filesystem...
    // TODOX: calculateDurations()
    // directly select session as we have no other sessions to choose from
    if (Object.size(window.stemSessions) === 1) {
      window.currentView = 'trackList'
      window.currentSession = Object.keys(window.stemSessions)[0]
    }

    if (window.currentSession === null && window.currentView === 'trackList') {
      console.log('config error')
      return false
    }
    if (!window.currentSession) {
      window.currentView = 'sessionList'
    }
    // directly render single track as we have no other content to choose from
    if (window.currentSession && Object.size(window.stemSessions[window.currentSession].tracks) === 1) {
      window.currentView = 'singleTrack'
      window.currentTrack = Object.keys(window.stemSessions[window.currentSession].tracks)[0]
    }
  }

  /**
   * try to load a single config file for each track
   * the paths for those configs are defined by the treeStructure
   *
   * @param {Array} treeStructure
   */
  async function loadConfigFilesForTreeLeafs (treeStructure) {
    // TODOX: used for progress // const totalItemsToCheck = treeStructure.length
    // TODOX: used for progress // let itemsChecked = 0
    for (let i = 0; i < treeStructure.length; i++) {
      const sessIdx = treeStructure[i].sessionIndex
      for (let ii = 0; ii < treeStructure[i].tracks.length; ii++) {
        const trackIdx = treeStructure[i].tracks[ii].trackIndex
        const pathChunks = [
          'data', ''
        ]
        if (window.hostLevel === 'sessionlist' || window.hostLevel === 'tracklist') {
          pathChunks.unshift(treeStructure[i].tracks[ii].trackDir)
          pathChunks.unshift('data')
        }
        if (window.hostLevel === 'sessionlist') {
          pathChunks.unshift(treeStructure[i].sessionDir)
          pathChunks.unshift('data')
        }
        const trackDataPath = pathChunks.join('/')
        const scriptId = 'cnf-' + sessIdx.replace(/[\W_]+/g, '_') + '-' + trackIdx
        const attributes = {
          id: scriptId,
          type: 'text/javascript',
          src: trackDataPath + 'config.js'
        }
        store.commit('retrieveLoadAttempt')
        await Promise.all([loadScript(trackDataPath, attributes)])
          .then(function () {
            const mediaPathPrefix = (window.hostLevel === 'sessionlist')
              ? 'data/' + treeStructure[i].sessionDir + '/'
              : ''
            store.commit('retrieveSessionProperties', {
              sessionIndex: sessIdx,
              mediaPathPrefix: mediaPathPrefix
            })
            store.commit('retrieveTrackproperties', {
              sessionIndex: sessIdx,
              trackIndex: trackIdx,
              trackDataPath: trackDataPath
            })
            // console.log('SUCCESS in Promise checkConfigPaths()', sessIdx, trackIdx)
            // remove script container
            removeDomNode('#' + scriptId)
          })
          .catch(function () {
            // console.log('FAIL in Promise checkConfigPaths()', sessIdx, trackIdx, scriptId)
            // remove script container
            removeDomNode('#' + scriptId)
          })
      }
      // TODOX: used for grogress // itemsChecked++
      // TODOX: $('.path__progress').setAttribute('stroke-dashoffset', strokeDasharray - strokeDasharray * itemsChecked / (totalItemsToCheck / 100) * 0.01)
    }

    return true
  }

  function loadScript (trackDataPath, attributes) {
    // This promise will be used by Promise.all to determine success or failure
    return new Promise(function (resolve, reject) {
      const element = document.createElement('script')
      element.async = true
      // attributes.src = `file:///MUSIC/stromwerk/data/${attributes.src}`
      for (const attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
      }

      // Important success and error for the promise
      element.onload = function () {
        resolve(trackDataPath)
      }
      element.onerror = function () {
        reject(trackDataPath)
      }

      // Inject into document to kick off loading
      try {
        document.body.appendChild(element)
      } catch (e) {
        console.log(e)
      }
    })
  }

  /**
   * removeDomNode
   *
   * @param {String} querySelector
   */
  function removeDomNode (querySelector) {
    const elem = document.querySelector(querySelector)
    if (!elem) {
      return
    }
    elem.remove()
  }
}

export default DataLoader
