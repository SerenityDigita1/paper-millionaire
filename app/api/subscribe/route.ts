import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev mode — log and return success so the form works locally
    console.log(`[subscribe] Would add: ${email}`)
    return NextResponse.json({ ok: true })
  }

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (!audienceId) throw new Error('RESEND_AUDIENCE_ID not set')

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Resend error')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Could not subscribe. Try again.' }, { status: 500 })
  }
}
