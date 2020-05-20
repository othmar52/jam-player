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
    config
      .plugin('copy')
      .tap(([options]) => {
        options[0].ignore.push('data/**/*')
        options.push({
          from: path.resolve(__dirname, './src/assets/img/jam-logo-1-256x256.png'),
          to: path.resolve(__dirname, './dist/data/stemplayer/img/jam-logo-1-256x256.png')
        })
        options.push({
          from: path.resolve(__dirname, './src/assets/img/jam-logo-2-256x256.png'),
          to: path.resolve(__dirname, './dist/data/stemplayer/img/jam-logo-2-256x256.png')
        })
        return [options]
      })
  }
}
