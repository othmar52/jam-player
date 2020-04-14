<template>
  <div id="permaplayer" :class="hiddenClass">
    <div v-if="currentTrack">
      <div class="permaplayer__section-play">
        <button class="track__play play" @click="togglePlayPause">
          <SvgPlayPause v-bind:usePath="playOrPauseInverted" />
        </button>
      </div>
      <div class="permaplayer__section-main">
        {{ currentTrack.track.trackLetter }}
        <router-link :to="{
          name: 'TrackShow',
          params: {
            sessionIndex: currentTrack.track.session,
            trackIndex: currentTrack.track.trackLetter
          }
        }">{{ currentTrack.track.title }}</router-link>
        -
        <router-link :to="{
          name: 'SessionShow',
          params: {
            sessionIndex: currentTrack.track.session
          }
        }">Session #{{ formatSessionNumber(currentTrack.track.session) }}</router-link>
        <MusiciansBadges :track="currentTrack.track" />
        <span>{{currentTrack.track.bpm}} BPM</span>
        <div class="player__control-seek">
          <div class="seek__progress" ref="progress" :style="currentProgressPercent"></div>
          <div class="seek__clickarea" @click="triggerSeekRequest" ref="seek"></div>
        </div>
        <AudioNode
          v-for="(stem, idx) in stems"
          v-bind:key="`${currentTrack.track.session}${currentTrack.track.trackLetter}${idx}`"
          v-bind:source="stem.filePath"
          v-bind:stemIndex="idx"
          v-bind:playOrPause="playOrPause"
          :ref="`s${idx}`"
        />
      </div>
      <div class="permaplayer__section-right">
          {{ currentProgressSecond }} / {{ durationSecond }}
          <!-- <span title="TODO: fullscreen toggle">[X]</span> -->
      </div>
    </div>
    <div v-else>
      no track in permaplayer. TODO: random button
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import SvgPlayPause from '@/components/Svg/PlayPause.vue'
import AudioNode from '@/components/Player/AudioNode.vue'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import { helpersMixin } from '@/assets/js/helpersMixin.js'

