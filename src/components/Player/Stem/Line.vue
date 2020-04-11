<template>
  <li :class="`track__line line line--color-${stem.color}`" :id="`track__line${stemIndex}`">
    <div class="line__index tool__action--boost" :id="`line__index${stemIndex}`" :data-target="`player${stemIndex}`" title="click and hold to boost stem">
        #{{ stemIndex+1 }}
    </div>
    <div class="line__wave" :id="`line__wave${stemIndex}`">
        <div class="waveform__wrapper" ref="waveform">
        </div>
        <div class="seek__progress" :style="progressPercent"></div>
        <div class="seek__clickarea" @click="seek" ref="seek"></div>
    </div>
    <div class="line__audio line__audio--left"></div>
    <div class="line__audio line__audio--right"></div>
    <div class="line__meta" id="line_meta0">
      <div :id="`dbmeter${stemIndex}`" class="dbmeter">
      </div>
      <ul class="line__tools tool tool--line">
        <li class="tool__item">
            <button class="tool__action tool__action--isolate button" id="tool__action--isolate" data-target="player0"><abbr title="Toggle isolate">I</abbr></button>
        </li>
        <li class="tool__item">
            <button class="tool__action tool__action--solo button" id="tool__action--solo0" data-target="player0"><abbr title="Toggle solo">S</abbr></button>
        </li>
        <li class="tool__item">
            <button class="tool__action tool__action--mute button" id="tool__action--mute0" data-target="player0"><abbr title="Toggle mute">M</abbr></button>
        </li>
      </ul>
      <div class="line__description">
        <span class="tool__item tool__item--settings">
            <button class="tool__action tool__action--settings button" title="Toggle Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path class="dotpath" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
            </button>
        </span>
        <div class="line__artist artist">
          jammer {{ isNowPlaying }}
          <span class="artist__name">{{ stem.title }}</span>
        </div>
        <div class="tool__item tool__item--volume">
            <input type="range" min="0" max="1" step="0.01" class="tool__action tool__action--volume" id="tool__action--volume0" value="0" data-target="player0">
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { waveFormMixin } from '@/assets/js/waveFormMixin.js'
export default {
  name: 'PlayerStemLine',
  mixins: [
    waveFormMixin
  ],
  props: {
    stemIndex: Number,
    stem: Object,
    isNowPlaying: Boolean
  },
  computed: {
    progressPercent () {
      if (this.isNowPlaying === false) {
        return 'width: 0'
      }
      return `width: ${this.$store.getters.getCurrentProgressPercent}%`
    }
  },
  methods: {
    seek (e) {
      if (this.isNowPlaying === false) {
        return
      }
      const rect = this.$refs.seek.getBoundingClientRect()
      const x = e.clientX - rect.left // x position within the element.
      const w = e.target.offsetWidth
      const percent = x / (w / 100)
      this.$store.commit('requestSeek', percent)
    }
  }
}
</script>
