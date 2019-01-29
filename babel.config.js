module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      'babel-plugin-import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
    [
      'module-resolver',
      {
        alias: {
          '@shared': '@comma/shared',
        },
      },
    ],
  ],
}
