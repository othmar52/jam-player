// vue.config.js
module.exports = {
  publicPath: './',
  // lintOnSave: false, // TODO remove as soon as tryout phase is finished
  css: {
    loaderOptions: {
     sass: {
      prependData: `
       @import "@/scss/_variables.scss";
      `
     }
    }
  },
  chainWebpack: config => {
    config.plugin('copy').tap(([options]) => {
      options[0].ignore.push('data/**/*')
      options[0].ignore.push('tracklist.js')
      return [options]
    })
  }
}
