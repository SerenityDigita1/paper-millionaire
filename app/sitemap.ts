import type { MetadataRoute } from 'next'
import { EPISODES } from '@/lib/episodes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = EPISODES.reduce((a, b) => (a.date > b.date ? a : b)).date

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: latest,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/episodes`,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: '2026-06-01',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
