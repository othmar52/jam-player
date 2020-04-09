<template>
  <div id="permaplayer">
    <div v-if="currentTrack">
      <strong>permaplayer {{ currentTrack.track.title }} BBB</strong>
      <button class="track__play play" @click="togglePlayPause">
        <SvgPlayPause />
      </button>
      <AudioNode
        v-for="(stem, idx) in stems"
        v-bind:key="`${currentTrack.track.session}${currentTrack.track.trackLetter}${idx}`"
        v-bind:source="stem.filePath"
        :ref="`s${idx}`"
      />
    </div>
    <div v-else>
      no track in permaplayer
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import SvgPlayPause from '@/components/Svg/PlayPause.vue'
import AudioNode from '@/components/Player/AudioNode.vue'

export default {
  name: 'PermaPlayer',
  components: {
    SvgPlayPause,
    AudioNode
  },
  data () {
    return {
      componentKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentTrack'
    ]),
    currentTrack () {
      return this.getCurrentTrack
    },
    stems () {
      return this.getCurrentTrack.track.stems
    }
  },
  watch: {
    currentTrack () {
    },
    stems () {
      // this.currentTrack = data
    }
  },
  methods: {
    forceRerender () {
      this.componentKey += 1
    },
    togglePlayPause () {
      if (window.audioCtx) {
        window.audioCtx.resume()
      }

      let playerCmd = 'pause'
      // let iconPathId = '#play-icon'
      if (this.currentTrack.playing === false) {
        playerCmd = 'play'
        // iconPathId = '#pause-icon'
      }
      for (const playerId in this.currentTrack.stemStates) {
        this.$refs[playerId][0][playerCmd]()
        /*
          let player = $('#' + playerId);
          if(playerCmd === null) {
              playerCmd = 'pause';
              iconPathId = '#play-icon';
              if(player.paused) {
                  playerCmd = 'play';
                  iconPathId = '#pause-icon';
              }
          }
          $('.track__play use').setAttribute( 'xlink:href', iconPathId);
          player[playerCmd]();
          player.volume = window.stemState[playerId].volLevel;
        */
      }
      this.$store.dispatch('togglePermaPlayingState')
    }
  }
}
</script>

<style lang="scss">
#permaplayer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100px;
  border: 2px solid tomato;
  width: 100%;
  z-index: 200;
}
</style>
