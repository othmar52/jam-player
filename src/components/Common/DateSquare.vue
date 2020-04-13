<template>
  <time class="session__date date">
    <span class="date__year">{{ year }}</span>
    <span class="date__wrapper">
      <span class="date__month">{{ month }}</span>
      <span class="date__day">{{ day }}</span>
    </span>
  </time>
</template>

<script>

export default {
  name: 'DateSquare',
  props: {
    day: String,
    month: String,
    year: String
  }
}
</script>

<style lang="scss">

</style>
