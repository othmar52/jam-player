<template>
  <header class="page__header page__header--session">
    <h1 class="page__title">
      <router-link :to="{ name: 'SessionShow', params: { sessionIndex: session.index } }">
      <span class="view__highlight">Se</span>ssion<span class="view__highlight">#{{ session.counter }}</span>
      </router-link>
    </h1>
    <DateSquare :day="session.day" :month="session.month" :year="session.year" />
    <span>{{ session.trackCount }} Tracks</span>
    <span>{{ toMinutes(session.duration) }} min</span>
    <GalleryInline :session="session" v-if="session" />
  </header>
</template>

<script>
import DateSquare from '@/components/Common/DateSquare.vue'
import GalleryInline from '@/components/GalleryInline.vue'
import { helpersMixin } from '@/assets/js/helpersMixin.js'

export default {
  name: 'SessionHeader',
  components: {
    DateSquare,
    GalleryInline
  },
  mixins: [
    helpersMixin
  ],
  props: {
    session: Object
  }
}
</script>

<style lang="scss">

.page__header--session {
  display: block;
  width: 100%;
  h1 {
    display: inline-block;
    text-transform: uppercase;
  }
  .session__date {
    display: inline-block;
  }
}
</style>
