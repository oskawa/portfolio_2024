/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.maxime-eloir.fr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/robots.txt'], // 👈 Exclut robots.txt du sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}