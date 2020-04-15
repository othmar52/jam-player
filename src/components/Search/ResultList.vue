<template>
  <div class="autocomplete__list" v-if="fetchedData.length>0">
    <table class="list-group">
      <tr
        class="list-group-item"
        :class="checkSelected(index)"
        v-for="(resultItem, index) in fetchedData"
        v-bind:key="index"
        @mousemove="mouseHover(index)"
        @mousedown="selectMe(index)">
        <td v-if="resultItem.type === 'track'" v-html="highlight(resultItem.title)"></td>
        <td v-if="resultItem.type === 'session'" v-html="highlight(resultItem.stemNames)"></td>
        <td>#<strong class="view__highlight">{{resultItem.sessionCounter}}</strong></td>
        <td>{{resultItem.month}} {{resultItem.year}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

import { helpersMixin } from '@/assets/js/helpersMixin.js'
export default {
  name: 'ResultList',
  props: ['fetchedData'],
  mixins: [
    helpersMixin
  ],
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
    },
    highlight: function (inputData) {
      const searchTerm = this.$store.getters.getSearchTerm
      if (typeof inputData === 'string') {
        return this.emphasizeTextMarkup(inputData, searchTerm)
      }
      const multiResults = []
      for (const item of inputData) {
        if (item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          multiResults.push(this.emphasizeTextMarkup(item, searchTerm))
        }
      }
      return [(multiResults.length > 0) ? multiResults : inputData].join(', ')
    },
    emphasizeTextMarkup (inputText, searchTerm) {
      if (inputText.trim() === '') {
        return ''
      }
      return inputText.replace(
        RegExp(this.regExpEscape(searchTerm.trim()), 'gi'),
        '<mark>$&</mark>'
      )
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

mark {
  background: $darkblue;
  color: $lightblue;
  font-weight: bold;
}

.selected{
  background-color: $darkblue3;
  color : white;
}
</style>
