const path = require('path')

module.exports = {
  entry: "./script.js",
  output: {
    path: path.resolve(__dirname, ""),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  }
}
