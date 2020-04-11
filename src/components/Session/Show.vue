<template>
  <main class="page__wrapper session session--detail">
    <router-link to="/sessions" class="menu__link">All sessions</router-link>
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
            <td>
              <span class="track__letter track__letter-circled">{{ track.trackLetter }}</span>
            </td>
            <td class="text--bold">
              {{ track.title }}
            </td>
            <td>
              <span class="bright"><span class="bpm">{{ track.bpm }} BPM</span></span>
            </td>
            <td>
              <span class="bright">{{ track.duration }}</span>
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
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import RatingStars from '@/components/RatingStars.vue'
export default {
  name: 'SessionShow',
  components: {
    MusiciansBadges,
    RatingStars
  },
  data () {
    return {
      session: ''
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
    '$route.params.sessionIndex': function (x) {
      this.sessionIndex = x
    },
    sessionTracks () {

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
</style>
