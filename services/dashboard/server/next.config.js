const { compose } = require('redux')
const withTranspile = require('next-plugin-transpile-modules')
const withLess = require('@zeit/next-less')

module.exports = compose(
  withTranspile,
  withLess,
)({
  cssLoaderOptions: {
    // CSS Loader https://github.com/webpack/css-loader
    importLoaders: 1,
    // CSS Nano http://cssnano.co/options/
    discardComments: { removeAll: true },
  },

  lessLoaderOptions: {
    relativeUrls: true,
    javascriptEnabled: true,
    // antd less variables https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
    // eslint-disable-next-line global-require
    modifyVars: require('../../../dev/antd-less-theme-override.js'),
  },

  target: 'serverless',
  assetPrefix: '/dashboard',
  useFileSystemPublicRoutes: false,
  poweredByHeader: false,
})
