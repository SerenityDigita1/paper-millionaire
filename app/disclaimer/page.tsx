export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-gold font-mono text-xs tracking-widest uppercase mb-4">Legal</p>
      <h1 className="text-4xl font-bold text-white mb-8">Disclaimer</h1>

      <div className="space-y-8 text-white/60 leading-relaxed">

        <section>
          <h2 className="text-white font-bold text-lg mb-3">Not Financial Advice</h2>
          <p>
            Everything published on this website, on the Paper Millionaire YouTube channel, and across
            any associated social media is for entertainment and educational purposes only. Nothing here
            constitutes financial advice, investment advice, trading advice, or any other form of advice.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-3">Paper Portfolio</h2>
          <p>
            The portfolio tracked on this site is a simulated paper trading account. No real money is
            being invested on your behalf. Any positions referenced are hypothetical and for illustrative
            purposes only. Past performance of a paper portfolio has no bearing on future real-money results.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-3">Do Your Own Research</h2>
          <p>
            Before making any investment decision, consult a qualified financial advisor. The stocks,
            sectors, and theses discussed here are based on personal research and opinion. We are not
            licensed financial advisors, brokers, or dealers.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-3">No Guarantees</h2>
          <p>
            Investing involves risk, including the potential loss of principal. The $100K Experiment is
            designed to document a process — not to guarantee returns. We will report gains and losses
            transparently. Following along with your own paper portfolio carries the same educational
            risks and no guarantee of any outcome.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-3">Affiliates &amp; Sponsors</h2>
          <p>
            We may mention third-party platforms (such as paper trading platforms) by name. Any
            mentions are based on personal use and are not paid placements unless explicitly stated.
            We do not accept sponsored stock picks or paid promotions disguised as editorial content.
          </p>
        </section>

        <section>
          <h2 className="text-white font-bold text-lg mb-3">Accuracy of Information</h2>
          <p>
            Portfolio data, stock prices, and P&L figures are updated periodically and may not reflect
            real-time market conditions. We make no representations about the accuracy, completeness,
            or timeliness of any information on this site.
          </p>
        </section>

        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-white/30 text-sm font-mono">
            Last updated: June 2026. Questions? Reach us at{' '}
            <a href="mailto:john@digitalbyserenity.com" className="text-gold hover:underline">
              john@digitalbyserenity.com
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
