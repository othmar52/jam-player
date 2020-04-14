<template>
  <main class="pics__list">
    <header class="page__header page__header--allsessions">
      <h1 class="page__title"><span class="view__highlight">Pi</span>cs &amp; <span class="view__highlight">Vi</span>deos</h1>
      <span>{{ getStats.totalPics }} Pics</span>
      <span>{{ getStats.totalVideos }} Videos</span>
    </header>
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
      'getAllSessions',
      'getStats'
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
  min-width: 420px;
  max-width: 560px;
  max-height: 180px;
  flex-shrink: 1;
  flex-grow: 1;
  a {
    display: flex;
  }
  img {
    width: 160px;
    height: 160px;
    display: inline-block;
    background-image: url(data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgd2lkdGg9IjQwIiAgaGVpZ2h0PSI0MCIgIGZpbGw9InJlZCI+ICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02LjMwMDAwMDAsMTkuNTAwMDAwKSBzY2FsZSgwLjAzMiwtMC4wMzIpIiBzdHJva2U9Im5vbmUiPiAgICAgIDxjaXJjbGUgY3g9IjgwMCIgY3k9IjAiIHI9IjYwMCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMDIwNzI0Ii8+ICAgICAgPHBhdGggZmlsbD0iIzYwZDRmZiIgY2xhc3M9InBhdGhfX2xvZ28iIHN0eWxlPSJzdHJva2U6IG5vbmU7IiBkPSJtODk4IDQwOCBsMzIgLTUgMCAtMTI1IGMwIC0xMTUgLTEgLTEyNSAtMTcgLTExOCAtMzUgMTQgLTE0MCAxNyAtMTc2IDYgLTUxIC0xNyAtMTIyIC04NCAtMTQxIC0xMzMgLTIyIC01NCAtMTMgLTEwOSAyNSAtMTUzIDQxIC00NiA3NiAtNTggMTU4IC01MyA4MiA0IDEzNSAzNSAxODYgMTA3IGwzMCA0MyA1IDE5OCA1IDE5OCA3NCAtNDkgYzc5IC01MiAxNzkgLTg5IDI0MSAtODkgNDYgMCA1OSAtMjQgMzYgLTY4IC0xOCAtMzQgLTc2IC04NyAtMTA1IC05NyAtMTggLTUgLTIxIC0xNCAtMjEgLTY5IDAgLTE2MyAtOTIgLTMwNiAtMjQzIC0zNzcgLTExOSAtNTUgLTI0MCAtNTggLTM3MCAtOSAtNzUgMjggLTE3MyAxMTggLTIxNSAxOTcgLTEyOCAyNDAgMTMgNTI5IDI5MSA1OTkgNDkgMTIgMTI1IDExIDIwNSAtM3oiID48L3BhdGg+ICAgIDwvZz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position: center;
    filter: grayscale(80%);
    transition: filter 0.2s ease;
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
