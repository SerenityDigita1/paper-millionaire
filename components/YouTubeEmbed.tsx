'use client'

import dynamic from 'next/dynamic'

const YouTubeFrame = dynamic(() => import('@/components/YouTubeFrame'), {
  loading: () => <div className="h-full w-full" />,
})

export default function YouTubeEmbed(props: {
  id: string
  title: string
  lazy?: boolean
}) {
  return <YouTubeFrame {...props} />
}
