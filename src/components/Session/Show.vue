<template>
  <main class="page__wrapper session session--detail">
    <SessionHeader :session="session" v-if="session"/>
    <div class="tracklist__wrapper">
      <table class="track__list">
        <tbody>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Bpm</th>
            <th>Duration</th>
            <th>Jammers</th>
            <th>Track Rating</th>
          </tr>
          <tr v-for="(track, idx) in sessionTracks" v-bind:key="idx" @click="forwardToTrack(track.trackLetter)">
            <td class="text--centered">
              <span class="track__letter track__letter-circled">{{ track.trackLetter }}</span>
            </td>
            <td class="text--bold">
              {{ track.title }}
            </td>
            <td class="text--centered">
              <span class="bright"><span class="bpm">{{ track.bpm }} <span class="unit">bpm</span></span></span>
            </td>
            <td class="text--centered">
              <span class="bright">{{ formatTime(track.duration) }} <span class="unit">m</span></span>
            </td>
            <td>
              <MusiciansBadges :track="track" />
            </td>
            <td>
              <RatingStars />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { helpersMixin } from '@/assets/js/helpersMixin.js'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import RatingStars from '@/components/RatingStars.vue'
import SessionHeader from '@/components/Session/Header.vue'
export default {
  name: 'SessionShow',
  components: {
    MusiciansBadges,
    RatingStars,
    SessionHeader
  },
  mixins: [
    helpersMixin
  ],
  data () {
    return {
      session: null
    }
  },
  computed: {
    ...mapGetters([
      'getSessionByIndex'
    ]),
    sessionIndex () {
      return this.$route.params.sessionIndex
    },
    sessionTracks () {
      if (!this.session) {
        return []
      }
      return this.session.tracks
    }
  },
  mounted () {
    this.session = this.getSessionByIndex(this.sessionIndex)
  },
  methods: {
    loadTrack (trackIndex) {
      // console.log('loadTrack', trackIndex)
      this.$store.dispatch(
        'loadPlayerTrack',
        {
          sessionIndex: this.sessionIndex,
          trackIndex: trackIndex
        }
      )
      return false
    },
    forwardToTrack (trackIndex) {
      // console.log('forwardToTrack', trackIndex)
      this.$router.push(
        {
          name: 'TrackShow',
          params: {
            sessionIndex: this.sessionIndex,
            trackIndex: trackIndex
          }
        }
      )
    }
  },
  watch: {
    '$route.params.sessionIndex': function (sessionIndex) {
      this.sessionIndex = sessionIndex
      this.session = this.getSessionByIndex(this.sessionIndex)
    },
    sessionTracks () {

    }
  },
  metaInfo () {
    return {
      title: `Tracklist #${this.session.counter} (${this.session.month} ${this.session.year})`
    }
  }
}
</script>

<style lang="scss">
.track__letter-circled {
  width: 1.6em;
  height: 1.6em;
  display: inline-block;
  background: #0d1332;
  color: $lightblue;
  border-radius: 50%;
  font-size: 1.3em;
  text-align: center;
  line-height: 1.7em;
}
.unit {
  color: $darktext;
}
</style>
