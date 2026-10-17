export default function YouTubeFrame({
  id,
  title,
  lazy = false,
}: {
  id: string
  title: string
  lazy?: boolean
}) {
  return (
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${id}`}
      title={title}
      loading={lazy ? 'lazy' : 'eager'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
