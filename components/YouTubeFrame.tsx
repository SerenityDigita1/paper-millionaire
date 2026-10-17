'use client'

import { useEffect, useRef, useState } from 'react'

export default function YouTubeFrame({
  id,
  title,
  lazy = false,
}: {
  id: string
  title: string
  lazy?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(!lazy)

  useEffect(() => {
    if (!lazy) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [lazy])

  return (
    <div ref={ref} className="h-full w-full">
      {show ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading={lazy ? 'lazy' : 'eager'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : null}
    </div>
  )
}
