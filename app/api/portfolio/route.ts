import { NextResponse } from 'next/server'
import { getPortfolioData } from '@/lib/prices'

export const revalidate = 300

export async function GET() {
  const data = await getPortfolioData()
  return NextResponse.json(data)
}
