import { supabase } from "./supabase"
import { uid } from "./id"

export async function uploadPublicFile(opts: {
  file: File
  bucket: string
  prefix?: string
}): Promise<string> {
  const { file, bucket, prefix = "" } = opts
  const path = `${prefix}${prefix ? "/" : ""}${uid()}-${file.name.replace(/\s+/g, "_")}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
