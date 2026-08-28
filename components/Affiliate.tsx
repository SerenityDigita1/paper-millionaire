const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? ""

export default function Affiliate({
  asin,
  children,
  search,
}: {
  asin?: string
  search?: string
  children: React.ReactNode
}) {
  if (!asin && !search) {
    throw new Error("<Affiliate> needs either an asin or a search term")
  }
  const href = asin
    ? `https://www.amazon.com/dp/${encodeURIComponent(asin)}${TAG ? `?tag=${TAG}` : ""}`
    : `https://www.amazon.com/s?k=${encodeURIComponent(search!)}${TAG ? `&tag=${TAG}` : ""}`
  return (
    <a href={href} rel="sponsored nofollow noopener" target="_blank" className="text-gold underline decoration-gold/40 underline-offset-2 hover:text-white">
      {children}
    </a>
  )
}
