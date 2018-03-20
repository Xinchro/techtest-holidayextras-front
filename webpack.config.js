const path = require("path")

module.exports = {
  entry: "./script.js",
  output: {
    path: path.resolve(__dirname, ""),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
          options: {
            loaders: {
              js: "babel-loader"
            }
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          query: {
            presets: [ "es2015" ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  stats: {
    colors: true
  }
}
