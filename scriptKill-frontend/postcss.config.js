module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      exclude: /node_modules/i
    }
  }
}