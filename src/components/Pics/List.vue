<template>
  <main class="pics__list">
    <h1>pics list all sessions</h1>
    <div class="cards">
      <div v-for="(item, idx) of sessionsWithPics" v-bind:key="`pic-${item.index}-${idx}`" class="card">
        <router-link :to="{ name: 'SessionPicsShow', params: { sessionIndex: item.index } }">
          <img :src="randomItem(item.images.concat(item.videos)).thumbPath" />
          <div class="card__content">
            <h2><span class="darker__text session__symbol">#</span>{{item.counter}}</h2>
            <span>{{ amountAsText(item) }}</span>
            <DateSquare :day="item.day" :month="item.month" :year="item.year" />
            <MusiciansBadges :session="item" />
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>

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
    },
    amountAsText (session) {
      const textParts = []
      if (session.images.length > 0) {
        textParts.push(
          session.images.length === 1
            ? '1 Pic'
            : `${session.images.length} Pics`
        )
      }
      if (session.videos.length > 0) {
        textParts.push(
          session.videos.length === 1
            ? '1 Video'
            : `${session.videos.length} Videos`
        )
      }
      return textParts.join(', ')
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
  max-height: 180px;
  a {
    display: contents;
  }
  img {
    -webkit-filter: grayscale(80%);
    filter: grayscale(80%);
  }
  .card__content {
    margin: 0 20px;
    position: relative;
    overflow-x: none;
    overflow-y: auto;
    h2 {
      font-size: 28px;
    }

    time {
      position: absolute;
      right: 0;
      top: 0;
    }
    .stem__title {
      margin: 0 3px 5px 0;
      display: inline-block;
    }
  }
}

.card:hover {
  img {
    filter: none;
  }
}

</style>
