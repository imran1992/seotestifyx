/* eslint-disable comma-dangle */
// @ts-nocheck
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const withPlugins = require("next-compose-plugins");
const path = require("path");
const withReactSvg = require('next-react-svg')

module.exports = withPlugins([
  // [withSass, {
  //   cssModules: true
  // }]
  [withReactSvg, {
    include: path.resolve(__dirname, 'public/icons'),
  }]
], {
  trailingSlash: false,
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve("./components"),
      "@public": path.resolve("./public"),
      "@redux": path.resolve("./redux"),
      "@utils": path.resolve("./utils"),
      "@sampleData": path.resolve("./sampleData"),
      "@styles": path.resolve("./styles"),
      "@apolloX": path.resolve("./lib")
    };

    return config;
  }
});
