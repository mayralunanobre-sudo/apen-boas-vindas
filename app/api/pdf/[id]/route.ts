import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.redirect(
    new URL(`/preview/${params.id}`, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  )
}
