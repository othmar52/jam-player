<template>
  <span class="gallery__inline" v-if="totalMediaItems > 0" @click="showFirstMediaItem" >
    <SvgPhoto :number="totalMediaItems" />
    <div style="display: none;">
      <SessionPics :session="session" ref="gallery" />
    </div>
  </span>
</template>

<script>
import SvgPhoto from '@/components/Svg/Photo.vue'
import SessionPics from '@/components/Pics/Show.vue'
export default {
  name: 'GalleryInline',
  components: {
    SvgPhoto,
    SessionPics
  },
  props: {
    session: Object
  },
  computed: {
    totalMediaItems () {
      return this.session.images.length + this.session.videos.length
    }
  },
  methods: {
    showFirstMediaItem () {
      // console.log(this.$refs.gallery.$refs.lightgallery.firstChild)
      this.$refs.gallery.$refs.lightgallery.firstChild.click()
      // this.$refs.gallery.$refs.lightgallery.data('lightGallery').goToNextSlide()
    }
  },
  watch: {
    session () { },
    totalMediaItems () { }
  }
}
</script>

<style lang="scss">

</style>