export default {
  name: 'PermaPlayer',
  components: {
    SvgPlayPause,
    AudioNode,
    MusiciansBadges
  },
  mixins: [
    helpersMixin
  ],
  data () {
    return {
      playOrPause: 'pause'
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentTrack',
      'getCurrentProgressPercent',
      'getCurrentProgressSecond',
      'getDurationSecond',
      'getRequestSeek',
      'getIsPlaying'
    ]),
    currentTrack () {
      return this.getCurrentTrack
    },
    stems () {
      return this.getCurrentTrack.track.stems
    },
    currentProgressPercent () {
      return `width: ${this.getCurrentProgressPercent}%`
    },
    currentProgressSecond () {
      return this.formatTime(this.getCurrentProgressSecond)
    },
    durationSecond () {
      return this.formatTime(this.getDurationSecond)
    },
    requestSeek () {
      return this.$store.getters.getRequestSeek
    },
    isPlaying () {
      return this.$store.getters.getIsPlaying
    },
    playOrPauseInverted () {
      return (this.playOrPause === 'play') ? 'pause' : 'play'
    },
    hiddenClass () {
      const playerClass = (this.currentRouteIsPermaPlayersAudio() === true)
        ? 'hidden'
        : (this.currentTrack.track.stems)
          ? ''
          : 'hidden'
      document.body.classList[(playerClass === 'hidden') ? 'remove' : 'add']('has__permaplayer')
      return playerClass
    }
  },
  watch: {
    currentTrack () { },
    stems () { },
    currentProgressPercent () { },
    currentProgressSecond () { },
    durationSecond () { },
    playOrPause () { },
    playOrPauseInverted () { },
    isPlaying (newVal) {
      this.playOrPause = (newVal) ? 'play' : 'pause'
      if (newVal === true) {
        this.forcePlay()
      }
    },
    requestSeek (val) {
      if (val > 0) {
        for (const playerId in this.currentTrack.stemStates) {
          this.$refs[playerId][0].seekTo(val)
        }
        this.$store.commit('requestSeekFinished')
      }
    }
  },
  methods: {
    togglePlayPause () {
      if (window.audioCtx) {
        window.audioCtx.resume()
      }

      let playerCmd = 'pause'
      if (this.currentTrack.playing === false) {
        playerCmd = 'play'
      }
      this.playOrPause = playerCmd
      this.$store.dispatch('togglePermaPlayingState')
    },
    forcePlay () {
      if (window.audioCtx) {
        window.audioCtx.resume()
      }
      this.playOrPause = 'play'
    },
    triggerSeekRequest (e) {
      // console.log('seek')
      const rect = this.$refs.seek.getBoundingClientRect()
      const x = e.clientX - rect.left // x position within the element.
      const w = e.target.offsetWidth
      const percent = x / (w / 100)
      this.$store.commit('requestSeek', percent)
    },
    invertPlayPause (inputString) {
      return (inputString === 'play') ? 'pause' : 'play'
    },
    currentRouteIsPermaPlayersAudio () {
      if (this.$route.name !== 'TrackShow') {
        return false
      }
      if (this.$route.params.sessionIndex !== this.currentTrack.track.session) {
        return false
      }
      if (this.$route.params.trackIndex !== this.currentTrack.track.trackLetter) {
        return false
      }
      return true
    },
    resyncAudioNodes (self) {
      if (!self.isPlaying) {
        return
      }
      let syncTo = false
      for (const playerId in self.currentTrack.stemStates) {
        if (syncTo === false) {
          // read reference time from very first audio track
          syncTo = self.$refs[playerId][0].getCurrentTime()
          continue
        }
        // calculate delta as a positive float
        const delta = Math.abs(syncTo - self.$refs[playerId][0].getCurrentTime())
        if (delta < 0.1) {
          // no need for resyncing this audio node
          continue
        }
        // console.log('resyncing stem', playerId, delta)
        self.$refs[playerId][0].seekTo(syncTo)
      }
    }
  },
  mounted () {
    const self = this
    setInterval(
      function () {
        self.resyncAudioNodes(self)
      },
      2000
    )
  }
}
</script>

<style lang="scss">
#permaplayer {
  position: absolute;
  bottom: 0;
  transition: bottom 0.5s ease 0s;
  left: 0;
  height: 100px;
  width: 100%;
  z-index: 200;
  background: linear-gradient(to bottom, #f1f1f1, #f1f1f1, #dfe0e5, #cecfd9, #b9bccb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $darkblue;
  &>* {
    display: contents;
  }
  .permaplayer__section-play {
    min-width: 150px;
    max-width: 150px;
    text-align: center;
    height: 100%;
    padding-top: 17px;
    border-right: 1px solid #caccd6;
  }
  .permaplayer__section-main {
    flex-grow: 1;
    flex-shrink: 1;
    padding-left: 3em;

    a {
      text-decoration: underline;
    }

    .player__control-seek {
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background-color: $darkblue;
      margin: 10px 0;
      position: relative;

      .seek__progress {
        width: 100%;
        height: 100%;
        background: $lightblue;
        border-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .seek__clickarea {
        width: 100%;
        height: 30px;
        position: absolute;
        top: -7px;
      }

      .seek__clickarea:hover {
        cursor: pointer;
      }
    }
  }
  .permaplayer__section-right {
    min-width: 220px;
    max-width: 220px;
    text-align: center;
  }

  .musician__badges {
    display: inline-block;
    .stem__title {
      background: none;
    }
    .stem__title:after {
      content: ', ';
    }
    .stem__title:last-child:after {
      content: '';
    }
  }

}
#permaplayer.hidden {
  bottom: -110px;
}
</style>
