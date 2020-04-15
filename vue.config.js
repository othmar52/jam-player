// vue.config.js
const path = require('path')
module.exports = {
  publicPath: './',
  outputDir: path.resolve(__dirname, './dist'),
  assetsDir: './data/stemplayer',
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
      return [options]
    })
  }
}
