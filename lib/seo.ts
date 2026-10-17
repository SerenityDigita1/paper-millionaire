import type { Metadata } from 'next'
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/site'

type PagePath = '/' | '/portfolio' | '/episodes' | '/disclaimer'

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string
  description: string
  path: PagePath
  absoluteTitle?: boolean
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | Paper Millionaire`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: 'Change My Trajectory',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  }
}

export const homeMetadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
})
