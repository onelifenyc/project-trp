const webpack = require('webpack')

module.exports = {
  publicPath: 'trp',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  }
}
