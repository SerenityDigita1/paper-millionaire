import { EPISODES } from '@/lib/episodes'
import EmailCapture from '@/components/EmailCapture'

export default function EpisodesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-gold font-mono text-xs tracking-widest uppercase mb-2">All Episodes</p>
        <h1 className="text-4xl font-bold text-white mb-2">The Archive</h1>
        <p className="text-white/40 text-sm">Every episode of the $100K Experiment, in order.</p>
      </div>

      <div className="space-y-12">
        {[...EPISODES].reverse().map(ep => (
          <article key={ep.number} className="border-b border-white/10 pb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gold text-navy font-mono text-xs font-bold px-3 py-1 rounded">
                EP. {String(ep.number).padStart(3, '0')}
              </span>
              <span className="text-white/30 font-mono text-xs">{ep.date}</span>
            </div>

            <h2 className="text-white text-xl font-bold mb-3">{ep.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-6">{ep.description}</p>

            {ep.youtubeId !== 'REPLACE_WITH_VIDEO_ID' ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ep.youtubeId}`}
                  title={ep.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl border border-white/10 bg-card flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/30 font-mono text-sm mb-1">Episode coming soon</p>
                  <p className="text-white/20 font-mono text-xs">Subscribe to be notified</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Subscribe nudge */}
      <div className="mt-16 bg-card border border-gold/20 rounded-xl p-8 text-center">
        <p className="text-white font-bold mb-2">New episode every week.</p>
        <p className="text-white/40 text-sm mb-6">Get it in your inbox so you never miss a move.</p>
        <EmailCapture compact />
      </div>
    </div>
  )
}
