module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['prettier', 'react', 'jsx-a11y', 'import'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    curly: 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['.serverless_plugins/**', 'dev/**'],
      },
    ],
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
    'prefer-destructuring': 'off',
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    semi: ['error', 'never'],
    'react/require-default-props': 'off',
  },
}
