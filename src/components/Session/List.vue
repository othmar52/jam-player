<template>
  <main class="page__wrapper session session--list">
    <div class="sessionlist__wrapper">
      <table class="session__list">
        <tbody>
          <tr>
            <th class="heading_date">Date</th>
            <th class="heading__number text--centered">Session #</th>
            <th class="heading__trackcount">Tracks</th>
            <th class="heading__duration">Duration</th>
            <th class="heading__jammers">Jammers</th>
            <th class="heading__media"></th>
            <th class="heading__rating">Avarage Rating</th>
          </tr>

          <tr
            v-for="(session, idx) in getAllSessions"
            v-bind:key="idx"
            @click="forwardToSession(idx)">
            <td class="session__date">
              <DateSquare :day="session.day" :month="session.month" :year="session.year" />
            </td>
            <td class="text--centered session__counter">
              <h3>
                <span class="darker__text session__symbol">#</span>{{ session.counter }}
              </h3>
            </td>
            <td class="text--centered">
              <span class="darker__text">{{ session.trackCount }}</span>
            </td>
            <td class="text--centered">
              <span class="darker__text">{{ toMinutes(session.duration) }} min</span>
            </td>
            <td>
               <MusiciansBadges :session="session" />
            </td>
            <td>
              <div v-if="session.images.length">
                <SvgPhoto :number="session.images.length" />
              </div>
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
// @ is an alias to /src
import { mapGetters } from 'vuex'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import RatingStars from '@/components/RatingStars.vue'
import DateSquare from '@/components/Common/DateSquare.vue'
import SvgPhoto from '@/components/Svg/Photo.vue'
import { helpersMixin } from '@/assets/js/helpersMixin.js'

export default {
  name: 'SessionList',
  components: {
    MusiciansBadges,
    RatingStars,
    DateSquare,
    SvgPhoto
  },
  mixins: [
    helpersMixin
  ],
  computed: {
    ...mapGetters([
      'getAllSessions'
    ])
  },
  methods: {
    forwardToSession (sessionIndex) {
      this.$router.push(
        {
          name: 'SessionShow',
          params: {
            sessionIndex: sessionIndex
          }
        }
      )
    }
  }
}
</script>
