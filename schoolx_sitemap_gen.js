const sitemap = require('nextjs-sitemap-generator')

sitemap({
  baseUrl: 'https://schoolx.pk',
  ignoredPaths: ['test'],
  extraPaths: ['/test'],
  pagesDirectory: __dirname + '/pages',
  targetDirectory: 'public/',
  nextConfigPath: __dirname + '/next.config.js',
  ignoreIndexFiles:true,
  //ignoredExtensions: ['png', 'jpg'],
//   pagesConfig: {
//     '/login': {
//       priority: '0.5',
//       changefreq: 'daily',
//     },
//   },
  sitemapStylesheet: [
    {
      type: 'text/css',
      styleFile: '/public/styles/main.css',
    },
  ],
})
