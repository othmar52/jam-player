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

          <tr v-for="(session, idx) in getAllSessions" v-bind:key="idx" @click="forwardToSession(idx)">
            <td class="session__date">
              <time class="session__date date">
                <span class="date__year">{{ session.year }}</span>
                <span class="date__wrapper">
                  <span class="date__month">{{ session.month }}</span>
                  <span class="date__day">{{ session.day }}</span>
                </span>
              </time>
            </td>
            <td class="text--centered session__counter">
              <h3>
                <span class="darker__text session__symbol">#</span>{{ session.counter }}
              </h3>
            </td>
            <td class="text--centered">
              <span class="darker__text">{{ session.tracks.size }}x</span>
            </td>
            <td class="text--centered">
              <span class="darker__text">{{ session.duration }} min</span>
            </td>
            <td>
              <MusiciansBadges />
            </td>
            <td>
              <div v-if="session.images.length">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <defs>
                    <clipPath id="a">
                      <path d="M13 11a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm-3 5a5 5 0 1 1 5-5 5 5 0 0 1-5 5zM6.42 2.56l-.67.64a2 2 0 0 1-1.38.56H2a1.89 1.89 0 0 0-2 1.75v10.54a1.89 1.89 0 0 0 2 1.76h16a1.89 1.89 0 0 0 2-1.76V5.51a1.89 1.89 0 0 0-2-1.76h-2.37a2 2 0 0 1-1.38-.56l-.67-.64A2 2 0 0 0 12.2 2H7.8a2 2 0 0 0-1.38.56z" clip-rule="evenodd"></path>
                    </clipPath>
                  </defs>
                  <path fill-rule="evenodd" d="M13 11a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm-3 5a5 5 0 1 1 5-5 5 5 0 0 1-5 5zM6.42 2.56l-.67.64a2 2 0 0 1-1.38.56H2a1.89 1.89 0 0 0-2 1.75v10.54a1.89 1.89 0 0 0 2 1.76h16a1.89 1.89 0 0 0 2-1.76V5.51a1.89 1.89 0 0 0-2-1.76h-2.37a2 2 0 0 1-1.38-.56l-.67-.64A2 2 0 0 0 12.2 2H7.8a2 2 0 0 0-1.38.56z"></path>
                  <g clip-path="url(#a)">
                    <path fill="#0d1332" d="M0 0h20v20H0z"></path>
                  </g>
                </svg>
                {{session.images.length}}
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

export default {
  name: 'SessionList',
  components: {
    MusiciansBadges,
    RatingStars
  },
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
