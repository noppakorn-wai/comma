const { plugins } = require('../../babel.config')

module.exports = {
  presets: ['next/babel'],
  plugins: plugins.concat([
    'emotion',
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: (name) => `${name}/style/index.less`,
      },
      'antd',
    ],
  ]),
}
