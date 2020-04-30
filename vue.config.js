module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'gforum',
    themeColor: '#272727',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      skipWaiting: true
    }
  }
}