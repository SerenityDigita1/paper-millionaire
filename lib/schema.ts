import { EPISODES } from '@/lib/episodes'
import { HOME_DESCRIPTION, SITE_URL } from '@/lib/site'

const ORG_ID = `${SITE_URL}/#organization`

function watchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

export function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Change My Trajectory',
        url: SITE_URL,
        sameAs: ['https://www.youtube.com/@PaperMillionaire'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Change My Trajectory',
        description: HOME_DESCRIPTION,
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

export function breadcrumbSchema(name: string, path: '/portfolio' | '/episodes' | '/disclaimer') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  }
}

export function episodesSchema() {
  const episodes = [...EPISODES].reverse()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/episodes#blog`,
        name: 'The Archive',
        description: 'Every episode of the $100K experiment, in order.',
        url: `${SITE_URL}/episodes`,
        publisher: { '@id': ORG_ID },
        blogPost: episodes.map((ep) => ({
          '@type': 'BlogPosting',
          headline: ep.title,
          datePublished: ep.date,
          description: ep.description,
          url: watchUrl(ep.youtubeId),
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/episodes#list`,
        name: 'The Archive',
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: episodes.length,
        itemListElement: episodes.map((ep, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: ep.title,
          url: watchUrl(ep.youtubeId),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Episodes',
            item: `${SITE_URL}/episodes`,
          },
        ],
      },
    ],
  }
}
