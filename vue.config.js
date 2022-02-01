const path = require('path');
module.exports = {
  transpileDependencies: [
    'vuetify',
    'aveine-toolbox'
  ],
  css: { extract: true },
  configureWebpack: {
    resolve: {
      symlinks:false,
      alias: {
        'vue': path.resolve('./node_modules/vue')
      }
    }
  }
}