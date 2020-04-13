<template>
  <main class="pics__list">
    <h1>pics list all sessions</h1>
    <div class="cards">
      <div v-for="(item, idx) of sessionsWithPics" v-bind:key="idx" class="card">
        <router-link :to="{ name: 'SessionPicsShow', params: { sessionIndex: item.index } }">
          <img :src="randomItem(item.images).thumbPath" />
          <div class="card__content">
            <h3>#{{item.counter}}</h3>
            {{item.images.length}} Pics
            <DateSquare :day="item.day" :month="item.month" :year="item.year" />
            <MusiciansBadges :session="item" />
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>
/*
  session nr
  datum der sesseion
  teilnehmer
  anzahl der bilder
  anzahl videos
  ein random thumbnail
*/
// @ is an alias to /src
import { mapGetters } from 'vuex'
import MusiciansBadges from '@/components/MusiciansBadges.vue'
import DateSquare from '@/components/Common/DateSquare.vue'
export default {
  name: 'AllPics',
  components: {
    MusiciansBadges,
    DateSquare
  },
  computed: {
    ...mapGetters([
      'getAllSessions'
    ]),
    sessionsWithPics () {
      const sessWithMedia = []
      for (const item of Object.entries(this.getAllSessions)) {
        if (item[1].images.length > 0 || item[1].videos.length > 0) {
          sessWithMedia.push(item[1])
        }
      }
      return sessWithMedia
    }
  },
  methods: {
    forwardToSessionPics (sessionIndex) {
      this.$router.push(
        {
          name: 'SessionPicsShow',
          params: {
            sessionIndex: sessionIndex
          }
        }
      )
    },
    randomItem (inputArray) {
      return inputArray[Math.floor(Math.random() * inputArray.length)]
    }
  }
}
</script>

<style lang="scss">
.pics__list {
  height: 100%;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
.card {
  display: flex;
  background-color: #1c2849;
  padding: 10px;
  margin: 10px;
  max-width: 30%;
  a {
    display: contents;
  }
  .card__content {
    margin: 0 20px;
  }
}

</style>
