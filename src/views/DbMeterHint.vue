<template>
  <main class="page__wrapper dbmeterhint">
    <header class="page__header page__header--dbmeterhint">
      <h1 class="page__title">DB<span class="view__highlight">Meter</span></h1>
    </header>
    <div class="dbmeterhint__wrapper">
      <div>
        <h3>How to activate the DB-Meter?</h3>
        <p>Browser requirements: <strong>Google Chrome</strong> or <strong>chromium</strong><br>
          start the browser via included launcher files, which already resides on your harddisk...</p>
        <img src="@/assets/img/dbmeter.gif" />
      </div>
      <div>
        <h3>Windows</h3>
        <p>launch jam-player via <span class="pre">{{ pathPrefix }}/launcher/windows-chrome.bat</span></p>
        <h3>OSX</h3>
        <p>launch jam-player via <span class="pre">{{ pathPrefix }}/launcher/osx-chrome.command</span></p>
        <h3>Linux</h3>
        <p>launch jam-player via <span class="pre">{{ pathPrefix }}/launcher/linux-chromium.sh</span></p>

        <h3>Looking for an Icon?</h3>
        <p>
          In case you create a shortcut on your desktop or wherever - here are some icons:
          <a :href="require('@/assets/img/jam-logo-1-256x256.png')" target="_blank">
            <span class="pre">{{ pathPrefix }}/data/stemplayer/img/jam-logo-1-256x256.png</span>
          </a>
          <br>
          <a :href="require('@/assets/img/jam-logo-2-256x256.png')" target="_blank">
            <span class="pre">{{ pathPrefix }}/data/stemplayer/img/jam-logo-2-256x256.png</span>
          </a>
          <br>
          <a :href="require('@/assets/img/jam-logo-1-256x256.png')" target="_blank">
            <img src="@/assets/img/jam-logo-1-256x256.png" width="100px"/>
          </a>&nbsp;
          <a :href="require('@/assets/img/jam-logo-2-256x256.png')" target="_blank">
            <img src="@/assets/img/jam-logo-2-256x256.png" width="100px"/>
          </a>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'DbMeterHint',
  computed: {
    pathPrefix () {
      const chunks = document.location.pathname.split('/')
      chunks.pop()
      return chunks.join('/')
    }
  }
}
</script>

<style lang="scss">
.dbmeterhint__wrapper {
  display: flex;
  &>div {
    padding: 2em;
  }
}
</style>
