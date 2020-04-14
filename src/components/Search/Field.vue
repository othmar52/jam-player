<template>
  <div>
    <input
      type="text"
      id="acinput"
      name="acinput"
      @keyup="fetchData()"
      @keydown="setFocus"
      @focus="inputFocus(true)"
      @blur="inputFocus(false)"
      v-model="inputtext"
      class="form-control"
      placeholder="Search"
      autocomplete="off"
    />
    <ResultList :fetchedData="acdata" />
  </div>
</template>

<script>

import ResultList from './ResultList.vue'
export default {
  name: 'SearchField',
  components: {
    ResultList
  },
  props: {
    minInput: Number
  },
  computed: {
    acdata () {
      if (this.isFocus) {
        return this.$store.state.acData
      }
      return []
    },
    inputtext: {
      get () {
        return this.$store.state.inputData
      },
      set (value) {
        this.$store.dispatch('changeInput', value)
      }
    },
    isFocus () {
      return this.$store.state.inputFocus
    }

  },
  data: function () {
    return {}
  },
  methods: {
    fetchData: function (e) {
      if (this.inputtext.length >= this.minInput && this.isFocus) {
        this.$store.dispatch('searchData', this.inputtext)
        return
      }
      this.$store.dispatch('resetData')
    },
    setFocus: function (e) {
      var keycode = e.keyCode
      var listLn = this.acdata.length

      if (listLn === 0) { return }
      switch (keycode) {
        case 40:
          this.$store.dispatch('focusChange', 1)
          break
        case 38:
          this.$store.dispatch('focusChange', -1)
          break
        case 13:
          this.$router.push(this.acdata[this.$store.state.focusIndex].route)
          this.$store.dispatch('optionPicked', this.acdata[this.$store.state.focusIndex])
          this.$store.dispatch('changeInput', '')
          this.$store.dispatch('resetData')
          e.target.blur()
          // this.$store.dispatch('inputFocus',false);
          break
        case 27:
          e.target.blur()
          this.$store.dispatch('resetData')
          break
      }
    },
    inputFocus: function (val) {
      this.$store.dispatch('inputFocus', val)
    }
  }

}
</script>

<style lang="scss">
input[type=text] {
  border: none;
  background-color: rgba(0, 0, 0,0);
  padding: 15px 0 2px;
  margin: 0 0 0 20px;
  width: 120px;
  text-align: center;
  outline: none;
}
input[type=text],
input[type=text]::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1; /* Firefox */
  font-family: 'Neo Sans Pro', sans-serif;
  font-weight: 200;
  font-size: 14px;
  text-align: center;
}

input[type=text]:focus {
  border-bottom: 1px solid white;
  outline: none;
  &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    opacity: 0; /* Firefox */
    display: none;
    visibility: hidden;
    color: red;
  }
}
</style>
