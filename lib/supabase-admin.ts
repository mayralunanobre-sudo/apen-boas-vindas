import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error(
        'Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente da Vercel.'
      )
    }
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}

// Proxy lazy: o cliente só é criado na primeira requisição, nunca durante o build
export const supabaseAdmin = new Proxy<SupabaseClient>({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const c = getClient()
    const val = (c as unknown as Record<string | symbol, unknown>)[prop]
    return typeof val === 'function' ? (val as (...a: unknown[]) => unknown).bind(c) : val
  },
})

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType: string
): Promise<string | null> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFromFormFile(
  bucket: string,
  prefix: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${prefix}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return uploadFile(bucket, path, buffer, file.type)
}
