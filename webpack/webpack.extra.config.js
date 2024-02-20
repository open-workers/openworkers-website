console.info('Using custom webpack config (webpack/webpack.extra.config.js)\n');

export default {
  experiments: {
    buildHttp: {
      // https://webpack.js.org/configuration/experiments/#experimentsbuildhttpalloweduris
      allowedUris: ['https://raw.githubusercontent.com/'],
      cacheLocation: '/tmp/webpack-cache',
      frozen: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(md)$/,
        exclude: /node_modules/,
        loader: './webpack/webpack.markdown-loader.js'
      }
    ]
  }
};
