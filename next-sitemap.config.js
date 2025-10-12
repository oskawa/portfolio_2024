/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.maxime-eloir.fr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}