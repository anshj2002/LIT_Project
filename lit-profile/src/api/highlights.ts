import { supabase } from "../lib/supabase"
export type Highlight = { id: string; student_id: string; label: string; value: number | null; unit: string | null; trend: string | null; accent: string | null; sort_order: number | null }

export async function listHighlights(studentId: string) {
  const { data, error } = await supabase.from("highlights").select("*").eq("student_id", studentId).order("sort_order", { ascending: true })
  if (error) throw error
  return data as Highlight[]
}
export async function upsertHighlight(payload: Partial<Highlight> & { id?: string }) {
  if (payload.id) {
    const { data, error } = await supabase.from("highlights").update(payload).eq("id", payload.id).select().single()
    if (error) throw error
    return data as Highlight
  } else {
    const { data, error } = await supabase.from("highlights").insert(payload).select().single()
    if (error) throw error
    return data as Highlight
  }
}
export async function deleteHighlight(id: string) {
  const { error } = await supabase.from("highlights").delete().eq("id", id)
  if (error) throw error
  return true
}
