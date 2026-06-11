import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }

  const apiKey       = process.env.BEEHIIV_API_KEY
  const pubId        = process.env.BEEHIIV_PUBLICATION_ID

  if (!apiKey || !pubId) {
    // Dev mode — log and return success so the form works locally
    console.log(`[subscribe] Would add to Beehiiv: ${email}`)
    return NextResponse.json({ ok: true })
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email:  true,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Beehiiv error')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Could not subscribe. Try again.' }, { status: 500 })
  }
}
