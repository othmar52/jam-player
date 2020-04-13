<template>
  <main class="page__wrapper session session--detail" v-if="session">
    <router-link to="/pics" class="menu__link">All pics</router-link>
    <div class="session__counter">
      <h1>Pics of session <span class="darker__text session__symbol">#</span>{{ session.counter }}</h1>
    </div>

    <MusiciansBadges :session="session" />
    <DateSquare :day="session.day" :month="session.month" :year="session.year" />
    <div class="lightgallery" ref="lightgallery">
      <a :href="mediaItem.filePath" v-for="(mediaItem, picIdx) of session.images" v-bind:key="`${picIdx}`">
        <img :src="mediaItem.thumbPath" />
      </a>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
// import RatingStars from '@/components/RatingStars.vue'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import DateSquare from '@/components/Common/DateSquare.vue'

import 'lightgallery.js'
import 'lightgallery.js/dist/css/lightgallery.css'
import 'lg-video.js'
import 'lg-zoom.js'
import 'lg-fullscreen.js'

export default {
  name: 'SessionPics',
  components: {
    MusiciansBadges,
    DateSquare
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
    }
  },
  mounted () {
    this.session = this.getSessionByIndex(this.sessionIndex)
    // thanks to https://forum.vuejs.org/t/not-getting-refs-in-mounted/12490/5
    setTimeout(() => {
      window.lightGallery(this.$refs.lightgallery)
    }, 0)
  },
  methods: {
  }
}
</script>

<style lang="scss">

</style>
