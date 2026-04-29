import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  const adminPassword = process.env.SENHA_DE_ADMINISTRADOR || process.env.ADMIN_PASSWORD || 'apen2024'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
