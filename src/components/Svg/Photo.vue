<template>
  <span class="icon__numberedphoto">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="icon__photo">
      <defs>
        <clipPath id="a">
          <path d="M13 11a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm-3 5a5 5 0 1 1 5-5 5 5 0 0 1-5 5zM6.42 2.56l-.67.64a2 2 0 0 1-1.38.56H2a1.89 1.89 0 0 0-2 1.75v10.54a1.89 1.89 0 0 0 2 1.76h16a1.89 1.89 0 0 0 2-1.76V5.51a1.89 1.89 0 0 0-2-1.76h-2.37a2 2 0 0 1-1.38-.56l-.67-.64A2 2 0 0 0 12.2 2H7.8a2 2 0 0 0-1.38.56z" clip-rule="evenodd"></path>
        </clipPath>
      </defs>
      <path fill-rule="evenodd" d="M13 11a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm-3 5a5 5 0 1 1 5-5 5 5 0 0 1-5 5zM6.42 2.56l-.67.64a2 2 0 0 1-1.38.56H2a1.89 1.89 0 0 0-2 1.75v10.54a1.89 1.89 0 0 0 2 1.76h16a1.89 1.89 0 0 0 2-1.76V5.51a1.89 1.89 0 0 0-2-1.76h-2.37a2 2 0 0 1-1.38-.56l-.67-.64A2 2 0 0 0 12.2 2H7.8a2 2 0 0 0-1.38.56z"></path>
      <g clip-path="url(#a)">
        <path fill="#0d1332" d="M0 0h20v20H0z"></path>
      </g>
    </svg>
    <span v-if="number" :class="`circled__number circled__number--${digits}`">
      <span>{{ number }}</span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'SvgPhoto',
  data () {
    return {
      digits: 0
    }
  },
  props: {
    number: Number
  },
  created () {
    this.digits = this.number.toString().length
  },
  watch: {
    number () { }
  }
}
</script>

<style lang="scss">
.icon__numberedphoto {
  white-space: nowrap;
}
.icon__photo {
  width: 30px;
  height: 30px;
}
.circled__number {
  background-color: $red;
  color: #DDD;
  height: 20px;
  width: 20px;
  display: inline-block;
  border-radius: 10px;
  text-align: center;
  position: relative;
  top: 3px;
  left: -10px;
  opacity: 0.9;
  span {
    display: inline-block;
    padding-top: 3px;
    width: 100%;
    height: 100%;
  }
}
.circled__number--2 {
  font-size: 13px;
}
</style>
