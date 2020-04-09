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
  }
}
