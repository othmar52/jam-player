<template>
  <main class="page__wrapper session session--detail" v-if="session">
    <router-link to="/pics" class="menu__link">All pics</router-link>
    <div class="session__counter">
      <h1>Pics of
        <router-link :to="{ name: 'SessionShow', params: { sessionIndex: session.index } }">
          session <span class="darker__text session__symbol">#</span>{{ session.counter }}
        </router-link>
      </h1>
    </div>

    <MusiciansBadges :session="session" />
    <DateSquare :day="session.day" :month="session.month" :year="session.year" />
    <div class="lightgallery" ref="lightgallery">
      <a :href="mediaItem.filePath" v-for="(mediaItem, picIdx) of session.images" v-bind:key="`pic-${session.counter}-${picIdx}`">
        <img :src="mediaItem.thumbPath" />
      </a>
      <span
        v-for="(mediaItem, vidIdx) of session.videos"
        v-bind:key="`vid-${session.counter}-${vidIdx}`"
        data-sub-html="video caption1"
        :data-html="`#vid-${session.counter}-${vidIdx}`">
        <img :src="mediaItem.thumbPath" />
        <div style="display:none;" :id="`vid-${session.counter}-${vidIdx}`">
          <video class="lg-video-object lg-html5" controls preload="none">
            <source :src="mediaItem.filePath" type="video/mp4">
              Your browser does not support HTML5 video.
          </video>
        </div>
      </span>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
// import RatingStars from '@/components/RatingStars.vue'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import DateSquare from '@/components/Common/DateSquare.vue'

import 'lightgallery.js'
import 'lg-fullscreen.js'
import 'lg-zoom.js'
import 'lg-video.js'
import 'lightgallery.js/dist/css/lightgallery.css'

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
  beforeDestroy () {
    this.$refs.lightgallery.destroy()
  },
  methods: {
  },
  watch: {
    session () { }
  }
}
</script>

<style lang="scss">

</style>
