<template>
  <div class="autocomplete__list" v-if="fetchedData.length>0">
    <ul class="list-group">
      <li
        class="list-group-item"
        :class="checkSelected(index)"
        v-for="(resultItem, index) in fetchedData"
        v-bind:key="index"
        @mousemove="mouseHover(index)"
        @mousedown="selectMe(index)">
        {{resultItem.title}}
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'ResultList',
  props: ['fetchedData'],
  methods: {
    selectMe: function (idx) {
      this.$router.push(this.fetchedData[idx].route)
      this.$store.dispatch('optionPicked', this.fetchedData[idx].title)
      this.$store.dispatch('changeInput', '')
      this.$store.dispatch('resetData')
    },
    checkSelected: function (idx) {
      return {
        selected: idx === this.$store.state.focusIndex
      }
    },
    mouseHover: function (idx) {
      this.$store.dispatch('setFocus', idx)
    }
  }
}
</script>

<style lang="scss">
.autocomplete__list {
  position : absolute;
  left: 19px;
  background: #323754;
  z-index: 202;
  li {
    padding: 0.5em;
    width: 200px;
  }
}

.selected{
  background-color: $darkblue3;
  color : white;
}
</style>
