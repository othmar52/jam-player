<template>
  <router-link
    :to="{ name: 'SessionPicsShow', params: { sessionIndex: session.index } }"
    :title="`Show pictures and videos of Session #${session.counter}`">
    <SvgPhoto :number="session.images.length + session.videos.length" />
  </router-link>
</template>

<script>
import SvgPhoto from '@/components/Svg/Photo.vue'
export default {
  name: 'GalleryLink',
  components: {
    SvgPhoto
  },
  props: {
    session: Object
  }
}
</script>

<style lang="scss">

</style>
