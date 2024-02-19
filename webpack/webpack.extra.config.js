import webpack from 'webpack';

console.log('Using custom webpack config (./webpack.extra.config.js)\n');

export default {
  target: 'es2020',
  experiments: {
    outputModule: true,
    buildHttp: {
      // https://webpack.js.org/configuration/experiments/#experimentsbuildhttpalloweduris
      allowedUris: ['https://raw.githubusercontent.com/'],
      cacheLocation: '/tmp/webpack-cache',
      frozen: false
    }
  },
  output: {
    module: true
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
