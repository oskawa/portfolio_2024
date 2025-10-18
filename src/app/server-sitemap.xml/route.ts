// app/server-sitemap.xml/route.ts
import { getServerSideSitemap } from 'next-sitemap'
import http from '@/app/axios/http'

export const dynamic = 'force-dynamic' // 👈 Force le mode dynamique
export const revalidate = 0 // 👈 Pas de cache

export async function GET() {
  try {
    console.log('🔄 Generating dynamic sitemap...')
    const response = await http.get('portfolio')
    const projets = response.data

    const fields = projets.map((projet: any) => ({
      loc: `https://www.maxime-eloir.fr/fr/projets/${projet.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as const,
      priority: 0.7,
    }))

    console.log(`✅ Generated sitemap with ${fields.length} URLs`)
    return getServerSideSitemap(fields)
  } catch (error) {
    console.error('❌ Sitemap error:', error)
    return getServerSideSitemap([])
  }
}