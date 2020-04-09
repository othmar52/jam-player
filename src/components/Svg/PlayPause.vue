<template>
    <svg width="100%" height="100%" viewBox="0 0 36 36">
        <defs>
            <path id="pause-icon" data-state="playing" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26"></path>
            <path id="play-icon" data-state="paused" d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28"></path>
        </defs>
        <use xlink:href="#play-icon"></use>
    </svg>
</template>

<script>
export default {
  name: 'SvgPlayPause'
}
</script>
