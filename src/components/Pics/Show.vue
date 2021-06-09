<template>
  <main class="page__wrapper session session--detail" v-if="session">
    <header class="page__header page__header--pics">
      <h1 class="page__title">
        <router-link :to="{ name: 'SessionShow', params: { sessionIndex: session.index } }">
          <span class="view__highlight">Se</span>ssion<span class="view__highlight">#{{ session.counter }}</span>
        </router-link> Pics
      </h1>
      <DateSquare :day="session.day" :month="session.month" :year="session.year" />
      <span>{{ session.trackCount }} Tracks</span>
      <span>{{ toMinutes(session.duration) }} min</span>
    </header>

    <router-link to="/pics" class="menu__link">All pics</router-link>
    <MusiciansBadges :session="session" />
    <div class="lightgallery" ref="lightgallery">
      <a :href="mediaItem.filePath" v-for="(mediaItem, picIdx) of session.images" v-bind:key="`pic-${session.counter}-${picIdx}`">
        <img :src="mediaItem.thumbPath" />
      </a>
      <span
        v-for="(mediaItem, vidIdx) of session.videos"
        v-bind:key="`vid-${session.cleanCounter}-${vidIdx}`"
        data-sub-html="video caption1"
        :data-html="`#vid-${session.cleanCounter}-${vidIdx}`">
        <img :src="mediaItem.thumbPath" />
        <div style="display:none;" :id="`vid-${session.cleanCounter}-${vidIdx}`">
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
import { helpersMixin } from '@/assets/js/helpersMixin.js'
// import RatingStars from '@/components/RatingStars.vue'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import DateSquare from '@/components/Common/DateSquare.vue'

import 'lightgallery.js'
import 'lg-fullscreen.js'
import 'lg-zoom.js'
import 'lg-video.js'
import 'lg-thumbnail.js'
import 'lg-autoplay.js'
import 'lightgallery.js/dist/css/lightgallery.css'

export default {
  name: 'SessionPics',
  components: {
    MusiciansBadges,
    DateSquare
  },
  mixins: [
    helpersMixin
  ],
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
    cleanCounter () {
      if (!this.session) {
        return ''
      }
      return this.session.counter.replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, '-')
    }
  },
  mounted () {
    this.session = this.getSessionByIndex(this.sessionIndex)
    console.log(this.session)
    // thanks to https://forum.vuejs.org/t/not-getting-refs-in-mounted/12490/5
    setTimeout(() => {
      window.lightGallery(this.$refs.lightgallery)
    }, 0)
  },
  beforeDestroy () {
    if (typeof this.$refs.lightgallery.destroy !== 'undefined') {
      this.$refs.lightgallery.destroy()
    }
  }
}
</script>

<style lang="scss">

</style>
