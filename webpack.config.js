const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
}
