const PathPrefixer = store => {
  store.subscribe(mutation => {
    if (mutation.type === 'retrieveSessionProperties') {
      prefixMediaPaths(
        mutation.payload.sessionIndex,
        mutation.payload.mediaPathPrefix
      )
    }
    if (mutation.type === 'retrieveTrackproperties') {
      prefixAudioPaths(
        mutation.payload.sessionIndex,
        mutation.payload.trackIndex,
        mutation.payload.trackDataPath
      )
    }
  })

  /**
   *
   */
  function prefixAudioPaths (sessionIndex, trackIndex, pathPrefix) {
    const track = window.stemSessions[sessionIndex].tracks[trackIndex]
    track.stems.forEach(function (stem, stemIndex) {
      if (typeof track.stems[stemIndex].pathCorrectionDone !== 'undefined') {
        // path correction already applied (maybe caused by duplicates during testing)
        return
      }
      if (track.stems[stemIndex].filePath.substring(0, 4) === 'http') {
        // don't modify absolute paths that are hostet somewhere else
        return
      }
      track.stems[stemIndex].filePath = pathPrefix + stem.filePath
      track.stems[stemIndex].pathCorrectionDone = true
    })
    store.commit('addTrack', track)
    // TODOX: substituteAudioPathsWithHttpUrls(sessionIndex, trackIndex)
  }

  function prefixMediaPaths (sessionIndex, pathPrefix) {
    const session = window.stemSessions[sessionIndex]
    if (typeof session.mediaPathCorrectionDone !== 'undefined') {
      return
    }
    const images = session.images
    images.forEach(function (image, imageIndex) {
      session.images[imageIndex].filePath = pathPrefix + image.filePath
      session.mediaPathCorrectionDone = true
      session.images[imageIndex].thumbPath = pathPrefix + image.thumbPath
    })
    const videos = session.videos
    videos.forEach(function (video, videoIndex) {
      session.videos[videoIndex].filePath = pathPrefix + video.filePath
      session.mediaPathCorrectionDone = true
      session.videos[videoIndex].thumbPath = pathPrefix + video.thumbPath
      session.videos[videoIndex].stillPath = pathPrefix + video.stillPath
    })
    store.commit('addSession', session)
  }
}

export default PathPrefixer
